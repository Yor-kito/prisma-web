export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background py-20 px-4">
      <div className="container mx-auto max-w-4xl prose prose-slate dark:prose-invert">
        <h1 className="text-4xl font-bold text-primary mb-8">Política de Privacidad</h1>
        <p className="text-muted-foreground mb-8">
          <strong>Última actualización:</strong> 22 de Marzo de 2026
        </p>

        <p>En PRISMA AI, la privacidad y seguridad de nuestros usuarios es una prioridad absoluta. Esta Política de Privacidad describe cómo recopilamos, usamos y protegemos tu información cuando utilizas nuestra aplicación iOS y iPadOS, así como nuestra versión web.</p>
        
        <h2 className="text-2xl font-bold mt-10 mb-4 text-primary">1. Información que recopilamos</h2>
        <p>La aplicación PRISMA AI (iOS) está diseñada pensando en la privacidad local, utilizando <strong>SwiftData</strong> de Apple. Toda la información de tus asignaturas, documentos, notas y sesiones de estudio se almacena localmente en tu dispositivo o en tu cuenta de iCloud.</p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
            <li><strong>Datos locales:</strong> Todos los textos de tus documentos, resúmenes y flashcards se guardan exclusivamente en tu dispositivo.</li>
            <li><strong>Datos de voz y texto para IA:</strong> Cuando utilizas herramientas impulsadas por inteligencia artificial, el texto introducido es procesado bajo estrictos estándares de privacidad para generar la respuesta.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-primary">2. Uso de la Información</h2>
        <p>Los datos que genera la app se utilizan exclusivamente para:</p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>Proporcionar y mejorar las funcionalidades de estudio personalizadas.</li>
            <li>Calcular tus estadísticas de uso y gamificación localmente.</li>
            <li>Sincronizar tus datos entre tus propios dispositivos mediante iCloud (si está habilitado).</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-primary">3. Privacidad de los Datos</h2>
        <p><strong>No vendemos ni alquilamos tus datos a terceros.</strong> PRISMA AI no incluye rastreadores publicitarios intrusivos. Tu progreso académico y tus documentos son privados.</p>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-primary">4. Derechos del Usuario</h2>
        <p>Tienes el control total para eliminar tus datos locales cuando desees utilizando los Ajustes de la aplicación. Para la versión web, todos tus datos persisten temporalmente en el caché local de tu navegador.</p>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-primary">5. Contacto</h2>
        <p>Si tienes alguna pregunta sobre nuestra Política de Privacidad, por favor contáctanos en: <strong>privacy@prisma-ai.com</strong></p>
      </div>
    </main>
  );
}
