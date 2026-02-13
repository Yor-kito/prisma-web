import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  MessageSquare,
  FileText,
  Headphones,
  Brain,
  CheckCircle2,
  Trophy,
  Languages,
  FileEdit,
  ArrowRight
} from "lucide-react";

export default function Home() {
  const features = [
    { icon: MessageSquare, title: "Chat Socrático", color: "text-blue-500" },
    { icon: FileText, title: "Resúmenes", color: "text-purple-500" },
    { icon: Brain, title: "Flashcards", color: "text-pink-500" },
    { icon: CheckCircle2, title: "Exámenes", color: "text-emerald-500" },
    { icon: Headphones, title: "Podcasts", color: "text-orange-500" },
    { icon: Trophy, title: "Gamificación", color: "text-yellow-500" },
    { icon: Languages, title: "Traductor", color: "text-cyan-500" },
    { icon: FileEdit, title: "Ensayos", color: "text-red-500" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-muted/50 to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-24 text-center">
        <Badge variant="secondary" className="mb-4">
          🎓 Tu Profesor Virtual Personal
        </Badge>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          PRISMA AI
        </h1>
        <p className="text-muted-foreground mb-8 text-xl max-w-2xl mx-auto">
          Aprende con inteligencia artificial. Sube PDFs, genera resúmenes,
          crea exámenes y domina cualquier materia con tu asistente educativo.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button asChild size="lg" className="gap-2">
            <Link href="/dashboard">
              Ir al Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/about">Conocer más</Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/workspace/demo">Probar Demo</Link>
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Todo lo que necesitas para estudiar
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
              <feature.icon className={`h-8 w-8 mx-auto mb-3 ${feature.color}`} />
              <p className="font-medium text-sm">{feature.title}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <Card className="p-12 max-w-2xl mx-auto bg-gradient-to-br from-primary/10 to-primary/5">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para mejorar tus resultados?
          </h2>
          <p className="text-muted-foreground mb-6">
            Únete a miles de estudiantes que ya están aprendiendo mejor con PRISMA AI
          </p>
          <Button asChild size="lg">
            <Link href="/dashboard">Comenzar Ahora</Link>
          </Button>
        </Card>
      </div>
    </main>
  );
}
