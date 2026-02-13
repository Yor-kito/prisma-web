"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { LibrarySystem } from "@/components/library/LibrarySystem";
import { GamificationPanel } from "@/components/gamification/GamificationPanel";
import { SmartSearch } from "@/components/search/SmartSearch";
import { EssayGenerator } from "@/components/tools/EssayGenerator";
import { Translator } from "@/components/tools/Translator";
import { StudyPlanner } from "@/components/planner/StudyPlanner";
import { PerformanceAnalysis } from "@/components/analytics/PerformanceAnalysis";
import { ThemeToggle } from "@/components/theme-toggle";
import {
    LayoutDashboard,
    Library,
    Trophy,
    Search,
    FileEdit,
    Languages,
    Calendar,
    BarChart3,
    Info
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold">PRISMA AI</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/about">
                            <Button variant="ghost" size="sm">
                                <Info className="h-4 w-4 mr-2" />
                                Sobre PRISMA
                            </Button>
                        </Link>
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <Tabs defaultValue="dashboard" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
                        <TabsTrigger value="dashboard" className="gap-2">
                            <LayoutDashboard className="h-4 w-4" />
                            <span className="hidden sm:inline">Dashboard</span>
                        </TabsTrigger>
                        <TabsTrigger value="library" className="gap-2">
                            <Library className="h-4 w-4" />
                            <span className="hidden sm:inline">Biblioteca</span>
                        </TabsTrigger>
                        <TabsTrigger value="gamification" className="gap-2">
                            <Trophy className="h-4 w-4" />
                            <span className="hidden sm:inline">Logros</span>
                        </TabsTrigger>
                        <TabsTrigger value="search" className="gap-2">
                            <Search className="h-4 w-4" />
                            <span className="hidden sm:inline">Buscar</span>
                        </TabsTrigger>
                        <TabsTrigger value="essay" className="gap-2">
                            <FileEdit className="h-4 w-4" />
                            <span className="hidden sm:inline">Ensayos</span>
                        </TabsTrigger>
                        <TabsTrigger value="translator" className="gap-2">
                            <Languages className="h-4 w-4" />
                            <span className="hidden sm:inline">Traductor</span>
                        </TabsTrigger>
                        <TabsTrigger value="planner" className="gap-2">
                            <Calendar className="h-4 w-4" />
                            <span className="hidden sm:inline">Planificador</span>
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="gap-2">
                            <BarChart3 className="h-4 w-4" />
                            <span className="hidden sm:inline">Análisis</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="dashboard" className="space-y-6">
                        <Dashboard />
                    </TabsContent>

                    <TabsContent value="library" className="space-y-6">
                        <LibrarySystem />
                    </TabsContent>

                    <TabsContent value="gamification" className="space-y-6">
                        <GamificationPanel />
                    </TabsContent>

                    <TabsContent value="search" className="space-y-6">
                        <SmartSearch />
                    </TabsContent>

                    <TabsContent value="essay" className="space-y-6">
                        <EssayGenerator />
                    </TabsContent>

                    <TabsContent value="translator" className="space-y-6">
                        <Translator />
                    </TabsContent>

                    <TabsContent value="planner" className="space-y-6">
                        <StudyPlanner />
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-6">
                        <PerformanceAnalysis />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
