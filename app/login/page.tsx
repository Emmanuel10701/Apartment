"use client";
import React, { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaLock,
  FaGithub,
  FaGoogle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import Link from "next/link";
import { CircularProgress } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

const LoginPage: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (response?.error) {
        toast.error(response.error);
      } else {
        toast.success("Login successful!");
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    signIn(provider);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="w-full max-w-xl p-12 bg-white shadow-lg rounded-lg mb-8">
          <h2 className="text-4xl font-extrabold text-center mb-6 text-slate-600">
            🔒 Login
          </h2>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg pl-12 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                placeholder="Email Address"
                required
              />
              <FaEnvelope className="absolute left-3 top-3 text-gray-500 text-xl" />
            </div>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg pl-12 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                placeholder="Password"
                required
              />
              <FaLock className="absolute left-3 top-3 text-gray-500 text-xl" />
              <div
                className="absolute right-3 top-3 cursor-pointer text-xl text-gray-500"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            <div className="text-end mt-4">
              <Link href="/forgot-password">
                <span className="text-blue-500 hover:underline">
                  Forgot Password?
                </span>
              </Link>
            </div>
            <button
            type="submit"
            className={`w-full py-4 bg-blue-500 text-white font-bold rounded-lg ${loading ? 'border-2 border-indigo-800' : ''} hover:bg-blue-600 transition-colors relative`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <span className="text-white">Processing...</span>
                <CircularProgress
                  size={24}
                  color="inherit" // Inherit the color from the surrounding text or use white
                  style={{ color: "white" }} // Explicitly set the spinner to white
                />
              </div>
            ) : (
              "Sign In"
            )}
         </button>


            {/* Social Login Icons with Labels */}
            <div className="mt-8 text-center">
              <p className="text-lg font-semibold mb-4">Or log in with</p>
              <div className="flex justify-center space-x-8">
                <div className="flex flex-col items-center">
                  <FaGithub
                    onClick={() => handleSocialLogin("github")}
                    className="text-gray-800 text-2xl cursor-pointer hover:text-gray-600"
                  />
                  <span className="text-gray-600 mt-2">GitHub</span>
                </div>
                <div className="flex flex-col items-center">
                  <FaGoogle
                    onClick={() => handleSocialLogin("google")}
                    className="text-red-600 text-2xl cursor-pointer hover:text-red-400"
                  />
                  <span className="text-red-600 mt-2">Google</span>
                </div>
              </div>
            </div>

            <div className="text-center mt-4">
              Don&apos;t have an account?
              <Link href="/register">
                <span className="text-blue-500 hover:underline"> Register</span>
              </Link>
            </div>
          </form>

          {/* Toast Notifications */}
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
