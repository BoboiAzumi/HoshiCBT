import { Context } from "hono";
import { getAllowUser } from "../../db/class";

export async function GetAllowUsers (c: Context) {
    try{
        const { data } = await c.req.json();

        return c.json({
            status: "OK",
            data: await getAllowUser(data.class_id)
        })
    }
    catch(err){
        return c.json({
            status: "FAIL"
        })
    }
}