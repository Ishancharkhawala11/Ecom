const mongoose=require('mongoose')
const productReviewSchema=new mongoose.Schema({
    productId:String,
    userId:String,
    userName:String,
    reviewmessage:String,
    reviewValue:Number

},{timeseries:true})
module.exports=mongoose.model('Review',productReviewSchema)