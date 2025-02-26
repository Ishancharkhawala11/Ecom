import React, { useState, useEffect } from "react";
import img from "../../assets/account.jpg";
import Address from "@/components/shopping/Address";
import { useDispatch, useSelector } from "react-redux";
import User_Cart_Items_content from "@/components/shopping/Cart_content";
import { Button } from "@/components/ui/button";
import { createNewOrder } from "@/store/Shop/order";
import { useToast } from "@/hooks/use-toast";
import { clearCart } from "@/store/Shop/Cartslice/index";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/shopping/Footer";

const ShoppingCheckout = () => {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const {orderItems}=useSelector(state=>state.shopOrder)
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const navigate=useNavigate()
  const dispatch = useDispatch();
  const { toast } = useToast();
  console.log(cartItems,'checkOut');
  
useEffect(() => {
  if (cartItems.length === 0) {
    setCurrentSelectedAddress(null); // Reset address selection if needed
  }
}, [cartItems]);
  const totalAmount =
    cartItems?.items?.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem.salePrice > 0 ? currentItem.salePrice : currentItem.price) *
              currentItem.quantity,
          0
        )
      : 0;

  // const handleInitiatePayment = () => {
  //   if (!cartItems || cartItems.items.length === 0) {
  //     toast({ title: "Your cart is empty. Please add items to proceed", variant: "destructive" });
  //     return;
  //   }
  //   if (!currentSelectedAddress) {
  //     toast({ title: "Please select an address to proceed.", variant: "destructive" });
  //     return;
  //   }

  //   const orderData = {
  //     userId: user.id,
  //     cartId: cartItems._id,
  //     cartItems: cartItems.items.map((item) => ({
  //       productId: item.productId,
  //       title: item.title,
  //       image: item.image,
  //       price: item.salePrice > 0 ? item.salePrice : item.price,
  //       quantity: item.quantity,
  //     })),
  //     addressInfo: {
  //       addressId: currentSelectedAddress._id,
  //       address: currentSelectedAddress.address,
  //       city: currentSelectedAddress.city,
  //       pincode: currentSelectedAddress.pincode,
  //       phone: currentSelectedAddress.phone,
  //       notes: currentSelectedAddress.notes,
  //     },
  //     orderStatus: "pending",
  //     totalAmount,
  //     orderDate: new Date(),
  //     orderUpdateDate: new Date(),
  //     paymentMethod,
  //     paymentStatus: paymentMethod === "cod" ? "pending" : "processing",
  //     paymentId: "",
  //     payerId: "",
  //   };

  //   dispatch(createNewOrder(orderData)).then((data) => {
  //     if (data.payload.success) {
  //       if (paymentMethod === "paypal") {
  //         setIsPaymentStart(true);
  //       } else {
  //         toast({ title: "Order placed successfully with Cash on Delivery!", variant: "success" });
  //         // localStorage.setItem('orderId',orderId)
  //         navigate('/shop/paypal-return')
  //         sessionStorage.removeItem("current_order_id")
  //         // localStorage.setItem('orderId',orderId)
  //         dispatch(clearCart());
  //       }
  //     } else {
  //       setIsPaymentStart(false);
  //       dispatch(clearCart())
  //     }
  //   });
  // };
const handleInitiatePayment = () => {
  if (!cartItems || cartItems.items.length === 0) {
    toast({ title: "Your cart is empty. Please add items to proceed", variant: "destructive" });
    return;
  }
  if (!currentSelectedAddress) {
    toast({ title: "Please select an address to proceed.", variant: "destructive" });
    return;
  }

  const orderData = {
    userId: user.id,
    cartId: cartItems._id,
    cartItems: cartItems.items.map((item) => ({
      productId: item.productId,
      title: item.title,
      image: item.image,
      price: item.salePrice > 0 ? item.salePrice : item.price,
      quantity: item.quantity,
    })),
    addressInfo: {
      addressId: currentSelectedAddress._id,
      address: currentSelectedAddress.address,
      city: currentSelectedAddress.city,
      pincode: currentSelectedAddress.pincode,
      phone: currentSelectedAddress.phone,
      notes: currentSelectedAddress.notes,
    },
    orderStatus: "pending",
    totalAmount,
    orderDate: new Date(),
    orderUpdateDate: new Date(),
    paymentMethod,
    paymentStatus: paymentMethod === "cod" ? "pending" : "processing",
    paymentId: "",
    payerId: "",
  };

  dispatch(createNewOrder(orderData)).then((data) => {
    if (data.payload.success) {
      if (paymentMethod === "paypal") {
        setIsPaymentStart(true);
      } else {
        toast({ title: "Order placed successfully with Cash on Delivery!", variant: "success" });
        navigate('/shop/paypal-return' )// Redirect after COD order success
        // sessionStorage.removeItem("current_order_id");
        // dispatch(clearCart());
      }
    } else {
      setIsPaymentStart(false);
      dispatch(clearCart());
    }
  });
};

  useEffect(() => {
    if (isPaymentStart && approvalURL && paymentMethod === "paypal") {
      window.location.href = approvalURL;
    }
  }, [isPaymentStart, approvalURL, paymentMethod]);

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" alt="Checkout" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address selectedId={currentSelectedAddress} setCurrentSelecedAddress={setCurrentSelectedAddress} />
        <div className="flex flex-col gap-4">
          {cartItems?.items?.map((item) => (
            <User_Cart_Items_content key={item.productId} cartItem={item} />
          ))}
          <div className="flex justify-between">
            <span className="font-bold">Total</span>
            <span className="font-bold">${totalAmount}</span>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <Button
                className={paymentMethod === "paypal" ? "bg-blue-500" : "bg-gray-300"}
                onClick={() => setPaymentMethod("paypal")}
              >
                PayPal
              </Button>
              <Button
                className={paymentMethod === "cod" ? "bg-green-500" : "bg-gray-300"}
                onClick={() => setPaymentMethod("cod")}
              >
                Cash on Delivery
              </Button>
            </div>
            <Button onClick={handleInitiatePayment} className="mt-4 w-full">
              {isPaymentStart && paymentMethod === "paypal"
                ? "Processing PayPal payment..."
                : "Place Order"}
            </Button>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default ShoppingCheckout;
