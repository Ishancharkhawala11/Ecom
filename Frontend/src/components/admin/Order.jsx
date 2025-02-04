import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
// import { Table } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
// import Admin_Order_details from './Order_details'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrderDetailsForAdmin, getAllOrdersForAdmin, resetOrderDetails } from '@/store/admin/order-slice'
import { Badge } from '../ui/badge'
import Admin_Order_details from './Order_details'


const AdminOrder = () => {
  const [openDetailsDialouge,setOpenDetailsDialouge]=useState(false)
  const {orderList,orderDetails}=useSelector(state=>state.adminOrder)
  const dispatch=useDispatch()
  useEffect(() => {
  // Dispatch to fetch all orders
  dispatch(getAllOrdersForAdmin());
}, [dispatch]);
useEffect(()=>{
  if(orderDetails!==null){
    setOpenDetailsDialouge(true)
  }
},[orderDetails])

  console.log(orderDetails,'adminDetails');
  const handleFetchOrderDetails=(getId)=>{
    dispatch(getAllOrderDetailsForAdmin(getId))
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0
              ? orderList.map((orderItem) => (
                  <TableRow>
                    <TableCell>{orderItem?._id}</TableCell>
                    <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
                    <TableCell>
                      <Badge
                        className={`py-1 px-3 ${
                          orderItem?.orderStatus === "confirmed"
                            ? "bg-green-500"
                            : orderItem?.orderStatus === "rejected"
                            ? "bg-red-600"
                            : "bg-black"
                        }`}
                      >
                        {orderItem?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>${orderItem?.totalAmount}</TableCell>
                    <TableCell>
                      <Dialog
                        open={openDetailsDialouge}
                        onOpenChange={() => {
                          setOpenDetailsDialouge(false);
                          dispatch(resetOrderDetails());
                        }}
                      >
                        <Button
                          onClick={() =>
                            handleFetchOrderDetails(orderItem?._id)
                          }
                        >
                          View Details
                        </Button>
                        <Admin_Order_details orderDetails={orderDetails} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default AdminOrder