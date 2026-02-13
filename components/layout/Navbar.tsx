"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowLeft, BrainCircuit } from "lucide-react";
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

                <Link href="/dashboard" className="mr-8 flex items-center space-x-2 group">
                    <div className="p-1.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <BrainCircuit className="h-6 w-6 text-primary" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">PRISMA</span>
                </Link>

                <nav className="flex items-center space-x-8 text-sm font-medium">
                    <Link href="/dashboard" className="transition-colors hover:text-primary text-muted-foreground">
                        Inicio
                    </Link>
                    <Link href="/about" className="transition-colors hover:text-primary text-muted-foreground">
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
