import { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { validateToken } from "../../utils/validate";

export const validateAuthToken = async (c: Context, next: Next) => {
  const host = c.req.header("host")?.split(":")[0];

  const csrf = c.req.header("X-CSRF-Token");
  if (csrf && csrf.length < 800) {
    throw new HTTPException(401, { message: "Token refreshed. Logout" });
  }

  if (host !== "localhost") {
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new HTTPException(401, {
        message: "Missing or invalid Authorization header",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    if (!validateToken(token, c.env.KEY)) {
      throw new HTTPException(403, { message: "Invalid token - " + token });
    }
  }

  await next();
};