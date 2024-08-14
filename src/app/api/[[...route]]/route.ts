import { Context, Hono } from "hono"
import { handle } from "hono/vercel"
import { auth } from "./auth"
import { Instructor } from "./instructor"
import { User } from "./user"
import dotenv from "dotenv-extended"
import { stream } from "hono/streaming"
import fs from "fs"
import path from "path"
import { Admin } from "./admin"

dotenv.load()

const app: Hono = new Hono().basePath("/api")

app.route("/auth", auth)
app.route("/instructor", Instructor)
app.route("/user", User)
app.route("/admin", Admin)

//app.post("/uploads", upload)

app.get("/uploads/:type/:file", (c: Context) => {
    try{
        const { type, file } = c.req.param()

        return stream(c, async (stream) => {
            try{
                stream.onAbort(() => {
                    console.log("Aborted")
                })
    
                stream.write(Buffer.from(fs.readFileSync(path.join(<string>process.env.UPLOAD_MAIN_DIR, type, file))))
            }
            catch{
                stream.write(JSON.stringify({
                    status: "FAIL",
                    msg: "FILE NOT FOUND"
                }))
            }
        })
    }
    catch{
        return c.json({
            status: "FAIL"
        })
    }
})

console.log("HONO LOADED")

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)