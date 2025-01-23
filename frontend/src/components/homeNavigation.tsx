export default function HomeNavigation() {
    return (
        <nav className="top-0 left-0 w-full bg-[#021526] shadow-md z-50">
            <div className="container mx-auto px-10 py-6 flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center">
                    <div className="text-2xl font-extrabold text-pink-500">StudySync</div>
                </div>

                {/* Button */}
                <div>
                    <a
                        href="#"
                        className="text-white px-6 py-3 text-xs bg-pink-500 rounded-full hover:bg-pink-600 transition-colors duration-300"
                    >
                        LETS GO!
                    </a>
                </div>
            </div>
        </nav>
    );
}
