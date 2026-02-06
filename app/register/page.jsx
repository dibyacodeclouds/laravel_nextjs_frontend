"use client";
import Link from "next/link";
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';


export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    //  let a = 5;
    // let b = 10;
    // let c = a;
    // a = b;
    // b = c;
    // a,b = b,a

    // a=


    const onhandleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Handle form submission logic here
        // console.log({ name, email, password, confirmPassword });
        if (!name || !email || !password || !confirmPassword) {
            toast.error("Please fill in all fields!");
            setLoading(false);
            return;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long!");
            setLoading(false);
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            toast.error("Please enter a valid email address!");
            setLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            setLoading(false);
            return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const res = await fetch(`${apiUrl}register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, password_confirmation: confirmPassword }),
        });
        res.json().then(data => {
            if (res.ok) {
                setLoading(false);
                toast.success(data.message || "Registration successful!");
            } else {
                setLoading(false);
                toast.error(data.message || "Registration failed!");
            }
        }).catch(err => {
            setLoading(false);
            toast.error(`An error occurred. Please try again. Error: ${err.message}`);
        });



        // setTimeout(() => {
        //     setLoading(false);
        //     toast.success("Registration successful!");
        // }, 3000);


    }

    return (
        <div className="register-wrapper bg-light min-vh-100 d-flex align-items-center justify-content-center p-3">
            <div className="register-card bg-white shadow-lg rounded-4 overflow-hidden d-flex flex-column flex-md-row">

                {/* Left Side: Illustration & Welcome (Visible on MD and up) */}
                <div className="register-sidebar d-none d-md-flex flex-column justify-content-center p-5 text-white bg-success bg-gradient align-items-center text-center">
                    <div className="display-1 mb-4">🌟</div>
                    <h2 className="fw-bold mb-3">Join Us Today!</h2>
                    <p className="opacity-75">Create your account and start your journey with our powerful dashboard.</p>
                </div>

                {/* Right Side: Form */}
                <div className="register-form-area p-5 grow">
                    <div className="mb-4 text-center text-md-start">
                        <h3 className="fw-bold text-dark mb-1">Create Account</h3>
                        <p className="text-muted small">Please fill in the details to register your new account.</p>
                    </div>

                    <form onSubmit={onhandleSubmit}>
                        <div className="mb-3">
                            <label className="form-label small fw-semibold text-muted">Full Name</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0 text-muted">👤</span>
                                <input
                                    type="text"
                                    className="form-control bg-light border-start-0 ps-0"
                                    placeholder="John Doe"
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

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

                        <div className="row">
                            <div className="col-md-6 mb-3">
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
                            <div className="col-md-6 mb-4">
                                <label className="form-label small fw-semibold text-muted">Confirm Password</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0 text-muted">🛡️</span>
                                    <input
                                        type="password"
                                        className="form-control bg-light border-start-0 ps-0"
                                        placeholder="••••••••"
                                        name="confirm_password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={loading}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <Toaster position="top-right" />

                        <button
                            type="submit"
                            className={`btn btn-success w-100 py-2 fw-bold text-uppercase shadow-sm mb-3 ${loading ? 'opacity-75 disabled' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Creating Account...
                                </>
                            ) : "Register"}
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <p className="text-muted small mb-0">
                            Already a member? <Link href="/login" className="text-success fw-bold text-decoration-none hover-link">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .register-wrapper {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }
        .register-card {
          width: 100%;
          max-width: 1000px;
          min-height: 550px;
        }
        .register-sidebar {
          width: 35%;
          background: linear-gradient(180deg, #198754 0%, #157347 100%);
        }
        .form-control:focus {
          box-shadow: none;
          background-color: #fff !important;
          border-color: #198754;
        }
        .input-group-text {
          border-color: transparent;
        }
        .hover-link:hover {
          text-decoration: underline !important;
        }
        @media (max-width: 768px) {
          .register-card {
            max-width: 500px;
          }
        }
      `}</style>
        </div>
    )
}

