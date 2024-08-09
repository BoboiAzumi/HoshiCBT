import { Context, Hono } from "hono"
import { authentication } from "../auth/middleware"
import { JWTVerify, verify } from "../auth/jwtauth"
import { getCookie } from "hono/cookie"
import { deleteAllowUser, deleteBlockUser, deleteClassById, findClassById, findClassByInstructorId, getAllowUser, getAllowUserNotIn, getBlockUser, getBlockUserNotIn, insertClass, setAllowUser, setBlockUser, updateClassById } from "../db/class"
import { Classroom } from "../types/class"
import { deleteAnswer, deleteAttachment, deleteExamByClasId, deleteQuestion, getExam, getExamList, insertNewAnswer, insertNewAttachment, insertNewQuestion, newExam, saveExam } from "../db/exam"
import { Questions } from "../types/exam"
import { upload } from "../upload"

export const Admin = new Hono()

Admin.use(authentication)
Admin.use(async (c: Context, next: Function) => {
    const jwt: string = <string>getCookie(c, "jwt")
    const encoded: JWTVerify = await verify(jwt)

    if(encoded.error != null){
        c.status(500)
        return c.json({
            status: "FAIL",
            message: encoded.error
        })
    }

    if(encoded.result.role != "admin"){
        c.status(500)
        return c.json({
            status: "FORBIDDEN"
        })
    }

    c.set("encoded", encoded)
    await next()
})

Admin.post("/uploads", upload)