import CommonForm from "@/components/common/Form";
import { LoginFormControl } from "@/components/config";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/store/auth-slice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const initialState = {
    email: "",
    password: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [emailError, setEmailError] = useState('');
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setFormData({ ...formData, email });

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return; // Show error message if invalid
    } else {
      setEmailError(""); // Clear error if email is valid
    }
  };

  // console.log();
  
  const onSubmit = (e) => {
    e.preventDefault();
    // Dispatch login action here
    dispatch(loginUser(formData)).then((data) => {
      if (data.payload.success) {
        toast({
          title: data.payload.message,
        });
        navigate("/shop/home");
      } else {
        toast({
          title: data.payload.message,
          variant: "destructive",
        });
      }
    });
  };

  const isFormValid = () => {
    const emailReg= /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const valid=emailReg.test(formData.email)

    return Object.keys(formData).map((key) => formData[key] !== '').every((item) => item) && valid;
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">
          Don't have an account?{" "}
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            register
          </Link>
        </p>
      </div>
      <CommonForm
        formControlers={LoginFormControl}
        buttonText={"Sign Up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isBtnDisabled={!isFormValid()}
        forgotPassword={true}
        error={{ emailError }}
        handleEmailChange={handleEmailChange} // Pass the handleEmailChange as prop
      />
    </div>
  );
};

export default Login;
