"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
export const dynamic = 'force-dynamic';
import { Counter } from '@/components/Counter';




const profile = async () => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const res = await fetch(`${apiUrl}me`, {
      method: "GET",
      credentials: "include",
      cache: 'no-store',
      headers: {
        "Content-Type": "application/json",
        'Accept': "application/json",
      },
    });
    const data = await res.json();
    console.log(`Profile Data (${new Date().toLocaleTimeString()}):`, data);
    return data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};

export default function Dashboard() {

  const router = useRouter();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { count, increment, decrement, reset } = Counter();

  useEffect(() => {
    document.title = "Dashboard";

    profile().then(data => {
      setProfileData(data);
      setLoading(false);
    });
  }, [router]);

  const userLogout = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const res = await fetch(`${apiUrl}logout`, {
        method: "POST",
        credentials: "include",
        cache: 'no-store',
        headers: {
          "Content-Type": "application/json",
          'Accept': "application/json",
        },
      });

      const data = await res.json();
      if (data.success) {
        router.push('/login');
        // window.location.href = '/login';
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  if (loading) {
    return (
      <div className="container vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <main className="text-center mt-5 p-5 shadow-lg rounded-4 bg-white">
        <div className="mb-4">
          <div className="display-4 text-primary">👋</div>
        </div>
        <h2 className="mb-3 fw-bold text-dark">Welcome Back, {profileData?.user?.name || "User"}!</h2>
        <p className="lead mb-5 text-muted">
          Your dashboard is ready. Managed your account and view your latest activity here.
        </p>
        <div> 
          <h1>Count: {count}</h1>
          <button onClick={increment}>Increment</button>
          <button onClick={decrement}>Decrement</button>
          <button onClick={reset}>Reset</button>
        </div>
        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
          <button className="btn btn-outline-danger btn-lg px-4" onClick={userLogout}>
            <i className="bi bi-box-arrow-right me-2"></i>Logout Session
          </button>
        </div>
        <div className="row">
          <div className="col-md-3">
            <div className="card text-white bg-primary mb-3">
              <div className="card-body">
                <h5 className="card-title"><Link className="text-white" href={'/dashboard/products'}> Products </Link></h5> 
                {/* <p className="card-text display-6">25</p> */}
              </div>
          </div>
        </div>
        </div>
      </main>

      <style jsx>{`
        main {
          transition: transform 0.3s ease-in-out;
          border-top: 5px solid #0d6efd;
        }
        main:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </div>
  )
}
