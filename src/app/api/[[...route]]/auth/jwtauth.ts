import * as jwt from "jsonwebtoken"
import dotenv from "dotenv-extended"
dotenv.load()

export type JWTRegister = {
    encoded: any,
    error: Error | null
}

export type JWTVerify = {
    result: any,
    error: Error | null
}

export async function register(data: object): Promise<JWTRegister>{
    let promise = new Promise((resolve, reject) => {
        jwt.sign(data, process.env.JWT_SECRET? process.env.JWT_SECRET : "", { algorithm: "HS256", expiresIn: 60 * 60 * 24 }, (err, encoded) => {
            if(err){
                reject(err)
            } 
            else{
                resolve(encoded)
            }
        })
    })

    try{
        let result = await promise

        return {
            encoded : result,
            error: null
        }
    }
    catch(err){
        return {
            encoded : null,
            error: <Error>err
        }
    }
}

export async function verify(token: string): Promise<JWTVerify>{
    let promise = new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET? process.env.JWT_SECRET : "", { algorithms: ["HS256"] }, (err, decoded) => {
            if (err) {
                reject(err)
            }
            else{
                resolve(decoded)
            }
        })
    })

    try{
        let result = await promise

        return {
            result,
            error: null
        }
    }
    catch(err) {
        return {
            result: null,
            error: <Error>err
        }
    }
}