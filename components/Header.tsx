import Link from 'next/link'
import React from 'react'
import { cookies } from 'next/headers';
import Logout from './Logout';

export default async function Header() {
  const cookieStore = await cookies();
  const token = cookieStore.get('jwt_token')?.value;    


  return (
    <header className="bg-light py-3 mb-4 shadow-sm">
      <div className="container d-flex justify-content-between align-items-center">
        <h4 className="m-0">My Next.js App</h4>
        <nav className="d-flex gap-3">
          {token ? (
            <>
            <Link href="/dashboard" className="btn btn-outline-primary">
              Dashboard
            </Link>
            <Logout />
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-outline-primary">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
