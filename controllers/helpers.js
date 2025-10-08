import { pipefy } from "./pipefy.js";

import { configDotenv } from "dotenv";
configDotenv({ path: "./.env" });

let tokenObject = await pipefy.generateAccessToken();

//Pipefy acessToken
let accessToken = tokenObject.access_token;
const pipeId3RD = process.env.PIPEFY_3RD_SDR_PIPE_ID;

function randomize(array) {
  return array[Math.floor(Math.random() * array.length)];
}

async function gradeCalculator(formFields) {
  //IsTokenExpired returns false to valid tokens
  if (pipefy.isTokenExpired(tokenObject)) {
    tokenObject = await pipefy.generateAccessToken();
    accessToken = tokenObject.access_token;
  }

  const labels = await pipefy.findLabels(accessToken, pipeId3RD);

  let grade = 0;

  if (formFields.parentesco?.value === "Pai/Mãe") {
    grade += 1;
  }

  if (formFields.parentesco?.value === "Avô/Avó") {
    grade += 1;
  }

  if (formFields.parentesco?.value === "Bisavô/Bisavó") {
    grade += 1;
  }

  if (formFields.parentesco?.value === "Trisavô ou mais") {
    grade += 1;
  }

  if (formFields.documento?.value === "Sim") {
    grade += 1;
  }

  if (formFields.Judicial?.value === "Sim") {
    grade += 1;
  }

  if (formFields.processo?.value === "3 Meses") {
    grade += 2;
  }

  if (formFields.processo?.value === "6 Meses") {
    grade += 1;
  }

  if (formFields.processo?.value === "0 à 60 dias") {
    grade += 3;
  }

  const label = labels.find((label) => label.name === `Lead Nota ${grade}`);

  return label.id;
}

function getAnswers(formFields) {
  let info = "";

  if (formFields.documento?.value !== undefined) {
    info += `${formFields.documento.title} ${formFields.documento.value}, `;
  }
  if (formFields.Judicial?.value !== undefined) {
    info += `${formFields.Judicial.title} ${formFields.Judicial.value}, `;
  }
  if (formFields.interesse?.value !== undefined) {
    info += `${formFields.interesse.title} ${formFields.interesse.value}, `;
  }
  if (formFields.processo?.value !== undefined) {
    info += `${formFields.processo.title} ${formFields.processo.value}, `;
  }

  return info;
}

async function sendBody(first_message, phone_number) {
  const res = await fetch(
    `https://integracoes.tintim.app/webhook/833ad51a-c552-41ce-8517-813973ef03f1`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_message: first_message,
        phone_number: phone_number,
      }),
    }
  );

  return res.status;
}

export const helpers = {
  randomize,
  gradeCalculator,
  getAnswers,
  sendBody,
};
