"use client";
import { LogOut, LogIn } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";


function NavBar() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const _router = useRouter();

  const handleSignOut = async () => {
    const data = await signOut({ redirect: false, callbackUrl: "/" });
    toast.success("Logged out successfully. See you soon.");
    window.location.href = data.url;
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Link
          href={"/"}
          className="font-semibold text-slate-900 tracking-tight"
        >
          Links Simplified
        </Link>
      </div>

      {status === "loading" ? (
        <div className="h-8 w-20 bg-slate-100 animate-pulse rounded-lg"></div>
      ) : user ? (
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-900">
              {user.name || "Developer"}
            </p>
            <p className="text-xs text-slate-500 truncate max-w-45">
              {user.email}
            </p>
          </div>
          {user.image ? (
            <img
              src={user?.image}
              alt="User Imahge"
              className="h-8 w-8 rounded-full border border-slate-200"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">
              {user.name ? user.name[0].toUpperCase() : "U"}
            </div>
          )}
          <button
            onClick={handleSignOut}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50 transition-colors"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <Link
          href={"/sign-in"}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs px-4 py-2 rounded-xl active:scale-[0.98] transition-all shadow-sm"
        >
          <LogIn className="h-3.5 w-3.5" />
          Sign In
        </Link>
      )}
    </header>
  );
}

export default NavBar;
