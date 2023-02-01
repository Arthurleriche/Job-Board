import { ApolloClient, gql, InMemoryCache } from '@apollo/client';
import { request } from 'graphql-request';
import { getAccessToken } from '../auth';

const GRAPHQS_URL = 'http://localhost:9000/graphql';

export const client = new ApolloClient({
  uri: GRAPHQS_URL,
  cache: new InMemoryCache(),
});

const JOB_DETAIL_FRAGMENT = gql`
  fragment JobDetail on Job {
    id
    title
    company {
      id
      name
    }
    description
  }
`;

export const JOBS_QUERY = gql`
  query {
    jobs {
      id
      title
      description
      company {
        id
        name
      }
    }
  }
`;

const JOB_QUERY = gql`
  query jobQuery($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  ${JOB_DETAIL_FRAGMENT}
`;

// GET JOB
export async function getJob(id) {
  const variables = { id };
  const {
    data: { job },
  } = await client.query({ query: JOB_QUERY, variables });

  return job;
}

// GET COMPANY
export async function getCompany(id) {
  const query = gql`
    query getCompany($id: ID!) {
      company(id: $id) {
        id
        name
        description
        jobs {
          id
          title
          description
        }
      }
    }
  `;

  const variables = { id };
  const {
    data: { company },
  } = await client.query({ query, variables });

  return company;
}

// CREATE JOB
export async function createJob(input) {
  const mutation = gql`
    mutation CreateJobMutation($input: CreateJobInput!) {
      job: createJob(input: $input) {
        ...JobDetail
      }
    }
    ${JOB_DETAIL_FRAGMENT}
  `;

  const variables = { input };
  const context = {
    headers: { Authorization: 'Bearer ' + getAccessToken() },
  };

  const {
    data: { job },
  } = await client.mutate({
    mutation,
    variables,
    context,
    update: (cache, { data: { job } }) => {
      cache.writeQuery({
        query: JOB_QUERY,
        variables: { id: job.id },
        data: { job },
      });
    },
  });

  return job;
}

// DELETE JOB
export async function deleteJob(id) {
  const mutation = gql`
    mutation deleteJobMutation($id: ID!) {
      job: deleteJob(id: $id) {
        id
      }
    }
  `;

  const variables = { id };
  const { job } = await request(GRAPHQS_URL, mutation, variables);
  return job;
}
