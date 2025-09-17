import express from "express";
import { pipefy } from "./controllers/pipefy.js";

const pipeId = 306505374;
const app = express();
const port = 3000;

//Refresh Pipefy Token every 30 days
await pipefy.refreshAccessToken();

const accessToken = pipefy.getAcessToken();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Run tmole 3000 && npm run server

let leads = {
  name: "API Test",
  phoneNumber: "+551399998888",
  campaign: ["Não identificado"],
  service: ["CI"],
  deceased: "Nao",
  numberOfApplicants: 2,
  SDRConsultant: ["306844193"],
  info: "Criando novo Card via API",
  email: "teste@testeAPIcall2.com",
  firstContact: "2025-09-12",
  label: ["316554221"],
  meet: [],
};

app.get("/", (req, res) => {
  res.json("Server Running");
});

app.get("/api/v1/leads", (req, res) => {
  res.json(leads);
  res.status(200).json({ message: "Leads list" });
});

app.post("/api/v1/newLead", async (req, res) => {
  const newLead = req.body;
  const formFields = newLead.fields;
  const rawDate = req.body.meta.date.value;
  const split = rawDate.split("/");
  const reverse = split.reverse();
  const formatedData = reverse.join("-");

  let tipoDeCampanha;

  if ((newLead.form.name = "forms mês do cliente - Longa")) {
    tipoDeCampanha = "Forms Mês do Cliente";
  } else {
    tipoDeCampanha = "Não identificado";
  }

  const lead = {
    name: `${formFields.name.value}`,
    phoneNumber: `${formFields.whatsapp.value}`,
    campaign: [tipoDeCampanha],
    service: ["CI"],
    deceased: `${formFields.family.value}`,
    numberOfApplicants: formFields.pro.value === "somente eu" ? 1 : 0,
    SDRConsultant: ["306844193"],
    info: `Cidade: ${formFields.city.value},
    ${formFields.italy.title} ${formFields.italy.value},
    ${formFields.family.title} ${formFields.family.value}, 
    ${formFields.docs.title} ${formFields.docs.value},
    ${formFields.pro.title} ${formFields.pro.value},
    ${formFields.viajudicial.title} ${formFields.viajudicial.value} `,
    email: `${formFields.email.value}`,
    firstContact: `${formatedData}`,
    label: ["316554221"],
    meet: [],
  };

  const cardResponse = await pipefy.createNewCard(accessToken, pipeId, lead);
  console.log(cardResponse);

  // const n8nRes = await fetch(
  //   "https://n8n.choranmidias.com/webhook/coleta-leads",
  //   {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       body: req.body,
  //     }),
  //   }
  // );

  // console.log("Status N8N:", n8nRes.status);

  // const n8nResBody = await n8nRes.json();

  // console.log(n8nResBody);

  res.status(201).json({ message: "New lead created", newLead: lead });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
