import { configDotenv } from "dotenv";
configDotenv({ path: "./.env" });

const MAKER_TOKEN = process.env.MAKER_TOKEN;

async function getWorkspaceId() {
  const res = await fetch("https://api.gptmaker.ai/v2/workspaces", {
    method: "GET",
    headers: {
      Content_Type: "application/json",
      Authorization: `Bearer ${MAKER_TOKEN}`,
    },
  });

  const resBody = await res.json();

  const worksapcesId = resBody.map((worksapces) => {
    if (worksapces.name === "Gioppo&Conti") {
      return worksapces.id;
    }
  });

  return worksapcesId[0];
}

async function getAgentId(workspaceId) {
  const res = await fetch(
    `https://api.gptmaker.ai/v2/workspace/${workspaceId}/agents`,
    {
      method: "GET",
      headers: {
        Content_Type: "application/json",
        Authorization: `Bearer ${MAKER_TOKEN}`,
      },
    }
  );

  console.log(res.status);

  const resBody = res.json();

  return resBody;
}

async function getAgentIntentions() {
  const worksapcesId = getWorkspaceId();
  const agentId = "3E6AF98EF543E0A9A19A0E5D41267B31";

  const res = await fetch(
    `https://api.gptmaker.ai/v2/agent/${agentId}/intentions`,
    {
      method: "GET",
      headers: {
        Content_Type: "authentication/json",
        Authorization: `Bearer ${MAKER_TOKEN}`,
      },
    }
  );

  console.log(res.status);

  const resBody = await res.json();

  return resBody;
}

export const gptMaker = {
  getWorkspaceId,
  getAgentId,
  getAgentIntentions,
};
