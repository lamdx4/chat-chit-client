import { ChevronDown } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router";
import messageLogo from "@/assets/message-logo.png";

export default function OuterLayout() {
  return (
    <div className=" bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-4 lg:px-8">
        <div>
          <img
            src={messageLogo}
            alt="Messenger Logo"
            width={40}
            height={40}
            className="w-10 h-10"
          />
        </div>
        <div className="hidden md:flex items-center gap-8">
          <button className="text-sm font-bold">Features ▾</button>
          <Link to="#" className="text-sm font-bold">
            Privacy and safety
          </Link>
          <NavLink to="#" className="text-sm font-bold">
            Desktop app
          </NavLink>
          <NavLink to="#" className="text-sm font-bold">
            For developers
          </NavLink>
          <NavLink to="#" className="text-sm font-bold">
            Help Centre
          </NavLink>
        </div>
      </nav>
      <Outlet />
      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between text-sm text-gray-500">
          <div>© ChatChit 2025</div>
          <div className="flex items-center gap-4">
            <NavLink to="#">Privacy Policy</NavLink>
            <NavLink to="#">Cookie Policy</NavLink>
            <NavLink to="#">Terms</NavLink>
            <button className="flex items-center gap-1">
              English (UK) <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
