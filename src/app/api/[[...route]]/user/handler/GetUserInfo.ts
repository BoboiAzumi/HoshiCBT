import { Context } from "hono";

export async function GetUserInfo (c: Context) {
    try{
        return c.json({
            status: "OK",
            data: c.get("encoded")
        })
    }
    catch{
        return c.json({
            status: "FAIL",
        });
    }
}