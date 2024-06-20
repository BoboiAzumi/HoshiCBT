import { UserData } from "@/context/UserData"
import { useContext, useState } from "react"

export default function Navbar(){
    let [dropdown, setDropdown] = useState(false)
    let userData = useContext(UserData)
    return (
        <nav className="w-full px-5 py-3 flex justify-evenly min-h-10 shadow-sm fixed top-0 bg-white">
                <a href="/dashboard/" className="flex justify-center items-center">
                    <img
                        src={"/img/HeaderLogo.svg"}
                        alt="logo"
                        className="w-[6rem] object-contain"
                    />
                </a>
                <div className="relative">
                    <button className="flex flex-col justify-center items-center hover:bg-slate-300 p-2 w-[10rem]" onClick={(ev) => setDropdown(!dropdown)}>
                        <img
                            src={"/img/UserProfile.svg"}
                            alt="profile"
                            className="w-[2rem] object-contain"
                        />
                    </button>
                    <div className={"absolute flex flex-col border bg-white shadow-md w-full rounded-b-lg z-101" + (dropdown ? "": " hidden")}>
                        <h5 className="p-3 text-xs text-gray-600 font-semibold overflow-hidden text-center">{userData?.information.fullname}</h5>
                        <a href="/dashboard/user/profile" className="px-5 py-3 hover:bg-[#ff4c1a] hover:text-white">Profile</a>
                        <hr />
                        <a href="/dashboard/logout" className="px-5 py-3 hover:bg-[#ff4c1a] hover:text-white rounded-b-lg">Logout</a>
                    </div>
                </div>
            </nav>
    )
}