import { Context } from "hono";
import { FindId } from "./Find";
import { SessionCheck } from "./SessionCheck";
import { SignIn } from "./SignIn";
import { SignOut } from "./SignOut";

export async function RequestHandler(c: Context){
    try{
        const { method } = await c.req.json()
        switch((method as string)){
            case "FIND_USER_BY_ID":
                return await FindId(c)
            case "AUTHENTICATION":
                return await SessionCheck(c)
            case "SIGN_IN":
                return await SignIn(c)
            case "SIGN_OUT":
                return await SignOut(c)
            default: 
                c.status(500)
                return c.json({
                    status: "FAIL",
                    message: "Unknown Method"
                })
        }
    }
    catch (e: unknown){
        c.status(500)
        return c.json({
            status: "FAIL",
            message: (e as Error).message
        })
    }
}