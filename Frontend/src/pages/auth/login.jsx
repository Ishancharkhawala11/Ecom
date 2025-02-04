import CommonForm from "@/components/common/Form";
import { LoginFormControl } from "@/components/config";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/store/auth-slice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
const Login = () => {
  const intialState = {
    // userName:"",
    email: "",
    password: "",
  };

  const [formData, setFormdata] = useState(intialState);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();
  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(loginUser(formData)).then((data) => {
      if (data.payload.success) {
        toast({
          title: data.payload.message,
          // position:"top"
        });
        navigate("/shop/home");
      }
      else{
        toast({
          title:data.payload.message,
          variant:"destructive",
          // position:"top"
        })
        // navigate("/auth/login");
      }
    });
    // console.log(formData)
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
        setFormdata={setFormdata}
        onSubmit={onSubmit}
      ></CommonForm>
    </div>
  );
};

export default Login;
