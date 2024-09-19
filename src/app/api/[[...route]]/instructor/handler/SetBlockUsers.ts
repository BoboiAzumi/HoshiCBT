import { Context } from "hono"
import { setBlockUser } from "../../db/class"

export async function SetBlockUsers (c: Context) {
    try{
        const { data } = await c.req.json()

        return c.json({
            status: "OK",
            data: await setBlockUser(data.class_id, data.user_id)
        })
    }
    catch(err){
        return c.json({
            status: "FAIL",
        })
    }
}