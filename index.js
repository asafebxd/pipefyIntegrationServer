import { pipefy } from "./controllers/pipefy.js";
import { orchestrator } from "./orchestrator.js";

const pipeId = 306529415;

const startFormFields = await orchestrator.fetchFieldsData(pipeId);

const createResponse = await pipefy.createNewCard(pipeId);

console.log("start form fields:", startFormFields);

console.log("Create New Card Response:", createResponse);
