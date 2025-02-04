import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSideBar from './SideBar'
import AdminHeader from './Header'

const AdminLayout = () => {
  const [open,setOpen]=useState(false)
  return (
    <div className='flex min-h-screen w-full'>
    <AdminSideBar open={open} setOpen={setOpen}/>
        <div className='flex flex-1 flex-col'>
        <AdminHeader setOpen={setOpen}/>
            <main className='flex-1 flex-col flex bg-muted/40 p-4 md:p-6'>
                <Outlet/>
            </main>
        </div>
    </div>
  )
}

export default AdminLayout