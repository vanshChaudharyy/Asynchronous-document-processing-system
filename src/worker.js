require("./db");

const { Worker } = require("bullmq");
const { connection } = require("./queue");
const { updateJob } = require("./jobStore");
const axios = require("axios");

console.log("🚀 Worker started and waiting for jobs...");

const worker = new Worker(
  "documentQueue",
  async (job) => {
    const { jobId } = job.data;

    console.log(`📥 Job received: ${jobId}`);

    // Mark as processing
    await updateJob(jobId, {
      status: "processing",
      started_at: new Date().toISOString(),
    });

    // Simulate processing delay
    await new Promise((resolve) =>
      setTimeout(resolve, 10000 + Math.random() * 10000),
    );

    // Simulate random failure
    if (Math.random() < 0.2) {
      throw new Error("Random processing failure");
    }

    const result = {
      message: "Document processed successfully",
      extracted_data: {
        title: "Sample Doc",
        pages: 5,
      },
    };

    // Mark as completed
    const completedJob = await updateJob(jobId, {
      status: "completed",
      completed_at: new Date().toISOString(),
      result,
    });

    console.log(`✅ Job completed: ${jobId}`);

    // Webhook call
    if (completedJob.webhook_url) {
      try {
        await axios.post(completedJob.webhook_url, completedJob);
        console.log("📡 Webhook sent");
      } catch (err) {
        console.log("⚠️ Webhook failed:", err.message);
      }
    }

    return result;
  },
  {
    connection,
    concurrency: 5,
  },
);

// Worker ready
worker.on("ready", () => {
  console.log("✅ Worker is ready and connected to Redis");
});

// Handle failure
worker.on("failed", async (job, err) => {
  console.log(`❌ Job failed: ${job.id} - ${err.message}`);

  const failedJob = await updateJob(job.data.jobId, {
    status: "failed",
    completed_at: new Date().toISOString(),
    error: err.message,
  });

  if (failedJob.webhook_url) {
    try {
      await axios.post(failedJob.webhook_url, failedJob);
    } catch (e) {}
  }
});

// Error handler
worker.on("error", (err) => {
  console.error("🚨 Worker error:", err);
});
