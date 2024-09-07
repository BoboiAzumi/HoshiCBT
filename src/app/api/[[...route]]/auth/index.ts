import { Context, Hono } from "hono"
import { RequestHandler } from "./handler/RequestHandler";

export const auth: Hono = new Hono();

auth.post("/", RequestHandler)
auth.get("/", async (c: Context) => {
    c.status(500)
    return c.json({
        status: "FAIL",
        message: "Method not found"
    })
})