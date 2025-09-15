import { pipefy } from "./controllers/pipefy.js";
import { gptMaker } from "./controllers/gptMaker.js";
import { rdStation } from "./controllers/rdStation.js";

import { configDotenv } from "dotenv";
configDotenv({ path: "./.env" });

// Refresh RD Token every 24h
await rdStation.refreshAccessToken();

//Refresh Pipefy Token every 30 days
await rdStation.refreshAccessToken();

const RdAccessToken = rdStation.getAccessToken();

const pipefyAccessToken = pipefy.getAcessToken();

console.log("token", pipefyAccessToken, "rd", RdAccessToken);

// const pipeId = 306505374;
// const segmentId = 17086323;

// const pipeFields = await pipefy.fetchFieldsData(pipeId);

// const leadObject = {
//   name: "API Test",
//   phoneNumber: "+551399998888",
//   campaign: ["Não identificado"],
//   service: ["CI"],
//   firstQuestion: "Nao",
//   numberOfApplicants: 2,
//   SDRConsultant: ["306844193"],
//   info: "Criando novo Card via API",
//   email: "teste@testeAPIcall2.com",
//   firstContact: "2025-09-12",
//   label: ["316554221"],
//   meet: [],
// };

// const cardCreated = await pipefy.createNewCard(pipeId, leadObject);

// console.log(cardCreated);

// console.log(accessToken);

start_form_fields: [
  {
    id: "nome",
    required: false,
    label: "Nome cliente ",
    type: "short_text",
    options: [],
  },
  {
    id: "telefone",
    required: true,
    label: "Telefone:",
    type: "phone",
    options: [],
  },
  {
    id: "tipo_de_campanha_1",
    required: false,
    label: "Tipo de Campanha",
    type: "checklist_horizontal",
    options: [Array],
  },
  {
    id: "tipo_de_servi_o_1",
    required: true,
    label: "Tipo de Serviço",
    type: "radio_horizontal",
    options: [Array],
  },
  {
    id: "quem_o_italiano",
    required: false,
    label: "Quem é o dante causa",
    type: "short_text",
    options: [],
  },
  {
    id: "quantidade_de_requerentes",
    required: false,
    label: "Quantidade de requerentes",
    type: "number",
    options: [],
  },
  {
    id: "documenta_es",
    required: false,
    label: "Documentações",
    type: "attachment",
    options: [],
  },
  {
    id: "consultor_sdr",
    required: true,
    label: "Consultor SDR",
    type: "assignee_select",
    options: [],
  },
  {
    id: "informa_es",
    required: true,
    label: "Informações",
    type: "long_text",
    options: [],
  },
  {
    id: "email",
    required: false,
    label: "Email:",
    type: "email",
    options: [],
  },
  {
    id: "data_do_primeiro_contato",
    required: true,
    label: "Data do primeiro contato",
    type: "date",
    options: [],
  },
  {
    id: "sele_o_de_etiqueta",
    required: false,
    label: "Seleção de etiqueta",
    type: "label_select",
    options: [],
  },
  {
    id: "reuni_o",
    required: false,
    label: "Reunião",
    type: "radio_vertical",
    options: [Array],
  },
];

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
