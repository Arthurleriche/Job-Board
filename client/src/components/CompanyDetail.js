import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { getCompany } from '../graphql/queries';
import JobList from './JobList';

function CompanyDetail() {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  useEffect(() => {
    getCompany(companyId).then(setCompany);
  }, [companyId]);

  console.log(company);
  if (!company) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <div>
        <h1 className="title">{company.name}</h1>
        <div className="box">{company.description}</div>
      </div>
      <h5 className="title is-5">Jobs at {company.name}</h5>
      <JobList jobs={company.jobs} />
    </>
  );
}

export default CompanyDetail;
