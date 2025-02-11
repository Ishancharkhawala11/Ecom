const paypal = require("../../helpers/Paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/product");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const User=require('../../models/User')
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

    const newOrder = new Order({
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

    await newOrder.save();

    // If COD, update stock immediately
    if (paymentMethod === "cod") {
      for (let item of cartItems) {
        let product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product ${item.title} not found`,
          });
        }
        if (product.totalStock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for product: ${item.title}`,
          });
        }
        product.totalStock -= item.quantity;
        await product.save();
      }

      // Clear the cart after placing the order
      await Cart.findByIdAndDelete(cartId);

      return res.status(201).json({
        success: true,
        message: "Order placed successfully with Cash on Delivery!",
        orderId: newOrder._id,
      });
    }

    // If PayPal, proceed with payment processing
    const create_payment_json = {
      intent: "sale",
      payer: { payment_method: "paypal" },
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
          amount: { currency: "USD", total: totalAmount },
          description: "Order Payment",
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "PayPal payment creation failed" });
      }

      const approvalURL = paymentInfo.links.find((link) => link.rel === "approval_url").href;

      res.status(201).json({
        success: true,
        approvalURL: approvalURL,
        orderId: newOrder._id,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Some error occurred" });
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
    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock of this product ${product.title}`,
        });
      }
      product.totalStock -= item.quantity;
      await product.save();
    }
    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);
    await order.save();
    // await sendEmail(email,order)
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
const sendEmail = async (req, res) => {
  try {
  const { orderId, email } = req.body;
  let order = await Order.findById(orderId);
  if (!order) {
    return res.json({
      success: false,
      message: "Order can not be found",
    });
  }
  const tempPath = path.join(__dirname, "../../helpers/Order.html");
  let orderHtml = fs.readFileSync(tempPath, "utf8");
  const pdfBuffer=await generatePdf(order)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ishan11012003@gmail.com",
      pass: "sula fceb pbyz xqfu",
    },
  });
  const message = {
    from: "ishan11012003@gmail.com",
    to: email,
    subject: "Order COnfirmation Mail",
    
    html: orderHtml
      .replaceAll("{{ORDER_NUMBER}}", order._id)
      .replaceAll("{{ORDER_TOTAL}}", order.totalAmount),
      attachments: [
        {
          filename: `Invoice_${order._id}.pdf`,
          content: pdfBuffer, // Attach PDF from memory
          contentType: "application/pdf",
        },
      ],
  };
  transporter.sendMail(message, (error, info) => {
    if (error) {
      console.error("Error in sending email:", error);
      return res.status(500).send({
        message: "Failed to send Email of confirmation.",
        success: false,
      });
    }
    console.log("Email sent:", info.response);
    res.json({
      success:true,
      message:'Email send Successfully'
    })
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
    const { userId } = req.params;
    const orders = await Order.find({ userId });
    if (!orders.length) {
      res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }
    res.status(200).json({
      success: true,
      data: orders,
    });
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
    const { id } = req.params;
    // console.log(id,'id');

    const order = await Order.findById(id);
    // console.log(order,'order');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    res.status(200).json({
      success: true,
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
const generatePdf=async(order)=>{
  const user=await User.findById(order.userId)
  if(!user){
    return res.json({
      success:false,
      message:'User not found'
    })
  }
  const browser=await puppeteer.launch({headless:'new'})
 
  const page=await browser.newPage()
  console.log(order.addressInfo[0].
    address," ",order.addressInfo[0].city,' ',user.userName);
  
  const tempPath=path.join(__dirname,"../../helpers/Invoice.html")
  let htmlContent= fs.readFileSync(tempPath,'utf8')
  const orderItemsHtml=order.cartItems.map((item) => `
  <tr>
    <td>${item.title}</td>
    <td>${item.quantity}</td>
    <td>$${parseFloat(item.price).toFixed(2)}</td>
    <td>$${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
  </tr>`
).join('')
htmlContent=htmlContent
.replace('{{ORDER_ID}}',order._id)
.replaceAll('{{ORDER_TOTAL}}',order.totalAmount.toFixed(2))
.replace("{{ORDER_DATE}}", new Date(order.orderDate).toLocaleDateString())
.replaceAll('{{NAME}}',user.userName)
.replace('{{ADDRESS_AREA}}',order.addressInfo[0].address)
.replace('{{ADDRESS_CITY}}',order.addressInfo[0].city)
.replace('{{ADDRESS_PINCODE}}',order.addressInfo[0].pincode)
.replace("{{ORDER_ITEMS}}", orderItemsHtml);
await page.setContent(htmlContent)
const pdfBuffer=await page.pdf({format:"A4",printBackground:true})
await browser.close()
return pdfBuffer
}
module.exports = {
  createOrder,
  captureOrder,
  getAllOrderByUser,
  getOrderDetails,
  sendEmail
};
