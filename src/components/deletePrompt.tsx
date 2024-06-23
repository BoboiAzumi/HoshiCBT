export type deletePromptObject = {
    promptText: string,
    setShow: Function,
    show: boolean,
    deleteFunction: Function
}

export default function DeletePrompt(props: deletePromptObject){
    return (
        <>
            <div 
                className={"fixed w-full min-h-[100vh] bg-black bg-opacity-25 z-10 " + (props.show? "" : "hidden")}
                onClick={(ev) => props.setShow(false)}
            />
            <div className={"fixed w-[30rem] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] items-center z-20 bg-white px-5 py-3 rounded-md " + (props.show? "" : "hidden")}
                onClick={(ev) => { return }}>
                <h2 className="font-bold text-gray-600 mt-2">
                    {props.promptText}
                </h2>
                <div className="mt-5">
                    <button className="bg-transparent border-2 border-slate-200 px-3 py-1 rounded-md hover:border-[#ff4c1a] hover:bg-[#ff4c1a] hover:text-white"
                        onClick={() => props.setShow(false)}
                        >
                        No
                    </button>
                    <button className="ml-2 border-2 px-3 py-1 rounded-md border-[#ff4c1a] bg-[#ff4c1a] text-white"
                        onClick={() => props.deleteFunction()}>
                        Yes
                    </button>
                </div>
            </div>
        </>
    )
}