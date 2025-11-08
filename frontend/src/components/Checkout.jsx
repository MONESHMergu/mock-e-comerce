import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })
  const [receipt, setReceipt] = useState(null)
  const [showReceipt, setShowReceipt] = useState(false)

  useEffect(() => {
    fetchCart()
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      fetchCart()
    }
    window.addEventListener('cartUpdated', handleCartUpdate)
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
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
      setLoading(false)
      alert('Error fetching cart: ' + err.message)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Please fill in all fields')
      return
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty')
      return
    }

    try {
      const response = await fetch('http://localhost:4000/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems,
          name: formData.name,
          email: formData.email
        })
      })
      
      if (!response.ok) {
        throw new Error('Checkout failed')
      }
      
      const data = await response.json()
      // Store user email for future use
      localStorage.setItem('userEmail', formData.email)
      // Navigate to confirmation page with order data
      navigate('/order-confirmation', { state: { orderData: data } })
      setFormData({ name: '', email: '' })
    } catch (err) {
      alert('Error during checkout: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-300">Loading...</div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="px-4 py-6">
        <h2 className="text-2xl font-bold text-gray-100 mb-6">Checkout</h2>
        <div className="text-center text-gray-300 py-8">
          <p className="text-lg">Your cart is empty. Please add items before checkout.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-100 mb-6">Checkout</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-600"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Order Summary</h3>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item._id || item.id} className="flex justify-between items-center py-2 border-b border-gray-600">
                <div>
                  <p className="font-medium text-gray-100">{item.name}</p>
                  <p className="text-sm text-gray-400">Quantity: {item.qty}</p>
                </div>
                <p className="font-medium text-gray-100">
                  ₹{(item.price * item.qty).toLocaleString('en-IN')}
                </p>
              </div>
            ))}
            <div className="flex justify-between items-center pt-4">
              <p className="text-lg font-semibold text-gray-100">Total:</p>
              <p className="text-xl font-bold text-yellow-400">₹{total.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-600"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Customer Information</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-100"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-100"
                required
              />
            </div>
            <motion.button
              type="submit"
              className="w-full bg-green-600 text-gray-100 py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
              whileTap={{ scale: 0.95 }}
            >
              Place Order
            </motion.button>
          </form>
        </motion.div>
      </div>

      <AnimatePresence>
        {showReceipt && receipt && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 border border-gray-600"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold text-gray-100 mb-4">Order Confirmation</h3>
              <div className="space-y-3">
                <p className="text-gray-100"><strong>Receipt ID:</strong> {receipt.receiptId}</p>
                <p className="text-gray-100"><strong>Date:</strong> {new Date(receipt.timestamp).toLocaleString()}</p>
                <p className="text-gray-100"><strong>Total Amount:</strong> ₹{receipt.total.toLocaleString('en-IN')}</p>
              </div>
              <div className="mt-6 flex justify-end">
                <motion.button
                  onClick={() => setShowReceipt(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Checkout;