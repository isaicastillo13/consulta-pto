import {Link, useLocation} from "react-router-dom";

export default function NavLink({ to, children, className = "" }) {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
         <Link
      to={to}
      className={`px-2 py-2 rounded transition ${className}`}
      style={{ color: "#3559a1" }}
    >
      {children}
    </Link>
    );
}