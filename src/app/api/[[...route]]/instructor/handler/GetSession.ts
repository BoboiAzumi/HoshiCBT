import { Context } from "hono";

export async function GetSession (c: Context) {
    return c.json({
        status: "OK",
        data: c.get("encoded")
    })
}