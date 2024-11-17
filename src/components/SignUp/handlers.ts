import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("*/register", () => {
    return HttpResponse.json({});
  }),
];
