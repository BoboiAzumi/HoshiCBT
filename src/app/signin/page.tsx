"use client"
import LandingNavbar from "@/components/LandingNavbar";
import Splash from "@/components/splash";
import { ChangeEvent, FormEvent, useEffect, useState } from "react"

export default function Login(){
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    let [process, setProcess] = useState(false);
    let [load, setLoad] = useState(true);
    let [fail, setFail] = useState(false);

    useEffect(() => {
        fetch("/api/auth", {
            method: "post",
            body: JSON.stringify({
                method: "AUTHENTICATION"
            })
        }).then((res) => {
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
                method: "SIGN_IN",
                data: {
                    username,
                    password
                }
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
            <div className={"min-h-[100vh]" + (load ? " hidden" : "")}>
                <div className="hidden md:flex">
                    <div className="relative w-[60vw] min-h-[100vh]">
                        <img
                            src="/img/loginBg.png"
                            className="w-full h-[100vh] object-cover"
                        />
                        <div className="absolute w-full h-[100vh] bg-black top-0 bg-opacity-60">
                            <div className="absolute bottom-[15vh] left-[8vw] right-[8vw]">
                                <h2 className="text-gray-200 text-3xl italic">
                                    Welcome to
                                </h2>
                                <h1 className="text-gray-200 text-5xl font-bold">
                                    HoshiCBT
                                </h1>
                                <h3 className="text-gray-200 text-2xl">
                                    An open source computer based test for
                                    everyone
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className="w-[40vw] min-h-[100vh] flex flex-col justify-center items-center">
                        <form
                            action="#"
                            method="post"
                            onSubmit={submit}
                            className="w-[25vw]"
                        >
                            <div className="flex justify-center">
                                <img
                                    src={"/img/BannerLogo.svg"}
                                    alt="logo"
                                    className="w-[10rem] object-contain my-5"
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <input
                                    value={username}
                                    onChange={(
                                        ev: ChangeEvent<HTMLInputElement>
                                    ) => setUsername(ev.target.value)}
                                    type="text"
                                    placeholder="Username"
                                    className="border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md"
                                />
                                <input
                                    value={password}
                                    onChange={(
                                        ev: ChangeEvent<HTMLInputElement>
                                    ) => setPassword(ev.target.value)}
                                    type="password"
                                    placeholder="Password"
                                    className="border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md"
                                />
                                <h3
                                    className={
                                        "text-center text-red-600" +
                                        (fail ? "" : " hidden")
                                    }
                                >
                                    Login Gagal
                                </h3>
                                <input
                                    type="submit"
                                    value="Login"
                                    className={
                                        "border border-slate-200 bg-[#ff7854] hover:bg-[#ff4c1a] text-gray-100 px-3 py-2 focus:outline-[#ff7854] rounded-md cursor-pointer" +
                                        (process ? " hidden" : "")
                                    }
                                />
                                <button
                                    className={
                                        "flex justify-center border border-slate-200 bg-[#ff4c1a] text-gray-100 focus:outline-[#ff7854] rounded-md cursor-pointer" +
                                        (process ? "" : " hidden")
                                    }
                                    disabled
                                >
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
                <div className="md:hidden min-h-[100vh] flex flex-col justify-center">
                    <div
                        className={
                            "bg-white px-10 py-8 rounded-lg"
                        }
                    >
                        <form action="#" method="post" onSubmit={submit}>
                            <div className="flex justify-center">
                                <img
                                    src={"/img/BannerLogo.svg"}
                                    alt="logo"
                                    className="w-[10rem] object-contain my-5"
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <input
                                    value={username}
                                    onChange={(
                                        ev: ChangeEvent<HTMLInputElement>
                                    ) => setUsername(ev.target.value)}
                                    type="text"
                                    placeholder="Username"
                                    className="border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md"
                                />
                                <input
                                    value={password}
                                    onChange={(
                                        ev: ChangeEvent<HTMLInputElement>
                                    ) => setPassword(ev.target.value)}
                                    type="password"
                                    placeholder="Password"
                                    className="border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md"
                                />
                                <h3
                                    className={
                                        "text-center text-red-600" +
                                        (fail ? "" : " hidden")
                                    }
                                >
                                    Login Gagal
                                </h3>
                                <input
                                    type="submit"
                                    value="Login"
                                    className={
                                        "border border-slate-200 bg-[#ff7854] hover:bg-[#ff4c1a] text-gray-100 px-3 py-2 focus:outline-[#ff7854] rounded-md cursor-pointer" +
                                        (process ? " hidden" : "")
                                    }
                                />
                                <button
                                    className={
                                        "flex justify-center border border-slate-200 bg-[#ff4c1a] text-gray-100 focus:outline-[#ff7854] rounded-md cursor-pointer" +
                                        (process ? "" : " hidden")
                                    }
                                    disabled
                                >
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
            </div>
        </>
    );
}