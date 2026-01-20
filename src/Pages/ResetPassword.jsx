import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function ResetPassword() {

  const navigate = useNavigate();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!emailOrPhone.trim())
      newErrors.emailOrPhone = 'E-mail or phone number is required';
    if (!verificationCode.trim())
      newErrors.verificationCode = 'Verification code or OTP is required';
    if (!newPassword.trim())
      newErrors.newPassword = 'New password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    console.log({
      emailOrPhone,
      verificationCode,
      newPassword,
    });
    alert('Password reset request submitted.');
  };

 

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
        {/* Left side logo */}
        <div className="flex items-center justify-center w-full md:w-1/2 bg-white p-8">
          <img
            src="/icons/logo dv.svg"
            alt="La Dolce Vita Logo"
            className="w-40 h-40 md:w-64 md:h-64 object-contain"
          />
        </div>

        {/* Right side form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-center">
          <h2 className="text-green-800 text-2xl sm:text-3xl font-semibold mb-6 text-center md:text-left">
            Reset Password
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email or phone */}
            <div>
              {/* <label
                htmlFor="emailOrPhone"
                className="block text-green-800 font-medium mb-1"
              >
                E-mail or phone number<span className="text-red-600">*</span>
              </label> */}
              <input
                id="emailOrPhone"
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className={`w-full border-b border-green-800 bg-transparent py-2 text-green-800 placeholder-green-600 focus:outline-none ${
                  errors.emailOrPhone ? 'border-red-600' : ''
                }`}
                placeholder="Enter your email or phone"
              />
              {errors.emailOrPhone && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.emailOrPhone}
                </p>
              )}
            </div>

            {/* Verification code */}
            <div>
              {/* <label
                htmlFor="verificationCode"
                className="block text-green-800 font-medium mb-1"
              >
                Verification code or OTP<span className="text-red-600">*</span>
              </label> */}
              <input
               
                id="verificationCode"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className={`w-full border-b border-green-800 bg-transparent py-2 text-green-800 placeholder-green-600 focus:outline-none ${
                  errors.verificationCode ? 'border-red-600' : ''
                }`}
                placeholder="Enter verification code or OTP"
              />
              {errors.verificationCode && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.verificationCode}
                </p>
              )}
            </div>

            {/* New password */}
            <div className="relative">
              {/* <label
                htmlFor="newPassword"
                className="block text-green-800 font-medium mb-1"
              >
                New password<span className="text-red-600">*</span>
              </label> */}
              <input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full border-b border-green-800 bg-transparent py-2 pr-10 text-green-800 placeholder-green-600 focus:outline-none ${
                  errors.newPassword ? 'border-red-600' : ''
                }`}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-0 text-green-800 hover:text-green-600 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.175-6.125M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3l18 18"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
              {errors.newPassword && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                type="submit"
                className="w-full bg-green-800 text-white py-2 rounded-full hover:bg-green-700 transition"
              >
                Reset password
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full bg-green-800 text-white py-2 rounded-full hover:bg-green-700 transition flex items-center justify-center space-x-2"
              >
                <span>Login</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;

