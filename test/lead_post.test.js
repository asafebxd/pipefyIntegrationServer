import { pipefy } from "../controllers/pipefy";
import { helpers } from "../controllers/helpers";

import { configDotenv } from "dotenv";
configDotenv({ path: "./.env" });

const pipeId3RD = process.env.PIPEFY_3RD_SDR_PIPE_ID;

let tokenObject = await pipefy.generateAccessToken();
//Pipefy acessToken
let accessToken = tokenObject.access_token;

//Pipefy format Date
const date = new Date();
const day = date.getDate();
const month = String(date.getMonth() + 1).padStart(2, "0");
const year = date.getFullYear();
const formattedDate = `${year}-${month}-${day}`;

describe("Test if posts endpoints are working properly", () => {
  test("Post with forms object", async () => {
    const newLead = {
      form: { id: "1bafa00", name: "Forms - CI" },
      fields: {
        STEP1: {
          id: "STEP1",
          type: "step",
          title: "",
          value: "",
          raw_value: "",
          required: "0",
        },
        nome: {
          id: "nome",
          type: "text",
          title: "",
          value: "Jest Test1",
          raw_value: "Leonardo Tosta ",
          required: "1",
        },
        whatsapp: {
          id: "whatsapp",
          type: "text",
          title: "",
          value: "(13) 9999-9999",
          raw_value: "(21) 97999-2045",
          required: "1",
        },
        email: {
          id: "email",
          type: "email",
          title: "",
          value: "teste@teste.com",
          raw_value: "leonardo.tosta2019@outlook.com",
          required: "1",
        },
        STEP2: {
          id: "STEP2",
          type: "step",
          title: "",
          value: "",
          raw_value: "",
          required: "0",
        },
        parentesco: {
          id: "parentesco",
          type: "radio",
          title: "Qual o grau de parentesco entre você e o Italiano?",
          value: "Bisavô/Bisavó",
          raw_value: "Bisavô/Bisavó",
          required: "1",
        },
        STEP3: {
          id: "STEP3",
          type: "step",
          title: "",
          value: "",
          raw_value: "",
          required: "0",
        },
        documento: {
          id: "documento",
          type: "radio",
          title: "Você tem algum documento do Italiano?            ",
          value: "Sim",
          raw_value: "Sim",
          required: "1",
        },
        STEP4: {
          id: "STEP4",
          type: "step",
          title: "",
          value: "",
          raw_value: "",
          required: "0",
        },
        Judicial: {
          id: "Judicial",
          type: "radio",
          title: "Conhece a via Judicial?",
          value: "Não",
          raw_value: "Não",
          required: "1",
        },
        STEP5: {
          id: "STEP5",
          type: "step",
          title: "",
          value: "",
          raw_value: "",
          required: "0",
        },
        interesse: {
          id: "interesse",
          type: "number",
          title: "Quantas pessoas tem interesse  no reconhecimento?",
          value: "1",
          raw_value: "1",
          required: "1",
        },
        STEP6: {
          id: "STEP6",
          type: "step",
          title: "",
          value: "",
          raw_value: "",
          required: "0",
        },
        processo: {
          id: "processo",
          type: "radio",
          title: "Quando pretende iniciar o processo?",
          value: "Não tenho previsão",
          raw_value: "Não tenho previsão",
          required: "1",
        },
        utm_source: {
          id: "utm_source",
          type: "hidden",
          title: "utm_source",
          value: "Meta-Ads",
          raw_value: "Meta-Ads",
          required: "0",
        },
        utm_campaign: {
          id: "utm_campaign",
          type: "hidden",
          title: "utm_campaign",
          value: "[C2G] [VD] [LEAD] [F] - Captação Página Preço Advantage+",
          raw_value: "[C2G] [VD] [LEAD] [F] - Captação Página Preço Advantage+",
          required: "0",
        },
        utm_medium: {
          id: "utm_medium",
          type: "hidden",
          title: "utm_medium",
          value: "00 - União Europeia - Europa",
          raw_value: "00 - União Europeia - Europa",
          required: "0",
        },
        utm_content: {
          id: "utm_content",
          type: "hidden",
          title: "utm_content",
          value: "Ad - Julho Preço 01",
          raw_value: "Ad - Julho Preço 01",
          required: "0",
        },
        utm_term: {
          id: "utm_term",
          type: "hidden",
          title: "utm_term",
          value: "Instagram_Stories",
          raw_value: "Instagram_Stories",
          required: "0",
        },
      },
    };
    const formFields = newLead.fields;
    //IsTokenExpired returns false to valid tokens
    if (pipefy.isTokenExpired(tokenObject)) {
      tokenObject = await pipefy.generateAccessToken();
      accessToken = tokenObject.access_token;
    }

    // Campaigns array
    const startForm = await pipefy.fetchFieldsData(accessToken, pipeId3RD);
    const campaigns = startForm[2].options;

    // Service Logic || Theres is only one CP Landing page
    const service = newLead.form.id === "2e1ae2f" ? "CP" : "CI";

    const lead = {
      name: `${formFields.nome?.value}`,
      phoneNumber: `+55${(formFields?.whatsapp.value).replace(/[^0-9]/g, "")}`,
      campaign: [
        campaigns.includes(formFields.utm_campaign?.value)
          ? formFields.utm_campaign.value
          : "Não identificado",
      ],
      service: [service],
      deceased: `${formFields.parentesco?.value}`,
      numberOfApplicants: formFields.interesse?.value || 1,
      SDRConsultant: [306844193],
      info: `${helpers.getAnswers(formFields)}`,
      email: `${formFields.email?.value}`,
      firstContact: `${formattedDate}`,
      label: JSON.stringify([
        "316647443",
        `${await helpers.gradeCalculator(formFields)}`,
      ]),
      meet: [],
    };

    const cardResponse = await pipefy.createNewCard(
      accessToken,
      pipeId3RD,
      lead
    );

    const cardId = cardResponse.createCard.card.id;

    expect(cardResponse).toEqual({
      createCard: { card: { id: cardId } },
    });

    const cardDeleteResponse = await pipefy.deleteCard(accessToken, cardId);
    expect(cardDeleteResponse).toEqual({
      deleteCard: { success: true },
    });
  });

  test("Post with agent object", async () => {
    const newLead = {
      deceased: "Bisavô",
      contactInfo:
        "Eduarda tem interesse em reconhecer a cidadania italiana, tem bisavô europeu, não possui documentos do europeu, já ouviu falar do processo judicial, 2 pessoas da família têm interesse, e o motivo principal é viajar.",
      service: "CI",
      applicants: 3,
      name: "Jest Test2",
      chat_id: "3E7EE7D6B964C0FFD3A36ECD0F6844AF-5528999931657",
      contact_name: "João Vitor Vasco",
      contact_phone: "5528999931657",
      contact_email: "",
      contact_gender: "",
      contact_birthday: "",
      contact_job_title: "",
      contact_org_name: "",
      contact_org_state: "",
      contact_org_city: "",
      whatsappPhone: "551399998888",
      whatsappName: "João Vitor Vasco",
      contextId: "3E7EE7D6B964C0FFD3A36ECD0F6844AF-5528999931657",
    };

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

    const cardResponse = await pipefy.createNewCard(
      accessToken,
      pipeId3RD,
      lead
    );

    const cardId = cardResponse.createCard.card.id;

    expect(cardResponse).toEqual({
      createCard: { card: { id: cardId } },
    });

    const cardDeleteResponse = await pipefy.deleteCard(accessToken, cardId);

    expect(cardDeleteResponse).toEqual({ deleteCard: { success: true } });
  });

  test("Post with manychat object", async () => {
    const newLead = {
      id: "1376440803",
      name: "Jest Test3",
      telefone: "1399998888",
    };

    //IsTokenExpired returns false to valid tokens
    if (pipefy.isTokenExpired(tokenObject)) {
      tokenObject = await pipefy.generateAccessToken();
      accessToken = tokenObject.access_token;
    }

    const lead = {
      name: newLead?.name,
      phoneNumber: `+${newLead?.telefone}`,
      campaign: ["Instagram ADS"],
      label: ["316647925"],
    };

    const cardResponse = await pipefy.createNewCardInstragramDM(
      accessToken,
      pipeId3RD,
      lead
    );

    const cardId = cardResponse.createCard.card.id;

    expect(cardResponse).toEqual({
      createCard: { card: { id: cardId } },
    });

    const cardDeleteResponse = await pipefy.deleteCard(accessToken, cardId);

    expect(cardDeleteResponse).toEqual({ deleteCard: { success: true } });
  });
});
