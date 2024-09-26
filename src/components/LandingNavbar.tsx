export default function LandingNavbar(){
    return (
        <nav className="navbar bg-base-100 bg-opacity-30 backdrop-blur-md fixed top-0 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost lg:hidden"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16"
                            />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 color-[#0dc0df] rounded-box z-[1] mt-3 w-52 p-2 shadow"
                    >
                        <li>
                            <a>About</a>
                        </li>
                        <li>
                            <a>Docs</a>
                        </li>
                        <li>
                            <a>Changelog</a>
                        </li>
                    </ul>
                </div>
                <a href="/" className="btn btn-ghost text-xl">
                    <img
                        src={"/img/HeaderLogo.svg"}
                        alt="logo"
                        className="w-[6rem] object-contain"
                    />
                </a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li>
                        <a>About</a>
                    </li>
                    <li>
                        <a>Docs</a>
                    </li>
                    <li>
                        <a>Changelog</a>
                    </li>
                </ul>
            </div>
            <div className="navbar-end">
                <a className="btn btn-ghost" href="https://github.com/BoboiAzumi/HoshiCBT">
                    <img
                        src="/img/Octicons-mark-github.svg"
                        className="w-[1.5rem]"
                    />
                </a>
            </div>
        </nav>
    );
}