import { Context } from "hono";

export async function GetUserInfo (c: Context) {
    return c.json({
        status: "OK",
        data: c.get("encoded")
    })
}