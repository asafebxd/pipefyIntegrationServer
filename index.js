import { pipefy } from "./controllers/pipefy.js";
import { gptMaker } from "./controllers/gptMaker.js";
import { rdStation } from "./controllers/rdStation.js";

import { configDotenv } from "dotenv";
configDotenv({ path: "./.env" });

const worksapcesId = await gptMaker.getWorkspaceId();

const data = "16/05/2003";
let newData = "";

const split = data.split("/");
console.log(split);
const reverse = split.reverse();
split.forEach((element) => {
  newData += `${element}`;
});

console.log(reverse);
const reuslt = reverse.join("-");
console.log(reuslt);

console.log("workSpaceId", worksapcesId);

// Refresh RD Token every 24h
// await rdStation.refreshAccessToken();

//Refresh Pipefy Token every 30 days
// await rdStation.refreshAccessToken();

// const RdAccessToken = rdStation.getAccessToken();

const pipefyAccessToken = pipefy.getAcessToken();
// console.log("token", pipefyAccessToken, "rd", RdAccessToken);

// const pipeId = 306505374;
// const segmentId = 17086323;

// const pipeFields = await pipefy.fetchFieldsData(pipeId);

// const cardCreated = await pipefy.createNewCard(pipeId, leadObject);

// const tipoDeCampanha = [
//   "Instagram ADS",
//   "Instagram Orgânico",
//   "Tik Tok Orgânico",
//   "Te Amo Orgânico",
//   "Eletromidia Baixada Santista",
//   "Eletromidia Jundiaí",
//   "Link da Bio",
//   "Site Oficial",
//   "Whatsapp-PQ MIX",
//   "Forms Mês do Cliente",
//   "Forms VS2",
//   "LP-Fábio",
//   "Google",
//   "Campanha Facebook",
//   "Campanha Maria Joana",
//   "Meta ADS-Cidadania Portuguesa",
//   "Indicação",
//   "LP-Luiza",
//   "Promo Familia PF",
//   "Euro Congelado/Preço",
//   "Formulário",
//   "Não identificado",
//   "Webnario",
// ];
