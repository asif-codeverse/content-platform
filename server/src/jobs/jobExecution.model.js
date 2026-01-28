import mongoose from "mongoose";

const schema = new mongoose.Schema({
  jobId: { type: String, unique: true, required: true },
  type: { type: String, required: true },
  status: {
    type: String,
    enum: ["COMPLETED", "FAILED"],
    required: true,
  },
  executedAt: { type: Date, default: Date.now },
});

export const JobExecution = mongoose.model("JobExecution", schema);

export const isJobCompleted = async (jobId) => {
  return !!(await JobExecution.findOne({
    jobId,
    status: "COMPLETED",
  }));
};

export const markJobCompleted = async (job) => {
  return JobExecution.create({
    jobId: job.jobId,
    type: job.type,
    status: "COMPLETED",
  });
};

export const markJobFailed = async (job) => {
  return JobExecution.create({
    jobId: job.jobId,
    type: job.type,
    status: "FAILED",
  });
};
