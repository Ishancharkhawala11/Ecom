
export const registerFormControl=[
    {
        name:"userName",
        label:"User name",
        placeholder:"Enter your user name",
        componantType:'input',
        type:'text'
    },
    {
        name:"email",
        label:"email",
        placeholder:"Enter your email",
        componantType:'input',
        type:'email'
    },{
        name:"password",
        label:"password",
        placeholder:"Enter your password",
        componantType:'input',
        type:'password'
    }
];
export const forgotPasswordFormControl=[
 
  {
      name:"email",
      label:"email",
      placeholder:"Enter your email",
      componantType:'input',
      type:'email'
  },
];

export const resetPasswordControl=[
  {
    name:"password",
    label:"Enter password",
    placeholder:"Enter your password",
    componantType:'input',
    type:'password'
},
{
  name:"confirmPassword",
  label:"Confirm password",
  placeholder:"Enter your password",
  componantType:'input',
  type:'password'
}];
export const OtpFormControl=[
 
  {
      name:"otp",
      label:"",
      placeholder:"Enter your otp",
      componantType:'input',
      type:'text'
  },
];
export const LoginFormControl=[
 
    {
        name:"email",
        label:"email",
        placeholder:"Enter your email",
        componantType:'input',
        type:'text'
    },{
        name:"password",
        label:"password",
        placeholder:"Enter your password",
        componantType:'input',
        type:'password'
    }
];
export const categoryOptionsMap = {
  men: "Men",
  women: "Women",
  kids: "Kids",
  accessories: "Accessories",
  footwear: "Footwear",
};

export const brandOptionsMap = {
  nike: "Nike",
  adidas: "Adidas",
  puma: "Puma",
  levi: "Levi",
  zara: "Zara",
  "h&m": "H&M",
};
export const addProductFormElements = [
    {
      label: "Title",
      name: "title",
      componantType: "input",
      type: "text",
      placeholder: "Enter product title",
    },
    {
      label: "Description",
      name: "description",
      componantType: "textarea",
      placeholder: "Enter product description",
    },
    {
      label: "Category",
      name: "category",
      componantType: "select",
      options: [
        { id: "men", label: "Men" },
        { id: "women", label: "Women" },
        { id: "kids", label: "Kids" },
        { id: "accessories", label: "Accessories" },
        { id: "footwear", label: "Footwear" },
      ],
    },
    {
      label: "Brand",
      name: "brand",
      componantType: "select",
      options: [
        { id: "nike", label: "Nike" },
        { id: "adidas", label: "Adidas" },
        { id: "puma", label: "Puma" },
        { id: "levi", label: "Levi's" },
        { id: "zara", label: "Zara" },
        { id: "h&m", label: "H&M" },
      ],
    },
    {
      label: "Price",
      name: "price",
      componantType: "input",
      type: "number",
      placeholder: "Enter product price",
    },
    {
      label: "Sale Price",
      name: "salePrice",
      componantType: "input",
      type: "number",
      placeholder: "Enter sale price (optional)",
    },
    {
      label: "Total Stock",
      name: "totalStock",
      componantType: "input",
      type: "number",
      placeholder: "Enter total stock",
    },
    
  
  ];
  export const shoopingViewMenuItems=[
    {
      id:'home',
      label:'Home',
      path:'/shop/home'
    },
    {
      id:'products',
      label:'Products',
      path:'/shop/listing'
    },
    {
      id:'men',
      label:'Men',
      path:'/shop/listing'
    },
    {
      id:'women',
      label:'Women',
      path:'/shop/listing'
    },
    {
      id:'kids',
      label:'Kids',
      path:'/shop/listing'
    },
    {
      id:'footwear',
      label:'Footwear',
      path:'/shop/listing'
    },
    {
      id:'accessories',
      label:'Accesories',
      path:'/shop/listing'
    },
    // {
    //   id:'search',
    //   label:'Search',
    //   path:'/shop/search'
    // }
  ]
  export const filterOptions = {
    category: [
      { id: "men", label: "Men" },
      { id: "women", label: "Women" },
      { id: "kids", label: "Kids" },
      { id: "accessories", label: "Accessories" },
      { id: "footwear", label: "Footwear" },
    ],
    brand: [
      { id: "nike", label: "Nike" },
      { id: "adidas", label: "Adidas" },
      { id: "puma", label: "Puma" },
      { id: "levi", label: "Levi's" },
      { id: "zara", label: "Zara" },
      { id: "h&m", label: "H&M" },
    ],
  };
  
  export const sortOptions = [
    { id: "price-lowtohigh", label: "Price: Low to High" },
    { id: "price-hightolow", label: "Price: High to Low" },
    { id: "title-atoz", label: "Title: A to Z" },
    { id: "title-ztoa", label: "Title: Z to A" },
  ];
  export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componantType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componantType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componantType: "input",
    type: "number",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componantType: "input",
    type: "number",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componantType: "textarea",
    placeholder: "Enter any additional notes",
  },
];