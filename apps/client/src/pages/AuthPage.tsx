import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { useLoginFormStore } from "../store/loginStore";
import { useSignupFormStore } from "../store/signupStore";
import { useUserStore } from "../store/userStore";
import config from "../config/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Auth = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("signin");

  // Reusable input styles
  const inputClassName =
    "border-gray-800 bg-[#0f111a] text-white focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 focus-visible:outline-none";

  // Login store
  const {
    email: loginEmail,
    password: loginPassword,
    setField: setLoginField,
    clearForm: clearLoginForm,
  } = useLoginFormStore();

  // Signup store
  const {
    email: signupEmail,
    password: signupPassword,
    username,
    setField: setSignupField,
    clearForm: clearSignupForm,
  } = useSignupFormStore();

  // User store
  const setUser = useUserStore((state) => state.setUser);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `${config.API_URL}/auth/login`,
        { email: loginEmail, password: loginPassword },
        { withCredentials: true },
      );
      return res.data;
    },
    onSuccess: (data) => {
      const { token, user } = data;
      if (token) {
        localStorage.setItem("token", token);
      }
      if (user) {
        setUser(user);
      }
      clearLoginForm();
      navigate("/");
    },
    onError: (err) => {
      console.error("Login Failed:", err);
    },
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        `${config.API_URL}/auth/signup`,
        { email: signupEmail, password: signupPassword, username },
        { withCredentials: true },
      );
      return res.data;
    },
    onSuccess: (data) => {
      setUser(data);
      clearSignupForm();
      navigate("/");
    },
    onError: (err) => {
      console.error("Signup failed:", err);
    },
  });

  const handleSignIn = (e: any) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      alert("Please enter both email and password");
      return;
    }

    if (loginPassword.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    if (loginPassword.length > 32) {
      alert("Password must be at most 32 characters long");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail)) {
      alert("Please enter a valid email address");
      return;
    }

    loginMutation.mutate();
  };

  const handleSignUp = (e: any) => {
    e.preventDefault();

    if (!signupEmail || !signupPassword || !username) {
      alert("Please fill in all fields");
      return;
    }

    if (signupPassword.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupEmail)) {
      alert("Please enter a valid email address");
      return;
    }

    signupMutation.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-navy-800 rounded-xl">
              <Code2 className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <h1 className="text-3xl text-white font-bold tracking-tight">
            AI Code Reviewer
          </h1>
          <p className="text-gray-300 mt-2">
            Sign in to start reviewing your code
          </p>
        </div>

        <Card className="shadow-lg bg-navy-800 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Welcome</CardTitle>
            <CardDescription>
              Create an account or sign in to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full bg-gray-800 grid-cols-2 h-11">
                <TabsTrigger
                  value="signin"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-primary-foreground data-[state=inactive]:text-gray-400"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-primary-foreground data-[state=inactive]:text-gray-400"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white" htmlFor="signin-email">
                      Email
                    </Label>
                    <Input
                      className={inputClassName}
                      id="signin-email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={loginEmail}
                      onChange={(e: any) =>
                        setLoginField("email", e.target.value)
                      }
                      disabled={loginMutation.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white" htmlFor="signin-password">
                      Password
                    </Label>
                    <Input
                      className={inputClassName}
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={loginPassword}
                      onChange={(e: any) =>
                        setLoginField("password", e.target.value)
                      }
                      disabled={loginMutation.isPending}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11 font-semibold bg-blue-500"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Signing in..." : "Sign In"}
                  </Button>
                  {loginMutation.isError && (
                    <p className="text-red-500 text-sm mt-2">
                      Login failed. Please check your credentials and try again.
                    </p>
                  )}
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white" htmlFor="username">
                      Username
                    </Label>
                    <Input
                      className={inputClassName}
                      id="username"
                      type="text"
                      placeholder="johndoe"
                      required
                      value={username}
                      onChange={(e: any) =>
                        setSignupField("username", e.target.value)
                      }
                      disabled={signupMutation.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white" htmlFor="signup-email">
                      Email
                    </Label>
                    <Input
                      className={inputClassName}
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={signupEmail}
                      onChange={(e: any) =>
                        setSignupField("email", e.target.value)
                      }
                      disabled={signupMutation.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white" htmlFor="signup-password">
                      Password
                    </Label>
                    <Input
                      className={inputClassName}
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      required
                      minLength={8}
                      value={signupPassword}
                      onChange={(e: any) =>
                        setSignupField("password", e.target.value)
                      }
                      disabled={signupMutation.isPending}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11 bg-blue-500 font-semibold"
                    disabled={signupMutation.isPending}
                  >
                    {signupMutation.isPending
                      ? "Creating account..."
                      : "Create Account"}
                  </Button>
                  {signupMutation.isError && (
                    <p className="text-red-500 text-sm mt-2">
                      Signup failed. Please try again.
                    </p>
                  )}
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
