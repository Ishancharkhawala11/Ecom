import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";

const CommonForm = ({ formControlers, formData, setFormdata, onSubmit, buttonText, isBtnDisabled }) => {
  const [showPassword, setShowPassword] = useState({});

  const togglePasswordVisibility = (name) => {
    setShowPassword((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const renderInputsByComponantType = (getControlItem) => {
    let element = null;
    const value = formData[getControlItem.name] || "";

    switch (getControlItem.componantType) {
      case "input":
        element = (
          <div className="relative">
            <Input
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              id={getControlItem.name}
              type={
                getControlItem.name === "password" && showPassword[getControlItem.name]
                  ? "text"
                  : getControlItem.name
              }
              value={value}
              onChange={(e) => setFormdata({ ...formData, [getControlItem.name]: e.target.value })}
            />
            {getControlItem.name === "password" && (
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => togglePasswordVisibility(getControlItem.name)}
              >
                {showPassword[getControlItem.name] ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            )}
          </div>
        );
        break;
      case "select":
        element = (
          <Select
            onValueChange={(value) => setFormdata({
              ...formData,
              [getControlItem.name]: value,
            })}
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionsItem) => (
                    <SelectItem key={optionsItem.id} value={optionsItem.id}>
                      {optionsItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
        break;
      case "textarea":
        element = (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id}
            value={value}
            onChange={(e) => setFormdata({ ...formData, [getControlItem.name]: e.target.value })}
          />
        );
        break;
      default:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(e) => setFormdata({ ...formData, [getControlItem.name]: e.target.value })}
          />
        );
        break;
    }
    return element;
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControlers.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1">{controlItem.label}</Label>
            {renderInputsByComponantType(controlItem)}
          </div>
        ))}
      </div>
      <Button disabled={isBtnDisabled} type="submit" className="mt-2 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
};

export default CommonForm;
