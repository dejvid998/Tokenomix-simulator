
import { Link } from "react-router-dom";
import { Home, LineChart, Brain, FileText, Settings } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  tooltip: string;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
    tooltip: "Main Dashboard"
  },
  {
    title: "Simulation",
    href: "/simulation",
    icon: LineChart,
    tooltip: "Token Unlock & Vesting Charts"
  },
  {
    title: "AI Insights",
    href: "/insights",
    icon: Brain,
    tooltip: "AI-Powered Recommendations"
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
    tooltip: "Generate Reports"
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    tooltip: "Multi-chain Settings"
  }
];

export function MainNav() {
  return (
    <nav className="flex h-16 items-center px-4 md:px-6 gap-6 md:gap-8">
      <Link 
        to="/" 
        className="hidden md:flex items-center gap-2 text-lg font-semibold"
      >
        <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          UnlockFi
        </span>
      </Link>
      <TooltipProvider>
        <div className="flex items-center gap-4 md:gap-6">
          {navItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
                    "group rounded-lg px-3 py-2",
                    "hover:bg-accent/50",
                    "active:scale-95"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="hidden md:inline-block">{item.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </nav>
  );
}
