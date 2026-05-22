"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { User, Mail, Globe, LogIn, Camera, Wallet, Pencil, Check, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/components/app-providers";
import type { LearnerProfile } from "@genlayer-school/content";

export default function ProfilePage() {
  const auth = useAuth();
  const [pfpUrl, setPfpUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [displayName, setDisplayName] = useState("");
  // open by default so it's visible immediately after sign-in
  const [editingIdentity, setEditingIdentity] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");

  // Load pfp from localStorage
  useEffect(() => {
    if (!auth.learnerId) return;
    try {
      const stored = localStorage.getItem(`genlayer_pfp_${auth.learnerId}`);
      if (stored) setPfpUrl(stored);
    } catch {}
  }, [auth.learnerId]);

  // Load profile; collapse edit form if displayName already set
  useEffect(() => {
    if (!auth.ready || !auth.authenticated) return;
    let cancelled = false;

    auth.authFetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled || !d.profile) return;
        setProfile(d.profile);
        setDisplayName(d.profile.displayName ?? "");
        if (d.profile.displayName) {
          setEditingIdentity(false);
        }
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.authenticated, auth.learnerId]);

  function handlePfpChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setPfpUrl(dataUrl);
      try {
        localStorage.setItem(`genlayer_pfp_${auth.learnerId}`, dataUrl);
      } catch {}
    };
    reader.readAsDataURL(file);
  }

  async function saveIdentity() {
    if (saving) return;
    setSaving(true);
    setSaveStatus("idle");
    try {
      const res = await auth.authFetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName }),
      });
      const d = await res.json();
      if (res.ok && d.profile) {
        setProfile(d.profile);
        setDisplayName(d.profile.displayName ?? "");
        setSaveStatus("saved");
        setEditingIdentity(false);
      } else {
        setSaveStatus("error");
      }
    } catch {
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  }

  function cancelEdit() {
    setDisplayName(profile?.displayName ?? "");
    setEditingIdentity(false);
    setSaveStatus("idle");
  }

  const displayedName = profile?.displayName || auth.label;

  if (!auth.authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-white py-12 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl p-8 shadow-xl border border-purple-100"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-black mb-2">
              Welcome to GenLayer Regional School
            </h1>
            <p className="text-muted-foreground">Sign in to start your learning journey</p>
          </div>

          {!auth.ready ? (
            <div className="flex items-center justify-center py-8">
              <svg className="w-8 h-8 animate-spin text-purple-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            </div>
          ) : !auth.configured ? (
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm text-center">
              Privy is not configured — add <code className="font-mono">NEXT_PUBLIC_PRIVY_APP_ID</code> to your <code className="font-mono">.env</code> file.
            </div>
          ) : (
            <button
              onClick={auth.login}
              className="w-full px-6 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all"
            >
              <LogIn className="w-5 h-5" />
              Sign In with Privy
            </button>
          )}

          <div className="mt-8 pt-6 border-t border-purple-100 text-center">
            <p className="text-xs text-muted-foreground mb-4">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
            <Link href="/" className="text-sm text-purple-600 hover:underline">
              ← Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden"
        >
          {/* Header banner */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-500 p-8 text-white">
            <div className="flex items-center gap-6">
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePfpChange} />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-full bg-white p-1 relative group flex-shrink-0"
                title="Change profile picture"
              >
                <div className="w-full h-full rounded-full bg-purple-100 overflow-hidden flex items-center justify-center">
                  {pfpUrl
                    ? <img src={pfpUrl} alt="Profile" className="w-full h-full object-cover" />
                    : <User className="w-12 h-12 text-purple-600" />}
                </div>
                <div className="absolute inset-1 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </button>
              <div>
                <h1 className="text-3xl font-bold mb-1">{displayedName}</h1>
                <p className="text-purple-200">GenLayer Regional School Student</p>
              </div>
            </div>
          </div>

          {/* Account info */}
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Account Information</h2>
            <div className="space-y-4">

              {/* Display Name — first row, always visible */}
              <div className="rounded-xl border-2 border-purple-100 overflow-hidden">
                <div className="flex items-center justify-between px-4 pt-4 pb-2">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground font-medium">Display Name</span>
                  </div>
                  {!editingIdentity && (
                    <button
                      onClick={() => { setEditingIdentity(true); setSaveStatus("idle"); }}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-all text-xs font-medium"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  )}
                </div>

                {editingIdentity ? (
                  <div className="px-4 pb-4 space-y-3">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">
                        Display Name <span className="text-purple-400">shown in full · max 48 chars</span>
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        maxLength={48}
                        placeholder="GenLayer Learner"
                        autoFocus
                        className="w-full px-3 py-2.5 rounded-lg border-2 border-purple-200 focus:border-purple-500 focus:outline-none transition-colors bg-white text-foreground text-sm"
                      />
                    </div>
                    {saveStatus === "error" && (
                      <p className="text-xs text-red-600">Could not save. Please try again.</p>
                    )}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={saveIdentity}
                        disabled={saving}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-semibold hover:from-purple-700 hover:to-purple-600 transition-all disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                        {saving ? "Saving…" : "Save"}
                      </button>
                      {profile?.displayName && (
                        <button
                          onClick={cancelEdit}
                          disabled={saving}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200 transition-all"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="px-4 pb-4 flex items-center gap-6">
                    <div className="font-semibold">
                      {profile?.displayName
                        ? <span>{profile.displayName}</span>
                        : <span className="text-muted-foreground italic text-sm">No display name</span>}
                    </div>
                    {saveStatus === "saved" && (
                      <div className="ml-auto px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" /> Saved
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Email */}
              {auth.email && (
                <div className="flex items-center justify-between p-4 rounded-xl bg-purple-50 border border-purple-100">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="text-sm text-muted-foreground">Email</div>
                      <div className="font-semibold">{auth.email}</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">Verified</div>
                </div>
              )}

              {/* Wallet */}
              {auth.walletAddress && (
                <div className="flex items-center justify-between p-4 rounded-xl bg-purple-50 border border-purple-100">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="text-sm text-muted-foreground">Wallet</div>
                      <div className="font-semibold font-mono text-sm">
                        {auth.walletAddress.slice(0, 6)}…{auth.walletAddress.slice(-4)}
                      </div>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">Connected</div>
                </div>
              )}

              {/* Auth provider */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-purple-50 border border-purple-100">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="text-sm text-muted-foreground">Auth Provider</div>
                    <div className="font-semibold">Privy</div>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">Connected</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/dashboard"
            className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 text-white text-center font-semibold hover:from-purple-700 hover:to-purple-600 transition-all"
          >
            Go to Dashboard
          </Link>
          <button
            onClick={auth.logout}
            className="flex-1 px-6 py-3 rounded-lg bg-purple-100 text-purple-600 font-semibold hover:bg-purple-200 transition-all"
          >
            Sign Out
          </button>
        </motion.div>
      </div>
    </div>
  );
}
