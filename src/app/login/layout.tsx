"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "~/features/auth/hooks/useAuth";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    if (isAuthenticated()) {
        router.push("/");
        return <div>User is already logged in. Redirecting...</div>;
    }

    return children;
}
