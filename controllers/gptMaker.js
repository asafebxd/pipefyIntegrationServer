import { configDotenv } from "dotenv";
configDotenv({ path: "./.env" });

const MAKER_TOKEN = process.env.MAKER_TOKEN;

async function getWorkspaceId() {
  const res = await fetch("https://api.gptmaker.ai/v2/workspaces", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MAKER_TOKEN}`,
    },
  });
  console.log("Status code: ", res.status);

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
        "Content-Type": "application/json",
        Authorization: `Bearer ${MAKER_TOKEN}`,
      },
    }
  );

  console.log("Status code: ", res.status);

  const resBody = await res.json();

  const agent = resBody.data.map((agent) => {
    if (agent.name === "Gioppo e Conti") {
      return agent.id;
    }
  });

  return agent[0];
}

async function getAgentIntentionsById(agentId) {
  const res = await fetch(
    `https://api.gptmaker.ai/v2/agent/${agentId}/intentions`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MAKER_TOKEN}`,
      },
    }
  );

  console.log("Status code: ", res.status);

  const resBody = await res.json();

  return resBody;
}

export const gptMaker = {
  getWorkspaceId,
  getAgentId,
  getAgentIntentionsById,
};
