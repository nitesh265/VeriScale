// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";

// const Register = () => {
//   const navigate = useNavigate();
//   const { register } = useAuth();

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//     role: "APPLICANT",
//   });

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setError("");
//     setSuccess("");

//     if (form.password !== form.confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     setLoading(true);

//     try {
//       await register({
//         name: form.name,
//         email: form.email,
//         phone: form.phone,
//         password: form.password,
//         role: form.role,
//       });

//       setSuccess(
//         "Registration successful. Please login."
//       );

//       setTimeout(() => {
//         navigate("/login");
//       }, 1500);

//     } catch (error) {
//       console.error("Registration error:", error);

//       setError(
//         error.response?.data?.message ||
//         error.message ||
//         "Registration failed"
//       );

//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-100 flex justify-center items-center p-4">

//       <div className="bg-white shadow-lg rounded-2xl w-full max-w-lg p-8">

//         <h1 className="text-2xl font-bold text-center">
//           Create Account
//         </h1>

//         <p className="text-center text-gray-500 mt-2 mb-6">
//           Register for Online Verification System
//         </p>

//         {/* ERROR */}
//         {error && (
//           <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
//             {error}
//           </div>
//         )}

//         {/* SUCCESS */}
//         {success && (
//           <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4">
//             {success}
//           </div>
//         )}

//         <form
//           onSubmit={handleSubmit}
//           className="space-y-4"
//         >

//           {/* NAME */}
//           <input
//             name="name"
//             placeholder="Full Name"
//             value={form.name}
//             onChange={handleChange}
//             required
//             className="w-full border rounded-lg px-4 py-3"
//           />

//           {/* EMAIL */}
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={form.email}
//             onChange={handleChange}
//             required
//             className="w-full border rounded-lg px-4 py-3"
//           />

//           {/* PHONE */}
//           <input
//             type="tel"
//             name="phone"
//             placeholder="Phone Number"
//             value={form.phone}
//             onChange={handleChange}
//             required
//             className="w-full border rounded-lg px-4 py-3"
//           />

//           {/* ROLE */}
//           <select
//             name="role"
//             value={form.role}
//             onChange={handleChange}
//             className="w-full border rounded-lg px-4 py-3"
//           >
//             <option value="APPLICANT">
//               Applicant
//             </option>

//             <option value="INSPECTOR">
//               Inspector
//             </option>
//           </select>

//           {/* PASSWORD */}
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={form.password}
//             onChange={handleChange}
//             required
//             className="w-full border rounded-lg px-4 py-3"
//           />

//           {/* CONFIRM PASSWORD */}
//           <input
//             type="password"
//             name="confirmPassword"
//             placeholder="Confirm Password"
//             value={form.confirmPassword}
//             onChange={handleChange}
//             required
//             className="w-full border rounded-lg px-4 py-3"
//           />

//           {/* REGISTER */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg"
//           >
//             {loading
//               ? "Creating Account..."
//               : "Register"}
//           </button>

//         </form>

//         <p className="text-center text-sm mt-6">

//           Already have an account?{" "}

//           <Link
//             to="/login"
//             className="text-blue-600 font-medium"
//           >
//             Login
//           </Link>

//         </p>

//       </div>

//     </div>
//   );
// };

// export default Register;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBalanceScale, FaUserPlus, FaArrowRight } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "APPLICANT",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const data = await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role,
      });

      const role = (data?.user?.role || data?.role || form.role).toUpperCase();

      if (role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else if (role === "INSPECTOR") {
        navigate("/inspector/dashboard", { replace: true });
      } else {
        navigate("/applicant/dashboard", { replace: true });
      }
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[32px] shadow-[0_30px_80px_rgba(15,23,42,0.15)] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="auth-hero flex flex-col justify-between p-8 text-white lg:p-12">
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-blue-50">
              <FaUserPlus /> Join now
            </div>
            <h1 className="max-w-md text-4xl font-bold leading-tight lg:text-5xl">
              Create your trusted verification account.
            </h1>
            <p className="mt-5 max-w-md text-base text-blue-100/90">
              Register to submit applications, track inspections, and keep your instrument records fully compliant.
            </p>
          </div>

          <div className="mt-10 rounded-3xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-blue-100/70">Why choose OVS</p>
            <ul className="mt-4 space-y-3 text-sm text-blue-50">
              <li>• Automated verification tracking</li>
              <li>• Secure digital certificate handling</li>
              <li>• Faster inspections and reporting</li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-center bg-white/85 p-6 backdrop-blur-xl lg:p-10">
          <div className="w-full max-w-lg">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-3xl text-white shadow-lg shadow-blue-500/30">
                <FaBalanceScale />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Create account</h2>
              <p className="mt-2 text-sm text-slate-500">Start verifying instruments in minutes</p>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="frosted-input w-full rounded-2xl px-4 py-3.5 text-slate-800 placeholder:text-slate-400"
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="frosted-input w-full rounded-2xl px-4 py-3.5 text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="frosted-input w-full rounded-2xl px-4 py-3.5 text-slate-800 placeholder:text-slate-400"
              />

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="frosted-input w-full rounded-2xl px-4 py-3.5 text-slate-800"
              >
                <option value="APPLICANT">Applicant</option>
                {/* <option value="INSPECTOR">Inspector</option> */}
              </select>

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className="frosted-input w-full rounded-2xl px-4 py-3.5 text-slate-800 placeholder:text-slate-400"
                />

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className="frosted-input w-full rounded-2xl px-4 py-3.5 text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Creating account..." : "Register"}
                {!loading && <FaArrowRight />}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account? <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
