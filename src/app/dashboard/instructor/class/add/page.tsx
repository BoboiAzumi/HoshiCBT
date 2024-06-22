"use client"

import { Users } from "@/app/api/[[...route]]/types/user";
import Navbar from "@/components/navbar";
import Splash from "@/components/splash";
import { UserData } from "@/context/UserData";
import { useEffect, useState } from "react";

export default function AddClass(){
    let [userData, setUserData] = useState<Users>()
    let [load, setLoad] = useState(true)
    let [input, setInput] = useState({
        classname: "",
        ispublic: false
    } as {
        classname: string,
        ispublic: boolean
    })
    let [process, setProcess] = useState(false)
    let [errorMsg, setErrorMsg] = useState("")

    useEffect(() => {
        fetch("/api/auth/")
            .then((r) => r.json())
            .then((json) => {
                if (json.status != "OK") document.location.href = "/signin"
                switch (json.data.role) {
                    case "instructor":
                        setUserData(json.data)
                        setLoad(!load)
                        break
                    case "user":
                        document.location.href = "/dashboard/user"
                        break
                    case "admin":
                        document.location.href = "/dashboard/admin"
                        break
                }
            })
    }, [])

    function submit(){
        fetch("/api/instructor/class", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                class_name: input.classname,
                is_public: input.ispublic
            })
        }).then((res) => {
            return res.json()
        }).then((json) => {
            if(json.status === "OK") document.location.href = "/dashboard";
            else if(json.status === "EXIST") {
                setProcess(false)
                setErrorMsg("Class Already Exist")
            }
            else {
                setProcess(false)
                setErrorMsg("ERROR BACKEND !")
            }
        })
    }

    return (
        <>
            <Splash isLoad={load}></Splash>
            <div className={"bg-white w-full min-h-[100vh]"+ (load? " hidden": "")}>
            <UserData.Provider value={userData as Users}>
                <Navbar/>
            </UserData.Provider>
            <div className="w-full z-0">
                <div className="flex flex-col items-center">
                    <div className="mt-[10rem] text-gray-600 w-[30rem]">
                        <form className="flex flex-col" onSubmit={(ev) => {
                            ev.preventDefault();
                            setProcess(true);
                            submit()
                        }}>
                            <h6 className="mb-2">Class Name</h6>
                            <input 
                                type="text" 
                                value={input.classname} 
                                className="border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md"
                                placeholder="Ex: Class 101"
                                onChange={(ev) => setInput({...input, classname : ev.target.value})}
                                required
                            />
                            <div className="flex gap-2 mt-5">
                                <input 
                                    type="checkbox" 
                                    id="cbx" 
                                    checked={input.ispublic} 
                                    onChange={(ev) => setInput({...input, ispublic : !input.ispublic})}
                                />
                                <label htmlFor="cbx">Is Public</label>
                            </div>
                            {errorMsg != "" ? (<h4 className="text-red-400 mt-5">{errorMsg}</h4>) : (<></>)}
                            <input type="submit" value="Add" className={"border border-slate-200 bg-[#ff7854] hover:bg-[#ff4c1a] text-gray-100 mt-5 px-3 py-2 focus:outline-[#ff7854] rounded-md cursor-pointer" + (process? " hidden" : "")}/>
                            <button className={"flex justify-center border border-slate-200 bg-[#ff4c1a] text-gray-100 focus:outline-[#ff7854] rounded-md cursor-pointer mt-5" + (process? "" : " hidden")} disabled>
                            <img
                                src={"/img/load.svg"}
                                alt="logo"
                                className="w-[1.5rem] object-contain my-2"
                            />
                        </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}