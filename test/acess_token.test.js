import { jest } from "@jest/globals";
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
});
