import CommonForm from "@/components/common/Form";
import { LoginFormControl } from "@/components/config";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/store/auth-slice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
    setPasswordError(password.length < 6 ? "Password must be at least 6 characters." : "");
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setFormData({ ...formData, email });
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    setEmailError(!emailRegex.test(email) ? "Enter a valid email." : "");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData)).then((data) => {
      toast({ title: data.payload.message, variant: data.payload.success ? "" : "destructive" });
      if (data.payload.success) navigate("/shop/home");
    });
  };

  const isFormValid = () => {
    return formData.email && formData.password.length >= 6 && !emailError && !passwordError;
  };

  return (
    <div className="mx-auto w-full max-w-md bg-white p-8 rounded-lg shadow-lg space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Sign in to your account</h1>
        <p className="mt-2 text-gray-600">
          Don't have an account?
          <Link className="ml-2 text-blue-600 hover:underline" to="/auth/register">Register</Link>
        </p>
      </div>
      <CommonForm
        formControlers={LoginFormControl}
        buttonText="Sign In"
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isBtnDisabled={!isFormValid()}
        forgotPassword={true}
        error={{ emailError, passwordError }}
        handleEmailChange={handleEmailChange}
        handlePasswordChange={handlePasswordChange}
      />
    </div>
  );
};

export default Login;
