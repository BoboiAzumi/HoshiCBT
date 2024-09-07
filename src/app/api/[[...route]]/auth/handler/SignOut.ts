import { Context } from "hono";
import { deleteCookie } from "hono/cookie";

export async function SignOut (c: Context){
    try{
        deleteCookie(c, "jwt");
        return c.json({
            status: "OK"
        })
    }
    catch(e: unknown){
        c.status(500)
        return c.json({
            status: "FAIL",
            message: (e as Error).message
        })
    }
}