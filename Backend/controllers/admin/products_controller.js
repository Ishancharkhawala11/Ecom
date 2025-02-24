const { ImageUploadUtils } = require("../../helpers/Cloudinary");
const Product=require('../../models/product')
const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await ImageUploadUtils(url);
// console.log(result);

    res.json({
      success: true,
     data: result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error occured",
    });
  }
};

const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;
    const  newlyCreatedProduct=new Product({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    })
    await newlyCreatedProduct.save()
    res.status(201).json({
      success:true,
      data:newlyCreatedProduct
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const {id}=req.params
    const product=await  Product.findByIdAndDelete(id)
    if(! product){
      return res.status(404).json({
        success:false,
        message:"Product not found"
      })
    }
    res.status(200).json({
      success:true,
      message:"Product deleted successfully"
    })
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};
const editProduct = async (req, res) => {
  try {
    const {id} = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    let findProduct = await Product.findById(id);
    if (!findProduct)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;
    findProduct.price = price === "" ? 0 : price || findProduct.price;
    findProduct.salePrice =
      salePrice === "" ? 0 : salePrice || findProduct.salePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;
    findProduct.image = image || findProduct.image;
    findProduct.averageReview = averageReview || findProduct.averageReview;

    await findProduct.save();
    res.status(200).json({
      success: true,
      data: findProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};
const fetchAllProduct = async (req, res) => {
  try {
    const listofproduct=await Product.find({})
    res.status(200).json({
      success:true,
      data:listofproduct
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};
module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProduct,
  deleteProduct,
  editProduct,
};
