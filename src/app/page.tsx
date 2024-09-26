import LandingNavbar from "@/components/LandingNavbar";

export default function Home() {
	return (
        <div className="bg-white dark:bg-slate-900">
            <LandingNavbar />
            <div className="flex flex-col min-h-[80vh] justify-center items-center mt-[4rem] md:mt-[4.3rem]">
                <div className="flex flex-col justify-center gap-10">
                    <img
                        src={"/img/BannerLogo.svg"}
                        alt="logo"
                        className="w-[15rem] md:w-[30rem] object-contain"
                    />
					<div className="flex justify-center">
						<a href="/signin" className="btn text-white bg-[#ff7854] hover:bg-[#ff4c1a] mx-1">Sign In</a>
						<a className="btn bg-transparent hover:bg-slate-200 mx-1">Docs</a>
					</div>
                </div>
            </div>
        </div>
    );
}
