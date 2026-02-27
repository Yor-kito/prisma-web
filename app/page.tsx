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
          Sube tus apuntes o PDFs y deja que PRISMA los convierta en
          resúmenes, flashcards, exámenes y mucho más — en segundos.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="gap-2 px-8 text-base shadow-md">
            <Link href="/dashboard">
              <BookOpen className="h-5 w-5" />
              Empezar a estudiar
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2 px-8 text-base">
            <Link href="/workspace/demo">
              <Sparkles className="h-5 w-5" />
              Ver cómo funciona
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
            Sube tus apuntes ahora y empieza a estudiar de manera efectiva con IA.
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link href="/dashboard">
              Empezar a estudiar
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Card>
      </section>
    </main>
  );
}
