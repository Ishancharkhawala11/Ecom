import { Button } from '@/components/ui/button';
import { sendEmail } from '@/store/Shop/order';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { clearCart } from '@/store/Shop/Cartslice/index';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { mailSending } = useSelector((state) => state.shopOrder); 
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const socket = io(import.meta.env.VITE_BACKEND_APIS_ROUTE);
    const orderId = localStorage.getItem('orderId');

    if (orderId && user?.email) {
      dispatch(sendEmail({ orderId, email: user.email })).then(() => {
        setLoading(false); 
        localStorage.removeItem('orderId');
        socket.emit('sendNotification', {
          message: `Order ${orderId} is confirmed`,
          user: user.email,
          orderId
        });
        dispatch(clearCart());
      });
    } else {
      setLoading(false); 
    }
  }, [dispatch, user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] bg-white p-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-100 animate-pulse" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white shadow-2xl rounded-2xl p-8 max-w-lg w-full space-y-6 transform transition-all duration-500 hover:scale-105 hover:shadow-3xl text-center"
      >
        <h1 className="text-4xl font-extrabold text-black">Order Confirmation</h1>
        <p className="text-gray-700">We are processing your order and will send the confirmation email shortly.</p>

        {loading && mailSending ? (
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Sending confirmation email...</span>
          </div>
        ) : (
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.7 }}
            className="text-lg text-green-600 font-semibold"
          >
            Confirmation email sent successfully!
          </motion.p>
        )}

        <Button
          disabled={mailSending}
          className="mt-6 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition-all focus:ring-4 focus:ring-gray-300 focus:outline-none w-full"
          onClick={() => navigate('/shop/account')}
        >
          View Orders
        </Button>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
