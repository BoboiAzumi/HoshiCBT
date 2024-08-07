import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Block Users",
    description: "Block access for user"
}

export default function RootLayout({ children } : { children : React.ReactNode}){
    return (
        <html>
            <body>
                { children }
            </body>
        </html>
    )
}