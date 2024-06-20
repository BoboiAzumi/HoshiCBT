import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Opensource Computer Based Test",
    icons: "HeaderLogo.svg"
}

export default function RootLayout({children} : {children: React.ReactNode}){
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    )
}