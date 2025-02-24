import React, { Fragment } from 'react'
import { ChartNoAxesCombined } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import { adminsidebarMenuItems } from '../config';
import { LayoutDashboard } from 'lucide-react';
import { ShoppingBasket } from 'lucide-react';
import { BadgeCheck } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { MdOutlineSpaceDashboard } from "react-icons/md";
 const adminsidebarMenuItems=[
  {
      'id':"dashboard",
      'label':"Dashboard",
      'path':'/admin/dashboard',
      'icon':<MdOutlineSpaceDashboard size={25}/>
  },
  {
      'id':"products",
      'label':"Products",
      'path':'/admin/products',
      'icon':<ShoppingBasket />
  },
  {
      'id':"Orders",
      'label':"Orders",
      'path':'/admin/orders',
      'icon': <BadgeCheck />
  },
  
]
const MenuItems=({setOpen})=>{
  const navigate=useNavigate()
  return (<nav className='mt-8 flex-col flex gap-2'>
    {adminsidebarMenuItems.map(menuItem=>(
      <div key={menuItem.id} 
      onClick={()=>{
        navigate(menuItem.path)
      setOpen?setOpen(false):null
      }} className='flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer hover:bg-gray-100'>
{menuItem.icon}
<span className="font-semibold">{menuItem.label}</span>

      </div>
    ))}
  </nav>)
}
const AdminSideBar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className='flex gap-2 mt-5 mb-5'>
                <ChartNoAxesCombined size={30} /><span>
                Admin Panel
                </span> 
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        <div
          onClick={() => navigate('/admin/dashboard')}
          className="flex cursor-pointer items-center gap-2"
        >
          <LayoutDashboard />
          <h1 className="text-xl font-extrabold">Admin Panel</h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
};


export default AdminSideBar