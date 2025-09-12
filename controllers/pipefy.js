import { configDotenv } from "dotenv";
configDotenv({ path: "./.env" });

const API_TOKEN = process.env.API_TOKEN;

async function fetchFieldsData(pipeId) {
  const res = await fetch("https://api.pipefy.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
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

async function createNewCard(pipeId, leadObject) {
  const res = await fetch("https://api.pipefy.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
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

async function findLabels(pipeId) {
  const res = await fetch("https://api.pipefy.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
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

async function findMembers(pipeId) {
  const res = await fetch("https://api.pipefy.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
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
  createNewCard,
  fetchFieldsData,
  findLabels,
  findMembers,
};
