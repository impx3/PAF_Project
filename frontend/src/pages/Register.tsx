import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";

interface RegisterForm {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword?: string;
}

const Register = () => {
  const [form, setForm] = useState<RegisterForm>({
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
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{6,}$/.test(
      password,
    );
  };

  const handleRegister = async () => {
    const { username, email, firstName, lastName, password, confirmPassword } =
      form;

    if (
      !username ||
      !email ||
      !firstName ||
      !lastName ||
      !password ||
      !confirmPassword
    ) {
      toast.error("Please fill all the required fields!");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!isPasswordStrong(password)) {
      toast.error(
        "Password should be at least 6 characters with uppercase, lowercase, number, and special character.",
      );
      return;
    }

    try {
      const payload = { ...form };
      delete payload.confirmPassword;
      console.log("Sending register payload:", payload);

      const res = await api.post("/auth/register", payload);
      // if (res.data.success) {
      //  localStorage.setItem('token', res.data.result.token);

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Enter your information to get started
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="johndoe"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute right-3 top-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5" />
                ) : (
                  <FiEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute right-3 top-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <FiEyeOff className="h-5 w-5" />
                ) : (
                  <FiEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          {/* <input
        type="text"
        placeholder="Profile Image URL (optional)"
        value={form.profileImage}
        onChange={(e) => setForm({ ...form, profileImage: e.target.value })}
        className={styles.input}
      /> */}

          <Button className="w-full" onClick={handleRegister}>
            Register
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Register;
