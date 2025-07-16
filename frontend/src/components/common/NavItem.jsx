import { Link, useLocation } from "react-router-dom";

export default function NavItem({ to, label }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to}>
      <span
        className={`relative inline-block font-medium transition-all duration-200
          after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-red-600
          after:transition-transform after:duration-300 after:origin-left
          ${isActive
            ? "after:w-full"
            : "after:w-0 hover:after:w-full"
          }`}
      >
        {label}
      </span>
    </Link>
  );
}
