"use client";
import Link from "next/link";
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
// import Loader from "../../components/Loader";
// import { redirect } from "next/dist/server/api-utils";
import { useRouter } from 'next/navigation';



export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onhandleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Handle form submission logic here
    // console.log({ email, password });

    if (!email || !password) {
      toast.error("Please fill in all fields!");
      setLoading(false);
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    try {
      const res = await fetch(`${apiUrl}login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setLoading(false);
        toast.success(data.message || "Logged in successful!");

        // Forcing a full page reload is the most reliable way to sync layouts in Next.js 15
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh();
          // window.location.href = '/dashboard';
        }, 1000);
      } else {
        setLoading(false);
        toast.error(data.message || "Logged In failed!");
      }
    } catch (err) {
      setLoading(false);
      toast.error(`An error occurred. Please try again. Error: ${err.message}`);
    }

    // setTimeout(() => {
    //   setLoading(false);
    //   toast.success("Login successful!");
    // }, 3000);
  }

  return (
    <div className="login-wrapper bg-light min-vh-100 d-flex align-items-center justify-content-center p-3">
      <div className="login-card bg-white shadow-lg rounded-4 overflow-hidden d-flex flex-column flex-md-row">

        {/* Left Side: Illustration & Welcome (Visible on MD and up) */}
        <div className="login-sidebar d-none d-md-flex flex-column justify-content-center p-5 text-white bg-primary bg-gradient align-items-center text-center">
          <div className="display-1 mb-4">🚀</div>
          <h2 className="fw-bold mb-3">Welcome Back!</h2>
          <p className="opacity-75">Connect with your dashboard and manage everything in one place.</p>
        </div>

        {/* Right Side: Form */}
        <div className="login-form-area p-5 flex-grow-1">
          <div className="mb-4 text-center text-md-start">
            <h3 className="fw-bold text-dark mb-1">Sign In</h3>
            <p className="text-muted small">Enter your credentials to access your account.</p>
          </div>

          <form onSubmit={onhandleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">✉️</span>
                <input
                  type="email"
                  className="form-control bg-light border-start-0 ps-0"
                  placeholder="name@example.com"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-semibold text-muted">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">🔒</span>
                <input
                  type="password"
                  className="form-control bg-light border-start-0 ps-0"
                  placeholder="••••••••"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <Toaster position="top-right" />

            <button
              type="submit"
              className={`btn btn-primary w-100 py-2 fw-bold text-uppercase shadow-sm mb-3 ${loading ? 'opacity-75 disabled' : ''}`}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing In...
                </>
              ) : "Login"}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-muted small mb-0">
              Not a member? <Link href="/register" className="text-primary fw-bold text-decoration-none hover-link">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-wrapper {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }
        .login-card {
          width: 100%;
          max-width: 900px;
          min-height: 500px;
        }
        .login-sidebar {
          width: 40%;
          background: linear-gradient(180deg, #0d6efd 0%, #0a58ca 100%);
        }
        .form-control:focus {
          box-shadow: none;
          background-color: #fff !important;
          border-color: #0d6efd;
        }
        .input-group-text {
          border-color: transparent;
        }
        .hover-link:hover {
          text-decoration: underline !important;
        }
        @media (max-width: 768px) {
          .login-card {
            max-width: 450px;
          }
        }
      `}</style>
    </div>
  )
}

