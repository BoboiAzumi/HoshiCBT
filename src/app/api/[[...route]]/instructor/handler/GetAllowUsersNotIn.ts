import { Context } from "hono";
import { getAllowUserNotIn } from "../../db/class";

export async function GetAllowUsersNotIn (c: Context) {
    try{
        const { data } = await c.req.json();

        return c.json({
            status: "OK",
            data: await getAllowUserNotIn(data.class_id, data.q)
        })
    }
    catch(err){
        return c.json({
            status: "FAIL"
        })
    }
}