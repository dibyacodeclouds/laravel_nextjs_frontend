"use client";
import { useRouter } from 'next/navigation';


export default function Logout() {

  const router = useRouter();
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
        router.refresh();
        router.push('/login');
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  return (
    <button onClick={userLogout} className="btn btn-outline-primary">Logout</button>
  )
}