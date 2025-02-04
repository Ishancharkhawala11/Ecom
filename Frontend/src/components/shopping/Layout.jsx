import React from 'react'
import { Outlet } from 'react-router-dom'
import ShoppigHeader from './Header'

const ShoppingLayout = () => {
  return (
    <div className='flex flex-col bg-white overflow-hidden'>
    <ShoppigHeader/>
        <main className='flex flex-col w-full'>
            <Outlet/>
        </main>
    </div>
  )
}

export default ShoppingLayout