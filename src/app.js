const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { documentQueue } = require("./queue");

// IMPORT UPDATED STORE (Mongo-based)
const { createJob, getJob, getAllJobs } = require("./jobStore");

// IMPORTANT: Initialize DB
require("./db");

const app = express();
app.use(express.json());

/**
 * Create Job
 */
app.post("/jobs", async (req, res) => {
  try {
    const { file_url, webhook_url } = req.body;

    if (!file_url) {
      return res.status(400).json({ error: "file_url is required" });
    }

    const jobId = uuidv4();

    // Save job in DB
    await createJob(jobId, { file_url, webhook_url });

    // Push to queue
    await documentQueue.add(
      "processDocument",
      { jobId, file_url },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
      },
    );

    res.json({
      job_id: jobId,
      status: "queued",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get Job Status
 */
app.get("/jobs/:id", async (req, res) => {
  try {
    const job = await getJob(req.params.id);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get All Jobs
 */
app.get("/jobs", async (req, res) => {
  try {
    const jobs = await getAllJobs();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`🚀 API running on port ${PORT}`);
});
