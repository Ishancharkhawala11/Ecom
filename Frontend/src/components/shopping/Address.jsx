import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import CommonForm from "../common/Form";
import { addressFormControls } from "../config";
import { useDispatch, useSelector } from "react-redux";
import { addNewAddress, deleteAddress, editAddress, fetchAllAddress } from "@/store/Shop/Address_slice/Index";
import Address_card from "./Address_card";
import { useToast } from "@/hooks/use-toast";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

const Address = ({ setCurrentSelecedAddress, selectedId }) => {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [phoneError, setPhoneError] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const dispatch = useDispatch();
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const { toast } = useToast();

  const handlePhoneChange = (e) => {
    const phone = e.target.value;
    if (phone.includes("-")) {
      setPhoneError("Negative numbers are not allowed.");
    } else if (/^\d+$/.test(phone) && phone.length <= 10) {
      setFormData({ ...formData, phone });
      setPhoneError("");
    } else {
      setPhoneError("Enter a valid 10-digit phone number.");
    }
  };

  const handlePincodeChange = (e) => {
    const pincode = e.target.value;
    if (pincode.includes("-")) {
      setPincodeError("Negative numbers are not allowed.");
    } else if (/^\d+$/.test(pincode)) {
      setFormData({ ...formData, pincode });
      setPincodeError("");
    } 
  };

  const handleManageAddress = (e) => {
    e.preventDefault();
    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast({ title: "You can add max 3 addresses", variant: "destructive" });
      return;
    }
    const action = currentEditedId
      ? editAddress({ userId: user.id, addressId: currentEditedId, formData })
      : addNewAddress({ ...formData, userId: user.id });
    dispatch(action).then((data) => {
      if (data.payload.success) {
        dispatch(fetchAllAddress(user.id));
        setCurrentEditedId(null);
        setFormData(initialAddressFormData);
        toast({ title: currentEditedId ? "Address Updated Successfully" : "Address added successfully" });
      }
    });
  };

  const isFormValid = () => {
    return (
      Object.keys(formData).every((key) => formData[key].trim() !== "") &&
      !phoneError &&
      !pincodeError
    );
  };

  useEffect(() => {
    dispatch(fetchAllAddress(user.id));
  }, [dispatch]);

  const handleDeleteAddress = (address) => {
    dispatch(deleteAddress({ userId: user.id, addressId: address._id })).then((data) => {
      if (data.payload.success) {
        dispatch(fetchAllAddress(user.id));
      }
    });
  };

  const handleEditAddress = (address) => {
    setCurrentEditedId(address._id);
    setFormData({
      address: address.address,
      city: address.city,
      phone: address.phone,
      pincode: address.pincode,
      notes: address.notes,
    });
  };

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {addressList?.length > 0 &&
          addressList.map((item) => (
            <Address_card
              key={item._id}
              addressInfo={item}
              selectedId={selectedId}
              setCurrentSelecedAddress={setCurrentSelecedAddress}
              handleDeleteAddress={handleDeleteAddress}
              handleEditAddress={handleEditAddress}
            />
          ))}
      </div>
      <CardHeader>{currentEditedId ? "Edit Address" : "Add new Address"}</CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formControlers={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditedId ? "Edit" : "Add"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
          error={{ phoneError, pincodeError }}
          handlePhoneChange={handlePhoneChange}
          handlePincodeChange={handlePincodeChange}
        />
      </CardContent>
    </Card>
  );
};

export default Address;
