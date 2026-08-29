// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaBalanceScale } from "react-icons/fa";
// import { useAuth } from "../../context/AuthContext";

// const Login = () => {

//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const [error, setError] = useState("");
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
//     setLoading(true);

//     try {

//       const data = await login(form);

//       const role = data.user?.role;

//       if (role === "admin") {
//         navigate("/admin/dashboard");
//       } else if (role === "inspector") {
//         navigate("/inspector/dashboard");
//       } else {
//         navigate("/applicant/dashboard");
//       }

//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">

//       <div className="w-full max-w-md">

//         <div className="bg-white rounded-2xl shadow-lg p-8">

//           <div className="text-center mb-8">

//             <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <FaBalanceScale className="text-3xl" />
//             </div>

//             <h1 className="text-2xl font-bold text-gray-800">
//               Online Verification System
//             </h1>

//             <p className="text-gray-500 mt-2">
//               Weighing & Measuring Instruments
//             </p>

//           </div>

//           {error && (
//             <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-5 text-sm">
//               {error}
//             </div>
//           )}

//           <form
//             onSubmit={handleSubmit}
//             className="space-y-5"
//           >

//             <div>

//               <label className="block text-sm font-medium mb-2">
//                 Email
//               </label>

//               <input
//                 type="email"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter your email"
//                 className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
//               />

//             </div>

//             <div>

//               <label className="block text-sm font-medium mb-2">
//                 Password
//               </label>

//               <input
//                 type="password"
//                 name="password"
//                 value={form.password}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter your password"
//                 className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
//               />

//             </div>

//             <button
//               disabled={loading}
//               className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-lg font-medium"
//             >
//               {loading ? "Logging in..." : "Login"}
//             </button>

//           </form>

//           <p className="text-center text-sm text-gray-500 mt-6">

//             Don't have an account?{" "}

//             <Link
//               to="/register"
//               className="text-blue-600 font-medium"
//             >
//               Register
//             </Link>

//           </p>

//           <div className="text-center mt-5">

//             <Link
//               to="/verify-certificate"
//               className="text-sm text-gray-500 hover:text-blue-600"
//             >
//               Verify Certificate
//             </Link>

//           </div>

//         </div>

//       </div>

//     </div>
//   );
// };

// export default Login;

// ```jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBalanceScale, FaShieldAlt, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
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
    setLoading(true);

    try {
      const data = await login(form);
      const role = (data?.user?.role || data?.role || "").toUpperCase();

      if (role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else if (role === "INSPECTOR") {
        navigate("/inspector/dashboard", { replace: true });
      } else if (role === "APPLICANT") {
        navigate("/applicant/dashboard", { replace: true });
      } else {
        setError("Invalid user role.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[32px] shadow-[0_30px_80px_rgba(15,23,42,0.15)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="auth-hero flex flex-col justify-between p-8 text-white lg:p-12">
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-blue-50">
              <FaShieldAlt /> Secure platform
            </div>

            <h1 className="max-w-md text-4xl font-bold leading-tight lg:text-5xl">
              Trusted verification for every instrument.
            </h1>
            <p className="mt-5 max-w-md text-base text-blue-100/90">
              Manage compliance, inspections, and certificate validation through one streamlined digital workflow.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["1200+", "Applications"],
              ["98.6%", "Accuracy"],
              ["24/7", "Monitoring"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">{value}</div>
                <div className="mt-1 text-sm text-blue-100">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center bg-white/85 p-6 backdrop-blur-xl lg:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-3xl text-white shadow-lg shadow-blue-500/30">
                <FaBalanceScale />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
              <p className="mt-2 text-sm text-slate-500">Sign in to your verification dashboard</p>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="frosted-input w-full rounded-2xl px-4 py-3.5 text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="frosted-input w-full rounded-2xl px-4 py-3.5 text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Login"}
                {!loading && <FaArrowRight />}
              </button>
            </form>

            <div className="mt-6 space-y-4 text-center text-sm text-slate-600">
              <p>
                Don’t have an account?{" "}
                <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">
                  Register here
                </Link>
              </p>

              {/* <div className="flex items-center justify-center gap-2 text-slate-500">
                <FaCheckCircle className="text-emerald-500" />
                <Link to="/verify-certificate" className="hover:text-blue-600">
                  Verify certificate
                </Link>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
