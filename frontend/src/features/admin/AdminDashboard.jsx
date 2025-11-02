import { NavLink, Outlet } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[220px_1fr]">
      <aside className="border-r p-4 space-y-3">
        <h1 className="font-semibold text-lg">Admin</h1>
        <nav className="flex md:flex-col gap-2">
          <NavLink to="dashboard" className="underline">
            Dashboard
          </NavLink>
          <NavLink to="users" className="underline">
            Nutzer
          </NavLink>
          {/* <NavLink to="orders" className="underline">Bestellungen</NavLink> */}
          <NavLink to="products" className="underline">
            Produkte
          </NavLink>
          <NavLink to="orders" className="underline">
            Bestellungen
          </NavLink>
        </nav>
      </aside>
      <main className="p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
