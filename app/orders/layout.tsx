import type { ReactNode } from "react"
import Footer from "@/components/footer"

export default function OrdersLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  )
}
