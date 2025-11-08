import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'

function Cart() {
  const [cartItems, setCartItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { scrollYProgress } = useScroll()
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -200])
  const floatingY = useTransform(scrollYProgress, [0, 1], [0, -50])

  useEffect(() => {
    fetchCart()
    
    // Auto-refresh cart every 3 seconds
    const intervalId = setInterval(() => {
      fetchCart()
    }, 3000)
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      fetchCart()
    }
    window.addEventListener('cartUpdated', handleCartUpdate)
    
    // Refresh cart when component becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchCart()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      clearInterval(intervalId)
      window.removeEventListener('cartUpdated', handleCartUpdate)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const fetchCart = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail') || 'mock@user.com';
      const response = await fetch(`http://localhost:4000/api/cart?userId=${userEmail}`)
      if (!response.ok) {
        throw new Error('Failed to fetch cart')
      }
      const data = await response.json()
      setCartItems(data.items)
      setTotal(data.total)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const updateQuantity = async (productId, newQty) => {
    if (newQty <= 0) {
      return
    }

    try {
      const userEmail = localStorage.getItem('userEmail') || 'mock@user.com';
      const response = await fetch('http://localhost:4000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          qty: newQty,
          userId: userEmail
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update quantity')
      }
      
      fetchCart()
    } catch (err) {
      alert('Error updating quantity: ' + err.message)
    }
  }

  const removeItem = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/cart/${itemId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to remove item')
      }
      
      fetchCart()
    } catch (err) {
      alert('Error removing item: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 opacity-20"
          style={{ y: backgroundY }}
        >
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
        </motion.div>
        
        <div className="flex justify-center items-center h-96 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            className="text-center"
          >
            <div className="w-24 h-24 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-2xl font-bold text-gray-100">
              Loading your cart...
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-slate-900 relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 opacity-20"
          style={{ y: backgroundY }}
        >
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        </motion.div>
        
        <div className="flex justify-center items-center h-96 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-8 bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl border border-red-500"
          >
            <div className="text-6xl mb-4">⚠️</div>
            <div className="text-2xl font-bold text-red-400 mb-2">
              Oops! Something went wrong
            </div>
            <div className="text-lg text-gray-300">{error}</div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 opacity-20"
          style={{ y: backgroundY }}
        >
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
        </motion.div>
        
        <motion.div 
          className="container mx-auto px-4 py-16 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.h1 
            className="text-6xl font-bold text-center mb-12 text-gray-100"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            Shopping Cart
          </motion.h1>
          
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.div 
              className="text-9xl mb-8"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🛒
            </motion.div>
            <div className="text-3xl font-bold text-gray-100 mb-4">
              Your cart is empty
            </div>
            <div className="text-xl text-gray-300 mb-8">
              Time to fill it with amazing products!
            </div>
            <motion.a
              href="/"
              className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Shopping 🚀
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative overflow-hidden">
      <motion.div 
        className="absolute inset-0 opacity-20"
        style={{ y: backgroundY }}
      >
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
      </motion.div>
      
      <motion.div 
        className="container mx-auto px-4 py-16 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.h1 
          className="text-6xl font-bold text-center mb-12 text-gray-100"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          Shopping Cart
        </motion.h1>
        
        <motion.div 
          className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-3xl border border-gray-700 overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="px-8 py-6 border-b border-gray-700">
            <div className="grid grid-cols-12 gap-4 text-sm font-bold text-gray-300 uppercase tracking-wider">
              <div className="col-span-4">Product</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-3">Quantity</div>
              <div className="col-span-2">Total</div>
              <div className="col-span-1"></div>
            </div>
          </div>
          
          <AnimatePresence>
            {cartItems.map((item, index) => (
              <motion.div 
                key={item._id || item.id} 
                className="px-8 py-6 border-b border-gray-700 hover:bg-gray-700 hover:bg-opacity-30 transition-all duration-300"
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, x: -100, rotateY: 45 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(147, 51, 234, 0.3)"
                }}
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-4 flex items-center">
                    <motion.img 
                      src={item.image ? `http://localhost:4000/api/image?url=${encodeURIComponent(item.image)}` : '/placeholder.svg'} 
                      alt={item.name}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                      className="w-16 h-16 object-cover rounded-xl mr-4 border-2 border-purple-400/50"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="font-bold text-gray-100 text-lg">{item.name}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xl font-bold text-gray-100">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="col-span-3">
                    <div className="flex items-center bg-gray-700 rounded-full border border-gray-600">
                      <motion.button
                        onClick={() => updateQuantity(item.productId, item.qty - 1)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-l-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-bold"
                        whileTap={{ scale: 0.8, rotate: -10 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        −
                      </motion.button>
                      <span className="px-6 py-2 text-xl font-bold text-gray-100 min-w-[60px] text-center">
                        {item.qty}
                      </span>
                      <motion.button
                        onClick={() => updateQuantity(item.productId, item.qty + 1)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-r-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-bold"
                        whileTap={{ scale: 0.8, rotate: 10 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        +
                      </motion.button>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-2xl font-bold text-green-400">
                      ₹{(item.price * item.qty).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="col-span-1">
                    <motion.button
                      onClick={() => removeItem(item._id || item.id)}
                      className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-full hover:from-red-700 hover:to-pink-700 transition-all duration-300 font-bold"
                      whileTap={{ scale: 0.8, rotate: 90 }}
                      whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(239, 68, 68, 0.4)" }}
                    >
                      🗑️
                    </motion.button>
                  </div>
              </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          <motion.div 
            className="px-8 py-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-gray-100">Total:</span>
              <motion.span 
                    className="text-4xl font-bold text-yellow-400"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                key={total}
              >
                ₹{total.toLocaleString('en-IN')}
              </motion.span>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.a
            href="/checkout"
            className="inline-block bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white px-12 py-4 rounded-full font-bold text-xl hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105"
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(34, 197, 94, 0.4)" }}
            whileTap={{ scale: 0.95 }}
          >
            Proceed to Checkout 🚀
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Cart