import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/src/components/ui/form";
import { Dialog, DialogContent } from "@/src/components/ui/dialog";
import { cn } from "@/lib/utils";

type TProps = {
	isOpen: boolean;
	onClose: () => void;
	text?: string;
};

const formSchema = z.object({
	username: z.string().min(1, {
		message: "Username is required",
	}),
	password: z.string().min(1, {
		message: "Password is required",
	}),
});

const LoginModal = ({ isOpen, onClose }: TProps) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			// const res = await registerUser(values); // register the user
			// if (res?.message === "User registered") {
			// 	onClose();
			// 	form.reset();
			// 	form.resetField("password");
			// 	form.resetField("username");
			// }
			return { ...values };
		} catch (err) {
			// Handle error without reloading the page
			console.error("Login failed:", err);
		}
	}
	return (
		<Dialog
			open={isOpen}
			onOpenChange={onClose}
			modal={true}
			// onClose={() => {
			// 	// setShowPasswordInput(false);
			// 	onClose();
			// }}
		>
			<DialogContent className={cn(`sm:max-w-lg !max-w-[400px] bg-black border-[#2a2a2a] px-7 pb-8 !z-[9999]`)}>
				<div className="relative">
					<h3 className="text-white">Log In</h3>

					<div
						onSubmit={form.handleSubmit(onSubmit)}
						className="mt-6">
						<Form {...form}>
							<form className="space-y-6 relative">
								<FormField
									control={form.control}
									name="username"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													placeholder="Enter your username"
													value={form.getValues("username")}
													onChange={field.onChange}
													className="bg-black text-white"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="password"
									render={({ field }) => {
										return (
											<FormItem>
												<FormControl>
													<Input
														placeholder="Password"
														type="password"
														className="bg-black text-white"
														value={form.getValues("password")}
														onChange={field.onChange}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										);
									}}
								/>
								<Button
									type="submit"
									onClick={form.handleSubmit(onSubmit)}
									// disabled={isPending || !isConnected}
									className="bg-white text-black w-full hover:text-white">
									{/* {isPending ? <Spinner className="h-4 w-4" /> : "Submit"} */}
									Log in
								</Button>
							</form>
						</Form>
					</div>
					<div className="mt-6 text-gray-500 flex items-center gap-4">
						<div className="border basis-full border-gray-700"></div>
						<h5 className="">AND</h5>
						<div className="border basis-full border-gray-700"></div>
					</div>
					<div className="mt-6">
						<Button className="w-full">Log In with Google</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default LoginModal;
