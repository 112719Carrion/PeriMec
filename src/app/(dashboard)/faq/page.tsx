import PaymentsAdmin from "@/src/components/admin/payments-admin";

export default function FAQPage() {
  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">FAQ</h1>
      </div>
      <div className="border-b pb-2">
        <h2 className="text-lg font-semibold mb-2">Protección de datos personales</h2>
        <p className="text-muted-foreground mb-2">
          En cumplimiento con la normativa vigente en materia de protección de datos personales y el derecho fundamental a la privacidad, informamos a los usuarios que los datos personales recolectados a través de nuestra plataforma serán tratados conforme a los principios de legalidad, consentimiento, finalidad, seguridad y confidencialidad.
        </p>
        <p className="text-muted-foreground mb-2">
          La recolección, uso y tratamiento de los datos personales se realiza únicamente con el consentimiento libre, previo, expreso e informado del titular de los datos. Esto incluye, entre otros, información como nombre, apellido, email, número de teléfono, y datos del vehículo.
        </p>
        <p className="text-muted-foreground mb-2">
          El usuario tiene el derecho en todo momento a:
        </p>
        <ul className="list-disc list-inside text-muted-foreground mb-2 space-y-1">
          <li>Acceder a los datos personales recolectados.</li>
          <li>Solicitar su actualización o rectificación si contienen errores.</li>
          <li>Solicitar la supresión definitiva de los mismos cuando así lo desee.</li>
          <li>Revocar el consentimiento otorgado para su tratamiento.</li>
        </ul>
        <p className="text-muted-foreground mb-2">
          Nuestra aplicación web cuenta con un mecanismo disponible para que cualquier usuario que desee dejar de utilizar nuestros servicios, pueda:
        </p>
        <ul className="list-disc list-inside text-muted-foreground mb-2 space-y-1">
          <li>Solicitar la eliminación total de sus datos personales almacenados en nuestros sistemas.</li>
          <li>Desinstalar o dejar de acceder a la aplicación sin que esto afecte sus derechos como titular de los datos.</li>
        </ul>
        <p className="text-muted-foreground mb-2">
          La solicitud de eliminación puede realizarse escribiendo a nuestro correo de contacto: <a href="mailto:soporte@perimec.com" className="text-blue-600 underline">soporte@perimec.com</a>.
        </p>
        <p className="text-muted-foreground">
          Nos comprometemos a procesar estas solicitudes dentro de los plazos razonables establecidos por la ley, y garantizar que la información sea eliminada de forma segura.
        </p>
      </div>

      <div className="border-b pb-2">
        <h2 className="text-lg font-semibold mb-2">Términos y Condiciones</h2>
        <ul className="list-disc list-inside text-muted-foreground mb-2 space-y-1">
          <li>
        <span className="font-semibold">Uso del sitio:</span> El sitio está destinado a mayores de edad. Cualquier uso indebido, intento de fraude o manipulación está prohibido.
          </li>
          <li>
        <span className="font-semibold">Propiedad intelectual:</span> Todos los contenidos (textos, logos, código, imágenes) son propiedad del titular del sitio. Está prohibida su reproducción o uso sin autorización.
          </li>
          <li>
        <span className="font-semibold">Seguridad y datos personales:</span> La información ingresada se maneja bajo estrictas normas de confidencialidad y protección, conforme a la normativa vigente. El usuario es responsable de la seguridad de sus credenciales.
          </li>
          <li>
        <span className="font-semibold">Licencia de uso:</span> El sitio otorga una licencia limitada y revocable de uso personal. No se transfieren derechos sobre el contenido ni la tecnología del sistema.
          </li>
        </ul>
      </div>

      <div className="border-b pb-2">
        <h2 className="text-lg font-semibold mb-2">Preguntas frecuentes</h2>
        <ul className="list-disc list-inside text-muted-foreground mb-2 space-y-2">
          <li>
        <span className="font-semibold">¿Cómo creo mi clave?</span> Su clave será creada al crear el usuario. Puede cambiarla en caso de olvidarla desde la página principal.
          </li>
          <li>
        <span className="font-semibold">¿A qué dirección de mail me puedo contactar para hacer una sugerencia o reclamo?</span> Puede comunicarse a <a href="mailto:soporte@perimec.com" className="text-blue-600 underline">soporte@perimec.com</a>.
          </li>
          <li>
        <span className="font-semibold">¿Cómo funciona el peritaje?</span> Una vez creado el usuario, puede solicitar un turno para el peritaje. El día y hora del turno deberá dirigirse al taller para realizar el peritaje.
          </li>
          <li>
        <span className="font-semibold">¿Qué medios de pago aceptan?</span> Aceptamos Mercado Pago y efectivo.
          </li>
        </ul>
      </div>
      <div className="flex-1 overflow-auto">
      </div>
    </div>
  )
}