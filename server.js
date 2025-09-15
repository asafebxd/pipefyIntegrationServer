import express from "express";
const app = express();
const port = 3000;

app.use(express.json());

//Run tmole 3000 && npm run server

let leads = {
  name: "API Test",
  phoneNumber: "+551399998888",
  campaign: ["Não identificado"],
  service: ["CI"],
  firstQuestion: "Nao",
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

app.post("/api/v1/newLead", (req, res) => {
  const newLead = req.body;
  console.log(newLead);

  res.status(201).json({ message: "New lead created", lead: newLead });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
