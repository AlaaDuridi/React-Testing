import { http, HttpResponse } from "msw";

interface Response {
  token: string;
  message: string;
}

export const handlers = [
  http.post("*/register", async ({ request }) => {
    const body = (await request.json()) as Response;

    if (!body.token)
      return HttpResponse.json(
        { error: "Internal Server Error" },
        { status: 400 },
      );

    return HttpResponse.json(body);
  }),
];
