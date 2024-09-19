import { Context } from "hono"
import { setAllowUser } from "../../db/class"

export async function SetAllowUsers(c: Context) {
    try{
        const { data } = await c.req.json()

        return c.json({
            status: "OK",
            data: await setAllowUser(data.class_id, data.user_id)
        })
    }
    catch(err){
        return c.json({
            status: "FAIL",
        })
    }
}