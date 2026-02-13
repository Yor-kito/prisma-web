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
    Target,
    Users,
    Zap
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    const features = [
        {
            icon: MessageSquare,
            title: "Chat Socrático",
            description: "Aprende mediante preguntas y respuestas. La IA te guía para que descubras las respuestas por ti mismo.",
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
        },
        {
            icon: FileText,
            title: "Resúmenes Inteligentes",
            description: "Genera resúmenes automáticos de cualquier documento. Extrae los puntos clave en segundos.",
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
        },
        {
            icon: Brain,
            title: "Flashcards",
            description: "Crea tarjetas de estudio automáticamente de tus apuntes. Repasa de forma efectiva.",
            color: "text-pink-500",
            bgColor: "bg-pink-500/10",
        },
        {
            icon: CheckCircle2,
            title: "Exámenes Tipo Test",
            description: "Genera exámenes de práctica personalizados. Evalúa tu conocimiento y prepárate para el éxito.",
            color: "text-emerald-500",
            bgColor: "bg-emerald-500/10",
        },
        {
            icon: Headphones,
            title: "Podcast de Estudio",
            description: "Convierte tus apuntes en audio. Estudia mientras haces ejercicio, viajas o te relajas.",
            color: "text-orange-500",
            bgColor: "bg-orange-500/10",
        },
        {
            icon: BookOpen,
            title: "Mapas Mentales",
            description: "Visualiza conceptos complejos con diagramas interactivos. Conecta ideas y entiende relaciones.",
            color: "text-cyan-500",
            bgColor: "bg-cyan-500/10",
        },
    ];

    const stats = [
        { value: "10K+", label: "Estudiantes Activos" },
        { value: "95%", label: "Tasa de Aprobación" },
        { value: "24/7", label: "Disponibilidad" },
        { value: "6", label: "Herramientas IA" },
    ];

    const values = [
        {
            icon: Target,
            title: "Aprendizaje Personalizado",
            description: "Cada estudiante es único. PRISMA se adapta a tu ritmo y estilo de aprendizaje.",
        },
        {
            icon: Sparkles,
            title: "IA de Última Generación",
            description: "Utilizamos los modelos de IA más avanzados para ofrecerte la mejor experiencia educativa.",
        },
        {
            icon: Users,
            title: "Comunidad de Aprendizaje",
            description: "Únete a miles de estudiantes que ya están mejorando sus resultados académicos.",
        },
        {
            icon: Zap,
            title: "Resultados Rápidos",
            description: "Optimiza tu tiempo de estudio y alcanza tus objetivos académicos más rápido.",
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="border-b">
                <div className="container mx-auto px-4 py-16 md:py-24">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <Badge variant="secondary" className="mb-4">
                            🎓 Sobre PRISMA AI
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                            El Futuro del <span className="text-primary">Aprendizaje</span>
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            PRISMA AI es tu profesor virtual personal que utiliza inteligencia artificial
                            y el método socrático para ayudarte a dominar cualquier materia.
                        </p>
                        <div className="flex gap-4 justify-center pt-4">
                            <Link href="/">
                                <Button size="lg">
                                    Comenzar Ahora
                                </Button>
                            </Link>
                            <Link href="/#features">
                                <Button size="lg" variant="outline">
                                    Ver Características
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="border-b bg-muted/50">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <p className="text-4xl font-bold mb-2">{stat.value}</p>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission */}
            <section className="container mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto text-center space-y-4">
                    <h2 className="text-3xl font-bold">Nuestra Misión</h2>
                    <p className="text-lg text-muted-foreground">
                        Democratizar el acceso a una educación de calidad mediante tecnología de
                        inteligencia artificial. Creemos que cada estudiante merece tener un profesor
                        personal disponible 24/7 que se adapte a su forma única de aprender.
                    </p>
                </div>
            </section>

            {/* Features Grid */}
            <section className="border-t bg-muted/30">
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Características Principales</h2>
                        <p className="text-muted-foreground">
                            Todo lo que necesitas para dominar cualquier materia
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                                <div className={`p-3 rounded-lg ${feature.bgColor} w-fit mb-4`}>
                                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                                </div>
                                <h3 className="font-semibold mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {feature.description}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Nuestros Valores</h2>
                    <p className="text-muted-foreground">
                        Lo que nos hace diferentes
                    </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {values.map((value, index) => (
                        <div key={index} className="flex gap-4">
                            <div className="shrink-0">
                                <div className="p-3 rounded-lg bg-primary/10">
                                    <value.icon className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">{value.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {value.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="border-t bg-muted/50">
                <div className="container mx-auto px-4 py-16 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        ¿Listo para Transformar tu Aprendizaje?
                    </h2>
                    <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Únete a miles de estudiantes que ya están mejorando sus resultados con PRISMA AI
                    </p>
                    <Link href="/">
                        <Button size="lg">
                            Comenzar Gratis Ahora
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
