import Sidebar from "@/components/Sidebar";
import React from "react";
import { Bell, CircleUserRound, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex">
			<div className="w-[11%] fixed">
				<Sidebar />
			</div>
			<div className="ml-[11%] flex-1 p-4">
				<div className="flex items-center gap-2 w-full justify-end">
					<Bell />
					<CircleUserRound className="w-10 h-10" />
					<DropdownMenu>
						<DropdownMenuTrigger>
							<div className="flex space-x-2">
								<span>FavourPrecious</span>
								<ChevronDown />
							</div>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="mt-5">
							<DropdownMenuLabel>My Profile</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Change Password</DropdownMenuItem>
							<DropdownMenuItem>Notification Settings</DropdownMenuItem>
							<DropdownMenuItem>Delete Account</DropdownMenuItem>
							<DropdownMenuItem>Logout</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				{children}{" "}
			</div>
		</div>
	);
}
