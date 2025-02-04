import CommonForm from '@/components/common/Form'
import { registerFormControl } from '@/components/config'
import { useToast } from '@/hooks/use-toast'
import { registerUser } from '@/store/auth-slice'
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
const navigate=useNavigate()
const {toast}=useToast()
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
      setFormdata={setFormdata}
      onSubmit={onSubmit}
      ></CommonForm>
    </div>
  )
}

export default Register