import { Context } from "hono"
import { findUserById } from "../../db/users"
import { Users } from "../../types/user"

export async function FindId(c: Context) {
    try{
        const { data } = await c.req.json()
        const user: Users[] = await findUserById(data.user_id)

        return c.json({
            status: "OK",
            data: user
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