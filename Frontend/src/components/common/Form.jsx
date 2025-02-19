import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiLoader } from "react-icons/fi";

const CommonForm = ({
  formControlers,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
  forgotPassword = false,
  error = {},
  handleEmailChange,
  handlePasswordChange,
  handlePhoneChange,
  handlePincodeChange
}) => {
  const [showPassword, setShowPassword] = useState({});
  const { isLoading } = useSelector((state) => state.auth);

  const togglePasswordVisibility = (name) => {
    setShowPassword((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const renderInputField = (controlItem) => {
    const value = formData[controlItem.name] || "";

    switch (controlItem.componantType) {
      case "input":
        return (
          <div className="relative">
            <Input
              name={controlItem.name}
              placeholder={controlItem.placeholder}
              id={controlItem.name}
              type={
                ["password", "confirmPassword"].includes(controlItem.name) &&
                showPassword[controlItem.name]
                  ? "text"
                  : controlItem.type || "text"
              }
              value={value}
              {...(controlItem.type === "number" ? { min: 0 } : {})}
              onChange={(e) => {
                if (["email", "otp"].includes(controlItem.name)) {
                  handleEmailChange(e);
                } else if (controlItem.name === "password") {
                  handlePasswordChange(e);
                }
                else if(controlItem.name==='pincode'){
                  handlePincodeChange(e)
                }
                else if(controlItem.name==='phone'){
                  handlePhoneChange(e)
                }
                setFormData((prev) => ({ ...prev, [controlItem.name]: e.target.value }));
              }}
            />
            {["password", "confirmPassword"].includes(controlItem.name) && (
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => togglePasswordVisibility(controlItem.name)}
              >
                {showPassword[controlItem.name] ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            )}
          </div>
        );
      case "checkbox":
        return (
          <div className="grid grid-cols-2 gap-2">
            {controlItem.options?.map((option) => (
              <div key={option.id} className="flex items-center">
                <Checkbox
                  id={option.id}
                  name={controlItem.name}
                  value={option.id}
                  checked={value.includes(option.id)}
                  onCheckedChange={(checked) => {
                    setFormData({
                      ...formData,
                      [controlItem.name]: checked
                        ? [...value, option.id]
                        : value.filter((size) => size !== option.id),
                    });
                  }}
                />
                <label htmlFor={option.id} className="ml-2">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
      case "select":
        return (
          <Select
            onValueChange={(val) => setFormData({ ...formData, [controlItem.name]: val })}
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={controlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {controlItem.options?.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "textarea":
        return (
          <Textarea
            name={controlItem.name}
            placeholder={controlItem.placeholder}
            id={controlItem.id}
            value={value}
            onChange={(e) => setFormData({ ...formData, [controlItem.name]: e.target.value })}
          />
        );
      default:
        return (
          <Input
            name={controlItem.name}
            placeholder={controlItem.placeholder}
            id={controlItem.name}
            type={controlItem.type}
            value={value}
            onChange={(e) => setFormData({ ...formData, [controlItem.name]: e.target.value })}
          />
        );
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {formControlers.map((controlItem) => (
        <div key={controlItem.name} className="grid gap-2">
          <Label className="mb-1">{controlItem.label}</Label>
          {renderInputField(controlItem)}
          {error[`${controlItem.name}Error`] && formData[controlItem.name]?.trim() && (
            <p className="text-red-500 text-sm">{error[`${controlItem.name}Error`]}</p>
          )}
        </div>
      ))}

      {forgotPassword && (
        <div className="flex justify-end mt-5">
          <Link to="/auth/forgot" className="font-medium hover:text-gray-400">
            Forgot password?
          </Link>
        </div>
      )}

      <Button disabled={isBtnDisabled} type="submit" className="w-full flex items-center justify-center">
        {isLoading ? <FiLoader className="animate-spin h-5 w-5" /> : buttonText}
      </Button>
    </form>
  );
};

export default CommonForm;
