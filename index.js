import { pipefy } from "./controllers/pipefy.js";
import { gptMaker } from "./controllers/gptMaker.js";

const pipeId = 306529415;
const intentions = await gptMaker.getAgentIntentions();

const worksapcesId = await gptMaker.getWorkspaceId();

const agent = await gptMaker.getAgentId(worksapcesId);

console.log(agent);

// console.log("start form fields:", startFormFields);

// console.log("Create New Card Response:", createResponse);
