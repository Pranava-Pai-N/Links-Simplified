"use client";

import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";


export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();


    useEffect(() => {
        if (status === "authenticated") {
            router.push("/sign-in")
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-sm font-medium text-slate-500">Verifying session...</p>
            </div>
        );
    }

    if(status === "authenticated"){
        return <>{children}</>
    }
    return null;
}