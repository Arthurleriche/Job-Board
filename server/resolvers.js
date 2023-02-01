import { Job, Company, User } from './db.js';

const rejectIf = (condition) => {
  if (!condition) throw new Error('Unauthorize');
};

export const resolvers = {
  Query: {
    job: (root, { id }) => Job.findById(id),
    jobs: () => Job.findAll(),
    company: (_root, { id }) => Company.findById(id),
  },

  Mutation: {
    createJob: (_root, { input }, { user }) => {
      rejectIf(user);
      return Job.create({ ...input, companyId: user.companyId });
    },

    deleteJob: async (_root, { id }, { user }) => {
      rejectIf(user);
      const job = await Job.findOne(id);
      rejectIf(job.companyId !== user.companyId);
      return Job.delete(id);
    },
    updateJob: async (_root, { input }, { user }) => {
      rejectIf(user);
      const job = await Job.findOne(id);
      rejectIf(job.companyId !== user.companyId);
      return Job.update({ ...input, companyId: user.companyId });
    },
  },
  Job: {
    company: (job) => Company.findById(job.companyId),
  },
  Company: {
    jobs: (company) => Job.findAll((job) => job.companyId === company.id),
  },
};
