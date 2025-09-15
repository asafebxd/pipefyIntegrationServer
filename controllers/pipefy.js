import { configDotenv } from "dotenv";
configDotenv({ path: "./.env" });

const clientId = process.env.PIPEFY_CLIENT_ID;
const clientSecret = process.env.PIPEFY_CLIENT_SECRET;

let PIPEFY_ACCESS_TOKEN;
refreshAccessToken();

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

  console.log("Status code: ", res.status);

  const resBody = await res.json();

  return resBody.access_token;
}

async function refreshAccessToken() {
  PIPEFY_ACCESS_TOKEN = await generateAccessToken();
  console.log("Token Frist refresh");

  async function wait30days() {
    try {
      PIPEFY_ACCESS_TOKEN = await generateAccessToken();
      console.log("Token refreshed");
    } catch (err) {
      console.log("Failed to refresh token", err);
    }

    setInterval(() => {
      setInterval(wait30days, 24 * 60 * 60 * 1000 * 6);
    }, 24 * 60 * 60 * 1000 * 24);
  }

  wait30days();

  return PIPEFY_ACCESS_TOKEN;
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
  const pipeData = resBody.data.pipe;

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
                    field_value:  "${leadObject.firstQuestion}"
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
          members {
            id
            name
            email
    }
  }
}
      `,
    }),
  });

  const resBody = await res.json();

  const labels = resBody.data.pipe;

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
  refreshAccessToken,
  createNewCard,
  fetchFieldsData,
  findLabels,
  findMembers,
  getAcessToken: () => PIPEFY_ACCESS_TOKEN,
};
