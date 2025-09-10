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

export const rdStation = {
  generateAccessToken,
  refreshAccessToken,
  getAccessToken: () => RD_ACCESS_TOKEN,
};
