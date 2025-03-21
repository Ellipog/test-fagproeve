import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-xl font-bold">FileHub</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                  Dashboard
                </Link>
                <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                  My Files
                </Link>
                <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                  Categories
                </Link>
                <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                  Settings
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <button className="bg-primary hover:bg-blue-600 px-4 py-2 rounded-md text-sm font-medium">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 