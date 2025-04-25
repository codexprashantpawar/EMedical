"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { ShoppingCart, Package, Search, Menu, Stethoscope, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface NavbarProps {
  searchData?: string
  setSearchData?: (value: string) => void
  onSearch?: () => void
}

export default function Navbar({ searchData = "", setSearchData, onSearch }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [username, setUsername] = useState("")
  const router = useRouter()
  const pathname = usePathname()

  // Update the navbar to show the username more prominently
  useEffect(() => {
    const storedUsername = localStorage.getItem("username") || ""
    setUsername(storedUsername)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("islogin")
    localStorage.removeItem("userid")
    localStorage.removeItem("username")
    router.push("/")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch()
    }
  }

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/products" className="flex items-center">
              <Stethoscope className="h-6 w-6 text-teal-600 mr-2" />
              <span className="font-bold text-xl text-teal-700">PrashantPharma</span>
              <span className="ml-1 text-xs text-teal-600 hidden sm:inline">E-Medical Shop</span>
            </Link>
          </div>

          {pathname === "/products" && (
            <div className="hidden md:flex flex-1 mx-6">
              <form onSubmit={handleSearch} className="w-full max-w-lg">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search for medicines, healthcare products..."
                    className="w-full pl-10 pr-4 border-teal-200 focus:border-teal-300"
                    value={searchData}
                    onChange={(e) => setSearchData && setSearchData(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Button
                    type="submit"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-teal-600 hover:bg-teal-700"
                  >
                    Search
                  </Button>
                </div>
              </form>
            </div>
          )}

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart">
              <Button variant="ghost" className="flex items-center text-teal-700 hover:text-teal-800 hover:bg-teal-50">
                <ShoppingCart className="h-5 w-5 mr-1" />
                <span>Cart</span>
              </Button>
            </Link>
            <Link href="/orders">
              <Button variant="ghost" className="flex items-center text-teal-700 hover:text-teal-800 hover:bg-teal-50">
                <Package className="h-5 w-5 mr-1" />
                <span>Orders</span>
              </Button>
            </Link>
            {/* Update the desktop menu to show the username more clearly */}
            <div className="flex items-center border-l pl-4 ml-2">
              <Avatar className="h-8 w-8 bg-teal-100 text-teal-700 mr-2">
                <AvatarFallback>{getInitials(username)}</AvatarFallback>
              </Avatar>
              <div className="hidden lg:block">
                <p className="text-sm font-medium">{username}</p>
                <Button
                  variant="link"
                  onClick={handleLogout}
                  className="h-auto p-0 text-xs text-red-500 hover:text-red-600"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center">
                    <Stethoscope className="h-6 w-6 text-teal-600 mr-2" />
                    <span className="font-bold text-xl text-teal-700">PrashantPharma</span>
                  </div>
                </div>

                {/* Update the mobile menu to show the username more clearly */}
                <div className="flex items-center mb-6 pb-4 border-b">
                  <Avatar className="h-10 w-10 bg-teal-100 text-teal-700 mr-3">
                    <AvatarFallback>{getInitials(username)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{username}</p>
                    <p className="text-sm text-gray-500">Customer</p>
                  </div>
                </div>

                {pathname === "/products" && (
                  <form onSubmit={handleSearch} className="mb-6">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Search for medicines..."
                        className="w-full pl-10 pr-4 border-teal-200"
                        value={searchData}
                        onChange={(e) => setSearchData && setSearchData(e.target.value)}
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                    <Button type="submit" className="w-full mt-2 bg-teal-600 hover:bg-teal-700">
                      Search
                    </Button>
                  </form>
                )}

                <nav className="flex flex-col space-y-4">
                  <Link href="/products">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-teal-700 hover:text-teal-800 hover:bg-teal-50"
                    >
                      <Stethoscope className="h-5 w-5 mr-2" />
                      Products
                    </Button>
                  </Link>
                  <Link href="/cart">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-teal-700 hover:text-teal-800 hover:bg-teal-50"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Cart
                    </Button>
                  </Link>
                  <Link href="/orders">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-teal-700 hover:text-teal-800 hover:bg-teal-50"
                    >
                      <Package className="h-5 w-5 mr-2" />
                      Orders
                    </Button>
                  </Link>
                </nav>

                <div className="mt-auto pt-6">
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full justify-start text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
