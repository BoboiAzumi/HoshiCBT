"use client"
import Splash from "@/components/splash";
import { ChangeEvent, FormEvent, useEffect, useState } from "react"

export default function Login(){
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    let [process, setProcess] = useState(false);
    let [load, setLoad] = useState(true);
    let [fail, setFail] = useState(false);

    useEffect(() => {
        fetch("/api/auth").then((res) => {
            return res.json();
        }).then((json) => {
            if(json.status == "OK"){
                document.location.href = "/dashboard/"
            }
            else{
                setTimeout(() => setLoad(false), 1000)
            }
        })
    }, [])

    function submit(ev: FormEvent){
        ev.preventDefault()
        setProcess(true)
        setFail(false)
        fetch("/api/auth", {
            method: "post",
            body: JSON.stringify({
                username,
                password
            })
        }).then((r) => {
            setProcess(false)
            return r.json()
        }).then((r) => {
            if(r.status === "FAIL"){
                setFail(true)
            }
            else{
                document.location.href = "/dashboard/";
            }
        })
    }

    return (
        <>
        <Splash isLoad={load}></Splash>
        <div className={"flex flex-col items-center justify-center min-h-[100vh]"+ (load? " hidden": "")}>
            <div className={"bg-white px-10 py-8 rounded-lg"}>
                <form action="#" method="post" onSubmit={submit}>
                    <div className="flex justify-center">
                        <img
                            src={"/img/BannerLogo.svg"}
                            alt="logo"
                            className="w-[10rem] object-contain my-5"
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <input value={username} onChange={(ev: ChangeEvent<HTMLInputElement>) => setUsername(ev.target.value)} type="text" placeholder="Username" className="border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md"/>
                        <input value={password} onChange={(ev: ChangeEvent<HTMLInputElement>) => setPassword(ev.target.value)} type="password" placeholder="Password" className="border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md"/>
                        <h3 className={"text-center text-red-600" + (fail? "":" hidden")}>Login Gagal</h3>
                        <input type="submit" value="Login" className={"border border-slate-200 bg-[#ff7854] hover:bg-[#ff4c1a] text-gray-100 px-3 py-2 focus:outline-[#ff7854] rounded-md cursor-pointer" + (process? " hidden" : "")}/>
                        <button className={"flex justify-center border border-slate-200 bg-[#ff4c1a] text-gray-100 focus:outline-[#ff7854] rounded-md cursor-pointer" + (process? "" : " hidden")} disabled>
                            <img
                                src={"/img/load.svg"}
                                alt="logo"
                                className="w-[1.5rem] object-contain my-2"
                            />
                        </button>
                    </div>      
                </form>
            </div>
        </div>
        </>
    )
}