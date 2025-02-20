import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

const Address_card = ({ addressInfo,handleDeleteAddress ,handleEditAddress,setCurrentSelecedAddress,selectedId}) => {
  // console.log(addressInfo._id);
  
  return (
    <Card 
    className={`cursor-pointer flex flex-col justify-between min-h-[250px] ${selectedId?._id === addressInfo?._id ? 'border-yellow-300 border-[3px]' : 'border-black'}`}
    onClick={setCurrentSelecedAddress ? () => setCurrentSelecedAddress(addressInfo) : null}
  >
   
    <CardContent className="grid p-4 gap-2 flex-grow">
      <Label>Address: {addressInfo?.address}</Label>
      <Label>City: {addressInfo?.city}</Label>
      <Label>Pincode: {addressInfo?.pincode}</Label>
      <Label>Phone: {addressInfo?.phone}</Label>
      {addressInfo?.notes && <Label>Notes: {addressInfo?.notes}</Label>}
    </CardContent>
  
   
    <CardFooter className="p-3 pt-4 flex justify-between w-full mt-auto">
      <Button onClick={() => handleEditAddress(addressInfo)} className="w-[48%]">
        Edit
      </Button>
      <Button onClick={() => handleDeleteAddress(addressInfo)} className="w-[48%]">
        Delete
      </Button>
    </CardFooter>
  </Card>
  
  
  );
};

export default Address_card;
