import React from 'react'
import { SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import { Button } from '../ui/button'
// import userCartItemsContent from './Cart_content'
import User_Cart_Items_content from './Cart_content'
import { useNavigate } from 'react-router-dom'

const User_Cart_Wrapper = ({cartItems,setOpenCartSheet}) => {
  const navigate=useNavigate()
  const totalAmount=cartItems && cartItems.length>0?
cartItems.reduce((sum,currentItem)=>sum+(currentItem.salePrice>0?currentItem.salePrice:currentItem.price)*currentItem.quantity,0)
  : 0
  return (
   <SheetContent className="sm:max-w-md h-full flex flex-col">
   <SheetHeader>
   <SheetTitle>
   Your Cart
   </SheetTitle>
   
   </SheetHeader>
<div className='mt-8  space-y-4 flex-grow pr-5 overflow-y-auto '>
  {
    cartItems && cartItems.length>0?
    cartItems.map(item=><User_Cart_Items_content key={item.id} cartItem={item}></User_Cart_Items_content>):null
    }
</div>
<div className='mt-8 space-y-4'>
    <div className='flex justify-between'>
        <span className='font-bold'>Total</span>
        <span className='font-bold'>${totalAmount}</span>
    </div>
    <Button disabled={cartItems.length===0} onClick={()=>{
      navigate('/shop/checkout')
      setOpenCartSheet(false) 
      }} className='w-full mt-6'>Check out</Button>
</div>
   </SheetContent>
  )
}

export default User_Cart_Wrapper