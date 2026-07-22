import React, { createContext, useContext, useState } from 'react';

const JobsContext = createContext();

export const useJobs = () => {
  return useContext(JobsContext);
};

export const JobsProvider = ({ children }) => {
  const [draftJobs, setDraftJobs] = useState([]);
  const [publishedJobs, setPublishedJobs] = useState([]);

  const saveDraft = (jobData) => {
    // If it has an ID, update it, else create new
    if (jobData.id) {
      setDraftJobs(draftJobs.map(j => j.id === jobData.id ? jobData : j));
    } else {
      setDraftJobs([...draftJobs, { ...jobData, id: Date.now() }]);
    }
  };

  const publishJob = (jobData) => {
    // If published from draft, remove from drafts
    if (jobData.id) {
      setDraftJobs(draftJobs.filter(j => j.id !== jobData.id));
    }
    setPublishedJobs([{ ...jobData, id: Date.now(), status: 'Active', applicants: 0 }, ...publishedJobs]);
  };

  const deleteDraft = (id) => {
    setDraftJobs(draftJobs.filter(j => j.id !== id));
  };

  return (
    <JobsContext.Provider value={{ draftJobs, publishedJobs, saveDraft, publishJob, deleteDraft }}>
      {children}
    </JobsContext.Provider>
  );
};
