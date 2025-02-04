import React from 'react'
import { Button } from '../ui/button'
import { Minus, Plus, Trash } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteCart, updateCartQuantity } from '@/store/Shop/Cartslice'
import { useToast } from '@/hooks/use-toast'

const User_Cart_Items_content = ({cartItem}) => {
  const {user}=useSelector(state=>state.auth)
  const {toast}=useToast()
  const { cartItems } = useSelector((state) => state.shopCart);
  const {productList}=useSelector((state)=>state.shopProduct)
  const dispatch=useDispatch()
  const HandleCartItemDelete=(getCartItem)=>{
    dispatch(
      deleteCart({ userId: user?.id, productId: getCartItem?.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item is deleted successfully",
        });
      }
    });
  }
  const handleUpdateQuantity=(getCartItem,typeOfAction)=>{
    if(typeOfAction==='plus'){
      let getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCartItem?.productId
      );
      const getCurrentProductIndex=productList.findIndex(product=>product._id===getCartItem.productId)
      const getTotalStock=productList[getCurrentProductIndex].totalStock
      // if(indexOfCurrentItem)
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added`,
            variant: "destructive",
          });
          return
        }
      }
    }
    }
    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload) {
        toast({
          title: "Cart item is updated successfully",
        });
      }
    });

  }

  return (
   <div className='item-center flex space-x-4'>
    <img 
    src={cartItem.image}
    alt={cartItem.title}
    className='w-20 h-20 rounded object-fill'
    />
    <div className='flex-1'>
      <h3 className='font-extrabold '>{cartItem.title}</h3>
      <div className='flex items-center mt-1 gap-2'>
        <Button variant='outline'className='h-8 w-8 rounded-full' size='icon' onClick={()=>{handleUpdateQuantity(cartItem,'minus')} }   disabled={cartItem?.quantity === 1}>
          <Minus className='w-4 h-4'/>
          <span className='sr-only'>decrease</span>
        </Button>
        <span className='font-semibold'>{cartItem.quantity}</span>
        <Button variant='outline'className='h-8 w-8 rounded-full ' size='icon' onClick={()=>{handleUpdateQuantity(cartItem,'plus')}}>
          <Plus className='w-4 h-4'/>
          <span className='sr-only'>decrease</span>
        </Button>
      </div>
      
    </div>
    <div className='flex flex-col items-end'>
      <p className='font-semibold'>
        ${((cartItem.salePrice>0?cartItem.salePrice:cartItem.price) * cartItem.quantity).toFixed(2)}
      </p>
      <Trash onClick={()=>{HandleCartItemDelete(cartItem)}} className='cursor-pointer mt-1 ' size={20}/>
    </div>
   </div>
  )
}

export default User_Cart_Items_content