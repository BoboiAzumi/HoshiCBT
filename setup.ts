import { Client } from "@/app/api/[[...route]]/db/connection";
import { addUser } from "@/app/api/[[...route]]/db/users";
import { Users } from "@/app/api/[[...route]]/types/user";

addUser({
    username: "admin",
    password: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
    role: "admin",
    information: {
        fullname: "Administrator",
        email: "admin@email.com",
        phone: "",
        avatar: ""
    }
} as Users).then(() => {
    console.log("Done Add Admin")
    Client.close()
})

