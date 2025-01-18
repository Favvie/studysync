import React from "react";
import { ClipboardPlus, NotebookPen, Notebook, Users, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import NewRoomModal from "@/src/components/NewRoomModal";

const Sidebar = () => {
	return (
		<div className="bg-foreground text-background h-screen p-4">
			<h1 className="text-xl font-bold text-center">STUDYSYNC</h1>

			<div className="flex flex-col gap-10 mt-7 items-center">
				<div>
					<Dialog>
						<DialogTrigger asChild>
							<div className="cursor-pointer">
								<ClipboardPlus className="w-10 h-10" />
								<p>Create</p>
							</div>
						</DialogTrigger>
						<NewRoomModal />
					</Dialog>
				</div>

				<Link href={"/dashboard"}>
					<NotebookPen className="w-10 h-10" />
					<p>Task</p>
				</Link>

				<div>
					<Notebook className="w-10 h-10" />
					<p>Notes</p>
				</div>

				<div>
					<Users className="w-10 h-10" />
					<p>Friends</p>
				</div>

				<div>
					<MessageCircle className="w-10 h-10" />
					<p>Chats</p>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
