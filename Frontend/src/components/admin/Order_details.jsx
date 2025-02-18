import React, { useState } from "react";
import { DialogContent } from "../ui/dialog";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Separator } from "../ui/separator";
import CommonForm from "../common/Form";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { changeOrderStatus, getAllOrderDetailsForAdmin, getAllOrdersForAdmin, updateOrderStatus } from "@/store/admin/order-slice";
import { useToast } from "@/hooks/use-toast";

const initialFormData = {
  status: ""
};

const Admin_Order_details = ({ orderDetails }) => {
  const [formData, setFormdata] = useState(initialFormData);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    const { status } = formData;
    dispatch(updateOrderStatus({ id: orderDetails._id, orderStatus: status })).then((data) => {
      if (data.payload.success) {
        dispatch(getAllOrderDetailsForAdmin(orderDetails._id));
        dispatch(getAllOrdersForAdmin());
        if (orderDetails.paymentMethod === "cod") {
          dispatch(changeOrderStatus(orderDetails._id));
        }
        setFormdata(initialFormData);
        toast({ title: data.payload.message });
      }
    });
  };

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-auto p-6">
      <div className="grid gap-6 mt-2">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>{orderDetails?.orderDate?.split("T")[0]}</Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">Order Price</p>
            <Label>${orderDetails?.totalAmount}</Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">Payment Method</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">Payment Status</p>
            <Label>{orderDetails?.paymentStatus}</Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${
                  orderDetails?.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-600"
                    : orderDetails?.orderStatus === "delivered"
                    ? "bg-blue-500"
                    : "bg-black"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="font-medium">Order Details</div>
          <ul className="grid gap-3">
            {orderDetails?.cartItems?.length > 0 ? (
              orderDetails.cartItems.map((item, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span>Title: {item.title}</span>
                  <span>Quantity: {item.quantity}</span>
                  <span>Price: ${item.price}</span>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-500">No items found.</p>
            )}
          </ul>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="font-medium">Shipping Info</div>
          <div className="grid gap-1 text-muted-foreground">
            <span>{user?.userName}</span>
            <span>{orderDetails?.addressInfo?.address}</span>
            <span>{orderDetails?.addressInfo?.city}</span>
            <span>{orderDetails?.addressInfo?.pincode}</span>
            <span>{orderDetails?.addressInfo?.phone}</span>
            <span>{orderDetails?.addressInfo?.notes}</span>
          </div>
        </div>
        <Separator />
        <CommonForm
          formControlers={[
            {
              label: "Order Status",
              name: "status",
              componantType: "select",
              options: [
                { id: "pending", label: "Pending" },
                { id: "inProcess", label: "In Process" },
                { id: "inShipping", label: "In Shipping" },
                { id: "delivered", label: "Delivered" },
                { id: "rejected", label: "Rejected" },
              ],
            },
          ]}
          formData={formData}
          setFormData={setFormdata}
          buttonText={"Update Order Status"}
          onSubmit={handleUpdateStatus}
        />
      </div>
    </DialogContent>
  );
};

export default Admin_Order_details;
