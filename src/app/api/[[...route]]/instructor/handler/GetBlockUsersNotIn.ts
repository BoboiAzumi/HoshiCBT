import { Context } from "hono";
import { getBlockUserNotIn } from "../../db/class";

export async function GetBlockUsersNotIn (c: Context) {
    try{
        const { data } = await c.req.json();

        return c.json({
            status: "OK",
            data: await getBlockUserNotIn(data.class_id, data.q)
        })
    }
    catch(err){
        return c.json({
            status: "FAIL"
        })
    }
}