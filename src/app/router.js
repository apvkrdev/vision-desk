import { useRouter } from "next/navigation";

export default function AppRouter() {
  const router = useRouter();

  return (
    <nav>
      <button onClick={() => router.push("/")}>Home</button>
      <button onClick={() => router.push("/register")}>Register</button>
      {/* Add more navigation buttons as needed */}
    </nav>
  );
}
