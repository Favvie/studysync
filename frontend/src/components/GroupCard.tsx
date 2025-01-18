import React from "react";
import { CircleUserRound } from "lucide-react";

export default function GroupCard() {
	return (
		<div>
			<div className="rounded-lg h-56 w-30 p-3 border border-gray-600 group relative w-full">
				<CircleUserRound className="absolute top-2 left-2" />
				<div className="absolute inset-0 bg-black opacity-50 hidden group-hover:block rounded-lg"></div>
				<button className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 hidden group-hover:block bg-blue-500 text-white px-4 py-2 rounded">Join Room</button>
			</div>

			<h3 className="text-xl font-bold mt-2">Name of Study Group</h3>
			<p>3 Participants</p>
		</div>
	);
}
