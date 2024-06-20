import { Context, Hono } from "hono"
import { handle } from "hono/vercel"
import { register, verify } from "./auth/jwtauth"
import { auth } from "./auth"
import { Instructor } from "./instructor"
import { User } from "./user"

const app: Hono = new Hono().basePath("/api")

app.route("/auth", auth)
app.route("/instructor", Instructor)
app.route("/user", User)

console.log("HONO LOADED")

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)