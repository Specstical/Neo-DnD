"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sendmessage, getSessionId } from "@/app/_serverInteraction/socket";
import { ChevronLeft } from "@deemlol/next-icons";

export default function ComposePage({ params }: { params: { session: string } | Promise<{ session: string }> }) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!to.trim() || !subject.trim() || !body.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const sessionId = getSessionId();
      if (!sessionId) {
        setError("No session found");
        setLoading(false);
        return;
      }

      // Look up user by username to get their ID
      const userLookup = await sendmessage<{ success: boolean; results: Array<{ _id: string; username: string }> }>("data_lookup", {
        sessionID: sessionId,
        dataType: "User",
        filter: { username: to.trim() },
      });

      if (!userLookup.success || !userLookup.results || userLookup.results.length === 0) {
        setError(`User "${to}" not found`);
        setLoading(false);
        return;
      }

      const recipientId = userLookup.results[0]._id;

      const response = await sendmessage<{ success: boolean; message: string }>("mail_sendMail", {
        sessionID: sessionId,
        recipientID: recipientId,
        subject: subject,
        content: body,
      });

      if (response.success) {
        setSuccess(true);
        setTo("");
        setSubject("");
        setBody("");
        setTimeout(() => {
          router.push(`/${sessionId}/mail/inbox`);
        }, 1500);
      } else {
        setError("Failed to send mail");
      }
    } catch (err) {
      console.error("Error sending mail:", err);
      setError(err instanceof Error ? err.message : "Failed to send mail");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <div className="flex items-center gap-4 border-b border-border bg-surface px-6 py-3">
        <Link href={`/${getSessionId()}/mail/inbox`} className="flex items-center gap-2 hover:opacity-80 transition">
          <ChevronLeft size={24} className="text-primary" />
          <h1 className="text-lg font-semibold">Back</h1>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto bg-background">
        <div className="mx-auto max-w-2xl p-6">
          <form onSubmit={handleSend} className="space-y-4">
            {/* To Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">To</label>
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Recipient username"
                disabled={loading || success}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-muted-foreground">Enter the recipient's username</p>
            </div>

            {/* Subject Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject"
                disabled={loading || success}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Body Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Message</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your message here..."
                disabled={loading || success}
                rows={10}
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-100/10 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="rounded-lg bg-green-100/10 p-4 text-sm text-green-600">
                Mail sent successfully! Redirecting...
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Link
                href={`/${getSessionId()}/mail/inbox`}
                className={`rounded-lg px-4 py-2 text-sm font-medium border border-border hover:bg-primary/5 transition ${
                  loading || success ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || success}
                className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : success ? "Sent!" : "Send"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
