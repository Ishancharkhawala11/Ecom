import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { sendEmail } from '@/store/Shop/order';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { clearCart } from "@/store/Shop/Cartslice/index";
import { io } from 'socket.io-client';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { mailSending } = useSelector((state) => state.shopOrder); 
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const socket=io(import.meta.env.VITE_BACKEND_APIS_ROUTE)
    const orderId = localStorage.getItem('orderId');
// const dispatch=useDispatch()
    if (orderId && user?.email) {
      dispatch(sendEmail({ orderId, email: user.email })).then(() => {
        setLoading(false); 
        localStorage.removeItem('orderId');
        socket.emit("sendNotification",{
          message:`order ${orderId} is confirmed`,
          user: user.email,
          orderId
        })
         dispatch(clearCart());
      });
    } else {
      setLoading(false); 
    }
  }, [dispatch, user]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <Card className="p-10 shadow-lg rounded-2xl bg-white w-full max-w-lg text-center">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-4xl font-semibold text-black">
            Processing Successful
          </CardTitle>
        </CardHeader>
        <CardContent>
        <div className="flex items-center justify-center gap-2 text-black mb-2">
              
              <span>Do not close page or click on button untill mail send </span>
            </div>
          {loading && mailSending ? ( // Show loader while email is being sent
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Sending confirmation email...</span>
            </div>
          ) : (
            <p className="text-lg text-gray-400">Confirmation email sent successfully!</p>
          )}
          <Button 
          disabled={mailSending}
            className="mt-6 bg-black text-white px-6 py-3 rounded-lg w-full"
            onClick={() => navigate('/shop/account')}
          >
            View Orders
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
