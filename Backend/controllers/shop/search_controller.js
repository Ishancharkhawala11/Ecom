const Product=require('../../models/product')
const searchProducts=async(req,res)=>{
    try {
        const {keyword}=req.params;
        if(! keyword || typeof(keyword)!=='string'){
            return res.status(400).json({
                success:false,
                message:"keyword is required and must be in String formet"
            })
        }
        const regEx=new RegExp(keyword,'i')
        const cretaeSearchQuery={
            $or:[
                {title:regEx},
                {description:regEx},
                {category:regEx},
                {brand:regEx},
            ]
        }
        const searchResults=await Product.find(cretaeSearchQuery)
        res.status(200).json({
            success:true,
            message:searchResults
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:error
        })
        
    }
}
module.exports={searchProducts}