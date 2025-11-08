import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Get user email from localStorage, fallback to mock@user.com
      const userEmail = localStorage.getItem('userEmail') || 'mock@user.com';
      const response = await fetch(`http://localhost:4000/api/orders?userId=${userEmail}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-6">
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-6 text-center">
          <p className="text-red-400 text-lg">Error: {error}</p>
          <button
            onClick={fetchOrders}
            className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2">
          📦 Order History
        </h1>
        <p className="text-gray-400">View all your past orders and purchases</p>
      </motion.div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <motion.div
          className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ 
              rotate: [0, 10, -10, 0],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            📭
          </motion.div>
          <h3 className="text-2xl font-semibold text-gray-300 mb-2">No Orders Yet</h3>
          <p className="text-gray-400 mb-6">Start shopping to see your order history here!</p>
          <motion.button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Shopping
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order, index) => (
            <motion.div
              key={order._id}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl border border-gray-700 overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="p-6">
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-4 border-b border-gray-700">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <motion.div
                        className="w-3 h-3 bg-green-400 rounded-full"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [1, 0.7, 1]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity
                        }}
                      />
                      <h3 className="text-xl font-bold text-white">
                        Order #{order.receiptId}
                      </h3>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {new Date(order.timestamp).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm mb-1">Total Amount</p>
                    <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                      ₹{(order.total / 100).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                    <p className="text-gray-400 text-xs mb-1">Customer Name</p>
                    <p className="text-white font-semibold">{order.customerName}</p>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                    <p className="text-gray-400 text-xs mb-1">Email</p>
                    <p className="text-white font-semibold">{order.customerEmail}</p>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-gray-300 font-semibold flex items-center">
                      <span className="mr-2">🛍️</span>
                      Items ({order.items.length})
                    </h4>
                    <motion.button
                      onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                      className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {selectedOrder === order._id ? '▲ Hide Details' : '▼ Show Details'}
                    </motion.button>
                  </div>

                  {/* Quick Preview */}
                  {selectedOrder !== order._id && (
                    <div className="flex flex-wrap gap-2">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <span
                          key={idx}
                          className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-500/30"
                        >
                          {item.name}
                        </span>
                      ))}
                      {order.items.length > 3 && (
                        <span className="bg-gray-600/20 text-gray-400 px-3 py-1 rounded-full text-sm border border-gray-500/30">
                          +{order.items.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Expanded Items List */}
                  <AnimatePresence>
                    {selectedOrder === order._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-3 mt-4">
                          {order.items.map((item, idx) => (
                            <motion.div
                              key={idx}
                              className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 flex items-center justify-between"
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: idx * 0.05 }}
                            >
                              <div className="flex items-center space-x-4 flex-1">
                                {item.image && (
                                  <img
                                    src={`http://localhost:4000/api/image?url=${encodeURIComponent(item.image)}`}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded-lg border border-gray-600"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                )}
                                <div>
                                  <p className="text-white font-semibold">{item.name}</p>
                                  <p className="text-gray-400 text-sm">Quantity: {item.qty}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-white font-bold">
                                  ₹{((item.price * item.qty) / 100).toLocaleString('en-IN', {
                                    minimumFractionDigits: 2
                                  })}
                                </p>
                                <p className="text-gray-400 text-sm">
                                  ₹{(item.price / 100).toFixed(2)} each
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {orders.length > 0 && (
        <motion.div
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg p-6 border border-purple-500/30 text-center">
            <p className="text-gray-300 text-sm mb-2">Total Orders</p>
            <p className="text-4xl font-bold text-purple-400">{orders.length}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-lg p-6 border border-blue-500/30 text-center">
            <p className="text-gray-300 text-sm mb-2">Total Items</p>
            <p className="text-4xl font-bold text-blue-400">
              {orders.reduce((sum, order) => sum + order.items.length, 0)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-lg p-6 border border-yellow-500/30 text-center">
            <p className="text-gray-300 text-sm mb-2">Total Spent</p>
            <p className="text-4xl font-bold text-yellow-400">
              ₹{(orders.reduce((sum, order) => sum + order.total, 0) / 100).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default OrderHistory;
