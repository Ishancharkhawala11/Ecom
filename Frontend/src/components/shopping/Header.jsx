import { Menu } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { SheetTrigger, Sheet, SheetContent } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoopingViewMenuItems } from "../config"; // Corrected import
import { ShoppingCart } from "lucide-react";
import { UserCog } from "lucide-react";
import { LogOut } from "lucide-react";
import { Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import User_Cart_Wrapper from "./Cart_Wrapper";
import { fetchToCart } from "@/store/Shop/Cartslice";
import { Label } from "../ui/label";
import shop from '../../assets/shop_1.png'
const MenuItems = () => {
  const navigate = useNavigate();
  const location=useLocation()
  const [searchParams,setSearchParams]=useSearchParams()
  const handleNavigate = (getCurrentItem) => {
    sessionStorage.removeItem("filters");
    const currentFiletrs =
      getCurrentItem.id !== "home" && getCurrentItem.id!=='products' && getCurrentItem.id!=='search'
        ? {
            category: [getCurrentItem.id],
          }
        : null;
    sessionStorage.setItem("filters", JSON.stringify(currentFiletrs));
    location.pathname.includes('listing') &&currentFiletrs!==null ? 
    setSearchParams(new URLSearchParams(`?category=${getCurrentItem.id}`)):
    navigate(getCurrentItem.path);
  };
  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoopingViewMenuItems.map((menuitem) => (
        <Label
          onClick={() => handleNavigate(menuitem)}
          key={menuitem.id}
          // to={menuitem.path}
          className="text-sm font-medium cursor-pointer hover:text-blue-300"
        >
          {menuitem.label} {/* Added label for menu items */}
        </Label>
      ))}
    </nav>
  );
};
const HeaderRight = () => {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const HandleLogout = () => {
    dispatch(logoutUser());
  };
  useEffect(() => {
    dispatch(fetchToCart(user?.id));
  }, [dispatch, user]);
  // useEffect(() => {
  //   if (cartItems?.items) {
  //     console.log(cartItems.items, 'Header');
  //   } else {
  //     console.log('Cart items are not loaded yet');
  //   }
  // }, [cartItems]);
  // console.log(cartItems.items,'Header')
  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
    <Search className="cursor-pointer" onClick={()=>{navigate('/shop/search')}}/>
      <Sheet
        open={openCartSheet}
        onOpenChange={() => {
          setOpenCartSheet(false);
        }}
      >
        {/* {" "} */}
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className='relative'
        >
         
          <ShoppingCart className="h-6 w-6" />
          <span className="absolute top-[-5px] right-[2px] font-extrabold text-sm">{cartItems?.items?.length ||0}</span>
          <span className="sr-only">User cart</span>
        </Button>
        <User_Cart_Wrapper
        setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black ">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user.userName.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side-="right" className="w-56">
          <DropdownMenuLabel>
            Logged In as {user.userName}
            <DropdownMenuSeparator />
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              navigate("/shop/account");
            }}
          >
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={HandleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const ShoppingHeader = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth); // Correct destructuring
  // console.log(user, "username");

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link className="flex items-center gap-2" to="/shop/home">
          {/* <HousePlug className="h-6 w-6" /> */}
          <img src={shop} alt="Icon" className="w-7 h-7 pb-1"></img>
          <span className="font-bold text-xl">ShopEase</span>
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems />
            <HeaderRight></HeaderRight>
          </SheetContent>
        </Sheet>

        <div className="hidden lg:block">
          <MenuItems />
        </div>

        {isAuthenticated && (
          <div className="hidden lg:block">
            <HeaderRight></HeaderRight>
          </div>
        )}
      </div>
    </header>
  );
};

export default ShoppingHeader;
