import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {ThemeToggle} from "@/components/web/theme-toggle";

const Navbar = () => {
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
                        <Link href={"/"} className={buttonVariants({variant: "ghost"})}>
                            Blog
                        </Link>
                        <Link href={"/"} className={buttonVariants({variant: "ghost"})}>
                            Create
                        </Link>
                    </div>

                </div>
                <div className={"gap-4 flex"}>
                    <Link href="/auth/signup" className={buttonVariants()}>
                        Sign Up
                    </Link>
                    <Link href="/auth/login" className={buttonVariants({variant: "outline"})}>
                        Login
                    </Link>
                    <ThemeToggle/>
                </div>
            </nav>
        </header>
    )
}
export default Navbar
