const mongoose=require('mongoose')
const AddressSchema=new mongoose.Schema(
  {  
    userId:String,
    address:String,
    pincode:String,
    phone:String,
    notes:String,
    city:String,
  },{
    timestamps:true
  }
)
module.exports=mongoose.model("Address",AddressSchema)