"use client";

import { useState, useEffect } from "react";
import { User, ChevronLeft } from "@deemlol/next-icons";
import Link from "next/link";
import { sendmessage, getSessionId, clearSessionId } from "@/app/_serverInteraction/socket";
import { useRouter } from "next/navigation";

interface UserData {
  _id: string;
  username: string;
  email?: string;
  createdAt: string;
}

export default function ProfilePage({ params }: { params: { session: string } | Promise<{ session: string }> }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingUsername, setUpdatingUsername] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);
        setError(null);
        const sessionId = getSessionId();
        if (!sessionId) {
          setError("No session found");
          setLoading(false);
          return;
        }

        const response = await sendmessage<{
          success: boolean;
          results: UserData[];
        }>("data_lookup", {
          sessionID: sessionId,
          dataType: "User",
          filter: { sessionID: sessionId },
        });

        if (response.success && response.results && response.results.length > 0) {
          setUserData(response.results[0]);
        } else {
          setError("Failed to load user data");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const handleUsernameChange = async () => {
    const sessionId = getSessionId();

    if (!sessionId) {
      setActionMessage("No session found");
      return;
    }

    const nextUsername = newUsername.trim();
    if (!nextUsername) {
      setActionMessage("Username cannot be empty");
      return;
    }

    try {
      setUpdatingUsername(true);
      setActionMessage(null);

      const response = await sendmessage<{ success: boolean; message: string }>("account_setUsername", {
        sessionID: sessionId,
        username: nextUsername,
      });

      if (!response.success) {
        setActionMessage(response.message || "Failed to update username");
        return;
      }

      setUserData((previous) => (previous ? { ...previous, username: nextUsername } : previous));
      setNewUsername("");
      setActionMessage("Username updated successfully");
    } catch (updateError) {
      console.error("Error updating username:", updateError);
      setActionMessage("Failed to update username");
    } finally {
      setUpdatingUsername(false);
    }
  };

  const handlePasswordChange = async () => {
    const sessionId = getSessionId();

    if (!sessionId) {
      setActionMessage("No session found");
      return;
    }

    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setActionMessage("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setActionMessage("New passwords do not match");
      return;
    }

    try {
      setUpdatingPassword(true);
      setActionMessage(null);

      const response = await sendmessage<{ success: boolean; message: string }>("account_updatePassword", {
        sessionID: sessionId,
        currentPassword,
        newPassword,
      });

      if (!response.success) {
        setActionMessage(response.message || "Failed to update password");
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setActionMessage("Password updated successfully");
    } catch (updateError) {
      console.error("Error updating password:", updateError);
      setActionMessage("Failed to update password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 h-full">
        <div className="mx-auto max-w-2xl px-6 py-8">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading profile...</p>
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-100/10 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {!loading && userData && (
            <div className="space-y-6">
              {/* Profile Header Card */}
              <div className="rounded-2xl border border-border bg-surface p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Account</p>
                    <h2 className="mt-2 text-3xl font-semibold tracking-tight">{userData.username}</h2>
                  </div>
                  <div className="rounded-full bg-primary/10 p-4">
                    <User size={32} className="text-primary" />
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="rounded-2xl border border-border bg-surface p-6">
                <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground mb-4">Account Details</h3>
                
                <div className="space-y-4">
                  {/* Username */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Username</label>
                    <p className="mt-1 text-sm text-foreground">{userData.username}</p>
                  </div>

                  {/* Email */}
                  {userData.email && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
                      <p className="mt-1 text-sm text-foreground">{userData.email}</p>
                    </div>
                  )}

                  {/* Session ID */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Session ID</label>
                    <p className="mt-1 text-sm font-mono text-foreground/70">{getSessionId()}</p>
                  </div>

                  {/* Account Created */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Account Created</label>
                    <p className="mt-1 text-sm text-foreground">{formatDate(userData.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-2xl border border-border bg-surface p-6">
                <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground mb-4">Actions</h3>
                
                {actionMessage && (
                  <div className="mb-4 rounded-lg border border-border bg-background/80 px-4 py-3 text-sm text-foreground">
                    {actionMessage}
                  </div>
                )}

                <div className="grid gap-5">
                  <div className="rounded-2xl border border-border bg-background/60 p-4">
                    <h4 className="text-sm font-semibold text-foreground">Change Username</h4>
                    <p className="mt-1 text-xs text-muted-foreground">Pick a new display name for your account.</p>
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(event) => setNewUsername(event.target.value)}
                        placeholder="New username"
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                      <button
                        type="button"
                        onClick={handleUsernameChange}
                        disabled={updatingUsername}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {updatingUsername ? "Updating..." : "Change Username"}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-background/60 p-4">
                    <h4 className="text-sm font-semibold text-foreground">Change Password</h4>
                    <p className="mt-1 text-xs text-muted-foreground">Confirm your current password before choosing a new one.</p>
                    <div className="mt-3 grid gap-3">
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(event) => setCurrentPassword(event.target.value)}
                        placeholder="Current password"
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        placeholder="New password"
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="Confirm new password"
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                      <button
                        type="button"
                        onClick={handlePasswordChange}
                        disabled={updatingPassword}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {updatingPassword ? "Updating..." : "Change Password"}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      clearSessionId();
                      router.push("/");
                    }}
                    className="rounded-lg border border-border bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:cursor-pointer hover:bg-primary/90"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
