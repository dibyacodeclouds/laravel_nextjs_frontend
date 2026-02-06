import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <main className="text-center mt-5">
        <h1 className="mb-4">Welcome to Next.js with Bootstrap!</h1>
        <p className="lead mb-4">
          This is a simple example of using Bootstrap styles in a Next.js
          application.
        </p>
        <Link href={'/login'}><button className="btn btn-primary">Get Started</button></Link>
      </main>
    </div>
  );
}
