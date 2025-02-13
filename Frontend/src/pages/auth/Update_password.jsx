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
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setFormData((prev) => ({ ...prev, email: localStorage.getItem('email') || '' }));
  }, []);

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData((prev) => ({ ...prev, password }));
    setPasswordError(password.length < 6 ? 'Password must be at least 6 characters.' : '');
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;
    setFormData((prev) => ({ ...prev, confirmPassword }));
    setConfirmPasswordError(confirmPassword !== formData.password ? 'Passwords do not match.' : '');
  };

  const isFormValid = () => {
    return (
      formData.password.length >= 6 &&
      formData.confirmPassword === formData.password &&
      !passwordError &&
      !confirmPasswordError
    );
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    dispatch(resetPass(formData)).then((data) => {
      localStorage.removeItem('email');
      toast({
        title: data.payload.message || 'Password reset successfully',
        variant: data.payload.success ? '' : 'destructive',
      });
      if (data.payload.success) navigate('/auth/login');
    });
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-lg">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Reset Your Password</h1>
      </div>
      <CommonForm
        formControlers={resetPasswordControl}
        buttonText="Submit"
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isBtnDisabled={!isFormValid()}
        handlePasswordChange={handlePasswordChange}
        handleConfirmPasswordChange={handleConfirmPasswordChange}
        error={{ passwordError, confirmPasswordError }}
      />
    </div>
  );
};

export default UpdatePassword;
