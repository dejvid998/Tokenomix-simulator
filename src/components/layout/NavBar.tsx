
import { Home, BarChart2, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export const NavBar = () => {
  return (
    <nav className="border-b bg-white/50 backdrop-blur-xl dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-semibold text-zinc-900 dark:text-white">
              UnlockFi
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-sm text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors"
              >
                <Home size={18} />
                <span>Home</span>
              </Link>
              <span className="text-sm font-medium text-emerald-500 dark:text-emerald-400">
                Resomnium
              </span>
              <Link 
                to="/analytics" 
                className="flex items-center gap-2 text-sm text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors"
              >
                <BarChart2 size={18} />
                <span>Analytics</span>
              </Link>
              <Link 
                to="/docs" 
                className="flex items-center gap-2 text-sm text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors"
              >
                <FileText size={18} />
                <span>Documentation</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
