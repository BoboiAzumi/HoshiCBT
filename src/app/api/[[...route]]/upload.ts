import { Context } from "hono"
import crypto from "crypto"
import dotenv from "dotenv-extended"
import path from "path"
import fs from "fs"
import { File } from "buffer"

dotenv.load()

export async function upload(c: Context){
    try{
        const body = await c.req.parseBody()
            
        if(body["file"] instanceof File){
            const file: File = body["file"]
            const type: string = <string>body["type"]
            const date = new Date()
            const extension = file.name.split(".")[file.name.split(".").length-1]
            const hash = crypto.createHash("sha256")
                .update(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}.${file.name}`)
                .digest("hex")
    
            let filename = ""
            if(type == "Image"){
                filename = path.join(<string>process.env.UPLOAD_MAIN_DIR, <string>process.env.UPLOAD_IMG_DIR, `${hash}.${extension}`)
            }
            else if(type == "Audio"){
                filename = path.join(<string>process.env.UPLOAD_MAIN_DIR, <string>process.env.UPLOAD_AUDIO_DIR, `${hash}.${extension}`)
            }
            else{
                return c.json({
                    status: "FAIL"
                })
            }
    
            fs.writeFileSync(
                filename, 
                Buffer.from(await file.arrayBuffer())
            )
    
            return c.json({
                status: "OK",
                path: `/api/uploads/${type == "Image" ? "img": "audio"}/${hash}.${extension}`
            })
        }
        else{
            return c.json({
                status: "FAIL",
                msg: "Only File"
            })
        }
    
    }
    catch(e: any){
        return c.json({
            status: "FAIL",
            msg: e.message
        })
    }
}