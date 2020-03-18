import {loggApiError} from "./logger";

describe('Logger', () => {
  it("handles a normal http error", () => {
    window.frontendlogger = {error: jest.fn(), event: jest.fn()};
    loggApiError('http://example.org/flesk/flesk', '500 Internal Server Error', 500);
    expect(window.frontendlogger.error).toHaveBeenCalledWith("Feil ved henting av data: http://example.org/flesk/flesk - 500 Internal Server Error");
  });

  xit("mustn't crash on an exception", () => {
    window.frontendlogger = {error: jest.fn(), event: jest.fn()};
    loggApiError('http://example.org/flesk/flesk', new TypeError('flesk flesk'), 500);
    expect(window.frontendlogger.error).toHaveBeenCalledWith({});
  })
});