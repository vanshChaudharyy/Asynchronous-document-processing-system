const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  job_id: String,
  file_url: String,
  webhook_url: String,
  status: String,
  created_at: String,
  started_at: String,
  completed_at: String,
  result: Object,
  error: String,
});

module.exports = mongoose.model("Job", jobSchema);
