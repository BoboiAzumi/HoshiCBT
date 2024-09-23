import { Hono } from "hono"
import { authentication } from "../auth/middleware"
import { upload } from "../upload"
import { SessionVerify } from "./handler/Middleware"
import { RequestHandler } from "./handler/RequestHandler"

export const Instructor = new Hono()

Instructor.use(authentication)
Instructor.use(SessionVerify)

Instructor.post("/uploads", upload)
Instructor.post("/", RequestHandler)