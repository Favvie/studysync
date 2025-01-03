import HomeNavigation from "../components/homeNavigation";
import { BackgroundFirst } from "../components/reusables/background";

export default function Home() {
	return (
		<div className="relative min-h-screen">
			{/* First Section */}
			<section className="relative min-h-screen">
				<BackgroundFirst />
				<div className="absolute inset-0 z-10">
					<HomeNavigation />
					<div className="px-6 py-16 md:px-16 lg:px-32">
						<h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-snug">
							<span className="text-pink-500">Together</span>
							<br />
							WE STUDY STRONGER
						</h1>
						<p className="mt-6 text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed">
							StudySync transforms your independent study sessions into a shared
							learning experience. Connect with fellow students worldwide, stay
							motivated, and achieve your academic goals together. Create or join
							virtual study rooms and make every study session count.
						</p>
						<div className="mt-8 flex flex-wrap gap-4">
							<a
								href="#"
								className="bg-pink-500 text-white py-3 px-6 rounded-lg text-sm font-semibold hover:bg-pink-600 transition"
							>
								Join A Room Now
							</a>
						</div>
					</div>
					<div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-gray-400">
						<div className="text-center">
							<h2 className="text-2xl font-bold text-white">100k+</h2>
							<p className="mt-2">Hours Completed</p>
						</div>
						<div className="text-center">
							<h2 className="text-2xl font-bold text-white">200+</h2>
							<p className="mt-2">Tasks Completed</p>
						</div>
					</div>
					<div className="absolute bottom-0 left-0 w-full text-center text-white py-4">
						<div>
							<span className="text-sm">Scroll down to learn more</span>
							<div className="mt-2">
								<svg
									className="w-6 h-6 mx-auto animate-bounce"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 14l-7 7m0 0l-7-7m7 7V3"
									/>
								</svg>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Second Section */}
			<section className="relative min-h-screen bg-gray-900">
				<div className="absolute inset-0 z-10 px-6 py-16 md:px-16 lg:px-32">
					<h2 className="text-2xl md:text-3xl font-extrabold text-white">
						How It Works
					</h2>
					<div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 bg-black bg-opacity-50 p-8 rounded-lg">
						{[...Array(4)].map((_, index) => (
							<div className="flex gap-4 items-center" key={index}>
								<div className="bg-pink-500 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl">
									{index + 1}
								</div>
								<div>
									<h3 className="text-lg font-semibold text-white">
										{["Create a Room", "Set Goals", "Study Together", "Achieve Goals"][index]}
									</h3>
									<p className="text-gray-300">
										{[
											"Create a virtual study room and invite friends or join an existing room.",
											"Set study goals, track your progress, and motivate each other to stay on track.",
											"Study together in real-time, share resources, and help each other out.",
											"Stay motivated, complete tasks, and achieve your academic goals together.",
										][index]}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
