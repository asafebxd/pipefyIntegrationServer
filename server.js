import express from "express";
const app = express();
const port = 3000;

app.use(express.json());

let leads;

app.get("/api/v1/leads", (req, res) => {
  res.json(leads);
  res.status(200).json({ message: "Leads list" });
});

app.post("/api/v1/newLead", (req, res) => {
  const newLead = req.body;
  res.status(201).json({ message: "New lead created", lead: newLead });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
