"use client";

import { useState, useEffect } from "react";
import { sendmessage, getSessionId } from "@/app/_serverInteraction/socket";
import { Inbox, Send, Search, Edit } from "@deemlol/next-icons";
import Link from "next/link";

interface Mail {
  _id: string;
  sender?: { _id: string; username: string };
  recipient?: { _id: string; username: string };
  subject: string;
  body: string;
  sentAt: string;
  read: boolean;
}

export default function InboxPage({ params }: { params: { session: string } | Promise<{ session: string }> }) {
  const [mails, setMails] = useState<Mail[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFolder, setCurrentFolder] = useState("inbox");
  const [marking, setMarking] = useState(false);
  
  // Compose form state
  const [composeData, setComposeData] = useState({ to: "", subject: "", body: "" });
  const [composing, setComposing] = useState(false);
  const [composeError, setComposeError] = useState<string | null>(null);
  const [composeSuccess, setComposeSuccess] = useState(false);

  useEffect(() => {
    async function fetchMails() {
      try {
        setLoading(true);
        setError(null);
        setSelectedMail(null);
        const sessionId = getSessionId();
        if (!sessionId) {
          setError("No session found");
          setLoading(false);
          return;
        }

        const endpoint = currentFolder === "sent" ? "mail_getSentMail" : "mail_getMail";
        const response = await sendmessage<{ mails: Mail[] }>(endpoint, {
          sessionID: sessionId,
        });

        setMails(response.mails || []);
      } catch (err) {
        console.error("Error fetching mails:", err);
        setError("Failed to load mails");
      } finally {
        setLoading(false);
      }
    }

    fetchMails();
  }, [currentFolder]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };

  const handleMarkAsRead = async (mailID: string) => {
    try {
      setMarking(true);
      const sessionId = getSessionId();
      if (!sessionId) return;

      await sendmessage("mail_markAsRead", {
        sessionID: sessionId,
        mailID: mailID,
      });

      // Update local state
      setMails((prevMails) =>
        prevMails.map((mail) =>
          mail._id === mailID ? { ...mail, read: true } : mail
        )
      );
      if (selectedMail?._id === mailID) {
        setSelectedMail({ ...selectedMail, read: true });
      }
    } catch (err) {
      console.error("Error marking mail as read:", err);
    } finally {
      setMarking(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setMarking(true);
      const sessionId = getSessionId();
      if (!sessionId) return;

      await sendmessage("mail_markAllAsRead", {
        sessionID: sessionId,
      });

      // Update local state
      setMails((prevMails) =>
        prevMails.map((mail) => ({ ...mail, read: true }))
      );
    } catch (err) {
      console.error("Error marking all as read:", err);
    } finally {
      setMarking(false);
    }
  };

  const handleSendMail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!composeData.to.trim() || !composeData.subject.trim() || !composeData.body.trim()) {
      setComposeError("Please fill in all fields");
      return;
    }

    try {
      setComposing(true);
      setComposeError(null);
      setComposeSuccess(false);

      const sessionId = getSessionId();
      if (!sessionId) {
        setComposeError("No session found");
        setComposing(false);
        return;
      }

      // Look up user by username to get their ID
      const userLookup = await sendmessage<{
        success: boolean;
        results: Array<{ _id: string; username: string }>;
      }>("data_lookup", {
        sessionID: sessionId,
        dataType: "User",
        filter: { username: composeData.to.trim() },
      });

      if (!userLookup.success || !userLookup.results || userLookup.results.length === 0) {
        setComposeError(`User "${composeData.to}" not found`);
        setComposing(false);
        return;
      }

      const recipientId = userLookup.results[0]._id;

      const response = await sendmessage<{ success: boolean; message: string }>("mail_sendMail", {
        sessionID: sessionId,
        recipientID: recipientId,
        subject: composeData.subject,
        content: composeData.body,
      });

      if (response.success) {
        setComposeSuccess(true);
        setComposeData({ to: "", subject: "", body: "" });
        // Refresh sent mail list
        setTimeout(() => {
          const endpoint = "mail_getSentMail";
          sendmessage<{ mails: Mail[] }>(endpoint, { sessionID: sessionId }).then((res) => {
            setMails(res.mails || []);
            setComposeSuccess(false);
          });
        }, 500);
      } else {
        setComposeError("Failed to send mail");
      }
    } catch (err) {
      console.error("Error sending mail:", err);
      setComposeError(err instanceof Error ? err.message : "Failed to send mail");
    } finally {
      setComposing(false);
    }
  };

  const truncateText = (text: string, length: number) => {
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  const filteredMails = mails
    .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
    .filter((mail) =>
      mail.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (mail.sender?.username?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()) ||
      (mail.recipient?.username?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()) ||
      mail.body.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const unreadCount = currentFolder === "inbox" ? mails.filter((m) => !m.read).length : 0;

  return (
    <main className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <div className="flex items-center gap-4 border-b border-border bg-surface px-6 py-3">
        <div className="flex items-center gap-2">
          <Inbox size={24} className="text-primary" />
          <h1 className="text-lg font-semibold">Mail</h1>
        </div>
        <button
          onClick={() => setCurrentFolder("sent")}
          className="ml-auto rounded-lg bg-primary px-3 py-2 text-primary-foreground hover:bg-primary/90 transition flex items-center gap-2"
          title="Compose"
        >
          <Edit size={18} />
        </button>
        
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-56 border-r border-border bg-surface">
          {/* Search */}
          <div className="border-b border-border p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search mail..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder-muted-foreground focus:border-primary focus:outline-none"
              />
              <Search size={16} className="absolute right-3 top-2.5 text-muted-foreground" />
            </div>
          </div>

          {/* Folders */}
          <nav className="space-y-1 p-2">
            <button
              onClick={() => setCurrentFolder("inbox")}
              className={`w-full flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition ${
                currentFolder === "inbox"
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-primary/5"
              }`}
            >
              <Inbox size={18} />
              <span className="flex-1 text-left">Inbox</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setCurrentFolder("sent")}
              className={`w-full flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition ${
                currentFolder === "sent"
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-primary/5"
              }`}
            >
              <Send size={18} />
              <span>Sent</span>
            </button>
          </nav>

          {/* Mark All as Read */}
          {currentFolder === "inbox" && unreadCount > 0 && (
            <div className="border-t border-border p-2">
              <button
                onClick={handleMarkAllAsRead}
                disabled={marking}
                className="w-full rounded-lg px-3 py-2 text-xs font-medium text-accent hover:bg-accent/10 transition disabled:opacity-50"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>

        {/* Mail List */}
        <div className="w-80 border-r border-border overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Loading messages...</p>
            </div>
          )}

          {error && (
            <div className="m-4 rounded-lg bg-red-100/10 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {!loading && filteredMails.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No messages found</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {mails.length === 0 ? "Your inbox is empty" : "Try a different search"}
              </p>
            </div>
          )}

          {!loading && filteredMails.length > 0 && (
            <div className="divide-y divide-border">
              {filteredMails.map((mail) => (
                <button
                  key={mail._id}
                  onClick={() => {
                    setSelectedMail(mail);
                    if (!mail.read) {
                      handleMarkAsRead(mail._id);
                    }
                  }}
                  className={`w-full border-l-2 p-4 text-left transition hover:bg-primary/5 ${
                    selectedMail?._id === mail._id
                      ? "border-l-primary bg-primary/5"
                      : "border-l-transparent"
                  } ${currentFolder === "inbox" && !mail.read ? "bg-accent/5" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-medium truncate ${!mail.read ? "font-semibold text-foreground" : "text-foreground"}`}>
                          {currentFolder === "sent"
                            ? mail.recipient?.username || "Unknown"
                            : mail.sender?.username || "Unknown"}
                        </p>
                        {!mail.read && currentFolder === "inbox" && (
                          <span className="h-2 w-2 rounded-full bg-accent flex-shrink-0"></span>
                        )}
                      </div>
                      <h3 className={`mt-1 text-sm truncate ${!mail.read ? "font-semibold" : "font-normal"}`}>
                        {mail.subject || "(No subject)"}
                      </h3>
                      <p className="mt-1 truncate text-xs text-muted-foreground">{truncateText(mail.body, 80)}</p>
                    </div>
                    <p className="flex-shrink-0 text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(mail.sentAt)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mail Detail or Compose */}
        <div className="flex-1 overflow-y-auto bg-background">
          {currentFolder === "sent" && !selectedMail ? (
            <div className="h-full flex flex-col p-6">
              <form onSubmit={handleSendMail} className="space-y-4 max-w-2xl">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Compose Message</h2>
                </div>

                {/* To Field */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">To</label>
                  <input
                    type="text"
                    value={composeData.to}
                    onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
                    placeholder="Recipient username"
                    disabled={composing || composeSuccess}
                    className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Subject Field */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                  <input
                    type="text"
                    value={composeData.subject}
                    onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                    placeholder="Email subject"
                    disabled={composing || composeSuccess}
                    className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Body Field */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                  <textarea
                    value={composeData.body}
                    onChange={(e) => setComposeData({ ...composeData, body: e.target.value })}
                    placeholder="Write your message here..."
                    disabled={composing || composeSuccess}
                    rows={8}
                    className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Error Message */}
                {composeError && (
                  <div className="rounded-lg bg-red-100/10 p-4 text-sm text-red-600">
                    {composeError}
                  </div>
                )}

                {/* Success Message */}
                {composeSuccess && (
                  <div className="rounded-lg bg-green-100/10 p-4 text-sm text-green-600">
                    Mail sent successfully!
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    disabled={composing || composeSuccess}
                    onClick={() => setComposeData({ to: "", subject: "", body: "" })}
                    className="rounded-lg px-4 py-2 text-sm font-medium border border-border hover:bg-primary/5 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    disabled={composing || composeSuccess}
                    className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {composing ? "Sending..." : composeSuccess ? "Sent!" : "Send"}
                  </button>
                </div>
              </form>
            </div>
          ) : selectedMail ? (
            <div className="h-full flex flex-col">
              {/* Detail Header */}
              <div className="border-b border-border bg-surface px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold">{selectedMail.subject}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {currentFolder === "sent" ? "To" : "From"}:{" "}
                      {currentFolder === "sent"
                        ? selectedMail.recipient?.username
                        : selectedMail.sender?.username}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(selectedMail.sentAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentFolder === "inbox" && (
                      <button
                        onClick={() => {
                          setSelectedMail(null);
                          setComposeData({ 
                            to: selectedMail.sender?.username || "", 
                            subject: `Re: ${selectedMail.subject}`, 
                            body: "" 
                          });
                          setCurrentFolder("sent");
                        }}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
                      >
                        Reply
                      </button>
                    )}
                    {currentFolder === "sent" && (
                      <button
                        onClick={() => setSelectedMail(null)}
                        className="rounded-lg px-4 py-2 text-sm font-medium border border-border hover:bg-primary/5 transition"
                      >
                        Back
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Detail Body */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="prose prose-sm max-w-none break-words text-foreground">
                  {selectedMail.body.split("\n").map((line, idx) => (
                    <p key={idx} className="whitespace-pre-wrap mb-2">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <Inbox size={48} className="text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">
                {currentFolder === "sent" ? "Sent folder is empty" : "Select a message to read"}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
