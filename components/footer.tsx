import Link from "next/link"
import { Github, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-teal-800 text-white pt-8 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">PrashantPharma</h3>
            <p className="text-teal-100 text-sm mb-4">
              Your trusted healthcare partner providing quality medicines and healthcare products.
            </p>
            <div className="flex items-center text-sm text-teal-100 mb-2">
              <MapPin className="h-4 w-4 mr-2" />
              <span>Pune, Maharashtra, India</span>
            </div>
            <div className="flex items-center text-sm text-teal-100 mb-2">
              <Phone className="h-4 w-4 mr-2" />
              <span>+91 7499598429</span>
            </div>
            <div className="flex items-center text-sm text-teal-100">
              <Mail className="h-4 w-4 mr-2" />
              <span>contact@prashantpharma.com</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-teal-100">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-white transition-colors">
                  Orders
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-6">
              <Link
                href="https://github.com/codexprashantpawar"
                target="_blank"
                className="bg-teal-700 hover:bg-teal-600 p-2 rounded-full transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                className="bg-teal-700 hover:bg-teal-600 p-2 rounded-full transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                className="bg-teal-700 hover:bg-teal-600 p-2 rounded-full transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
            <p className="text-xs text-teal-200">Designed by Prashant Pawar</p>
          </div>
        </div>

        <div className="border-t border-teal-700 mt-6 pt-6 text-center text-sm text-teal-200">
          © 2025 PrashantPharma E-Medical Shop. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
