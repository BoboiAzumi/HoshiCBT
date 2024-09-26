import { Context, Hono } from "hono"
import { authentication } from "../auth/middleware"
import { verify } from "../auth/jwtauth"
import { getCookie } from "hono/cookie"
import { findClassByUserId } from "../db/class"
import { answerQuestion, endQuestions, examSession, findExamByClassId, getQuestionByArrayIndex, getResultTest } from "../db/exam"
import { SessionVerify } from "./handler/Middleware"
import { RequestHandler } from "./handler/RequestHandler"

export const User = new Hono()

User.use(authentication)
User.use(SessionVerify)

User.post("/", RequestHandler)