import { Context, Hono } from "hono"
import { authentication } from "../auth/middleware"
import { JWTVerify, verify } from "../auth/jwtauth"
import { getCookie } from "hono/cookie"
import { findClassByUserId } from "../db/class"
import { answerQuestion, endQuestions, examSession, findExamByClassId, getQuestionByArrayIndex, getResultTest } from "../db/exam"
import { Users } from "../types/user"

export const User = new Hono()

User.use(authentication)
User.use(async (c: Context, next: Function) => {
    const jwt: string = <string>getCookie(c, "jwt")
    const encoded: JWTVerify = await verify(jwt)

    if(encoded.error != null){
        c.status(500)
        return c.json({
            status: "FAIL",
            message: encoded.error
        })
    }

    if(encoded.result.role != "user"){
        c.status(500)
        return c.json({
            status: "FORBIDDEN"
        })
    }

    c.set("encoded", encoded)
    await next()
})

User.get("/", async (c: Context) => {
    return c.json({
        status: "OK",
        data: c.get("encoded")
    })
})

User.get("class", async (c: Context) => {
    const classes = await findClassByUserId(await c.get("encoded").result._id);

    return c.json({
        status: "OK",
        data: classes
    })
})

User.get("class/:id", async (c: Context) => {
    const exam = await findExamByClassId(c.req.param("id"))

    return c.json({
        status: "OK",
        data: exam
    })
})

User.get("class/:class_id/:exam_id", async (c: Context) => {
    const cookie = await verify(<string>getCookie(c, "jwt"))
    const exam = await examSession(c.req.param("class_id"), c.req.param("exam_id"), cookie.result._id)

    if(exam == false){
        return c.json({
            status: "FAIL"
        })
    }

    return c.json({
        status: "OK",
        data: exam
    })
})

User.post("class/:class_id/:exam_id", async (c: Context) => {
    const data = await c.req.json()
    const cookie = await verify(<string>getCookie(c, "jwt"))
    const setAnswer = await answerQuestion(c.req.param("class_id"), c.req.param("exam_id"), cookie.result._id, data.questionIndex, data.answer)

    if(!setAnswer){
        return c.json({
            status: "FAIL",
        })
    }

    return c.json({
        status: "OK",
    })
})

User.get("class/:class_id/:exam_id/end", async (c: Context) => {
    const cookie = await verify(<string>getCookie(c, "jwt"))
    await endQuestions(c.req.param("class_id"), c.req.param("exam_id"), cookie.result._id)
    
    return c.json({
        status: "OK"
    })
})

User.get("class/:class_id/:exam_id/result", async (c: Context) => {
    const cookie = await verify(<string>getCookie(c, "jwt"))
    const exam = await getResultTest(c.req.param("class_id"), c.req.param("exam_id"), cookie.result._id)
    
    return c.json({
        status: "OK",
        data: exam
    })
})

User.get("class/:class_id/:exam_id/:index", async (c: Context) => {
    const cookie = await verify(<string>getCookie(c, "jwt"))
    const getQuestions = await getQuestionByArrayIndex(c.req.param("class_id"), c.req.param("exam_id"), cookie.result._id, parseInt(c.req.param("index")))
    
    if(!getQuestions){
        return c.json({
            status: "FAIL",
        })
    }
    
    return c.json({
        status: "OK",
        data: getQuestions
    })
})