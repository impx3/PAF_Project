import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { ChefHat, Utensils, Leaf, Soup } from "lucide-react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Button } from "@/components/ui/button";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isPasswordStrong = (password: string): boolean => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{6,}$/.test(password);
  };

  const handleRegister = async () => {
    const { username, email, firstName, lastName, password, confirmPassword } = form;

    if (!username || !email || !firstName || !lastName || !password || !confirmPassword) {
      toast.error("Please fill all the required fields!");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!isPasswordStrong(password)) {
      toast.error("Password should be at least 6 characters with uppercase, lowercase, number, and special character.");
      return;
    }

    try {
      const payload = { ...form };
      delete payload.confirmPassword;

      const res = await api.post("/auth/register", payload);

      if (res.data?.result?.token) {
        localStorage.setItem("token", res.data.result.token);
        toast.success("Registration successful!");
        navigate("/login");
      } else {
        toast.error(res.data.message || "Registration failed!");
      }
    } catch (err) {
      toast.error("Something went wrong during registration.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-sage-100 to-beige-50 overflow-hidden">
      {/* Left Side - Animated Culinary Visuals */}
      <motion.div
        className="md:w-1/2 flex items-center justify-center p-8 text-sage-800"
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
              Join our Culinary Community
            </span>
          </h1>

          <div className="flex justify-center gap-4">
            <motion.div animate={{ rotate: -10 }} transition={{ yoyo: Infinity, duration: 2 }}>
              <Soup className="h-10 w-10 text-peach-600" />
            </motion.div>
            <motion.div animate={{ rotate: 10 }} transition={{ yoyo: Infinity, duration: 2, delay: 0.5 }}>
              <Utensils className="h-10 w-10 text-sage-600" />
            </motion.div>
            <motion.div animate={{ scale: [1, 1.1] }} transition={{ yoyo: Infinity, duration: 2 }}>
              <Leaf className="h-10 w-10 text-olive-600" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Registration Form */}
      <motion.div
      className="md:w-1/2 flex items-center justify-center p-8 overflow-y-auto"
      initial={{ x: 100 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 40 }}
    >
          <div className="w-full max-w-md bg-white shadow-md rounded-xl border border-beige-300 p-8 space-y-4 overflow-visible">
          <h2 className="text-2xl font-semibold text-center text-sage-900 mb-4">
            Create Your Account
          </h2>

          {["username", "email", "firstName", "lastName"].map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field}
              value={(form as any)[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="w-full border border-beige-300 rounded-lg px-4 py-3 focus:outline-none focus:border-sage-400"
            />
          ))}

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-beige-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:border-sage-400"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sage-500 cursor-pointer"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="w-full border border-beige-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:border-sage-400"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sage-500 cursor-pointer"
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

         <Button
          onClick={handleRegister}
          className="w-full py-3 font-medium rounded-lg transition-colors">
          Register
        </Button>


          <p className="text-center text-sage-600 text-sm pt-2">
            Already have an account?{" "}
            <a href="/login" className="text-sage-800 underline hover:text-sage-900">
              Log in
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
