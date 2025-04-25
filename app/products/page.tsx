"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import Navbar from "@/components/navbar"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pill, Leaf, FlaskRoundIcon as Flask, Stethoscope, Heart, Activity } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Product {
  id: number
  imgUrl: string
  name: string
  amount: number
  discount: number
  description: string
  quantity: number
}

export default function ProductsPage() {
  const [randomProducts, setRandomProducts] = useState<Product[]>([])
  const [searchData, setSearchData] = useState<string>("")
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState("")
  const baseurl = "http://localhost:8080/"
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("islogin")
    if (isLoggedIn !== "0") {
      router.push("/")
      return
    }

    const storedUsername = localStorage.getItem("username") || ""
    setUsername(storedUsername)

    loadRandomProducts()
  }, [router])

  const loadRandomProducts = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get<Product[]>(`${baseurl}random`)
      setRandomProducts(response.data)
    } catch (error) {
      console.error("Error loading random products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const search = async () => {
    if (!searchData.trim()) {
      loadRandomProducts()
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.get<Product[]>(`${baseurl}searchbyname${searchData}`)
      setSearchResults(response.data)
      if (response.data.length === 0) {
        alert("This product is not available, Out of stock!")
      }
    } catch (error) {
      console.error("Error searching products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterByCategory = async (category: string) => {
    setSelectedCategory(category)
    setIsLoading(true)
    try {
      const response = await axios.get<Product[]>(`${baseurl}searchbycategory${category}`)
      setSearchResults(response.data)
      if (response.data.length === 0) {
        alert("No products in this category.")
      }
    } catch (error) {
      console.error("Error filtering by category:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const displayProducts = searchResults.length > 0 ? searchResults : randomProducts

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar searchData={searchData} setSearchData={setSearchData} onSearch={search} />

      <div className="bg-gradient-to-r from-teal-500 to-teal-600 py-8 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome, {username}</h1>
              <p className="text-teal-100 max-w-2xl">
                Your trusted healthcare partner. Browse our wide range of medicines, healthcare products, and wellness
                items.
              </p>
            </div>
            <div className="hidden md:flex items-center bg-teal-600 p-3 rounded-lg">
              <Avatar className="h-10 w-10 bg-teal-100 text-teal-700 mr-3">
                <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="text-white">
                <p className="font-medium">{username}</p>
                <p className="text-xs text-teal-100">Customer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-8">
              <TabsTrigger value="all" onClick={loadRandomProducts}>
                <Stethoscope className="mr-2 h-4 w-4" />
                All Products
              </TabsTrigger>
              <TabsTrigger value="tablets" onClick={() => filterByCategory("Tablet")}>
                <Pill className="mr-2 h-4 w-4" />
                Tablets
              </TabsTrigger>
              <TabsTrigger value="patanjali" onClick={() => filterByCategory("Patnjali")}>
                <Leaf className="mr-2 h-4 w-4" />
                Patanjali
              </TabsTrigger>
              <TabsTrigger value="tonic" onClick={() => filterByCategory("Tonic")}>
                <Flask className="mr-2 h-4 w-4" />
                Tonic
              </TabsTrigger>
              <TabsTrigger value="cardiac" onClick={() => filterByCategory("Cardiac")}>
                <Heart className="mr-2 h-4 w-4" />
                Cardiac
              </TabsTrigger>
              <TabsTrigger value="vitamins" onClick={() => filterByCategory("Vitamins")}>
                <Activity className="mr-2 h-4 w-4" />
                Vitamins
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!isLoading && displayProducts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="inline-flex justify-center items-center w-20 h-20 bg-teal-50 rounded-full mb-4">
              <Pill className="h-10 w-10 text-teal-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-600">No products found</h3>
            <p className="text-gray-500 mt-2 mb-4">We couldn't find any products matching your criteria</p>
            <Button
              onClick={loadRandomProducts}
              variant="outline"
              className="mt-2 border-teal-200 text-teal-700 hover:bg-teal-50"
            >
              View All Products
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
