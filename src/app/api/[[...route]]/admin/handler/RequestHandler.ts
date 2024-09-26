import { Context } from "hono";
import { addUser, deleteUser, findAdmin, findInstructor, findUser, updateUser } from "../../db/users"
import { Users } from "../../types/user"

export async function RequestHandler (c: Context) {
    try{
        const { method, data } = await c.req.json()

        if(!(typeof method == "string")) return c.json({
            status: "FAIL"
        })

        let ftc : Users[];

        switch(method.toUpperCase()){
            case "ADD_ADMIN":
                await addUser({
                    ...data,
                    role: "admin"
                })

                return c.json({
                    status: "OK"
                })
            case "ADD_INSTRUCTOR":
                await addUser({
                    ...data,
                    role: "instructor"
                })

                return c.json({
                    status: "OK"
                })
            case "ADD_USER":
                await addUser({
                    ...data,
                    role: "user"
                })

                return c.json({
                    status: "OK"
                })
            case "DELETE":
                await deleteUser(data ? data.id ? data.id : "0" : "0")

                return c.json({
                    status: "OK"
                })
            
            case "MODIFY":
                if(data == undefined || data._id == undefined) {
                    c.status(500)
                    return c.json({
                        status: "FAIL",
                        message: "Data should contain"
                    })
                }

                await updateUser(data ? data : {} as Users)
                
                return c.json({
                    status: "OK"
                })
            case "GET_ADMIN":
                ftc = await findAdmin(data ? data.q ? data.q : "" : "")
                return c.json({
                    status: "OK",
                    data: ftc
                })
            case "GET_INSTRUCTOR":
                ftc = await findInstructor(data ? data.q ? data.q : "" : "")
                return c.json({
                    status: "OK",
                    data: ftc
                })
            case "GET_USER":
                ftc = await findUser(data ? data.q ? data.q : "" : "")
                return c.json({
                    status: "OK",
                    data: ftc
                })
            default:
                c.status(500)
                return c.json({
                    status: "FAIL",
                    message: "Unknown method"
                })
        }
    }
    catch(e: unknown){
        c.status(500)
        return c.json({
            status: "FAIL",
            message: (e as Error).message
        })
    }
}