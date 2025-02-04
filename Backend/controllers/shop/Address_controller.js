const Address=require('../../models/Address')
const addAddress=async(req,res)=>{
    try {
         const {userId,address,city,pincode,phone,notes}=req.body
         if(! userId || ! address || ! city ||! pincode ||! phone || !notes){
            return res.stutus(400).json(
                {
                    success:false,
                    message:"Invalid Data Provided"
                }
            )
         }
         const newlYCreatedAddress=new Address({
            userId,address,notes,phone,pincode,city
         })
         await newlYCreatedAddress.save()
         res.status(201).json({
            success:true,
            data:newlYCreatedAddress
         })
    } catch (error) {
        console.log(error);
        res.status({
            success:false,
            message:'Error occured'
        })
        
    }
}
const fetchAllAddress=async(req,res)=>{
    try {
        const {userId}=req.params
        if(! userId){
            res.status(400).json({
                success:false,
                message:"UserId  is Required"
            })
        }
        const addressList=await Address.find({userId})
        res.status(200).json({
            success:true,
            data:addressList
        })
    } catch (error) {
        console.log(error);
        res.status({
            success:false,
            message:'Error occured'
        })
        
    }
}
const editAddress=async(req,res)=>{
    try {
        const {userId,addressId}=req.params
        const formData=req.body
        if(! userId || ! addressId){
            res.status(400).json({
                success:false,
                message:"UserId and AddressId is Required"
            })
        }

  const address=await Address.findOneAndUpdate({
    _id:addressId,userId
  },formData,{new:true})
  if(!address){
   return res.status(404).json({
        success:false,
        message:"Address is not found"
    })
  }
  res.status(200).json({
    success:true,
    data:address
})
    } catch (error) {
        console.log(error);
        res.status({
            success:false,
            message:'Error occured'
        })
        
    }
}
const deleteAddress=async(req,res)=>{
    try {
        const {userId,addressId}=req.params
        if(! userId || ! addressId){
            res.status(400).json({
                success:false,
                message:"UserId and AddressId is Required"
            })
        }
        const address=await Address.findOneAndDelete({_id:addressId,userId})
        if(!address){
            return res.status(404).json({
                 success:false,
                 message:"Address is not found"
             })
           }
           res.status(200).json({
            success:true,
            // data:address
            message:"Address deleted successfully"
           })
    } catch (error) {
        console.log(error);
        res.status({
            success:false,
            message:'Error occured'
        })
        
    }
}
module.exports={addAddress,editAddress,deleteAddress,fetchAllAddress}