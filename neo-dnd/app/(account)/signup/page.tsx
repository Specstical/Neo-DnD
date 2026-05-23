"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { sendmessage, getSessionId } from "../../_serverInteraction/socket";
import { AuthCard } from "../AuthCard";

export default function Signup() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	function isValidEmail(email: string): boolean {
		if (typeof email !== "string") return false;
		email = email.trim();
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
		return emailPattern.test(email);
	}

	async function handleSignup(e: FormEvent) {
		e.preventDefault();
		if (!isValidEmail(email)) {
			alert("Please enter a valid email address.");
			return;
		}

		try {
			const response = await sendmessage<{ success: boolean; message: string; userId?: string }>(
				"account/signup",
				{ email, password }
			);

			if (!response.success) {
				alert(`Signup failed: ${response.message}`);
				return;
			}

			if (response.userId) {
				const sessionIDresponse = await sendmessage<{ success: boolean; message: string; sessionId?: string }>(
					"account_sessionID",
					{ sessionID: getSessionId() || "", userId: response.userId }
				);
				if (!sessionIDresponse.success) {
					alert(`Signup failed: ${sessionIDresponse.message}`);
					return;
				}
			}

			alert("Signup successful!");
			setEmail("");
			setPassword("");
		} catch (error) {
			if (error instanceof Error) {
				alert(`Signup failed: ${error.message}`);
			} else {
				alert("Signup failed: An unknown error occurred.");
			}
		}
	}

	return (
		<AuthCard
			title="Create your account"
			subtitle="Join Neo-DnD to save your campaign details, keep your session data in sync, and get back into the game faster."
			submitLabel="Sign Up"
			footerText="Already have an account?"
			footerLinkLabel="Log in"
			footerHref="/login"
			email={email}
			password={password}
			setEmail={setEmail}
			setPassword={setPassword}
			isValidEmail={isValidEmail}
			onSubmit={handleSignup}
		/>
	);
}
