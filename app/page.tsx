"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Stethoscope, User, Lock, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function LoginPage() {
  const baseurl = "http://localhost:8080/"
  const [name, setName] = useState("abc")
  const [password, setPassword] = useState("abc")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem("islogin")
    if (isLoggedIn === "0") {
      router.push("/products")
    }
  }, [router])

  const islogin = async () => {
    try {
      const url = `${baseurl}login${name}`
      console.log("Login URL:", url)
      console.log("Login password:", password)

      const response = await axios.post(url, password, {
        headers: { "Content-Type": "text/plain" },
      })

      const data = response.data
      console.log("Login response:", data)

      if (data > 0) {
        console.log("Login successful, user ID:", data)
        localStorage.setItem("islogin", "0")
        localStorage.setItem("userid", data.toString())
        localStorage.setItem("username", name)
        router.push("/products")
      } else if (data === -1) alert("Server exception")
      else if (data === -2) alert("Wrong username")
      else if (data === -3) alert("Multiple usernames")
      else if (data === -4) alert("Wrong password")
    } catch (error) {
      console.error("Login error", error)
      alert("Something went wrong")
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-50 to-blue-50 p-4">
      <div className="absolute top-0 left-0 w-full h-16 bg-white shadow-sm flex items-center px-6">
        <div className="flex items-center">
          <Stethoscope className="h-8 w-8 text-teal-600" />
          <span className="ml-2 text-2xl font-bold text-teal-700">PrashantPharma</span>
        </div>
        <span className="ml-2 text-sm text-teal-600">E-Medical Shop</span>
      </div>

      <Card className="w-full max-w-md shadow-xl border-0 mt-16">
        <CardHeader className="text-center pb-2 pt-8">
          <div className="mb-3 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center">
              <Stethoscope className="h-10 w-10 text-teal-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-teal-700">PrashantPharma</h2>
          <p className="text-gray-500 text-sm">Your Trusted Healthcare Partner</p>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium flex items-center">
              <User className="h-4 w-4 mr-2 text-teal-600" />
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium flex items-center">
              <Lock className="h-4 w-4 mr-2 text-teal-600" />
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-gray-300 pr-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
              </button>
            </div>
          </div>

          <Button onClick={islogin} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
            Login to Your Account
          </Button>

          <div className="text-center pt-2">
            <a href="#" className="text-sm text-teal-600 hover:text-teal-800">
              Forgot Password?
            </a>
          </div>

          <div className="pt-4 text-center">
            <p className="text-xs text-gray-500">By logging in, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </CardContent>
      </Card>

      <div className="absolute bottom-4 text-center w-full text-gray-500 text-xs">
        © 2025 PrashantPharma E-Medical Shop. All rights reserved.
      </div>
    </div>
  )
}
