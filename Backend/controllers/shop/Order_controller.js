const paypal = require("../../helpers/Paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product=require('../../models/product')
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentMethod,
      paymentStatus,
      paymentId,
      payerId,
    } = req.body;

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:5173/shop/paypal-return",
        cancel_url: "http://localhost:5173/shop/paypal-cancel",
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price: item.price.toFixed(2),
              currency: "USD",
              quantity: item.quantity,
            })),
          },

          amount: {
            currency: "USD",
            total: totalAmount,
          },
          description: "description",
        },
      ],
    };
    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.log(error, "Ishn");
        return res.status(500).json({
          success: false,
          message: "error while creatig paypal payment",
        });
      } else {
        const newlyCreatedOrder = new Order({
          userId,
          cartId,
          cartItems,
          addressInfo,
          orderStatus,
          totalAmount,
          orderDate,
          orderUpdateDate,
          paymentMethod,
          paymentStatus,
          paymentId,
          payerId,
        });
        await newlyCreatedOrder.save();
        const approvalURL = paymentInfo.links.find(
          (link) => link.rel === "approval_url"
        ).href;
        res.status(201).json({
          success: true,
          approvalURL: approvalURL,
          orderId: newlyCreatedOrder._id,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};
const captureOrder = async (req, res) => {
  try {
    const { orderId, paymentId, payerId } = req.body;
    let order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;
    for(let item of order.cartItems){
      let product=await Product.findById(item.productId)
      if(! product){
        return res.status(404).json({
          success:false,
          message:`Not enough stock of this product ${product.title}`
        })
      }
      product.totalStock-=item.quantity
      await product.save()
    }
    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);
    await order.save();
    res.status(200).json({
      success: true,
      message: "Order confirm",
      data: order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};
const getAllOrderByUser = async (req, res) => {
  try {
    const {userId}=req.params
    const orders=await Order.find({userId})
    if(! orders.length){
      res.status(404).json({
        success:false,
        message:"No orders found"
      })
    }
    res.status(200).json({
      success:true,
      data:orders
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
  
};
const getOrderDetails = async (req, res) => {
  try {
    const {id}=req.params
    // console.log(id,'id');
    
    const order=await Order.findById(id)
    // console.log(order,'order');
    
    if(! order){
     return res.status(404).json({
        success:false,
        message:"Order not found"
      })
    }
    res.status(200).json({
      success:true,
      data:order
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};
module.exports = { createOrder, captureOrder,getAllOrderByUser,getOrderDetails };
