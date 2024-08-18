import { Context } from "hono"
import { getCookie, setCookie } from "hono/cookie"
import { verify } from "./jwtauth";
import { findUserById } from "../db/users";
import { Users } from "../types/user";

export async function authentication(c: Context, next: Function){
    const jwt = getCookie(c, "jwt");
    if(!jwt){
        c.status(500);
        return c.json({
            status: "NOT_LOGGED"
        });
    }

    const jwtver = await verify(jwt)

    try{
        const user: Users[] = await findUserById(jwtver.result ? jwtver.result._id : "");

        if(user.length == 0){
            c.status(500);
            setCookie(c, "jwt", "")
            return c.json({
                status: "NOT_LOGGED"
            });
        }
    
        if(user[0].role != jwtver.result.role){
            c.status(500);
            setCookie(c, "jwt", "")
            return c.json({
                status: "NOT_LOGGED"
            });
        }
    
        await next()
    }
    catch{
        c.status(500);
        setCookie(c, "jwt", "")
        return c.json({
            status: "NOT_LOGGED"
        });
    }
}

