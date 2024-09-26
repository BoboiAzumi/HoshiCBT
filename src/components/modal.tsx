type modalObject = {
    show: boolean
    className: string
    setShow: Function
    children: React.ReactNode
}

export default function Modal(props: modalObject){
    return (
        <>
            <div 
                className={"fixed w-full min-h-[100vh] bg-black bg-opacity-25 z-20 " + (props.show? "" : "hidden")}
                onClick={(ev) => props.setShow(false)}
            />
            <div className={props.className+" fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] items-center z-30 " + (props.show? "" : "hidden")}
                onClick={(ev) => { return }}>
                {props.children}
            </div>
        </>
    )
}