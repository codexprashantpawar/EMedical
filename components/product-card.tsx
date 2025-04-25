"use client"

import { useState } from "react"
import Image from "next/image"
import axios from "axios"
import { ShoppingCart, Zap, Pill, Shield, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Product {
  id: number
  imgUrl: string
  name: string
  amount: number
  discount: number
  description: string
  quantity: number
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isOrdering, setIsOrdering] = useState(false)
  const baseurl = "http://localhost:8080/"

  const addToCart = async () => {
    setIsAddingToCart(true)
    try {
      const userid = localStorage.getItem("userid")
      if (!userid) {
        alert("Please login first")
        return
      }
      console.log(`Adding to cart: Product ID ${product.id}, User ID ${userid}`)
      const response = await axios.get(`${baseurl}addTocart${userid}and${product.id}`)
      console.log("Add to cart response:", response.data)
      if (response.data === 1) {
        alert("Added to cart successfully")
      } else {
        alert("Not added, sorry!")
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      alert("Failed to add to cart")
    } finally {
      setIsAddingToCart(false)
    }
  }

  const placeOrder = async () => {
    setIsOrdering(true);
    try {
      const userid = localStorage.getItem("userid");
      if (!userid) {
        alert("Please login first");
        return;
      }
  
      const productData = {
        id: product.id,
        name: product.name,
        price: product.amount,
        // include anything else you want from product object
      };
  
      console.log(`Placing order:`, productData, `for User ID: ${userid}`);
  
      const response = await axios.post(
        `${baseurl}placeorder${userid}`,
        productData // sending whole product as JSON
      );
  
      console.log("Place order response:", response.data);
  
      if (response.data === 1) {
        alert("Order placed successfully");
      } else if (response.data === -1) {
        alert("Product is out of stock");
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order");
    } finally {
      setIsOrdering(false);
    }
  };
  

  // Calculate discounted price
  const discountedPrice = product.amount - product.amount * (product.discount / 100)

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg border-0 shadow-sm">
      <div className="relative aspect-square">
        <Image
          src={product.imgUrl || "/placeholder.svg?height=300&width=300"}
          alt={product.name}
          fill
          className="object-cover"
        />
        {product.discount > 0 && (
          <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">{product.discount}% OFF</Badge>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
          <div className="flex justify-between items-center">
            <Badge variant="outline" className="bg-white/90 text-teal-700 border-0">
              <Pill className="h-3 w-3 mr-1" /> Medicine
            </Badge>
            <Badge variant="outline" className="bg-white/90 text-amber-700 border-0">
              <Clock className="h-3 w-3 mr-1" /> Fast Delivery
            </Badge>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-teal-700">₹{discountedPrice.toFixed(2)}</span>
          {product.discount > 0 && <span className="text-sm text-gray-500 line-through">₹{product.amount}</span>}
        </div>

        <div className="flex items-center mt-2 mb-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-xs text-green-600">
                  <Shield className="h-3 w-3 mr-1" />
                  <span>Genuine Product</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">100% Authentic Products</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button
            onClick={addToCart}
            variant="outline"
            disabled={isAddingToCart}
            className="text-teal-600 border-teal-200 hover:bg-teal-50 hover:text-teal-700"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </Button>
          <Button onClick={placeOrder} disabled={isOrdering} className="bg-teal-600 hover:bg-teal-700">
            <Zap className="mr-2 h-4 w-4" />
            {isOrdering ? "Ordering..." : "Buy Now"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
