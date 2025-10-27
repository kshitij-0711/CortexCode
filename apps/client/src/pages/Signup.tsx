import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useSignupFormStore } from '../store/signupStore' 
import { useUserStore } from '../store/userStore'
import { useNavigate } from 'react-router-dom'

const inputClasses =
  'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 m-2'

const Signup = () => {
  const navigate = useNavigate();
  // Access form state and functions from Zustand  -Form state is local UI state — it's temporary and specific to the signup component.
  const { email, password, username, setField, clearForm } = useSignupFormStore()
  // Access user state function from Zustand  -User state is global application state — it's long-lived and shared across the app
  const setUser = useUserStore((state) => state.setUser)

  // React Query mutation to handle async signup request
  const mutation = useMutation({
    // This function is triggered when mutation.mutate() is called
    mutationFn: async () => {
      // Send signup request to backend using axios
      const res = await axios.post('https://cortex-code-server.vercel.app/api/auth/signup', { email, password, username },{ withCredentials: true, });
      return res.data;// Return the response data (user object)
    },

    // Called when mutation succeeds
    onSuccess: (data) => {
      // Save user to Zustand global state
      setUser(data);
      // Clear the signup form
      clearForm();
      navigate('/login');
    },

    // Called if mutation fails
    onError: (err) => {
      console.error('Signup failed:', err)
    },
  })

  // When "Submit" is clicked
  const handleSubmit = () => {
    mutation.mutate() // Triggers the mutation (calls mutationFn)
  }

  return (
    <div className="w-full max-w-sm p-6 border border-b-gray-900 rounded-lg shadow-2xl">
      <div className="flex flex-col items-center justify-center w-full">
        {/* Email input */}
        <input
          type="text"
          className={inputClasses}
          placeholder="Email"
          value={email}
          onChange={(e) => setField('email', e.target.value)}
        />

        {/* Password input */}
        <input
          type="password"
          className={inputClasses}
          placeholder="Password"
          value={password}
          onChange={(e) => setField('password', e.target.value)}
        />

        {/* Username input */}
        <input
          type="text"
          className={inputClasses}
          placeholder="Username"
          value={username}
          onChange={(e) => setField('username', e.target.value)}
        />

        {/* Submit button */}
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg text-sm p-2 m-2 w-full"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Submitting...' : 'Submit'}
        </button>

        {/* Success / Error messages */}
        {mutation.isError && (
          <p className="text-red-500 text-sm mt-2">Signup failed. Please try again.</p>
        )}
        {mutation.isSuccess && (
          <p className="text-green-600 text-sm mt-2">Signup successful!</p>
        )}
      </div>
    </div>
  )
}

export default Signup
