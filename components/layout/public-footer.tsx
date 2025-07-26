import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function PublicFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/images/logo.svg"
                alt="NEBIB Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="font-bold text-xl text-gray-800">NEBIB</span>
            </div>
            <p className="text-gray-600 mb-6 max-w-md">
              Create, manage, and track forms with ease. Generate QR codes, collect responses, 
              and analyze data all in one powerful platform.
            </p>
            <div className="flex gap-4">
              <Link href="/sign-in">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/examples">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  View Templates
                </Button>
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/features" className="text-gray-600 hover:text-gray-800 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/examples" className="text-gray-600 hover:text-gray-800 transition-colors">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/qr-demo" className="text-gray-600 hover:text-gray-800 transition-colors">
                  QR Demo
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-600 hover:text-gray-800 transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-800 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-gray-800 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-gray-800 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-gray-800 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © 2025 NEBIB. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Github className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link href="mailto:contact@nebib.com" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 