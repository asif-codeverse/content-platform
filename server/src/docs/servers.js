export const servers = [
  {
    url: "http://localhost:5001/api/v1",
    description:
      "Local Development — runs on port 5001 by default (configurable via the PORT env variable).",
  },
  {
    url: "https://content-platform-api-8ars.onrender.com/api/v1",
    description:
      "Production — hosted on Render. Connects to MongoDB Atlas and Redis Cloud.",
  },
];