import { configDotenv } from "dotenv";
configDotenv({ path: "./.env" });

const API_TOKEN = process.env.API_TOKEN;

async function fetchPipefyData() {
  const res = await fetch("https://api.pipefy.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({
      query: `
        {
          organizations {
            id
            name
          }
        }
      `,
    }),
  });

  const resBody = await res.json();
  console.log(JSON.stringify(resBody));
}

fetchPipefyData().catch(console.error);
