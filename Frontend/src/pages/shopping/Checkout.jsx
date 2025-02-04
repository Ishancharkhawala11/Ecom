import React, { useState } from "react";
import img from "../../assets/account.jpg";
import Address from "@/components/shopping/Address";
import { useDispatch, useSelector } from "react-redux";
import User_Cart_Items_content from "@/components/shopping/Cart_content";
import { Button } from "@/components/ui/button";
import { createNewOrder } from "@/store/Shop/order";
import { useToast } from "@/hooks/use-toast";
const ShoppingCheckout = () => {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const {approvalURL}=useSelector((state)=>state.shopOrder)
 const [currentSelecctedAddress,setCurrentSelecedAddress]=useState(null)
 const [isPaymentStart,setIsPaymentStart]=useState(false)
 const dispatch=useDispatch()
 const {toast}=useToast()
 console.log(currentSelecctedAddress);
 
  const totalAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem.salePrice > 0
              ? currentItem.salePrice
              : currentItem.price) *
              currentItem.quantity,
          0
        )
      : 0;
     const handleIntiatePayment=()=>{
      if(cartItems.length===0){
        toast({
          title:"Your cart is empty.please addd items to proceed",
          variant:'destructive'
        })
        return;
      }
      if(currentSelecctedAddress===null){
        toast({
          title: "Please select an address to proceed.",
          variant: "destructive",
        });
        return;
      }
      
      const orderData={
      userId:user.id,
      cartId:cartItems._id,
      cartItems:cartItems.items.map(singleCartItem=>({
        productId:singleCartItem.productId,
            title:singleCartItem.title,
            image:singleCartItem.image,
            price:singleCartItem.salePrice>0?singleCartItem.salePrice:singleCartItem.price,
            quantity:singleCartItem.quantity
      })),
      addressInfo:{
            addressId:currentSelecctedAddress._id,
            address:currentSelecctedAddress.address,
            city:currentSelecctedAddress.city,
            pincode:currentSelecctedAddress.pincode,
            phone:currentSelecctedAddress.phone,
            notes:currentSelecctedAddress.notes
      },
      orderStatus:'pending',
      totalAmount:totalAmount,
      orderDate:new Date(),
      orderUpdateDate:new Date(),
      paymentMethod:'paypal',
      paymentStatus:'pending',
      paymentId:'',
      payerId:'',
      }
      // console.log(orderData);
      dispatch(createNewOrder(orderData)).then(data=>{
        console.log(data,'Ishan');
        if(data.payload.success){
               setIsPaymentStart(true)
        }
        else{
          setIsPaymentStart(false)
        }
        
      })
      
     } 
     if (approvalURL) {
      window.location.href = approvalURL;
    }
  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address selectedId={currentSelecctedAddress} setCurrentSelecedAddress={setCurrentSelecedAddress}></Address>
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((Item) => (
                <User_Cart_Items_content cartItem={Item} />
              ))
            : null}
          <div className="flex justify-between">
            <span className="font-bold">Total</span>
            <span className="font-bold">${totalAmount}</span>
          </div>
          <div>
            <Button onClick={handleIntiatePayment} className='mt-4 w-full'>
              {isPaymentStart ?'processing paypal payment...':'  Check out with paypal'}
            
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCheckout;
