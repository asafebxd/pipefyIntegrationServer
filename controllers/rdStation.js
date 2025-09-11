import { configDotenv } from "dotenv";
configDotenv({ path: "./.env" });

const refreshToken = process.env.RD_REFRESH_TOKEN;
const clientId = process.env.RD_CLIENT_ID;
const clientSecret = process.env.RD_CLIENT_SECRET;

let RD_ACCESS_TOKEN;
refreshAccessToken();

async function generateAccessToken() {
  const res = await fetch("https://api.rd.services/auth/token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    }),
  });
  console.log("Status code: ", res.status);

  const resBody = await res.json();

  return resBody.access_token;
}

async function refreshAccessToken() {
  RD_ACCESS_TOKEN = await generateAccessToken();

  setInterval(async () => {
    try {
      RD_ACCESS_TOKEN = await generateAccessToken();
      console.log("Token refreshed");
    } catch (err) {
      console.log("Failed to refresh token", err);
    }
  }, 24 * 60 * 60 * 1000);

  return RD_ACCESS_TOKEN;
}

async function getRDWebhooks(accessToken) {
  const res = await fetch("https://api.rd.services/integrations/webhooks", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log("Status Code:", res.status);

  const resBody = await res.json();

  return resBody.webhooks;
}

async function postRDWebhook(accessToken) {
  const res = await fetch("https://api.rd.services/integrations/webhooks", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      event_type: "WEBHOOK.CONVERTED",
      entity_type: "CONTACT",
      http_method: "POST",
      include_relations: ["COMPANY", "CONTACT_FUNNEL"],
      url: "https://gioppoeconti.webhook.com.br",
    }),
  });
  console.log("Status Code:", res.status);

  const resBody = await res.json();

  return resBody.webhooks;
}

async function getLeadsList(acessTokem, segmentId) {
  const res = await fetch(
    `https://api.rd.services/platform/segmentations/${segmentId}/contacts`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${acessTokem}`,
      },
    }
  );
  console.log("Status code:", res.status);

  const resBody = await res.json();

  const contacts = resBody.contacts;

  return contacts;
}

async function getLeadById(acessToken, leadId) {
  const res = await fetch(
    `https://api.rd.services/platform/contacts/uuid:${leadId}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${acessToken}`,
      },
    }
  );

  console.log("Status code:", res.status);

  const resBody = res.json();

  return resBody;
}

async function getLeadOriginById(acessToken, leadId) {
  const res = await fetch(
    `https://api.rd.services/platform/contacts/uuid:${leadId}/funnels/default`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${acessToken}`,
      },
    }
  );

  console.log("Status code: ", res.status);

  const resBody = await res.json();

  return resBody.origin;
}

export const rdStation = {
  generateAccessToken,
  refreshAccessToken,
  getRDWebhooks,
  postRDWebhook,
  getLeadsList,
  getLeadById,
  getLeadOriginById,
  getAccessToken: () => RD_ACCESS_TOKEN,
};
