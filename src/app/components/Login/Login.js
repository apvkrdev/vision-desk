"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Login.module.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Login successful!");
        router.push("/pages/Dashboard");
      } else {
        setMessage("Login failed: " + (data.error || "Invalid credentials"));
      }
    } catch (err) {
      setMessage("Login failed: " + err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
      <p style={{ textAlign: "center", marginTop: 16 }}>
        <a href="/pages/Employee" style={{ color: "#0070f3", textDecoration: "underline", cursor: "pointer" }}>
          Create new account
        </a>
      </p>
    </div>
  );
}
