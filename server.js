import express from "express";
import { pipefy } from "./controllers/pipefy.js";
import { n8n } from "./controllers/n8n.js";
import { helpers } from "./controllers/helpers.js";

import { configDotenv } from "dotenv";
configDotenv({ path: "./.env" });

const pipeId = process.env.PIPEFY_SDR_PIPE_ID;
const app = express();
const port = process.env.PORT;

//Refresh Pipefy Token every 30 days
await pipefy.refreshAccessToken();

const accessToken = pipefy.getAcessToken();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Grade Labels
const labelsObject = [
  { id: "316585201", name: "Lead Nota 1" },
  { id: "316585207", name: "Lead Nota 2" },
  { id: "316585225", name: "Lead Nota 3" },
  { id: "316585236", name: "Lead Nota 4" },
  { id: "316585240", name: "Lead Nota 5" },
];

const SDRArray = ["306993645", "306993647", "306993651"];
// 306993645 = Nuria Maia Giro
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

app.get("/api/v1/leads", (req, res) => {
  res.json(leads);
  res.status(200).json({ message: "Leads list" });
});

app.post("/api/v1/teste", (req, res) => {
  console.log("teste", req.body);
  res.status(200).json({ message: "New lead created", newLead: req.body });
});

app.post("/api/v1/newLead", async (req, res) => {
  const newLead = req.body;
  const formFields = newLead.fields;

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
    gradeLabel = labelsObject[0].id;
  }
  if (leadGrade === 2) {
    gradeLabel = labelsObject[1].id;
  }
  if (leadGrade === 3) {
    gradeLabel = labelsObject[2].id;
  }
  if (leadGrade === 4) {
    gradeLabel = labelsObject[3].id;
  }
  if (leadGrade === 5) {
    gradeLabel = labelsObject[4].id;
  }

  const lead = {
    name: `${formFields.nome.value}`,
    phoneNumber: `${formFields.whatsapp.value}`,
    campaign: [
      formFields.utm_campaign.value === ""
        ? "Não identificado"
        : formFields.utm_campaign.value,
    ],
    service: [service],
    deceased: `${formFields.parentesco.value}`,
    numberOfApplicants: formFields.interesse.value,
    SDRConsultant: [
      SDRConsultant === firstSDRConsultant
        ? helpers.randomize(SDRArray)
        : SDRConsultant,
    ],
    info: `
    ${formFields.documento.title} ${formFields.documento.value},
    ${formFields.Judicial.title} ${formFields.Judicial.value},
    ${formFields.interesse.title} ${formFields.interesse.value} 
    ${formFields.processo.title} ${formFields.processo.value} 
    `,
    email: `${formFields.email.value}`,
    firstContact: `${formattedDate}`,
    label: [gradeLabel],
    meet: [],
  };

  //Update First Consultant to avoid repetition
  firstSDRConsultant = lead.SDRConsultant;
  SDRConsultant = helpers.randomize(SDRArray);

  const cardResponse = await pipefy.createNewCard(accessToken, pipeId, lead);
  console.log(cardResponse);

  if (lead.service[0] === "CI") {
    await n8n.sendBody("coleta-leads", newLead);
  }
  if (lead.service[0] === "CP") {
    await n8n.sendBody("leads_CP", newLead);
  }

  res.status(200).json({ message: "New lead created", newLead: req.body });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
