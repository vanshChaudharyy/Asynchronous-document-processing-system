const Job = require("./jobModel");

async function createJob(jobId, data) {
  return await Job.create({
    job_id: jobId,
    file_url: data.file_url,
    webhook_url: data.webhook_url || null,
    status: "queued",
    created_at: new Date().toISOString(),
  });
}

async function updateJob(jobId, updates) {
  return await Job.findOneAndUpdate(
    { job_id: jobId },
    { $set: updates },
    { returnDocument: "after" },
  );
}

async function getJob(jobId) {
  return await Job.findOne({ job_id: jobId });
}

async function getAllJobs() {
  return await Job.find();
}

module.exports = {
  createJob,
  updateJob,
  getJob,
  getAllJobs,
};
