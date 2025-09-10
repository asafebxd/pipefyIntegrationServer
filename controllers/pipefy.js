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

  return resBody;
}

async function createNewCard(pipeId) {
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
                    field_value: "New Card by API"
                }
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

  return JSON.stringify(resBody.data);
}

export const pipefy = {
  createNewCard,
  fetchFieldsData,
};
