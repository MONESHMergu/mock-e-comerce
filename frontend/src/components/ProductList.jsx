import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { scrollYProgress } = useScroll()
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  // Resolve image source through backend proxy to avoid ORB/CORS issues
  const resolveImageSrc = (url) => {
    if (!url) return '/placeholder.svg'
    const isExternal = /^https?:\/\//i.test(url)
    return isExternal ? `http://localhost:4000/api/image?url=${encodeURIComponent(url)}` : url
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/products')
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data = await response.json()
      setProducts(data)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const addToCart = async (productId) => {
    try {
      const userEmail = localStorage.getItem('userEmail') || 'mock@user.com';
      const response = await fetch('http://localhost:4000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          qty: 1,
          userId: userEmail
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to add to cart')
      }
      
      // Trigger cart update event
      window.dispatchEvent(new Event('cartUpdated'))
      
      // Create a fun animation feedback
      const button = document.querySelector(`[data-product-id="${productId}"]`)
      if (button) {
        button.classList.add('bounce-in')
        setTimeout(() => button.classList.remove('bounce-in'), 800)
      }
      
      alert('🎉 Item added to cart!')
    } catch (err) {
      alert('❌ Error adding to cart: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <motion.div 
          className="text-4xl font-bold gradient-text neon-glow"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          ✨ Loading...
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <motion.div 
        className="text-center text-red-500 p-8 bg-red-100 rounded-lg glass-morphism"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-6xl mb-4">😵</div>
        <div className="text-xl font-bold">Oops! Something went wrong</div>
        <div className="text-lg">{error}</div>
      </motion.div>
    )
  }

  return (
    <div className="px-4 py-8">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <h1 className="text-6xl font-bold text-gray-100 drop-shadow-2xl mb-4 float-animation">
          🛍️ Mock Store Collection
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Discover amazing products with stunning designs and unbeatable prices
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2,
              delayChildren: 0.3,
            },
          },
        }}
      >
        {products.map((product, index) => (
          <motion.div 
            key={product.id} 
            className="group relative"
            variants={{
              hidden: { y: 50, opacity: 0, rotateX: 45 },
              visible: { y: 0, opacity: 1, rotateX: 0 },
            }}
            whileHover={{ 
              scale: 1.05, 
              rotateY: 5,
              transition: { duration: 0.3 }
            }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="bg-gray-800 rounded-2xl overflow-hidden hover-lift border border-gray-700">
              {/* Product Image with Hover Effects */}
              <div className="relative overflow-hidden">
                <motion.img 
                  src={resolveImageSrc(product.image)} 
                  alt={product.name || 'Product image'}
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/placeholder.svg'; }}
                  loading="lazy"
                  className="w-full h-64 object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-gray-100">
                    <div className="text-sm opacity-75">Premium Quality</div>
                    <div className="text-lg font-bold">✨ Best Seller</div>
                  </div>
                </div>
              </div>
              
              {/* Product Details */}
              <div className="p-6">
                <motion.div 
                  className="mb-3"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-xl font-bold text-gray-100 mb-2 group-hover:text-purple-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Premium quality product with amazing features and stunning design
                  </p>
                </motion.div>
                
                {/* Price and Rating */}
                <div className="flex items-center justify-between mb-4">
                  <motion.div 
                    className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                    whileHover={{ scale: 1.1 }}
                  >
                    ₹{product.price.toLocaleString('en-IN')}
                  </motion.div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <motion.span 
                        key={i}
                        className="text-yellow-400 text-lg"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        ⭐
                      </motion.span>
                    ))}
                  </div>
                </div>
                
                {/* Add to Cart Button */}
                <motion.button
                  data-product-id={product.id}
                  onClick={() => addToCart(product.id)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ 
                    boxShadow: "0 20px 40px rgba(147, 51, 234, 0.3)",
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <motion.span 
                      className="mr-2"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                    >
                      🛒
                    </motion.span>
                    Add to Cart
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.button>
              </div>
            </div>
            
            {/* Floating Elements */}
            <motion.div 
              className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
            >
              HOT 🔥
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-gray-400 opacity-10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductList;