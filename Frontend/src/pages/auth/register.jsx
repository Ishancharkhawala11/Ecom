import CommonForm from "@/components/common/Form";
import { registerFormControl } from "@/components/config";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/store/auth-slice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

const Register = () => {
  const [formData, setFormData] = useState(initialState);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const isFormValid = () => {
    return (
      formData.userName &&
      formData.email &&
      formData.password.length >= 6 &&
      !emailError &&
      !passwordError
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(registerUser(formData)).then((result) => {
      toast({
        title: result.payload.message,
        variant: result.payload.success ? "" : "destructive",
      });
      if (result.payload.success) navigate("/auth/login");
    });
  };

  return (
    <div className="mx-auto w-full max-w-md bg-white p-8 rounded-lg shadow-lg space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Create a new account</h1>
        <p className="mt-2 text-gray-600">
          Already have an account?
          <Link className="ml-2 text-blue-600 hover:underline" to="/auth/login">
            Login
          </Link>
        </p>
      </div>
      <CommonForm
        formControlers={registerFormControl}
        buttonText="Sign Up"
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isBtnDisabled={!isFormValid()}
        handleEmailChange={handleEmailChange}
        handlePasswordChange={handlePasswordChange}
        error={{ emailError, passwordError }}
      />
    </div>
  );
};

export default Register;
