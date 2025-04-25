"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import Image from "next/image"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PackageOpen, Calendar, Pill, CheckCircle, Truck } from "lucide-react"

interface Product {
  name: string
  amount: number
  decription: string
  imgUrl: string
}

interface Order {
  date: string
  products: Product[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const baseurl = "http://localhost:8080/"
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("islogin")
    if (isLoggedIn !== "0") {
      router.push("/")
      return
    }

    const userid = localStorage.getItem("userid")
    if (userid) {
      loadOrderHistory(userid)
    }
  }, [router])

  const loadOrderHistory = async (userid: string) => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${baseurl}checkOrderHistory${userid}`)
      if (response.data) {
        setOrders(response.data)
      }
    } catch (error) {
      console.error("Error fetching order history", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <PackageOpen className="h-6 w-6 text-teal-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Your Medicine Orders</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order, orderIndex) => (
              <Card key={orderIndex} className="overflow-hidden border-0 shadow-sm">
                <div className="bg-teal-50 p-4 border-b border-teal-100">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-teal-600 mr-2" />
                      <span className="font-medium text-teal-800">
                        Order Date:{" "}
                        {new Date(order.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-sm font-medium text-green-700">Delivered</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-0">
                  {order.products.map((product, productIndex) => (
                    <div
                      key={productIndex}
                      className={`flex flex-col sm:flex-row p-4 ${
                        productIndex < order.products.length - 1 ? "border-b" : ""
                      }`}
                    >
                      <div className="relative w-full sm:w-32 h-32 mb-4 sm:mb-0">
                        <Image
                          src={product.imgUrl || "/placeholder.svg?height=150&width=150"}
                          alt={product.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="sm:ml-6 flex-1">
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{product.decription}</p>
                        <div className="mt-2">
                          <span className="text-lg font-bold text-teal-700">₹{product.amount}</span>
                        </div>
                        <div className="mt-3 flex items-center text-sm text-gray-500">
                          <Truck className="h-4 w-4 mr-1" />
                          <span>
                            Delivered on{" "}
                            {new Date(new Date(order.date).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="inline-flex justify-center items-center w-24 h-24 bg-teal-50 rounded-full mb-6">
              <Pill className="h-12 w-12 text-teal-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              You haven't placed any orders yet. Start shopping for medicines to see your orders here.
            </p>
            <Button onClick={() => router.push("/products")} className="bg-teal-600 hover:bg-teal-700">
              Browse Medicines
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
