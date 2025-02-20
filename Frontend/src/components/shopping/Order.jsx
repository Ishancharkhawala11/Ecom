import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Dialog } from "../ui/dialog";
import Shopping_order_details from "./Shopping_order_details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrderDetails,
  getAllOrdersByUserId,
  resetSetOrderDetails,
} from "@/store/Shop/order";
import { Badge } from "../ui/badge";
import Product_Not_Found from "./Product_Not_Found";
import {CircleChevronRight } from "lucide-react";

const Shopping_Order = () => {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  useEffect(() => {
    if (user?.id) {
      dispatch(getAllOrdersByUserId(user.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (orderDetails) {
      setOpenDetailsDialog(true);
    }
  }, [orderDetails]);

  const handleFetchOrderDetails = async (getId) => {
    await dispatch(getAllOrderDetails(getId)); // Fetch order details before opening dialog
  };
  console.log(orderDetails);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Id</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0 ? (
              orderList.map((orderItem) => (
                <TableRow key={orderItem._id} className="h-[80px]">
                  <TableCell>{orderItem._id}</TableCell>
                  <TableCell>{orderItem.orderDate.split("T")[0]}</TableCell>
                  <TableCell>
                    <Badge
                      className={`py-1 px-3 ${
                        orderItem.orderStatus === "confirmed"
                          ? "bg-green-600"
                          : orderItem.orderStatus === "rejected"
                          ? "bg-red-600"
                          : "bg-black"
                      }`}
                    >
                      {orderItem.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell  >${orderItem.totalAmount}</TableCell>
                  <TableCell >
                    <Dialog
                      open={openDetailsDialog}
                      onOpenChange={(isOpen) => {
                        if (!isOpen) {
                          setOpenDetailsDialog(false);
                          dispatch(resetSetOrderDetails());
                        }
                      }}
                    >
                      <CircleChevronRight
                        className=" cursor-pointer hover:text-blue-600 transition transform"
                        onClick={() => handleFetchOrderDetails(orderItem._id)}
                      />

                      {orderDetails && (
                        <Shopping_order_details orderDetails={orderDetails} />
                      )}
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="5" className="text-center">
                  <Product_Not_Found Item={"Order"}></Product_Not_Found>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Shopping_Order;