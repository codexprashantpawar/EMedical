"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import Image from "next/image"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, ShoppingBag, Pill, Truck, CreditCard } from "lucide-react"

interface Product {
  id: number
  name: string
  amount: number
  discount: number
  decription: string
  imgUrl: string
}

interface CartItem {
  product: Product
}

export default function CartPage() {
  const baseurl = "http://localhost:8080/"
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState("")
  const [userid, setUserid] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("islogin")
    if (isLoggedIn !== "0") {
      router.push("/")
      return
    }

    const storedUsername = localStorage.getItem("username") || ""
    const storedUserid = localStorage.getItem("userid") || ""

    setUsername(storedUsername)
    setUserid(storedUserid)

    loadCartItems(storedUserid)
  }, [router])

  const loadCartItems = async (id: string) => {
    setIsLoading(true)
    try {
      console.log(`Loading cart items for user ID: ${id}`)
      const response = await axios.get(`${baseurl}checkproduct${id}`)
      console.log("Cart items response:", response.data)
      setCartItems(response.data)
    } catch (error) {
      console.error("Failed to load cart items", error)
    } finally {
      setIsLoading(false)
    }
  }

  const placeOrder = async (productId: number) => {
    try {
      console.log(`Placing order: Product ID ${productId}, User ID ${userid}`)
      const response = await axios.post(`${baseurl}placeorder${userid}`, productId, {
        headers: { "Content-Type": "text/plain" },
      })
      console.log("Place order response:", response.data)
      if (!response.data || response.data === 0) {
        alert("Something went wrong")
      } else {
        alert("Ordered successfully")
        loadCartItems(userid)
      }
    } catch (error) {
      console.error("Error placing order:", error)
      alert("Failed to place order")
    }
  }

  const removeFromCart = async (productId: number) => {
    try {
      console.log(`Removing from cart: Product ID ${productId}, User ID ${userid}`)
      const response = await axios.delete(`${baseurl}remove${userid}and${productId}`)
      console.log("Remove from cart response:", response.data)
      if (response.data === 1) {
        setCartItems((prev) => prev.filter((item) => item.product.id !== productId))
        alert("Item removed from cart")
      } else {
        alert("Something went wrong")
      }
    } catch (error) {
      console.error("Error removing from cart:", error)
      alert("Failed to remove product")
    }
  }

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => {
        const price = item.product.amount
        const discountedPrice = price - price * (item.product.discount / 100)
        return total + discountedPrice
      }, 0)
      .toFixed(2)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <ShoppingBag className="h-6 w-6 text-teal-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Your Medicine Cart</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {cartItems.map((item, index) => (
                <Card key={index} className="mb-4 overflow-hidden border-0 shadow-sm">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative w-full sm:w-40 h-40">
                        <Image
                          src={item.product.imgUrl || "/placeholder.svg?height=200&width=200"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4 flex-1">
                        <h3 className="font-semibold text-lg">{item.product.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{item.product.decription}</p>
                        <div className="mt-2">
                          <span className="text-lg font-bold text-teal-700">₹{item.product.amount}</span>
                          {item.product.discount > 0 && (
                            <span className="ml-2 text-green-600 text-sm">{item.product.discount}% OFF</span>
                          )}
                        </div>
                        <div className="mt-4 flex space-x-2">
                          <Button onClick={() => placeOrder(item.product.id)} className="bg-teal-600 hover:bg-teal-700">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Buy Now
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <CreditCard className="h-5 w-5 text-teal-600 mr-2" />
                    Order Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Items ({cartItems.length})</span>
                      <span>₹{calculateTotal()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-teal-700">₹{calculateTotal()}</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full mt-6 bg-teal-600 hover:bg-teal-700">
                    <Truck className="mr-2 h-4 w-4" />
                    Place Order
                  </Button>

                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium text-sm mb-2">Accepted Payment Methods</h4>
                    <div className="flex space-x-2">
                      <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs">Visa</div>
                      <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs">MC</div>
                      <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs">Amex</div>
                      <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs">UPI</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm mt-4 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <div className="bg-green-100 rounded-full p-2 mr-3">
                      <Truck className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-green-800">Free Home Delivery</h4>
                      <p className="text-sm text-green-700">On all medicine orders above ₹200</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="inline-flex justify-center items-center w-24 h-24 bg-teal-50 rounded-full mb-6">
              <Pill className="h-12 w-12 text-teal-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your medicine cart is empty</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Dear {username}, add some medicines to your cart for a healthier tomorrow!
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
