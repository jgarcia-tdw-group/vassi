"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "~/features/auth/hooks/useAuth";
import { ADMIN_USERS } from "~/utils/constants";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const { userName } = useAuth();
    console.log(userName())

    if (!ADMIN_USERS.includes(userName() || "")) {
        router.push("/");
        return <div>Loading...</div>;
    }

    return children;
}
