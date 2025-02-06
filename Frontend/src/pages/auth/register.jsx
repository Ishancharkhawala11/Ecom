import CommonForm from '@/components/common/Form'
import { registerFormControl } from '@/components/config'
import { useToast } from '@/hooks/use-toast'
import { registerUser } from '@/store/auth-slice'
// import { Item } from '@radix-ui/react-dropdown-menu'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
const intialState ={
  userName:"",
  email:"",
  password:""
}
const Register = () => {
  const [formData,setFormdata]=useState(intialState)
const disPatch=useDispatch()
 const [emailError, setEmailError] = useState('');
const navigate=useNavigate()
const {toast}=useToast()
const isFormValid=()=>{
  const emailReg= /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const valid=emailReg.test(formData.email)

  return Object.keys(formData).map((key) => formData[key] !== '').every((item) => item) && valid;
}
const handleEmailChange = (e) => {
  const email = e.target.value;
  setFormdata({ ...formData, email });

  // Validate email format
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    setEmailError("Please enter a valid email address.");
    return; // Show error message if invalid
  } else {
    setEmailError(""); // Clear error if email is valid
  }
};
const onSubmit = async (e) => {
  e.preventDefault();
  disPatch(registerUser(formData))
    .then((result) => {
      if(result.payload.success===true){
        toast({
          title:result.payload.message,
        })
        navigate("/auth/login");
      }
      else{
        toast({
          title:result.payload.message,
          variant:"destructive"
        })
        // navigate("/auth/login");
      }
    console.log(result)
    
    })
    .catch((error) => {
      console.error("Registration failed:", error.message);
    });
};

  return (
    <div className='mx-auto w-full max-w-md space-y-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold tracking-tight text-foreground'>
          Create new account
        </h1>
        <p className='mt-2'>Already have an Account <Link className='font-medium ml-2 text-primary hover:underline' to="/auth/login">Login</Link></p>
         
      </div>
      <CommonForm
      formControlers={registerFormControl}
      buttonText={'Sign Up'}
      formData={formData}
      setFormData={setFormdata}
      onSubmit={onSubmit}
      isBtnDisabled={! isFormValid()}
      handleEmailChange={handleEmailChange}
      error={{emailError}}
      ></CommonForm>
    </div>
  )
}

export default Register