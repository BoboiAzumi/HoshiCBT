import { useEffect, useRef } from "react";

export type deletePromptObject = {
    promptText: string,
    setShow: Function,
    show: boolean,
    deleteFunction: Function
}

export default function DeletePrompt(props: deletePromptObject){
    const DeleteModal = useRef({} as HTMLDialogElement)

    useEffect(() => {
        if(props.show){
            DeleteModal.current.showModal()
        }
        else{
            DeleteModal.current.close()
        }
    }, [props.show]);

    return (
        <>
            <dialog
                ref={DeleteModal}
                className="modal modal-bottom sm:modal-middle"
            >
                <div className="modal-box">
                    <h2 className="font-bold text-gray-600 mt-2">
                        {props.promptText}
                    </h2>
                    <div className="mt-5">
                        <button
                            className="btn bg-transparent border-slate-200 px-3 py-1 rounded-md hover:border-[#ff4c1a] hover:bg-[#ff4c1a] hover:text-white"
                            onClick={() => {
                                props.setShow(false)
                            }}
                        >
                            No
                        </button>
                        <button
                            className="btn ml-2 px-3 py-1 rounded-md border-[#ff4c1a] bg-[#ff4c1a] hover:bg-[#ff4c1a] text-white"
                            onClick={() => props.deleteFunction()}
                        >
                            Yes
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop" onClick={() => props.setShow(false)}>
                    <button>Close</button>
                </form>
            </dialog>
        </>
    );
}
