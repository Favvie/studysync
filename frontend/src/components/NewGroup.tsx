import React from "react";
import { Plus } from "lucide-react";

export default function NewGroup() {
	return (
		<div>
			<div className=" bg-gray-400 text-white rounded-lg h-56 w-30 p-3 border border-gray-400 flex items-center justify-center">
				<Plus className="w-10 h-10" />
			</div>
			<h3 className="text-xl font-bold mt-2">Create</h3>
		</div>
	);
}
