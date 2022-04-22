import {loggApiError} from "./logger";
import nock from "nock";

describe('Logger', () => {
  it("handles a normal http error", async () => {
    const errorScope = nock("http://localhost")
      .post("/soknader/api/logger/error")
      .reply(201);
    const infoScope = nock("http://localhost")
      .post("/soknader/api/logger/info")
      .reply(201);
    await loggApiError('http://example.org/flesk/flesk', '500 Internal Server Error', 500);
    expect(errorScope.isDone()).toBeTruthy();
    expect(infoScope.isDone()).toBeTruthy();

  });
});