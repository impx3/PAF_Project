import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import api from "../utils/axiosConfig";
import { motion } from "framer-motion";
import { ChefHat, Utensils, Leaf, Soup } from "lucide-react";

const Login: React.FC = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      if (res.data?.result.token) {
        localStorage.setItem("token", res.data.result.token);
        setCurrentUser(res.data.result);
        toast.success("Welcome back! Ready to cook something delicious?");
        navigate("/home");
      }
    } catch (err) {
      toast.error("Oops! Please check your credentials and try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-sage-100 to-beige-50 relative overflow-hidden">
      {/* Left Side - Culinary Visual Section */}
      <motion.div
        className="md:w-1/2 flex items-center justify-center p-8 text-sage-800 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-md space-y-8 text-center">
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <ChefHat className="h-20 w-20 mx-auto mb-6 text-sage-600" />
          </motion.div>

          <h1 className="text-4xl font-bold mb-4 font-serif text-sage-900">
            ChopChop
            <span className="text-xl block mt-4 text-sage-700">
              Your Culinary Community
            </span>
          </h1>

          <div className="flex justify-center gap-4">
            <motion.div
              animate={{ rotate: -10 }}
              transition={{ yoyo: Infinity, duration: 2 }}
            >
              <Soup className="h-10 w-10 text-peach-600" />
            </motion.div>
            <motion.div
              animate={{ rotate: 10 }}
              transition={{ yoyo: Infinity, duration: 2, delay: 0.5 }}
            >
              <Utensils className="h-10 w-10 text-sage-600" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.1] }}
              transition={{ yoyo: Infinity, duration: 2 }}
            >
              <Leaf className="h-10 w-10 text-olive-600" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Recipe Card Style Login Form */}
      <motion.div
        className="md:w-1/2 flex items-center justify-center p-8 relative z-10"
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 40 }}
      >
        <Card className="w-full max-w-md bg-white shadow-md rounded-xl border border-beige-300">
          <CardHeader className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold text-sage-900">
              Welcome Back to the Kitchen
            </h2>
            <p className="text-sage-700 text-sm">
              Share your recipes and culinary wisdom
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                <div className="relative">
                  <Input
                    id="username"
                    type="username"
                    placeholder="Your best recipe username"
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                    className="py-3 rounded-lg border border-beige-300 focus:border-sage-400 pl-10"
                  />
                  <ChefHat className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sage-500" />
                </div>

                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Secret ingredient"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="py-3 rounded-lg border border-beige-300 focus:border-sage-400 pl-10"
                  />
                  <Utensils className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sage-500" />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full  font-medium py-3 rounded-lg transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Utensils className="h-4 w-4 animate-spin" />
                    <span>Checking pantry...</span>
                  </div>
                ) : (
                  <>
                    <ChefHat className="mr-2 h-4 w-4" />
                    Start Cooking
                  </>
                )}
              </Button>

              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-beige-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-sage-600">
                    Quick access for busy chefs
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full py-3 border border-beige-300 text-sage-700 hover:bg-beige-50 rounded-lg gap-2"
              >
                <img
                  src="/icons/google-icon.png"
                  alt="Google"
                  className="h-4 w-4"
                />
                Continue with Google
              </Button>
            </form>
          </CardContent>

          <div className="text-center pb-4 text-sage-700 text-sm">
            New to our kitchen?{" "}
            <Link
              to="/signup"
              className="text-sage-800 hover:text-sage-900 underline underline-offset-2"
            >
              Join the community
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
