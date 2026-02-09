'use client'
import Link from 'next/link'


import Logout from './Logout';
import { useEffect, useState } from 'react';

export default function NavButton({ token }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    console.log("token", token);
    useEffect(() => {
        setIsAuthenticated(!!token);
    }, [token]);
    return (

        <nav className="d-flex gap-3">
            {isAuthenticated ? (
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
    )
}
