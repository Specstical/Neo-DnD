"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { applyTheme, THEME_STORAGE_KEY } from "../../theme-provider";

const THEMES = [
	{
		id: "light",
		label: "Sunlit",
		description: "Warm parchment surfaces with a calm, classic look.",
	},
	{
		id: "dark",
		label: "Midnight",
		description: "Low-light mode for late sessions and high contrast.",
	},
	{
		id: "forest",
		label: "Forest",
		description: "Natural tones with a green-forward fantasy palette.",
	},
] as const;

type ThemeId = (typeof THEMES)[number]["id"];

export default function SettingsPage() {
	const [theme, setTheme] = useState<ThemeId>("light");

	useEffect(() => {
		const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY) as ThemeId | null;

		if (storedTheme && THEMES.some((option) => option.id === storedTheme)) {
			setTheme(storedTheme);
			applyTheme(storedTheme);
		}
	}, []);

	const handleThemeChange = (nextTheme: ThemeId) => {
		setTheme(nextTheme);
		window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
		applyTheme(nextTheme);
	};

	return (
		<main className="min-h-screen bg-background px-6 py-10 text-foreground md:px-8">
			<section className="mx-auto max-w-4xl rounded-3xl border border-border bg-surface p-6 shadow-lg shadow-black/5 md:p-10">
				<p className="text-sm uppercase tracking-[0.35em] text-muted">Settings</p>
				<h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
					Theme
				</h1>
				<p className="mt-4 max-w-2xl text-base leading-7 text-muted md:text-lg">
					Choose a theme for the app. <br />This is separate from Game theming and only applies to the website UI.
				</p>

				<div className="mt-8 grid gap-2">
					{THEMES.map((option) => {
						const selected = option.id === theme;

						return (
							<button
								key={option.id}
								type="button"
								onClick={() => handleThemeChange(option.id)}
								className={`flex items-start justify-between rounded-2xl border px-5 py-4 text-left transition ${
									selected
										? "border-primary bg-primary/10"
										: "border-border bg-background hover:bg-accent/10"
								}`}
							>
								<div>
									<div className="text-lg font-medium">{option.label}</div>
									<p className="mt-1 text-sm leading-6 text-muted">{option.description}</p>
								</div>
								<span
									className={`ml-4 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] ${
										selected ? "bg-primary text-primary-foreground" : "bg-border text-foreground"
									}`}
								>
									{selected ? "Active" : "Choose"}
								</span>
							</button>
						);
					})}
				</div>
			</section>
		</main>
	);
}
