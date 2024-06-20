import { Context } from "hono"
import { getCookie } from "hono/cookie"

export async function authentication(c: Context, next: Function){
    const jwt = getCookie(c, "jwt");
    if(!jwt){
        c.status(500);
        return c.json({
            status: "NOT_LOGGED"
        });
    }
    await next()
}

