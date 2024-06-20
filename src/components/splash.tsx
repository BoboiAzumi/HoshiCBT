export default function Splash({isLoad}: {isLoad: boolean}){
    return (
        <div className={"flex flex-col items-center justify-center min-h-[100vh]" + (isLoad? "": " hidden")}>
            <img
                src={"/img/BannerLogo.svg"}
                alt="logo"
                className={"w-[10rem] object-contain my-5 animate-bounce"}
            />
        </div>
    )
}