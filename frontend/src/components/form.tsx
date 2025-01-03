"use client";
import React from "react";
import { Button } from "@/src/components/ui/button";
import SignUpModal from "../components/reusables/SignUpModal";
import LoginModal from "../components/reusables/LoginModal";

export function SignUpForm() {
	const [isOpenSignUp, setIsOpenSignUp] = React.useState(false);

	return (
		<div className="flex-col gap-8 items-center">
			<main className="flex flex-col gap-8 items-center">
				<Button
					onClick={() => setIsOpenSignUp(!isOpenSignUp)}
					className="rounded-full"
				>
					Sign Up
				</Button>
				<SignUpModal
					isOpen={isOpenSignUp}
					onClose={() => setIsOpenSignUp(false)}
				/>
			</main>
		</div>
	);
}

export function LoginForm() {
	const [isOpenLogin, setIsOpenLogin] = React.useState(false);

	return (
		<div className="min-h-screen p-8">
			<main className="flex flex-col gap-8 items-center">
				<Button
					onClick={() => setIsOpenLogin(!isOpenLogin)}
					className="rounded-full"
				>
					Log In
				</Button>
				<LoginModal
					isOpen={isOpenLogin}
					onClose={() => setIsOpenLogin(false)}
				/>
			</main>
		</div>
	);
}
