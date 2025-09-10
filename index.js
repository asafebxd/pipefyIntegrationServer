import { pipefy } from "./controllers/pipefy.js";
import { gptMaker } from "./controllers/gptMaker.js";
import { rdStation } from "./controllers/rdStation.js";

// Refresh RD Token every 24h
await rdStation.refreshAccessToken();

const pipeId = 306529415;

// const worksapcesId = await gptMaker.getWorkspaceId();
// const agentId = await gptMaker.getAgentId(worksapcesId);

// const intentions = await gptMaker.getAgentIntentionsById(agentId);

// console.log(intentions, agentId);

// console.log("start form fields:", startFormFields);

// console.log("Create New Card Response:", createResponse);

const accessToken = rdStation.getAccessToken();

console.log("Access Token:", accessToken);
