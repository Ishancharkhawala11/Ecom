import CommonForm from '@/components/common/Form';
import { resetPasswordControl } from '@/components/config';
import { useToast } from '@/hooks/use-toast';
import { resetPass } from '@/store/auth-slice';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const initialFormData = {
  email: '',
  password: '',
  confirmPassword: '',
};

const UpdatePassword = () => {
  const [formData, setFormData] = useState(initialFormData);
  const dispatch = useDispatch();
  const {toast}=useToast()
  const navigate=useNavigate()
  useEffect(()=>{
    formData.email=localStorage.getItem('email')
    console.log(formData.email);
    
  },[formData])
  const onSubmit = () => {
    // Dispatch password reset logic here
    // console.log("Form submitted", formData);
    dispatch(resetPass(formData)).then(data=>{
      console.log(data);
      localStorage.removeItem('email')
      if(data.payload.success){
        toast({
          title:data.payload.message|| 'password reset successfully'
        })
navigate('/auth/login')
      }
      else{
        toast({
          title:data.payload.message
        })
      }
    })
  };

  const isFormValid = () => {
    return (
      Object.values(formData).every((value) => value.trim() !== '') 
    );
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Reset Your Password
        </h1>
      </div>
      <CommonForm
        formControlers={resetPasswordControl}
        buttonText="Submit"
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isBtnDisabled={!isFormValid()}
        forgotPassword={false}
      />
    </div>
  );
};

export default UpdatePassword;
