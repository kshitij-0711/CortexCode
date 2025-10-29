import { useMutation } from "@tanstack/react-query";
import { useLoginFormStore } from "../store/loginStore";
import { useUserStore } from "../store/userStore";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../config/api";

const inputClasses =
  "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 m-2";

const Login = () => {
  const navigate = useNavigate();

  const { email, password, setField, clearForm } = useLoginFormStore();

  const setUser = useUserStore((state) => state.setUser);

  const mutation = useMutation({
    mutationFn: async () => {
      console.log("📤 Sending login request with:", { email, password: "***" });
      
      const res = await axios.post(
        `${config.API_URL}/auth/login`,
        { email, password },
        { withCredentials: true },
      );
      return res.data;
    },

    onSuccess: (data) => {
      console.log("✅ Login successful:", data);
      
      const { token, user } = data;

      if (token) {
        localStorage.setItem("token", token);
      }

      if (user) {
        setUser(user);
      }

      clearForm();
      navigate("/");
    },

    onError: (err) => {
      console.error("❌ Login Failed:", err);
      
      if (axios.isAxiosError(err)) {
        console.error("Backend Error Response:", err.response?.data);
        console.error("Status Code:", err.response?.status);
        console.error("Request Data:", { email, password: password ? "***" : "empty" });
      }
    },
  });

  const handleSubmit = () => {
    // ✅ Validation before submission
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    if (password.length > 32) {
      alert("Password must be at most 32 characters long");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    mutation.mutate();
  };

  return (
    <div className="w-full max-w-sm p-6 border border-b-gray-900 rounded-lg shadow-2xl">
      <div className="flex flex-col items-center justify-center w-full">
        <span className="font-bold text-2xl font-mono">Login</span>
        <input
          type="email"
          id="email"
          className={inputClasses}
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setField("email", e.target.value)}
        />
        <input
          type="password"
          id="password"
          className={inputClasses}
          placeholder="Password (min 8 characters)"
          required
          value={password}
          onChange={(e) => setField("password", e.target.value)}
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg text-sm p-2 m-2 w-full"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Logging In..." : "Login"}
        </button>

        {mutation.isError && (
          <p className="text-red-500 text-sm mt-2">
            Login failed. Please check your credentials and try again.
          </p>
        )}
        {mutation.isSuccess && (
          <p className="text-green-600 text-sm mt-2">Login successful!</p>
        )}
      </div>
    </div>
  );


};

export default Login;