import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

const Address_card = ({ addressInfo,handleDeleteAddress ,handleEditAddress,setCurrentSelecedAddress,selectedId}) => {
  // console.log(addressInfo._id);
  
  return (
    <Card className={`cursor-pointer ${selectedId?._id==addressInfo?._id?'border-yellow-300 border-[3px]':'border-black'}`} onClick={setCurrentSelecedAddress?()=>setCurrentSelecedAddress(addressInfo):null}>
       <CardContent className={`grid p-4 gap-4`}>
        <Label>Address: {addressInfo?.address}</Label>
        <Label>City: {addressInfo?.city}</Label>
        <Label>pincode: {addressInfo?.pincode}</Label>
        <Label>Phone: {addressInfo?.phone}</Label>
        <Label>Notes: {addressInfo?.notes}</Label>
      </CardContent>
      <CardFooter className='p-3 p-t flex justify-between'>
        <Button onClick={()=>handleEditAddress(addressInfo)}>Edit</Button>
        <Button onClick={()=>handleDeleteAddress(addressInfo)}>Delete</Button>
      </CardFooter>
    </Card>
  );
};

export default Address_card;
