import "./globals.css"
import { Inter } from "next/font/google"
import { SiteProvider } from "@/lib/SiteContext"
import CdpProvider from "@/components/CdpProvider"
import StatusPopover from "@/components/StatusPopover"
import ScriptInjector from "@/components/ScriptInjector"

const inter = Inter({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "Woodburn Bank - Your Trusted Financial Partner",
//   description:
//     "Discover comprehensive banking solutions including home loans, credit cards, personal loans, and bank accounts at Woodburn Bank.",
// }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>{/* Head content only, no ScriptInjector here */}</head>
      <body className={inter.className}>
        <SiteProvider>
          <ScriptInjector />
          <CdpProvider>{children}</CdpProvider>
          <StatusPopover />
        </SiteProvider>
      </body>
    </html>
  )
}
