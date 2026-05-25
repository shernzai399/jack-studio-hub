"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, UserPlus, UserRound } from "lucide-react";
import { Card, Field, PrimaryButton, inputClass } from "@/components/ui";
import { registerInternalUser, roleLabels } from "@/lib/internal-auth";
import { roles, type Role } from "@/lib/types";

export function RegisterForm() {
  const router = useRouter();
  const [savedMessage, setSavedMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    userId: "",
    displayName: "",
    password: "",
    confirmPassword: "",
    role: "store_staff" as Role
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavedMessage("");
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Password confirmation does not match.");
      return;
    }

    try {
      const user = await registerInternalUser({
        userId: form.userId,
        displayName: form.displayName,
        password: form.password,
        role: form.role
      });
      setSavedMessage(`${user.displayName} registered as ${user.roleLabel}.`);
      setForm({ userId: "", displayName: "", password: "", confirmPassword: "", role: "store_staff" });
      window.setTimeout(() => router.push("/sign-in"), 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to register user.");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-pearl px-4 py-10">
      <Card className="w-full max-w-md">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay">JACK STUDIO</p>
          <h1 className="mt-2 text-2xl font-semibold text-ink">Register User</h1>
          <p className="mt-2 text-sm text-moss">Create an internal testing account for this browser.</p>
        </div>

        {savedMessage && <p className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">{savedMessage}</p>}
        {error && <p className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <Field label="ID">
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-moss" size={18} />
              <input className={`${inputClass} w-full pl-10`} value={form.userId} onChange={(event) => setForm({ ...form, userId: event.target.value })} autoComplete="username" />
            </div>
          </Field>
          <Field label="Name">
            <div className="relative">
              <UserPlus className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-moss" size={18} />
              <input className={`${inputClass} w-full pl-10`} value={form.displayName} onChange={(event) => setForm({ ...form, displayName: event.target.value })} autoComplete="name" />
            </div>
          </Field>
          <Field label="Role">
            <select className={inputClass} value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as Role })}>
              {roles.map((role) => (
                <option key={role} value={role}>{roleLabels[role]}</option>
              ))}
            </select>
          </Field>
          <Field label="Password">
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-moss" size={18} />
              <input className={`${inputClass} w-full pl-10`} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} type="password" autoComplete="new-password" />
            </div>
          </Field>
          <Field label="Confirm password">
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-moss" size={18} />
              <input className={`${inputClass} w-full pl-10`} value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} type="password" autoComplete="new-password" />
            </div>
          </Field>
          <PrimaryButton type="submit">Register user</PrimaryButton>
        </form>

        <p className="mt-5 text-center text-sm text-moss">
          Already registered?{" "}
          <Link href="/sign-in" className="font-semibold text-clay underline">
            Back to sign in
          </Link>
        </p>
      </Card>
    </main>
  );
}
