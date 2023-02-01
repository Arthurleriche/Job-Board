import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { getJob, deleteJob } from '../graphql/queries';
import { useNavigate } from 'react-router';

function JobDetail() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [job, setJob] = useState();

  useEffect(() => {
    getJob(jobId).then(setJob);
  }, [jobId]);

  async function handleDeleteJob() {
    const job = await deleteJob(jobId);
    if (job) {
      navigate('/');
    }
  }

  if (!job) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <h1 className="title">{job.title}</h1>
      <h2 className="subtitle">
        <Link to={`/companies/${job.company.id}`}>{job.company.name}</Link>
      </h2>
      <div className="box">{job.description}</div>
      <button onClick={handleDeleteJob}>Delete Job</button>
    </div>
  );
}

export default JobDetail;