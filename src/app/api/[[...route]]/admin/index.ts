import { Hono } from "hono"
import { authentication } from "../auth/middleware"
import { upload } from "../upload"

import { SessionVerify } from "./handler/Middleware"
import { RequestHandler } from "./handler/RequestHandler"

export const Admin = new Hono()

Admin.use(authentication)
Admin.use(SessionVerify)
Admin.post("/uploads", upload)
Admin.post("/", RequestHandler)