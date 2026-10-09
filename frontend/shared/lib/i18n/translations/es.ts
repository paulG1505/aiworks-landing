export const es = {
  header: {
    logo: "AIworks",
    nav: {
      services: "Servicios",
      processes: "Procesos",
      howWeWork: "Cómo trabajamos",
      why: "Por qué AIworks",
      faq: "Preguntas",
      contact: "Contacto",
    },
    cta: "Hablar por WhatsApp",
  },
  hero: {
    category: { before: "Software con ", highlight: "inteligencia artificial", after: "." },
    benefit: "Hecho para el trabajo que su equipo hoy hace a mano.",
    subtitle:
      "Somos una consultora: construimos el software que hace ese trabajo solo, y dejamos a la vista cada decisión que toma.",
    trackRecord: "Más de 7 años resolviendo procesos.",
    cta: {
      primary: "Pruebe nuestro asistente",
      whatsapp: "Escribir por WhatsApp",
    },
  },
  log: {
    title: "Registro operativo",
    label: "Ejemplo de flujo",
    windowTitle: "aiworks — lead-whatsapp",
    command: "analizar-lead --canal=whatsapp",
    lines: [
      { time: "21:47", kind: "input", label: "entrada", text: "“Hola, ¿tienen el plan para 20 usuarios? Lo necesitamos este mes.”" },
      { time: "21:47", kind: "ai", label: "ia", text: "Intención: compra. Urgencia: alta, lo pide para este mes." },
      { time: "21:47", kind: "ai", label: "ia", text: "Cruza con el CRM: cliente nuevo, empresa de 20 personas." },
      { time: "21:48", kind: "decision", label: "decisión", text: "Responde con el plan y propone una llamada mañana." },
      { time: "21:48", kind: "review", label: "revisión", text: "Avisa a ventas para que confirme la llamada." },
      { time: "21:48", kind: "log", label: "registro", text: "Queda anotado con hora y responsable." },
    ],
    result: {
      label: "resultado",
      items: ["Lead prioritario", "Asignado a ventas", "Respondido en 1 minuto"],
    },
    footnote: "Cada decisión queda con hora, con responsable y con registro. Eso es lo que hace que una automatización se pueda auditar en lugar de tener que creerle.",
  },
  services: {
    eyebrow: "Qué construimos",
    title: { before: "Software a la medida", highlight: "de cómo trabaja su empresa." },
    subtitle:
      "Cuatro líneas de trabajo. Todas terminan en software funcionando sobre sus datos, con revisión humana donde importa.",
    exampleLabel: "Por ejemplo",
    items: [
      {
        icon: "processes",
        title: "Automatización de procesos",
        description:
          "Conciliaciones, cierres de mes, reportes y cobranza que hoy dependen de copiar y pegar entre sistemas.",
        example: "Conciliación bancaria diaria que deja a una persona solo las partidas que no cuadran.",
        technologies: ["Python", "n8n", "PostgreSQL"],
      },
      {
        icon: "chatbots",
        title: "Asistentes y chatbots con IA",
        description:
          "Atienden por WhatsApp y en su web con la información real del negocio, pasan a una persona lo que no saben responder y registran cada conversación.",
        example: "Un asistente que responde precios y disponibilidad fuera de horario y agenda con ventas.",
        technologies: ["Claude", "OpenAI", "LangChain", "WhatsApp"],
      },
      {
        icon: "documents",
        title: "Lectura y clasificación de documentos",
        description:
          "Facturas, PDF, correos y formularios se leen al llegar y los datos entran una sola vez al sistema.",
        example: "Facturas de proveedores registradas sin digitar, con revisión de los montos dudosos.",
        technologies: ["Python", "Claude", "FastAPI"],
      },
      {
        icon: "cloud",
        title: "Integración y nube",
        description:
          "Conectamos lo que ya usa y desplegamos en su propia nube, Azure o AWS, con la infraestructura escrita como código.",
        example: "Todo el entorno definido en Terraform: reproducible, auditable y en su cuenta.",
        technologies: ["Azure", "AWS", "Terraform", "Docker", "GitHub Actions"],
      },
    ],
  },
  processes: {
    eyebrow: "Procesos que se automatizan",
    title: { before: "Lo que hoy se hace a mano", highlight: "y no debería." },
    subtitle:
      "Si reconoce alguno de estos en su empresa, ya sabe de dónde salen las horas que no aparecen en ningún informe.",
    itemCta: "Hablar de esto",
    items: [
      {
        number: "01",
        title: "Conciliación bancaria",
        today: "Alguien cruza el extracto contra el sistema, línea por línea. El cierre depende de cuántas alcance a revisar antes de que termine el día.",
        solution:
          "El sistema lee el extracto, cruza por referencia y monto, y deja en una cola aparte solo las que no cuadran. La persona revisa las excepciones, no las cinco mil filas.",
      },
      {
        number: "02",
        title: "Cierre de mes y digitación",
        today: "Los datos llegan en correos, PDF y hojas de cálculo, y alguien los vuelve a escribir en el sistema. Lo que se digita mal se descubre en el cierre siguiente.",
        solution:
          "Los documentos se leen al llegar y los datos entran una sola vez. El equipo deja de digitar y pasa a decidir sobre lo que el sistema marcó.",
      },
      {
        number: "03",
        title: "Atención a clientes fuera de horario",
        today: "Las consultas se acumulan de noche y el lunes hay cola. Las preguntas son casi siempre las mismas.",
        solution:
          "Un asistente responde las consultas repetidas con la información real de su negocio, y pasa a una persona lo que no sabe contestar. No improvisa.",
      },
    ],
  },
  howWeWork: {
    eyebrow: "Cómo trabajamos",
    title: { before: "Tres fases.", highlight: "Sin sorpresas." },
    phaseLabel: "Fase",
    subtitle:
      "Tres fases, cada una con algo concreto que usted recibe al final. Si la primera no encuentra nada que valga la pena automatizar, se lo decimos y ahí queda.",
    deliverableLabel: "Usted recibe",
    phases: [
      {
        number: "01",
        title: "Descubrimiento",
        description:
          "Miramos el proceso donde está, con la gente que lo hace hoy. Medimos cuánto tiempo toma y dónde se rompe.",
        deliverable: "Un documento con el proceso tal como está, qué parte se puede automatizar y qué no conviene tocar.",
      },
      {
        number: "02",
        title: "Arquitectura y ejecución",
        description:
          "Diseñamos la solución y la construimos en entregas cortas, de modo que usted la vea funcionando antes de que esté terminada.",
        deliverable: "El sistema funcionando sobre sus datos reales, con las reglas de revisión humana ya definidas.",
      },
      {
        number: "03",
        title: "Puesta en producción",
        description:
          "Lo conectamos a lo que ya usa, capacitamos a quien lo va a operar y dejamos el registro de auditoría andando.",
        deliverable: "El sistema en producción, la documentación para operarlo y el registro de cada decisión que toma.",
      },
    ],
    stackLabel: "Tecnologías con las que trabajamos",
    pause: "Pausar",
    resume: "Reanudar",
  },
  why: {
    eyebrow: "Por qué AIworks",
    title: { before: "Sin promesas infladas.", highlight: "Con criterio." },
    items: [
      {
        title: "Más de 7 años resolviendo procesos",
        description:
          "La marca es nueva; la experiencia no. Son más de siete años liderando proyectos de software, la mayoría resolviendo exactamente este tipo de problema.",
      },
      {
        title: "IA con orden, no IA a ciegas",
        description:
          "Toda decisión automática queda registrada, con su hora, y las que importan pasan por una persona antes de ejecutarse. Usted puede reconstruir por qué el sistema hizo lo que hizo.",
      },
      {
        title: "Del concepto a producción suele tomar semanas",
        description:
          "Trabajamos en entregas cortas sobre sus datos reales. No hay una fase de seis meses en la que usted no ve nada.",
      },
      {
        title: "Software que otro puede mantener",
        description:
          "Código probado, documentado y suyo. Si mañana decide llevárselo a otro equipo, puede hacerlo.",
      },
    ],
    examples: {
      title: "Ejemplos de automatización",
      previous: "Ejemplo anterior",
      next: "Ejemplo siguiente",
      todayLabel: "Hoy",
      withAiLabel: "Con IA",
      items: [
        {
          area: "Ventas",
          title: "Leads de WhatsApp que llegan de noche",
          today: "Los mensajes de la noche se contestan al día siguiente, y algunos ya compraron en otro lado.",
          withAi: "Cada mensaje se clasifica al llegar; los interesados reciben respuesta y pasan a ventas con prioridad.",
        },
        {
          area: "Finanzas",
          title: "Conciliación bancaria a mano",
          today: "Una persona cruza el extracto contra el sistema línea por línea, y el cierre espera a que termine.",
          withAi: "El sistema cruza por referencia y monto; la persona revisa solo las partidas que no cuadran.",
        },
        {
          area: "Documentos",
          title: "Facturas en PDF que llegan por correo",
          today: "Cada factura se vuelve a digitar en el sistema, y los errores aparecen en el cierre siguiente.",
          withAi: "Las facturas se leen al llegar y los datos entran una sola vez, con revisión humana de lo dudoso.",
        },
        {
          area: "Cobranza",
          title: "Facturas vencidas sin seguimiento",
          today: "Alguien revisa quién debe y escribe a cada cliente uno por uno, cuando tiene tiempo.",
          withAi: "El sistema detecta los vencimientos, envía recordatorios y avisa a una persona cuando el cliente responde.",
        },
        {
          area: "Reportes",
          title: "El reporte semanal de cada lunes",
          today: "Se juntan varias hojas de cálculo a mano para armar el mismo reporte todas las semanas.",
          withAi: "El reporte se arma solo con los datos del sistema y llega por correo con lo que cambió.",
        },
        {
          area: "Operaciones",
          title: "Inventario que no cuadra con el sistema",
          today: "El stock de la hoja de cálculo no coincide con el sistema y nadie sabe cuál es el real.",
          withAi: "Ambos se concilian a diario y solo las diferencias llegan a quien tiene que decidir.",
        },
      ],
    },
  },
  faq: {
    eyebrow: "Preguntas frecuentes",
    title: { before: "Lo que suelen", highlight: "preguntarnos." },
    items: [
      {
        question: "¿Cuánto cuesta?",
        answer:
          "Depende del proceso y de cuánto haya que conectar. En el diagnóstico de 15 minutos le damos un rango concreto para su caso, sin compromiso.",
      },
      {
        question: "¿Cuánto demora?",
        answer:
          "El descubrimiento suele tomar entre una y dos semanas. Después, la primera versión funcionando sobre sus datos suele estar en semanas, no en meses, porque entregamos por partes.",
      },
      {
        question: "¿Qué pasa si la IA se equivoca?",
        answer:
          "Por eso no decide sola en lo que importa. Los pasos sensibles pasan por una persona antes de ejecutarse, y cada decisión queda registrada con su hora, así se puede ver qué hizo el sistema y corregirlo.",
      },
      {
        question: "¿Qué pasa con los datos de mi empresa?",
        answer:
          "Se quedan donde usted decida, y acordamos confidencialidad al iniciar el proyecto. Trabajamos bajo la Ley Orgánica de Protección de Datos Personales del Ecuador, y en el diagnóstico no necesitamos datos reales para decirle si el proceso se puede automatizar.",
      },
    ],
  },
  cta: {
    eyebrow: "Contacto",
    title: { before: "Empiece por saber", highlight: "qué le está costando más." },
    description:
      "En 15 minutos sabe qué proceso le está costando más y si se puede automatizar. Sin costo ni compromiso.",
    whatsapp: "Hablar por WhatsApp",
    emailLabel: "o escríbanos a",
  },
  floatingWhatsapp: {
    title: "¿Necesita ayuda?",
    text: "Escríbanos por WhatsApp",
    close: "Cerrar aviso",
  },
  footer: {
    description: "Consultora de software con inteligencia artificial para PYMEs. Quito, Ecuador.",
    columns: {
      services: "Servicios",
      company: "La empresa",
      contact: "Contacto",
      legal: "Legal",
    },
    examples: "Ejemplos",
    location: "Quito, Ecuador",
    privacy: "Política de privacidad",
    navigation: "Navegación del pie",
    copyright: "© 2026 AIworks · Quito, Ecuador",
  },
  legal: {
    back: "Volver al inicio",
    privacy: {
      title: "Política de privacidad",
      updated: "Última actualización: 8 de octubre de 2026",
      intro:
        "Esta política explica qué datos personales recibe AIworks a través de este sitio, para qué los usa y cómo puede ejercer sus derechos según la Ley Orgánica de Protección de Datos Personales del Ecuador (LOPDP).",
      sections: [
        {
          title: "Quién es responsable",
          paragraphs: [
            "AIworks, consultora de software con sede en Quito, Ecuador, es responsable del tratamiento de los datos descritos aquí. Puede escribirnos a {email}.",
          ],
        },
        {
          title: "Qué datos recibimos",
          paragraphs: [
            "Este sitio tiene un asistente de chat. Si usted lo usa, guardamos la conversación durante 30 días para mejorar las respuestas y después la borramos. No guardamos su dirección IP en claro: solo una huella que cambia cada día y que sirve para limitar abusos.",
            "Si usted pide una llamada, la empresa y el cargo que indique pasan a nuestro registro comercial. Su número de teléfono solo nos llega si usted nos escribe por WhatsApp. Por correo recibimos lo que decida enviarnos: su dirección y el contenido de su mensaje.",
            "El sitio no usa cookies de seguimiento ni herramientas de analítica. Su navegador guarda dos preferencias locales —idioma y modo claro u oscuro— y, mientras la pestaña esté abierta, un identificador de la sesión del chat. Nada de eso sirve para identificarle.",
          ],
        },
        {
          title: "Para qué los usamos",
          paragraphs: [
            "Para responder su consulta, preparar un diagnóstico o una propuesta, y dar seguimiento a la conversación que usted inició. La base legal es su consentimiento al contactarnos y, si llegamos a trabajar juntos, la ejecución del contrato.",
            "No vendemos ni cedemos sus datos a terceros. No los usamos para enviarle publicidad que no haya pedido.",
          ],
        },
        {
          title: "Dónde se guardan y por cuánto tiempo",
          paragraphs: [
            "Los mensajes quedan en los servicios que usted eligió para escribirnos (WhatsApp de Meta o nuestro proveedor de correo), que pueden procesar datos fuera del Ecuador. Los mensajes del chat los procesa nuestro proveedor de inteligencia artificial (Anthropic, en Estados Unidos) y el registro comercial vive en Notion; ninguno usa sus datos para otros fines. Conservamos la conversación mientras dure la relación comercial o hasta que usted pida su eliminación.",
          ],
        },
        {
          title: "Sus derechos",
          paragraphs: [
            "Puede pedir en cualquier momento acceder a sus datos, corregirlos, eliminarlos, oponerse a su tratamiento o recibirlos en un formato portable. Escríbanos a {email} y le responderemos en un plazo máximo de 15 días.",
            "Si considera que no atendimos su solicitud, puede acudir a la Superintendencia de Protección de Datos Personales del Ecuador.",
          ],
        },
        {
          title: "Cambios a esta política",
          paragraphs: [
            "Si esta política cambia, publicaremos la nueva versión en esta misma página con su fecha de actualización.",
          ],
        },
      ],
    },
  },
} as const;
