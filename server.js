import express from "express";
import { pipefy } from "./controllers/pipefy.js";
import { n8n } from "./controllers/n8n.js";

const pipeId = 306505374;
const app = express();
const port = 3000;

//Refresh Pipefy Token every 30 days
await pipefy.refreshAccessToken();

const accessToken = pipefy.getAcessToken();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Run tmole 3000 && npm run server

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

  // SDR Consultant Logic
  const SDRArray = ["306993645", "306993647", "306993651"];
  // 306993645 = Nuria Maia Giro
  // 306993647 = Luiz Felipe Oliveira Silva
  // 306993651 = Luiz Henrique Silva

  function randomize(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  let firstSDRConsultant = randomize(SDRArray);
  let SDRConsultant = firstSDRConsultant;

  // Campain Logic
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
    SDRConsultant: [
      SDRConsultant === firstSDRConsultant
        ? randomize(SDRArray)
        : SDRConsultant,
    ],
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

  //Update First Consultant to avoid repetition
  firstSDRConsultant = lead.SDRConsultant;
  SDRConsultant = randomize(SDRArray);

  const cardResponse = await pipefy.createNewCard(accessToken, pipeId, lead);
  console.log(cardResponse);

  await n8n.sendBody("coleta-dados", newLead);

  res.status(201).json({ message: "New lead created", newLead: lead });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
