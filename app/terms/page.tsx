export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background py-20 px-4">
      <div className="container mx-auto max-w-4xl prose prose-slate dark:prose-invert">
        <h1 className="text-4xl font-bold text-primary mb-8">Términos de Uso (EULA)</h1>
        <p className="text-muted-foreground mb-8">
          <strong>Última actualización:</strong> 30 de Marzo de 2026
        </p>

        <p>Al descargar o utilizar la aplicación PRISMA AI, estos términos se aplicarán automáticamente a usted. Asegúrese de leerlos cuidadosamente antes de usar la aplicación.</p>
        
        <h2 className="text-2xl font-bold mt-10 mb-4 text-primary">1. Licencia Acordada (EULA Estándar)</h2>
        <p>A menos que se indique lo contrario, usted acepta el Contrato de Licencia de Usuario Final (EULA) estándar de Apple (Términos de Uso estándar de Apple) para todo uso de nuestra aplicación iOS/iPadOS, descargada a través de la App Store.</p>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-primary">2. Suscripciones y Pagos</h2>
        <p>PRISMA AI ofrece suscripciones auto-renovables a través de compras In-App en la App Store.</p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>El pago se cargará a su cuenta de ID de Apple al confirmar la compra.</li>
            <li>La suscripción se renueva automáticamente a menos que se cancele al menos 24 horas antes del final del período actual.</li>
            <li>Su cuenta será cargada por la renovación dentro de las 24 horas previas al final del período actual.</li>
            <li>Puede administrar y cancelar sus suscripciones yendo a la configuración de su cuenta de App Store después de la compra.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-primary">3. Uso Aceptable</h2>
        <p>Usted acepta no utilizar nuestros servicios de Inteligencia Artificial para generar contenido ofensivo, ilegal o malicioso. El servicio se provee con fines educativos.</p>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-primary">4. Cambios a estos Términos</h2>
        <p>Podemos actualizar nuestros Términos de Uso de vez en cuando. Por lo tanto, se le aconseja que revise esta página periódicamente en busca de cualquier cambio.</p>

        <h2 className="text-2xl font-bold mt-10 mb-4 text-primary">5. Contacto</h2>
        <p>Si tiene alguna pregunta, contáctenos en: <strong>support@prisma-ai.com</strong></p>
      </div>
    </main>
  );
}
