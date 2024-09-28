import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { eventRoutes } from "./routes";
import { swaggerUI } from "@hono/swagger-ui";

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

app.route("", eventRoutes);

app.doc("/swagger.json", {
  openapi: "3.0.0",
  info: {
    title: "SRMKZILLA Events API",
    version: "1.0.0",
  },
});

app.get("/docs", swaggerUI({ url: "/swagger.json" }));

export default app;
