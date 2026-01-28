import { v4 as uuid } from "uuid";
import { enqueueInternal } from "./worker.js";

export const enqueueJob = ({ type, payload }) => {
  enqueueInternal({
    jobId: uuid(),
    type,
    payload,
    attempts: 0,
    maxAttempts: 5,
  });
};
