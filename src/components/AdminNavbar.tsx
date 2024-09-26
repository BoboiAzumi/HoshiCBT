import { UserData } from "@/context/UserData"
import { useContext } from "react"
import { FaUserShield, FaChalkboardUser, FaClipboardUser } from "react-icons/fa6";

export default function Navbar(){
    let userData = useContext(UserData)
    return (
        <>
            <div className="drawer">
                <input
                    type="checkbox"
                    id="drawerToggle"
                    className="drawer-toggle"
                />
                <div className="drawer-content">
                    <div className="navbar bg-base-100 bg-opacity-30 backdrop-blur-md fixed top-0 shadow-sm z-10">
                        <div className="flex-none">
                            <label
                                htmlFor="drawerToggle"
                                className="btn btn-square btn-ghost"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    className="inline-block h-5 w-5 stroke-current"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    ></path>
                                </svg>
                            </label>
                        </div>
                        <div className="flex-1">
                            <a className="btn btn-ghost text-xl">
                                <img
                                    src={"/img/HeaderLogo.svg"}
                                    alt="logo"
                                    className="w-[6rem] object-contain"
                                />
                            </a>
                        </div>
                        <div className="flex-none dropdown dropdown-end">
                            <button className="btn btn-square btn-ghost">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    className="inline-block h-5 w-5 stroke-current"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                                    ></path>
                                </svg>
                            </button>
                            <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow">
                                <li>
                                    <a className="justify-center">
                                        <h5 className="p-3 text-xs text-gray-600 font-semibold overflow-hidden text-center">
                                            {userData?.information.fullname}
                                        </h5>
                                    </a>
                                </li>
                                <li>
                                    <a className="justify-between">Profile</a>
                                </li>
                                <li>
                                    <a href="/dashboard/logout">Logout</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="drawer-side z-10">
                    <label
                        htmlFor="drawerToggle"
                        aria-label="close sidebar"
                        className="drawer-overlay"
                    ></label>
                    <div className="menu bg-base-100 min-h-full w-80 p-4 text-gray-600">
                        <div className="flex w-full min-h-[10vh] justify-center">
                            <img
                                src={"/img/HeaderLogo.svg"}
                                alt="logo"
                                className="w-[6rem] object-contain"
                            />
                        </div>
                        <ul>
                            <li className="my-2">
                                <h3 className="text-xl font-bold btn btn-ghost justify-start hover:bg-white">Menu</h3>
                            </li>
                            <li className="my-2">
                                <a
                                    className="btn btn-ghost flex justify-start"
                                    href={"/dashboard/admin/admin"}
                                >
                                    <FaUserShield />
                                    <span className="ml-5">Admin</span>
                                </a>
                            </li>
                            <li className="my-2">
                                <a
                                    className="btn btn-ghost flex justify-start"
                                    href={"/dashboard/admin/instructor"}
                                >
                                    <FaChalkboardUser />
                                    <span className="ml-5">Instructor</span>
                                </a>
                            </li>
                            <li className="my-2">
                                <a
                                    className="btn btn-ghost flex justify-start"
                                    href={"/dashboard/admin/user"}
                                >
                                    <FaClipboardUser />
                                    <span className="ml-5">User</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}