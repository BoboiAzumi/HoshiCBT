type modalObject = {
    show: boolean
    className: string
    children: React.ReactNode
}

export default function LoadingModal(props: modalObject){
    return (
        <>
            <div 
                className={"fixed w-full min-h-[100vh] bg-black bg-opacity-25 z-10 " + (props.show? "" : "hidden")}
            />
            <div className={props.className+" fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] items-center z-20 " + (props.show? "" : "hidden")}
                onClick={(ev) => { return }}>
                {props.children}
            </div>
        </>
    )
}