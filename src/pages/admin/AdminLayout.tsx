import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, LogOut } from "lucide-react";
import { AuthProvider, useAuth, useIsStaff } from "@/lib/auth";
import { COLLECTIONS, COLLECTION_ORDER } from "@/lib/admin/collections";
import { useSeo } from "@/lib/seo";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", label: "Enquiries", end: true },
  ...COLLECTION_ORDER.map((key) => ({
    to: `/admin/${key}`,
    label: COLLECTIONS[key].title,
    end: false,
  })),
  { to: "/admin/settings", label: "Studio Settings", end: false },
];

const Shell = () => {
  const { user, loading, signOut } = useAuth();
  const staff = useIsStaff();

  useSeo({ title: "Studio Admin", path: "/admin", noindex: true });

  if (loading || (user && staff.isPending)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return <SignIn />;

  if (!staff.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
        <div className="max-w-sm">
          <h1 className="font-serif text-h2 text-foreground">Not a studio account</h1>
          <p className="mt-4 text-caption text-muted-foreground">
            {user.email} doesn't have access. Ask an administrator to add you, then sign in again.
          </p>
          <button
            type="button"
            onClick={() => void signOut()}
            className="focus-ring mt-8 border border-hairline px-5 py-2.5 text-[10px] uppercase tracking-[0.24em] text-foreground hover:border-foreground"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-hairline">
        <div className="container-edge flex h-16 items-center justify-between">
          <Link to="/" className="focus-ring font-serif text-lg tracking-[0.18em]">
            JECMWA
            <span className="ml-3 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              Studio
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-caption text-muted-foreground sm:block">{user.email}</span>
            <button
              type="button"
              onClick={() => void signOut()}
              aria-label="Sign out"
              className="focus-ring p-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="container-edge grid grid-cols-1 gap-10 py-10 lg:grid-cols-12 lg:gap-14">
        <nav className="lg:col-span-3" aria-label="Admin">
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-0">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      "focus-ring block border px-4 py-2.5 text-[10px] uppercase tracking-[0.22em] transition-colors lg:border-0 lg:border-b lg:border-hairline lg:px-0 lg:py-3",
                      isActive
                        ? "border-foreground bg-foreground text-background lg:bg-transparent lg:text-accent"
                        : "border-hairline text-muted-foreground hover:text-foreground",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <main className="lg:col-span-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const SignIn = () => {
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-4">
          <span className="hairline" />
          <span className="eyebrow">Studio Admin</span>
        </div>
        <h1 className="font-serif text-h2 text-foreground">
          Sign in to <span className="font-light italic">the studio.</span>
        </h1>

        {sent ? (
          <p className="mt-8 text-[15px] leading-[1.85] text-muted-foreground">
            Check <span className="text-foreground">{email}</span> for a sign-in link. It expires in
            an hour.
          </p>
        ) : (
          <form
            className="mt-8"
            onSubmit={async (event) => {
              event.preventDefault();
              setBusy(true);
              try {
                await signInWithEmail(email.trim());
                setSent(true);
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Couldn't send the link.");
              } finally {
                setBusy(false);
              }
            }}
          >
            <label htmlFor="admin-email" className="eyebrow mb-2 block">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-hairline bg-transparent py-3 text-[15px] text-foreground outline-none focus:border-foreground"
              placeholder="you@jecmwa.com"
            />
            <button
              type="submit"
              disabled={busy}
              className="focus-ring mt-8 inline-flex w-full items-center justify-center gap-2 bg-foreground px-6 py-3.5 text-[10px] uppercase tracking-[0.24em] text-background transition-colors hover:bg-accent disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              Send a sign-in link
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export const AdminLayout = () => (
  <AuthProvider>
    <Shell />
  </AuthProvider>
);

export default AdminLayout;
