import { useMutation } from "@tanstack/react-query";
import { useLoginFormStore } from "../store/loginStore";
import { useUserStore } from "../store/userStore";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const inputClasses =
  "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 m-2";

const Login = () => {
  const navigate = useNavigate();

  const { email, password, setField, clearForm } = useLoginFormStore();

  const setUser = useUserStore((state) => state.setUser);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password },
        { withCredentials: true },
      );
      return res.data;
    },

    onSuccess: (data) => {
      const { token, user } = data;

      localStorage.setItem("token", token);

      setUser(user);

      clearForm();
      navigate("/");
    },

    onError: (err) => {
      console.log("Login Failed:", err);
    },
  });

  const handleSubmit = () => {
    mutation.mutate();
  };

  return (
    <div className="w-full max-w-sm p-6 border border-b-gray-900 rounded-lg shadow-2xl">
      <div className="flex flex-col items-center justify-center w-full">
        <span className="font-bold text-2xl font-mono">Login</span>
        <input
          type="text"
          id="email"
          className={inputClasses}
          placeholder="Email"
          required
          onChange={(e) => setField("email", e.target.value)}
        />
        <input
          type="text"
          id="password"
          className={inputClasses}
          placeholder="Password"
          required
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
            Login failed. Please try again.
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
