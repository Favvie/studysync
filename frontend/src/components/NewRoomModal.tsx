"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { UploadCloud } from "lucide-react";

export default function NewRoomModal() {
	const [image, setImage] = useState<string | null>(null);

	const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => setImage(e.target?.result as string);
			reader.readAsDataURL(file);
		}
	};
	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Create a Room</DialogTitle>
				<DialogDescription>Creating a study room allows you to collaborate with others in real time.</DialogDescription>
			</DialogHeader>

			<div className="grid gap-4 py-4">
				<div className="grid grid-cols-4 items-center gap-4">
					<Input
						id="name"
						defaultValue={"Enter Room Name"}
						className="col-span-4"
						placeholder="Enter Room Name"
					/>
				</div>
			</div>

			<div className="items-top flex space-x-2 ">
				<Checkbox id="private" />
				<div className="grid gap-1.5 leading-none">
					<label
						htmlFor="private"
						className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						Private
					</label>
				</div>
			</div>

			<Card className="w-full max-w-md p-6 space-y-4">
				<div className="flex items-center justify-center w-full">
					<label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
						<div className="flex flex-col items-center justify-center pt-5 pb-6">
							<UploadCloud className="w-8 h-8 mb-4 text-gray-500" />
							<p className="mb-2 text-sm text-gray-500">
								<span className="font-semibold">Click to upload</span> or drag and drop
							</p>
						</div>
						<Input
							type="file"
							className="hidden"
							accept="image/*"
							onChange={handleUpload}
						/>
					</label>
				</div>

				{image && (
					<div className="relative w-full h-48">
						<Image
							src={image}
							alt="Preview"
							fill
							className="rounded-lg object-cover"
						/>
					</div>
				)}
			</Card>

			<DialogFooter>
				<Button type="submit">Create Room</Button>
			</DialogFooter>
		</DialogContent>
	);
}
