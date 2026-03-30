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
  Sparkles,
  Languages,
  FileEdit,
  ArrowRight,
  Map,
  StickyNote,
} from "lucide-react";

export default function Home() {
  const features = [
    { icon: MessageSquare, title: "Chat con tu profe IA", desc: "Pregunta lo que quieras, como si hablaras con un profesor.", color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: FileText, title: "Resúmenes automáticos", desc: "Sube un PDF y obtén un resumen listo para repasar.", color: "text-purple-500", bg: "bg-purple-500/10" },
    { icon: Brain, title: "Flashcards", desc: "Tarjetas de memoria generadas a partir de tus apuntes.", color: "text-pink-500", bg: "bg-pink-500/10" },
    { icon: CheckCircle2, title: "Exámenes de práctica", desc: "Ponte a prueba con preguntas adaptadas al temario.", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { icon: Headphones, title: "Podcast del tema", desc: "Escucha un resumen explicado mientras haces otras cosas.", color: "text-orange-500", bg: "bg-orange-500/10" },
    { icon: Map, title: "Mapa mental", desc: "Visualiza las conexiones entre conceptos de un vistazo.", color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { icon: Languages, title: "Traductor", desc: "Traduce apuntes o textos al instante.", color: "text-cyan-500", bg: "bg-cyan-500/10" },
    { icon: StickyNote, title: "Notas propias", desc: "Anota lo más importante sin salir del espacio de estudio.", color: "text-red-500", bg: "bg-red-500/10" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background">

      {/* ── Hero ── */}
      <section className="container mx-auto px-4 pt-20 pb-16 text-center flex flex-col items-center">

        {/* Logo / nombre */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <BookOpen className="h-8 w-8 text-primary-foreground" />
          </div>
          <span className="text-4xl font-extrabold tracking-tight">PRISMA</span>
        </div>

        <Badge variant="secondary" className="mb-5 px-4 py-1 text-sm gap-1">
          <Sparkles className="h-3.5 w-3.5" />
          Tu asistente de estudio con IA
        </Badge>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 max-w-3xl leading-tight">
          Estudia más inteligente,<br />
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            no más duro
          </span>
        </h1>

        <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          resúmenes, flashcards, exámenes y mucho más — en cuestión de segundos.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="h-14 gap-3 px-8 shadow-md rounded-2xl hover:scale-105 transition-transform">
            <Link href="#">
              <svg width="24" height="24" viewBox="0 0 384 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.5-68 35-15.1 17.5-27.5 46.1-24.6 75.6 27.2 2.1 56.6-14.9 68.6-38.1z"/>
              </svg>
              <div className="flex flex-col items-start leading-none">
                <span className="text-[0.65em] font-medium opacity-90 mb-1">Consíguelo en el</span>
                <span className="text-[1.1em] font-bold">App Store</span>
              </div>
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-14 gap-2 px-8 text-base rounded-2xl">
            <Link href="/dashboard">
              <Sparkles className="h-5 w-5" />
              Probar Demo Web
            </Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          Sin registro · Gratis para empezar
        </p>
      </section>

      {/* ── Features ── */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-2">
          Todo lo que necesitas para dominar cualquier tema
        </h2>
        <p className="text-muted-foreground text-center mb-10 text-sm">
          PRISMA convierte cualquier material de estudio en herramientas activas de aprendizaje.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <Card key={i} className="p-5 hover:shadow-md transition-shadow group cursor-default">
              <div className={`h-10 w-10 rounded-xl ${f.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <f.icon className={`h-5 w-5 ${f.color}`} />
              </div>
              <p className="font-semibold text-sm mb-1">{f.title}</p>
              <p className="text-muted-foreground text-xs leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Card className="p-10 max-w-xl mx-auto bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow">
            <BookOpen className="h-7 w-7 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">¿Preparado para tu próximo examen?</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Lleva PRISMA AI en tu bolsillo. Descarga la App en tu iPhone o iPad o prueba la versión web.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="gap-2 h-14">
              <Link href="#">
                <svg width="20" height="20" viewBox="0 0 384 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.5-68 35-15.1 17.5-27.5 46.1-24.6 75.6 27.2 2.1 56.6-14.9 68.6-38.1z"/>
                </svg>
                Descargar en App Store
              </Link>
            </Button>
          </div>
        </Card>
      </section>

      <footer className="container mx-auto px-4 pb-10 text-center text-sm text-muted-foreground">
        <div className="flex justify-center gap-6 mb-4">
          <Link href="/privacy" className="hover:underline">Privacidad</Link>
          <Link href="/terms" className="hover:underline">Términos de Uso (EULA)</Link>
          <Link href="#" className="hover:underline">Soporte</Link>
        </div>
        <p>© 2026 PRISMA AI. Todos los derechos reservados.</p>
      </footer>
    </main>
  );
}
