import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LINKS = [{ to: "/", label: "Home", end: true }, { to: "/contact", label: "Contact us", end: false }];

export default function PublicLayout() {
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b bg-card/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground"><Sparkles className="size-4" /></div>
            <span className="font-semibold tracking-tight">SupportIQ</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end}
                className={({ isActive }) => cn("transition-colors", isActive ? "font-medium text-primary" : "text-muted-foreground hover:text-foreground")}>{l.label}</NavLink>
            ))}
          </nav>  
          <Link to="/login" className={buttonVariants({ variant: "outline", size: "sm", className: "ml-auto" })}>Staff login</Link>
        </div>
      </header>
      <motion.main key={pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex-1">
        <Outlet />
      </motion.main>
      <footer className="border-t bg-card py-6 text-center text-sm text-muted-foreground">© {new Date().getFullYear()} SupportIQ. All rights reserved.</footer>
    </div>
  );
}
