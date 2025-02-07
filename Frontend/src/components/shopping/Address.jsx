import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import CommonForm from "../common/Form";
import { addressFormControls } from "../config";
import { useDispatch, useSelector } from "react-redux";
import { addNewAddress, deleteAddress, editAddress, fetchAllAddress } from "@/store/Shop/Address_slice/Index";
import Address_card from "./Address_card";
import { useToast } from "@/hooks/use-toast";
// import { Item } from "@radix-ui/react-dropdown-menu";
const intialAddressFormdata = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

const Address = ({setCurrentSelecedAddress,selectedId}) => {
  const [formData, setFormData] = useState(intialAddressFormdata);
 const {user}=useSelector(state=>state.auth)
 const {addressList}=useSelector(state=>state.shopAddress)
  const dispatch=useDispatch()
  const [currentEditdId,setCurrentEditedId]=useState(null)
  const {toast}=useToast()
  const handleManangeAddress=(e)=>{
    e.preventDefault()
    if(addressList.length>=3 && currentEditdId===null){
        setFormData(intialAddressFormdata)
        toast({
            title:'You can add max 3 address',
            variant:'destructive'
        })
        return;
    }
    currentEditdId!==null?dispatch(editAddress({userId:user.id,addressId:currentEditdId,formData})).then(data=>{
        if(data.payload.success){
            dispatch(fetchAllAddress(user.id))
            setCurrentEditedId(null)
            setFormData(intialAddressFormdata)
            toast({
                title:"Address Updated Successfully"
            })
        }
    }):
    dispatch(addNewAddress({...formData,userId:user.id})).then(data=>{
        console.log(data,'Accounts')
        if(data.payload.success){
            dispatch(fetchAllAddress(user.id))
            setFormData(intialAddressFormdata)
            toast({
                title:"Address added successfully"
            })
        }
    })
  }
  const isFormValid=()=>{
  return Object.keys(formData).map(key=>formData[key].trim()!=='').every(Item=>Item)
  }
  useEffect(()=>{
    dispatch(fetchAllAddress(user.id))
  },[dispatch])
  console.log(addressList,'Account-1');
  const handleDeleteAddress=(getCurrentAddress)=>{
    // const dispatch=useDispatch()
    console.log(getCurrentAddress);
    dispatch(deleteAddress({userId:user.id,addressId:getCurrentAddress._id})).then(data=>{
        if(data.payload.success){
            dispatch(fetchAllAddress(user.id))
        }
    })
    
}
const handleEditAddress=(getCurrentAddress)=>{
    setCurrentEditedId(getCurrentAddress._id),
    setFormData({
        ...formData,
        address: getCurrentAddress.address,
        city: getCurrentAddress.city,
        phone: getCurrentAddress.phone,
        pincode: getCurrentAddress.pincode,
        notes: getCurrentAddress.notes,

    })

}
  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2  gap-2">
        {
            addressList && addressList.length>0?
            addressList.map(singleItem=><Address_card selectedId={selectedId} setCurrentSelecedAddress={setCurrentSelecedAddress} handleDeleteAddress={handleDeleteAddress} key={singleItem} addressInfo={singleItem} handleEditAddress={handleEditAddress} />)
            :null
        }
      </div>
      <CardHeader>{currentEditdId!==null?"Edit Address":"Add new Address"}</CardHeader>
      <CardContent classname="space-y-3">
        <CommonForm 
        formControlers={addressFormControls}
        formData={formData}
        setFormData={setFormData}
        buttonText={currentEditdId!==null?"Edit":"Add"}
        onSubmit={handleManangeAddress}
        isBtnDisabled={!isFormValid()}

        ></CommonForm>
      </CardContent>
    </Card>
  );
};

export default Address;
