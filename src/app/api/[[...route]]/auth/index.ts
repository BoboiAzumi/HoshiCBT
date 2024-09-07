import { Context, Hono } from "hono"
import { RequestHandler } from "./handler/RequestHandler";

export const auth: Hono = new Hono();

auth.post("/", RequestHandler)
auth.get("/", async (c: Context) => {
    return c.json({
        status: "METHOD_NOT_FOUND"
    })
})