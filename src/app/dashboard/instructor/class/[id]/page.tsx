"use client"
import { Classes } from "@/app/api/[[...route]]/types/class"
import { Users } from "@/app/api/[[...route]]/types/user"
import Navbar from "@/components/navbar"
import Splash from "@/components/splash"
import { UserData } from "@/context/UserData"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function AddClass(){
    let [userData, setUserData] = useState<Users>()
    let [load, setLoad] = useState(true)
    let [classes, setClasses] = useState(
        {
            _id : "",
            instructor: "",
            name: "",
            is_public: false,
            allow_users: [],
            block_users: []
        } as Classes)

    let [change, setChange] = useState(false)
    let [errorMsg, setErrorMsg] = useState("")
    let [process, setProcess] = useState(false)
    const { id } = useParams()

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

    return (
        <>
            <Splash isLoad={load}></Splash>
            <div className={"bg-white w-full min-h-[100vh]"+ (load? " hidden": "")}>
                <UserData.Provider value={userData as Users}>
                    <Navbar/>
                </UserData.Provider>
                <div className="w-full z-0">
                    <div className="flex flex-col items-center">
                        <h2 className="mt-[10rem] mb-5 text-2xl font-semibold text-gray-600">Class Information</h2>
                        <div className="w-[30rem]">
                            <form className="text-gray-600">
                                <h4 className="mb-2">Class Name</h4>
                                <input 
                                    type="text"
                                    className="w-full border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md"
                                    value={classes.name}
                                    onChange={(ev) => {
                                        setClasses({...classes, name: ev.target.value})
                                        setChange(true)
                                    }}
                                />
                                <div className="flex gap-2 mt-5">
                                    <input 
                                        type="checkbox" 
                                        id="cbx" 
                                        checked={classes.is_public} 
                                        onChange={(ev) => {
                                            setClasses({...classes, is_public : !classes.is_public})
                                            setChange(true)
                                        }}
                                    />
                                    <label htmlFor="cbx">Is Public</label>
                                </div>
                                {errorMsg != "" ? (<h4 className="text-red-400 mt-5">{errorMsg}</h4>) : (<></>)}
                                {change? (
                                    <>
                                        <input type="submit" value="Save" className={"w-full border border-slate-200 bg-[#ff7854] hover:bg-[#ff4c1a] text-gray-100 mt-5 px-3 py-2 focus:outline-[#ff7854] rounded-md cursor-pointer" + (process? " hidden" : "")}/>
                                        <button className={"w-full flex justify-center border border-slate-200 bg-[#ff4c1a] text-gray-100 focus:outline-[#ff7854] rounded-md cursor-pointer mt-5" + (process? "" : " hidden")} disabled>
                                            <img
                                                src={"/img/load.svg"}
                                                alt="logo"
                                                className="w-[1.5rem] object-contain my-2"
                                            />
                                        </button>
                                    </>
                                ) : (<></>)}
                            </form>
                        </div>
                        <h2 className="my-5 text-2xl font-semibold text-gray-600">Access</h2>
                        <div className="grid grid-flow-col-dense gap-2 grid-cols-3">
                            <div className="border shadow-sm shadow-gray-200 w-[10rem] px-5 py-2">
                                <a href={"/dashboard/instructor/class/"+id+"/allow"}> 
                                    <h3 className="text-center text-gray-600 font-semibold">
                                        Allow Users
                                    </h3>
                                </a>
                            </div>
                            <div className="border shadow-sm shadow-gray-200 w-[10rem] px-5 py-2">
                                <a href={"/dashboard/instructor/class/"+id+"/block"}> 
                                    <h3 className="text-center text-gray-600 font-semibold">
                                        Block Users
                                    </h3>
                                </a>
                            </div>
                        </div>
                        <h2 className="my-5 text-2xl font-semibold text-gray-600">Exam</h2>
                    </div>
                </div>
            </div>
        </>
    )
}