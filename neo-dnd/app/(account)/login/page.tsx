"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { sendmessage } from "../../_serverInteraction/socket";
import { AuthCard } from "../AuthCard";
import { getSessionId } from "../../_serverInteraction/socket";
import { useRouter } from "next/navigation";
import { get } from "http";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();

	function isValidEmail(email: string): boolean {
		if (typeof email !== "string") return false;
		email = email.trim();
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
		return emailPattern.test(email);
	}

	async function handleLogin(e: FormEvent) {
		e.preventDefault();
		if (!isValidEmail(email)) {
			alert("Please enter a valid email address.");
			return;
		}

		try {
			const response = await sendmessage<{ success: boolean; message: string; userId?: string }>(
				"account/login",
				{ email, password }
			);

			if (response.success) {
				if (response.userId) {
					const sessionIDresponse = await sendmessage<{ success: boolean; message: string; sessionId?: string }>(
						"account_sessionID",
						{ sessionID: getSessionId() || "", userId: response.userId }
					);

					if (!sessionIDresponse.success) {
                        alert(`Login failed: ${sessionIDresponse.message}`);
                        return;
                    }
					const sid = getSessionId() || "";
					router.push(sid ? `/${sid}` : "/");
                    }

                    
			} else {
				alert(`Login failed: ${response.message}`);
			}
		} catch (error) {
			if (error instanceof Error) {
				alert(`Login failed: ${error.message}`);
			} else {
				alert("Login failed: An unknown error occurred.");
			}
		}
	}

	return (
		<AuthCard
			title="Welcome back"
			subtitle="Sign in to continue your campaign, manage your characters, and pick up where you left off."
			submitLabel="Sign In"
			footerText="Don't have an account?"
			footerLinkLabel="Register"
			footerHref="/signup"
			email={email}
			password={password}
			setEmail={setEmail}
			setPassword={setPassword}
			isValidEmail={isValidEmail}
			onSubmit={handleLogin}
		/>
	);
}
