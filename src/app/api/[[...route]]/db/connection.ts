import { MongoClient, Db } from "mongodb"
import dotenv from "dotenv-extended"
dotenv.load()

if(!process.env.MONGODB){
    console.log("DATABASE CONFIG NOT FOUND AT .env");
    process.exit()
}

console.log("DATABASE LOADED")

export const Client: MongoClient = new MongoClient(process.env.MONGODB);

export const DB: Db = Client.db("HOSHICBT")