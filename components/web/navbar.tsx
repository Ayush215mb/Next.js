"use client"

import Link from "next/link";
import {Button, buttonVariants} from "@/components/ui/button";
import {ThemeToggle} from "@/components/web/theme-toggle";
import {useConvexAuth} from "convex/react";
import {authClient} from "@/lib/auth-client";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

const Navbar = () => {
    const router = useRouter()
    const {isAuthenticated, isLoading} = useConvexAuth();

    return (
        <header>
            <nav className={" w-full py-5 px-4 flex justify-between"}>
                <div className={"flex"}>
                    <div>
                        <Link href="/">
                            <h1 className={"text-white font-semibold text-2xl  text-shadow-2xl "}>
                                Nav
                                <span className={"text-blue-500 italic "}> Bar</span>
                            </h1>
                        </Link>
                    </div>

                    <div className={""}>
                        <Link href={"/"} className={buttonVariants({variant: "ghost"})}>
                            Home
                        </Link>
                        <Link href={"/blog"} className={buttonVariants({variant: "ghost"})}>
                            Blog
                        </Link>
                        <Link href={"/create"} className={buttonVariants({variant: "ghost"})}>
                            Create
                        </Link>
                    </div>

                </div>
                <div className={"gap-4 flex"}>
                    {isLoading ? null : isAuthenticated ? (
                        <Button
                            onClick={() =>
                                authClient.signOut({
                                    fetchOptions: {
                                        onSuccess: () => {
                                            toast.success("Logged out successfully");
                                            router.push("/");
                                        },
                                        onError: (error) => {
                                            toast.error(error.error.message);
                                        },
                                    },
                                })
                            }
                        >
                            Logout
                        </Button>
                    ) : (
                        <>
                            <Link className={buttonVariants()} href="/auth/sign-up">
                                Sign up
                            </Link>
                            <Link
                                className={buttonVariants({variant: "outline"})}
                                href="/auth/login"
                            >
                                Login
                            </Link>
                        </>
                    )}
                    <ThemeToggle/>
                </div>
            </nav>
        </header>
    )
}
export default Navbar
