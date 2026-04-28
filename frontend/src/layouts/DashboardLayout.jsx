import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ title, links, children }) => {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold">{title}</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">{user?.name}</span>
            <button onClick={logout} className="rounded bg-red-500 px-3 py-1 text-white">
              Logout
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 p-4 md:grid-cols-[220px,1fr]">
        <aside className="rounded-xl bg-white p-3 shadow">
          <nav className="space-y-1">
            {links.map((item) => (
              <Link key={item.to} to={item.to} className="block rounded px-3 py-2 hover:bg-slate-100">
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="rounded-xl bg-white p-4 shadow">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
