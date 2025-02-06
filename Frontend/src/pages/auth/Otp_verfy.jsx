import CommonForm from '@/components/common/Form'
import { OtpFormControl } from '@/components/config'
import { toast } from '@/hooks/use-toast'
import { verifyOtp } from '@/store/auth-slice'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
const initialState={
    otp:''
}
const Otp_verfy = () => {
    const [formData,setFormData]=useState(initialState)
    const [otpError,setOtpError]=useState('')
    const dispatch=useDispatch()
    const navigate=useNavigate()
  
   const onSubmit = async (e) => {
       e.preventDefault();
       const email=localStorage.getItem('email')
       if (isFormValid()) {
         dispatch(verifyOtp({formData:{...formData,email}}))
           .then((result) => {
             console.log(result);
             if(result.payload.success){
              //  localStorage.setItem('email',JSON.stringify(result))
               toast({
                 title:result.payload.message
               })
               navigate('/auth/reset-password')
              //  navigate('/auth/otp')
             }else {
               toast({
                 title: result.payload.message,
                 variant: "destructive",
               });
             }
             
             
           })
           .catch((error) => {
             console.error("Otp varification faild", error.message);
           });
       } else {
         setOtpError("Please only digit.");
       }
     };
    const handleEmailChange = (e) => {
      const otp = e.target.value;
      setFormData({ ...formData,  otp});
  
      // Validate email format
      const numberReg = /^\d+$/;
      
      if (!numberReg.test(otp)) {
        if (otp.length > 0 || otp.startsWith(" ")) {
          setOtpError("Please enter only digits.");
        }
       // Show error message if invalid
      } else {
        setOtpError(""); // Clear error if OTP is valid
      }
    };
        const isFormValid = () => {
     
      const numberReg = /^\d+$/;
      const verify=numberReg.test(formData.otp)
        return Object.keys(formData).map((key) => formData[key] !== '').every((item) => item) && verify ;
      };
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
    <div className="text-center">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        OTP verification
      </h1>
     
    </div>
    <CommonForm
      formControlers={OtpFormControl}
      buttonText={"Submit"}
      formData={formData}
      setFormData={setFormData}
      onSubmit={onSubmit}
      isBtnDisabled={!isFormValid()}
      forgotPassword={false}
      error={{otpError}}
      handleEmailChange={handleEmailChange}
    />
  </div>
  )
}

export default Otp_verfy