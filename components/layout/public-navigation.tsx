"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PublicNavigationProps {
  showBackButton?: boolean;
  backUrl?: string;
  backText?: string;
}

export default function PublicNavigation({ 
  showBackButton = false, 
  backUrl = "/", 
  backText = "Back to Home" 
}: PublicNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-blue-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Link href={backUrl}>
              <Button variant="ghost" size="sm" className="gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {backText}
              </Button>
            </Link>
          )}
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo.svg"
              alt="NEBIB Logo"
              width={20}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-xl font-bold text-gray-800">NEBIB</span>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/features">
            <Button variant="ghost" className="text-gray-700 hover:text-gray-900">Features</Button>
          </Link>
          <Link href="/examples">
            <Button variant="ghost" className="text-gray-700 hover:text-gray-900">Templates</Button>
          </Link>
          <Link href="/qr-demo">
            <Button variant="ghost" className="text-gray-700 hover:text-gray-900">QR Demo</Button>
          </Link>
          <Link href="/sign-in">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">Get Started</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-blue-200 bg-white/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <Link href="/features">
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-gray-900">
                Features
              </Button>
            </Link>
            <Link href="/examples">
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-gray-900">
                Templates
              </Button>
            </Link>
            <Link href="/qr-demo">
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-gray-900">
                QR Demo
              </Button>
            </Link>
            <div className="pt-2 border-t border-gray-200">
              <Link href="/sign-in">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 