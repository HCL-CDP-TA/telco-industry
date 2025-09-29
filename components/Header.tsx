"use client"

import { useTranslations } from "next-intl"
import { Menu, User, X } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import LoginModal from "./LoginModal"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import NavLink from "./common/NavLink"
import NavControls from "./NavControls"
import CartIcon from "./CartIcon"
import { useSiteContext } from "@/lib/SiteContext"
import { useCdp } from "@hcl-cdp-ta/hclcdp-web-sdk-react"

const Header = () => {
  const t = useTranslations("navigation")

  const navItems = useTranslations().raw("products") as Array<{ label: string; href: string }>

  const { brand, getFullPath } = useSiteContext()
  const { logout } = useCdp()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Function to check login status
  const checkLoginStatus = useCallback(() => {
    const customerData = JSON.parse(localStorage.getItem(`${brand.key}_customer_data`) || "{}")
    setIsLoggedIn(!!customerData?.loginData?.email)
  }, [brand.key])

  // Check login status on component mount
  useEffect(() => {
    checkLoginStatus()

    // Listen for login/logout events
    const handleLoginChange = () => {
      checkLoginStatus()
    }

    window.addEventListener("user-login-changed", handleLoginChange)

    return () => {
      window.removeEventListener("user-login-changed", handleLoginChange)
    }
  }, [brand.key, checkLoginStatus])

  const handleLogout = () => {
    const customerData = JSON.parse(localStorage.getItem(`${brand.key}_customer_data`) || "{}")

    // Remove only the loginData property
    if (customerData?.loginData) {
      delete customerData.loginData
      localStorage.setItem(`${brand.key}_customer_data`, JSON.stringify(customerData))
    }

    console.log("clearing Interact Session Data")
    sessionStorage.removeItem("sessionId")
    sessionStorage.removeItem("ssId")
    sessionStorage.removeItem("ssTs")
    sessionStorage.removeItem("audId")

    setIsLoggedIn(false) // Update state immediately

    // Dispatch custom event to notify other components about logout
    window.dispatchEvent(new CustomEvent("user-login-changed"))

    //Track logout event to CDP
    logout()
  }

  const handleLogin = () => {
    checkLoginStatus() // Re-check login status after login
  }

  return (
    <nav className="bg-[var(--secondary)] shadow-sm sticky top-0 z-50 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href={getFullPath("/")} className="flex items-center space-x-2">
              <brand.icon className="h-8 w-8 text-[var(--primary)]" />
              <span className="text-2xl font-bold text-[var(--secondary-foreground)]">{brand.label}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navItems.map(item => (
                <NavLink key={item.label} href={getFullPath(item.href)}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Controls and Login/Logout */}
          <div className="hidden md:flex items-center space-x-4">
            <NavControls />
            <CartIcon />
            {isLoggedIn ? (
              <Button variant="default" className="cursor-pointer" onClick={handleLogout}>
                <User className="h-4 w-4 mr-2 cursor-pointer" />
                {t("logout")}
              </Button>
            ) : (
              <LoginModal>
                <Button variant="default" className="cursor-pointer">
                  <User className="h-4 w-4 mr-2 cursor-pointer" />
                  {t("login")}
                </Button>
              </LoginModal>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <NavControls />
            <CartIcon />
            <Button
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer inline-flex items-center justify-center p-2 rounded-md  focus:outline-none focus:ring-2 focus:ring-inset ">
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={cn("md:hidden", isOpen ? "block" : "hidden")}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map(item => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[var(--secondary-foreground)] hover:text-[var(--primary)] block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}>
                {item.label}
              </Link>
            ))}
            <div className="pt-4">
              {isLoggedIn ? (
                <Button className="w-full pointer-cursor" onClick={handleLogout}>
                  <User className="h-4 w-4 mr-2" />
                  {t("logout")}
                </Button>
              ) : (
                <LoginModal onLogin={handleLogin}>
                  <Button className="w-full pointer-cursor">
                    <User className="h-4 w-4 mr-2" />
                    {t("login")}
                  </Button>
                </LoginModal>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header
