import Image from "next/image";
import { useContext, useEffect } from "react";

export default function Home() {
  return (
    <main className="min-h-[100vh] bg-white dark:bg-slate-900 dark">
      <nav className="w-full px-5 py-3 flex justify-evenly items-center h-16 shadow-sm fixed">
        <a href="./">
          <img
            src={"/img/HeaderLogo.svg"}
            alt="logo"
            className="w-[6rem] object-contain"
          />
        </a>
        <div className="flex h-full">
          <div className="flex flex-auto sm:flex-1 h-full items-center">
              <a className="hover:bg-slate-200 px-4 py-3 rounded-3xl text-gray-600 font-semibold" href="/about">
                About
              </a>
              <a className="hover:bg-slate-200 px-4 py-3 rounded-3xl text-gray-600 font-semibold" href="/docs">
                Docs
              </a>
              <a className="hover:bg-slate-200 px-4 py-3 rounded-3xl text-gray-600 font-semibold" href="/docs">
                Changelog
              </a>
          </div>
        </div>
        <div className="flex h-full">
          <div className="flex flex-auto sm:flex-1 h-full items-center">
              <a className="hover:bg-slate-200 px-4 py-3 rounded-3xl text-gray-600 font-semibold" href="/about">
                <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" className="w-[1.5rem]" />
              </a>
          </div>
        </div>
      </nav>
      <div className="min-h-[100vh] w-full flex flex-col items-center justify-center">
        <img
          src={"/img/BannerLogo.svg"}
          alt="logo"
          className="w-[30rem] object-contain"
        />
        <h2 className="font-semibold text-3xl w-full text-center text-gray-600 my-10">An open source computer based test for everyone</h2>
        <div className="flex">
          <a href="/signin/" className="bg-[#ff7854] hover:bg-[#ff4c1a] px-5 py-3 text-lg font-semibold text-gray-100 rounded-3xl mx-3 flex items-center justify-center">Sign</a>
          <a href="/docs" className="bg-transparent hover:bg-slate-200 px-5 py-3 text-lg font-semibold text-gray-600 rounded-3xl mx-3 border-2 flex items-center justify-center">Docs</a>
        </div>
      </div>
    </main>
  );
}
