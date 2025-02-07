import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/Shop/order";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const Paypal_return = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search); //get params from url
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");
  const {user}=useSelector(state=>state.auth)
  useEffect(() => {
    if (payerId && paymentId) {
      const orderId = JSON.parse(
        sessionStorage.getItem("current_order_id")
      );
      dispatch(capturePayment({ orderId, paymentId, payerId })).then(data=>{
        if(data.payload.success){
          sessionStorage.removeItem("current_order_id")
          localStorage.setItem('orderId',orderId)
          window.location.href='/shop/payment-success'
        }
      })
      //  console.log(getCurrentOrderId,'id');
    }
  }, [payerId, paymentId, dispatch]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing payment ... please wait</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default Paypal_return;
