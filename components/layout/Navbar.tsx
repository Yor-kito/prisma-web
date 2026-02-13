"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function Navbar({ showBackButton = false }: { showBackButton?: boolean }) {
    const router = useRouter();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                {showBackButton && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push("/dashboard")}
                        className="mr-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver
                    </Button>
                )}

                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">PRISMA AI</h1>
                </div>

                <nav className="flex items-center space-x-6 text-sm font-medium">
                    <Link href="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        Inicio
                    </Link>
                    <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        Sobre PRISMA
                    </Link>
                </nav>

                <div className="ml-auto flex items-center space-x-4">
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
