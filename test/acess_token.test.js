import { expect, jest } from "@jest/globals";
import { pipefy } from "../controllers/pipefy";

const EXPIRATION_IN_MS = 1000 * 60 * 60 * 24 * 31;

describe("Test for valid token", () => {
  test("Test isTokenExpired right behavor", async () => {
    jest.useFakeTimers();
    const tokenObject = await pipefy.generateAccessToken();
    const isExpired = pipefy.isTokenExpired(tokenObject);
    expect(isExpired).toBe(false);

    jest.setSystemTime(new Date(Date.now() + EXPIRATION_IN_MS));

    const isExpired2 = pipefy.isTokenExpired(tokenObject);
    expect(isExpired2).toBe(true);

    jest.useRealTimers();
  });
  //     let tokenObject = await pipefy.generateAccessToken();
  //     const accessToken1 = tokenObject.access_token;

  //     const res = await fetch("https://api.pipefy.com/graphql", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${accessToken1}`,
  //       },
  //       body: JSON.stringify({
  //         query: `
  //         mutation {
  //             createCard(input: {
  //                 pipe_id: 306529415
  //                 fields_attributes: [
  //                 {
  //                     field_id: "name"
  //                     field_value: "Teste"
  //                 }
  //               ]
  //             }) {
  //                 card {
  //                     id
  //                 }
  //             }
  //         }

  //       `,
  //       }),
  //     });
  //     const resBody = await res.json();
  //     console.log(resBody.data);
  //   });
});
