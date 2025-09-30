import express from "express";
import { pipefy } from "./controllers/pipefy.js";
import { n8n } from "./controllers/n8n.js";
import { helpers } from "./controllers/helpers.js";

import { configDotenv } from "dotenv";
configDotenv({ path: "./.env" });

const pipeId = process.env.PIPEFY_SDR_PIPE_ID;
const pipeId3RD = process.env.PIPEFY_3RD_SDR_PIPE_ID;
const app = express();
const port = process.env.PORT;

let tokenObject = await pipefy.generateAccessToken();

//Pipefy acessToken
let accessToken = tokenObject.access_token;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Campaigns array
const startForm = await pipefy.fetchFieldsData(accessToken, pipeId);
const campaigns = startForm[2].options;

//Grade Labels
const labels = await pipefy.findLabels(accessToken, pipeId);

const SDRArray = ["306993647", "306993651"];
// 306993647 = Luiz Felipe Oliveira Silva
// 306993651 = Luiz Henrique Silva

//Pipefy format Date
const date = new Date();
const day = date.getDate();
const month = String(date.getMonth() + 1).padStart(2, "0");
const year = date.getFullYear();
const formattedDate = `${year}-${month}-${day}`;

//Run tmole 3000 && npm run server
app.get("/", (req, res) => {
  res.json("Server Running");
});

app.post("/api/v1/newLeadByAgent", async (req, res) => {
  console.log(req.body);
  const newLead = req.body;

  //IsTokenExpired returns false to valid tokens
  if (pipefy.isTokenExpired(tokenObject)) {
    tokenObject = await pipefy.generateAccessToken();
    accessToken = tokenObject.access_token;
  }

  const lead = {
    name: newLead?.name,
    phoneNumber: `+${newLead?.whatsappPhone}`,
    campaign: ["Whatsapp"],
    service: [newLead?.service],
    deceased: newLead?.deceased,
    numberOfApplicants: newLead?.applicants || 1,
    SDRConsultant: [306844193],
    info: newLead?.contactInfo,
    email: "",
    firstContact: `${formattedDate}`,
    label: ["316638134"],
    meet: [],
  };

  const cardResponse = await pipefy.createNewCard(accessToken, pipeId3RD, lead);
  console.log(cardResponse);

  res.sendStatus(200);
});

app.post("/api/v1/newLead", async (req, res) => {
  const newLead = req.body;
  const formFields = newLead.fields;
  console.log(newLead);

  //IsTokenExpired returns false to valid tokens
  if (pipefy.isTokenExpired(tokenObject)) {
    tokenObject = await pipefy.generateAccessToken();
    accessToken = tokenObject.access_token;
  }

  //Lead grade
  let leadGrade = helpers.gradeCalculator(formFields);
  let gradeLabel = "";

  // SDR Consultant Logic
  let firstSDRConsultant = helpers.randomize(SDRArray);
  let SDRConsultant = firstSDRConsultant;

  // Service Logic || Theres is only one CP Landing page
  const service = newLead.form_id === "2b53029" ? "CP" : "CI";

  //Grade label logic
  if (leadGrade === 1) {
    gradeLabel = labels[8].id;
  }
  if (leadGrade === 2) {
    gradeLabel = labels[9].id;
  }
  if (leadGrade === 3) {
    gradeLabel = labels[10].id;
  }
  if (leadGrade === 4) {
    gradeLabel = labels[11].id;
  }
  if (leadGrade === 5) {
    gradeLabel = labels[12].id;
  }

  const lead = {
    name: `${formFields.nome?.value}`,
    phoneNumber: `${formFields.whatsapp?.value}`,
    campaign: [
      campaigns.includes(formFields.utm_campaign?.value)
        ? formFields.utm_campaign.value
        : "Não identificado",
    ],
    service: [service],
    deceased: `${formFields.parentesco?.value}`,
    numberOfApplicants: formFields.interesse?.value || 1,
    SDRConsultant: [
      SDRConsultant === firstSDRConsultant
        ? helpers.randomize(SDRArray)
        : SDRConsultant,
    ],
    info: `${helpers.getAnswers(formFields)}`,
    email: `${formFields.email?.value}`,
    firstContact: `${formattedDate}`,
    label: [gradeLabel],
    meet: [],
  };

  // Send new lead to C2G
  if (lead.service[0] === "CI") {
    await n8n.sendBody("coleta-leads", newLead);
  }
  if (lead.service[0] === "CP") {
    await n8n.sendBody("leads_CP", newLead);
  }

  //Update First Consultant to avoid repetition
  firstSDRConsultant = lead.SDRConsultant;
  SDRConsultant = helpers.randomize(SDRArray);

  const cardResponseSDR = await pipefy.createNewCard(accessToken, pipeId, lead);
  console.log("SDR:", cardResponseSDR);
  const cardResponseTerceiro = await pipefy.createNewCard(
    accessToken,
    pipeId3RD,
    lead
  );
  console.log("Terceiro:", cardResponseTerceiro);

  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
