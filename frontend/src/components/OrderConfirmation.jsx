import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state?.orderData;
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    if (!orderData) {
      navigate('/');
    }
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [orderData, navigate]);

  if (!orderData) {
    return null;
  }

  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {confettiPieces.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: `${piece.x}%`,
                top: '-20px',
                backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'][
                  Math.floor(Math.random() * 5)
                ],
              }}
              initial={{ y: -20, opacity: 1, rotate: 0 }}
              animate={{
                y: window.innerHeight + 20,
                opacity: 0,
                rotate: piece.rotation,
              }}
              transition={{
                duration: piece.duration,
                delay: piece.delay,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        className="max-w-2xl w-full"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Success Icon with Animation */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            delay: 0.2, 
            type: 'spring', 
            stiffness: 200,
            damping: 10 
          }}
        >
          <motion.div
            className="relative"
            animate={{ 
              rotate: [0, -10, 10, -10, 0],
            }}
            transition={{ 
              delay: 0.5,
              duration: 0.5,
              ease: 'easeInOut'
            }}
          >
            <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
              <motion.svg
                className="w-20 h-20 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            </div>
            
            {/* Pulse rings */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-green-400"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 1.3, opacity: 0 }}
              transition={{ 
                delay: 0.5,
                duration: 1,
                repeat: 2,
                ease: 'easeOut'
              }}
            />
          </motion.div>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-700"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-2">
              Order Confirmed! 🎉
            </h1>
            <p className="text-gray-300 text-lg">
              Thank you for your purchase!
            </p>
          </motion.div>

          {/* Order Details */}
          <motion.div
            className="space-y-6 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {/* Receipt ID */}
            <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
              <p className="text-gray-400 text-sm mb-1">Order ID</p>
              <p className="text-2xl font-mono font-bold text-green-400 tracking-wider">
                {orderData.receiptId}
              </p>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <p className="text-gray-400 text-sm mb-1">Date</p>
                <p className="text-white font-semibold">
                  {new Date(orderData.timestamp).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <p className="text-gray-400 text-sm mb-1">Time</p>
                <p className="text-white font-semibold">
                  {new Date(orderData.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            {/* Total Amount */}
            <motion.div
              className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-6 border-2 border-purple-500/50"
              animate={{ 
                boxShadow: [
                  '0 0 20px rgba(168, 85, 247, 0.4)',
                  '0 0 40px rgba(236, 72, 153, 0.4)',
                  '0 0 20px rgba(168, 85, 247, 0.4)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <p className="text-gray-300 text-sm mb-2">Total Amount Paid</p>
              <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                ₹{(orderData.total / 100).toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
            </motion.div>

            {/* Status Badge */}
            <motion.div
              className="flex items-center justify-center space-x-2 bg-green-500/20 rounded-lg p-3 border border-green-500"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ 
                delay: 1,
                type: 'spring',
                stiffness: 200
              }}
            >
              <motion.div
                className="w-3 h-3 bg-green-400 rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity
                }}
              />
              <p className="text-green-400 font-semibold">Payment Successful</p>
            </motion.div>
          </motion.div>

          {/* Message */}
          <motion.div
            className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <p className="text-blue-300 text-center">
              📧 A confirmation email has been sent to your email address
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            <motion.button
              onClick={() => navigate('/orders')}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              📦 View All Orders
            </motion.button>
            <motion.button
              onClick={() => navigate('/')}
              className="flex-1 bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-600"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🛍️ Continue Shopping
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          className="text-center text-gray-400 text-sm mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          Need help? Contact our support team anytime
        </motion.p>
      </motion.div>
    </div>
  );
}

export default OrderConfirmation;
