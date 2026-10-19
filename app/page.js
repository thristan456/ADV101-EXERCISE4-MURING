"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(event) {
    event.preventDefault();

    if (email.trim() === "") {
      setError("Please enter your email address.");
      return;
    }

    if (!email.trim().endsWith("@gmail.com")) {
      setError("Email must end with @gmail.com.");
      return;
    }

    if (password.length <= 6) {
      setError("Password must contain more than 6 characters.");
      return;
    }

    sessionStorage.setItem("noteUser", email.trim());

    setError("");

    router.push("/notes");
  }

  return (
    <main className={styles.loginPage}>
      <div className={styles.backgroundImage}></div>
      <div className={styles.overlay}></div>

      <section className={styles.loginCard}>
        <div className={styles.appIcon}>N</div>

        <h1>Note Application</h1>

        <p className={styles.subtitle}>
          Welcome back! Please log in to continue.
        </p>

        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              type="text"
              placeholder="example@gmail.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
            />
          </div>

          <button type="submit" className={styles.loginButton}>
            Login
          </button>

          {error && (
            <p className={styles.errorMessage} role="alert">
              {error}
            </p>
          )}
        </form>

        <p className={styles.footerText}>
          Your personal space for organizing notes.
        </p>
      </section>
    </main>
  );
}