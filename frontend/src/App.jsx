import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ProductList from './components/ProductList'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import OrderConfirmation from './components/OrderConfirmation'
import OrderHistory from './components/OrderHistory'

function App() {
  const [scrollY, setScrollY] = useState(0)
  const [currentUser, setCurrentUser] = useState('')

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    
    // Update current user display
    const updateUser = () => {
      setCurrentUser(localStorage.getItem('userEmail') || 'mock@user.com')
    }
    updateUser()
    window.addEventListener('storage', updateUser)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('storage', updateUser)
    }
  }, [])

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900">
        <motion.nav 
          className="bg-gray-900 bg-opacity-95 backdrop-blur-md shadow-lg sticky top-0 z-50"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="text-2xl font-bold text-gray-100 drop-shadow-lg">
                  🛍️ Mock Store
                </h1>
              </motion.div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-sm hidden md:block">👤 {currentUser}</span>
                <NavLink to="/" icon="🛍️">Products</NavLink>
                <NavLink to="/cart" icon="🛒">Cart</NavLink>
                <NavLink to="/checkout" icon="💳">Checkout</NavLink>
                <NavLink to="/orders" icon="📦">Orders</NavLink>
              </div>
            </div>
          </div>
        </motion.nav>

        <motion.main 
          className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/orders" element={<OrderHistory />} />
            </Routes>
          </AnimatePresence>
        </motion.main>
      </div>
    </Router>
  )
}

const NavLink = ({ to, children, icon }) => (
  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
    <Link 
      to={to} 
      className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform"
    >
      <span>{icon}</span>
      <span>{children}</span>
    </Link>
  </motion.div>
)

export default App