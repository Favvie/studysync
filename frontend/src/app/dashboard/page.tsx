import { Button } from "@/components/ui/button";
import GroupCard from "@/src/components/GroupCard";
import NewGroup from "@/src/components/NewGroup";
import NewRoomModal from "@/src/components/NewRoomModal";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import React from "react";

const DashboardPage = () => {
	return (
		<div className="p-4">
			<h1 className="text-3xl font-bold">ALONE BUT NEVER LONELY</h1>

			<div className="py-10 space-x-4">
				<Dialog>
					<DialogTrigger asChild>
						<Button>Create a Room</Button>
					</DialogTrigger>
					<NewRoomModal />
				</Dialog>

				<Button>Join a Room</Button>
			</div>

			<div className="grid grid-cols-4 gap-4 mt-10">
				<Dialog>
					<DialogTrigger asChild>
						<NewGroup />
					</DialogTrigger>
					<NewRoomModal />
				</Dialog>
				<GroupCard />
				<GroupCard />
				<GroupCard />
				<GroupCard />
			</div>
		</div>
	);
};

export default DashboardPage;
