import React from 'react'

const Product_Not_Found = ({Item}) => {
  return (
    <div className='w-full min-h-96 flex justify-center items-center  rounded-lg '>
      <p className='text-3xl font-extrabold text-black animate-pulse'>{Item==='Order'?'Yet no order':`${Item} are not available`}</p>
    </div>
  );
}

export default Product_Not_Found