import { Link, useLocation } from "react-router-dom";
import { Home, Users, Calendar, Coins, BookOpen, TrendingUp, Megaphone, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/social", icon: Users, label: "Social" },
  { path: "/events", icon: Calendar, label: "Event" },
  { path: "/learn", icon: BookOpen, label: "Learn" },
  { path: "/crypto", icon: Coins, label: "Crypto" },
  { path: "/investment", icon: TrendingUp, label: "Invest" },
  { path: "/adverts", icon: Megaphone, label: "Advert" },
  { path: "/profile", icon: User, label: "Profile" }
];

export const BottomNavigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="grid grid-cols-8 h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center text-xs transition-colors",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};