import { configDotenv } from "dotenv";
configDotenv({ path: "./.env" });

const clientId = process.env.PIPEFY_CLIENT_ID;
const clientSecret = process.env.PIPEFY_CLIENT_SECRET;

async function generateAccessToken() {
  const res = await fetch("https://app.pipefy.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  console.log("Generate Status code: ", res.status);

  const resBody = await res.json();

  return resBody;
}

function isTokenExpired(token) {
  const expiresAt = (token.expires_in + token.created_at) * 1000;

  return Date.now() >= expiresAt;
}

async function fetchFieldsData(acessToken, pipeId) {
  const res = await fetch("https://api.pipefy.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${acessToken}`,
    },
    body: JSON.stringify({
      query: `
        {
          pipe(id: ${pipeId}) {
            start_form_fields {
              id
              required
              label
              type
              options
            }
               labels {
              id
              name
            }
          }
        }
      `,
    }),
  });
  console.log("Status code: ", res.status);

  const resBody = await res.json();
  const pipeData = resBody.data.pipe.start_form_fields;

  return pipeData;
}

async function createNewCard(acessToken, pipeId, leadObject) {
  const res = await fetch("https://api.pipefy.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${acessToken}`,
    },
    body: JSON.stringify({
      query: `
        mutation {
            createCard(input: {
                pipe_id: ${pipeId}
                fields_attributes: [
                {
                    field_id: "nome"
                    field_value:  "${leadObject.name}"
                },
                 {
                    field_id: "telefone"
                    field_value: "${leadObject.phoneNumber}"
                },
                {
                    field_id: "tipo_de_campanha_1"
                    field_value: "${leadObject.campaign}"
                },
                {
                    field_id: "tipo_de_servi_o_1"
                    field_value:  "${leadObject.service}"
                },
                {
                    field_id: "quem_o_italiano"
                    field_value:  "${leadObject.deceased}"
                },
                {
                    field_id: "quantidade_de_requerentes"
                    field_value:  "${leadObject.numberOfApplicants}"
                },
                {
                    field_id: "consultor_sdr"
                    field_value:  "${leadObject.SDRConsultant}"
                },
                {
                    field_id: "informa_es"
                    field_value:  "${leadObject.info}"
                },
                 {
                    field_id: "email"
                    field_value:  "${leadObject.email}"
                },
                    {
                    field_id: "data_do_primeiro_contato"
                    field_value:  "${leadObject.firstContact}"
                },
                {
                    field_id: "sele_o_de_etiqueta"
                    field_value:  "${leadObject.label}"
                },
                {
                    field_id: "reuni_o"
                    field_value:  "${leadObject.meet}"
                },
              ]
            }) {
                card {
                    id
                }
            }
        }
      
      `,
    }),
  });
  console.log("Status code: ", res.status);

  const resBody = await res.json();

  return JSON.stringify(resBody);
}

async function createNewCardInstragramDM(acessToken, pipeId, leadObject) {
  const res = await fetch("https://api.pipefy.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${acessToken}`,
    },
    body: JSON.stringify({
      query: `
        mutation {
            createCard(input: {
                pipe_id: ${pipeId}
                fields_attributes: [
                {
                    field_id: "nome"
                    field_value:  "${leadObject.name}"
                },
                 {
                    field_id: "telefone"
                    field_value: "${leadObject.phoneNumber}"
                },
                {
                    field_id: "tipo_de_campanha_1"
                    field_value: "${leadObject.campaign}"
                },
                {
                    field_id: "sele_o_de_etiqueta"
                    field_value:  "${leadObject.label}"
                },
              ]
            }) {
                card {
                    id
                }
            }
        }
      
      `,
    }),
  });
  console.log("Status code: ", res.status);

  const resBody = await res.json();

  return JSON.stringify(resBody);
}

async function findLabels(acessToken, pipeId) {
  const res = await fetch("https://api.pipefy.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${acessToken}`,
    },
    body: JSON.stringify({
      query: `
       {
        pipe(id: "${pipeId}") {
          labels {
            id
            name
    }
  }
}
      `,
    }),
  });

  const resBody = await res.json();

  const labels = resBody.data.pipe.labels;

  return labels;
}

async function findMembers(acessToken, pipeId) {
  const res = await fetch("https://api.pipefy.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${acessToken}`,
    },
    body: JSON.stringify({
      query: `
        {
          pipe(id: ${pipeId}) {
           members { 
            user {
              id
              name
            }
           }
          }
        }
      `,
    }),
  });

  const resBody = await res.json();

  const members = resBody.data.pipe.members;

  return members;
}

export const pipefy = {
  generateAccessToken,
  isTokenExpired,
  createNewCard,
  createNewCardInstragramDM,
  fetchFieldsData,
  findLabels,
  findMembers,
};
