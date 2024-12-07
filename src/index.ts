import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { routes } from "./routes";
import { swaggerUI } from "@hono/swagger-ui";
import { validateAuthToken } from "./middleware/auth";

type Bindings = {
  DB: D1Database;
};

const app = new OpenAPIHono<{ Bindings: Bindings }>();

app.onError((error, ctx) => {
  console.error("Error:", error);
  return ctx.json(
    {
      success: false,
      message: "An unexpected error occurred.",
      error: error.message,
    },
    500
  );
});

app.use("*", cors());
app.use("*", validateAuthToken);

app.route("", routes);

app.doc("/swagger.json", {
  openapi: "3.0.0",
  info: {
    title: "Evenzo API",
    version: "1.2.0",
  },
});

app.get("/docs", swaggerUI({ url: "/swagger.json" }));

export default app;
