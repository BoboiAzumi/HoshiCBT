import { Hono } from "hono"
import { authentication } from "../auth/middleware"
import { upload } from "../upload"

import { Middleware } from "./handler/Middleware"
import { RequestHandler } from "./handler/RequestHandler"

export const Admin = new Hono()

Admin.use(authentication)
Admin.use(Middleware)
Admin.post("/uploads", upload)
Admin.post("/", RequestHandler)