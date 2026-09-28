export const es = {
  header: {
    logo: "AIworks",
    nav: {
      servicios: "Servicios",
      procesos: "Procesos",
      proceso: "Cómo trabajamos",
      porque: "Por qué AIworks",
      preguntas: "Preguntas",
      contacto: "Contacto",
    },
    cta: "Hablar por WhatsApp",
  },
  hero: {
    // La categoría es la primera línea del titular: un visitante frío tiene que leer
    // "software con IA" antes que cualquier beneficio.
    categoria: { antes: "Software con ", clave: "inteligencia artificial", despues: "." },
    beneficio: "Hecho para el trabajo que su equipo hoy hace a mano.",
    subtitle:
      "Somos una consultora: construimos el software que hace ese trabajo solo, y dejamos a la vista cada decisión que toma.",
    trayectoria: "Más de 7 años resolviendo procesos.",
    cta: {
      primary: "Escribir por WhatsApp",
      correo: "o por correo",
    },
  },
  registro: {
    titulo: "Registro operativo",
    etiqueta: "Ejemplo de flujo",
    // Un lead que llega por WhatsApp fuera de horario: se entiende sin contexto técnico y
    // muestra en seis líneas qué hace la IA y dónde entra una persona.
    ventana: "aiworks — lead-whatsapp",
    comando: "analizar-lead --canal=whatsapp",
    lineas: [
      { hora: "21:47", tipo: "entrada", etiqueta: "entrada", texto: "“Hola, ¿tienen el plan para 20 usuarios? Lo necesitamos este mes.”" },
      { hora: "21:47", tipo: "ia", etiqueta: "ia", texto: "Intención: compra. Urgencia: alta, lo pide para este mes." },
      { hora: "21:47", tipo: "ia", etiqueta: "ia", texto: "Cruza con el CRM: cliente nuevo, empresa de 20 personas." },
      { hora: "21:48", tipo: "decision", etiqueta: "decisión", texto: "Responde con el plan y propone una llamada mañana." },
      { hora: "21:48", tipo: "revision", etiqueta: "revisión", texto: "Avisa a ventas para que confirme la llamada." },
      { hora: "21:48", tipo: "registro", etiqueta: "registro", texto: "Queda anotado con hora y responsable." },
    ],
    resultado: {
      label: "resultado",
      items: ["Lead prioritario", "Asignado a ventas", "Respondido en 1 minuto"],
    },
    pie: "Cada decisión queda con hora, con responsable y con registro. Eso es lo que hace que una automatización se pueda auditar en lugar de tener que creerle.",
  },
  servicios: {
    eyebrow: "Qué construimos",
    titulo: { antes: "Software a la medida", clave: "de cómo trabaja su empresa." },
    subtitle:
      "Cuatro líneas de trabajo. Todas terminan en software funcionando sobre sus datos, con revisión humana donde importa.",
    ejemploLabel: "Por ejemplo",
    items: [
      {
        icono: "procesos",
        titulo: "Automatización de procesos",
        descripcion:
          "Conciliaciones, cierres de mes, reportes y cobranza que hoy dependen de copiar y pegar entre sistemas.",
        ejemplo: "Conciliación bancaria diaria que deja a una persona solo las partidas que no cuadran.",
        tecnologias: ["Python", "n8n", "PostgreSQL"],
      },
      {
        icono: "chatbots",
        titulo: "Asistentes y chatbots con IA",
        descripcion:
          "Atienden por WhatsApp y en su web con la información real del negocio, pasan a una persona lo que no saben responder y registran cada conversación.",
        ejemplo: "Un asistente que responde precios y disponibilidad fuera de horario y agenda con ventas.",
        tecnologias: ["Claude", "OpenAI", "LangChain", "WhatsApp"],
      },
      {
        icono: "documentos",
        titulo: "Lectura y clasificación de documentos",
        descripcion:
          "Facturas, PDF, correos y formularios se leen al llegar y los datos entran una sola vez al sistema.",
        ejemplo: "Facturas de proveedores registradas sin digitar, con revisión de los montos dudosos.",
        tecnologias: ["Python", "Claude", "FastAPI"],
      },
      {
        icono: "nube",
        titulo: "Integración y nube",
        descripcion:
          "Conectamos lo que ya usa y desplegamos en su propia nube, Azure o AWS, con la infraestructura escrita como código.",
        ejemplo: "Todo el entorno definido en Terraform: reproducible, auditable y en su cuenta.",
        tecnologias: ["Azure", "AWS", "Terraform", "Docker", "GitHub Actions"],
      },
    ],
  },
  procesos: {
    eyebrow: "Procesos que se automatizan",
    titulo: { antes: "Lo que hoy se hace a mano", clave: "y no debería." },
    subtitle:
      "Si reconoce alguno de estos en su empresa, ya sabe de dónde salen las horas que no aparecen en ningún informe.",
    ctaItem: "Hablar de esto",
    items: [
      {
        numero: "01",
        titulo: "Conciliación bancaria",
        hoy: "Alguien cruza el extracto contra el sistema, línea por línea. El cierre depende de cuántas alcance a revisar antes de que termine el día.",
        resuelve:
          "El sistema lee el extracto, cruza por referencia y monto, y deja en una cola aparte solo las que no cuadran. La persona revisa las excepciones, no las cinco mil filas.",
      },
      {
        numero: "02",
        titulo: "Cierre de mes y digitación",
        hoy: "Los datos llegan en correos, PDF y hojas de cálculo, y alguien los vuelve a escribir en el sistema. Lo que se digita mal se descubre en el cierre siguiente.",
        resuelve:
          "Los documentos se leen al llegar y los datos entran una sola vez. El equipo deja de digitar y pasa a decidir sobre lo que el sistema marcó.",
      },
      {
        numero: "03",
        titulo: "Atención a clientes fuera de horario",
        hoy: "Las consultas se acumulan de noche y el lunes hay cola. Las preguntas son casi siempre las mismas.",
        resuelve:
          "Un asistente responde las consultas repetidas con la información real de su negocio, y pasa a una persona lo que no sabe contestar. No improvisa.",
      },
    ],
  },
  proceso: {
    eyebrow: "Cómo trabajamos",
    titulo: { antes: "Tres fases.", clave: "Sin sorpresas." },
    faseLabel: "Fase",
    subtitle:
      "Tres fases, cada una con algo concreto que usted recibe al final. Si la primera no encuentra nada que valga la pena automatizar, se lo decimos y ahí queda.",
    entregableLabel: "Usted recibe",
    fases: [
      {
        numero: "01",
        titulo: "Descubrimiento",
        descripcion:
          "Miramos el proceso donde está, con la gente que lo hace hoy. Medimos cuánto tiempo toma y dónde se rompe.",
        entregable: "Un documento con el proceso tal como está, qué parte se puede automatizar y qué no conviene tocar.",
      },
      {
        numero: "02",
        titulo: "Arquitectura y ejecución",
        descripcion:
          "Diseñamos la solución y la construimos en entregas cortas, de modo que usted la vea funcionando antes de que esté terminada.",
        entregable: "El sistema funcionando sobre sus datos reales, con las reglas de revisión humana ya definidas.",
      },
      {
        numero: "03",
        titulo: "Puesta en producción",
        descripcion:
          "Lo conectamos a lo que ya usa, capacitamos a quien lo va a operar y dejamos el registro de auditoría andando.",
        entregable: "El sistema en producción, la documentación para operarlo y el registro de cada decisión que toma.",
      },
    ],
    stackLabel: "Tecnologías con las que trabajamos",
    pausar: "Pausar",
    reanudar: "Reanudar",
  },
  porque: {
    eyebrow: "Por qué AIworks",
    titulo: { antes: "Sin promesas infladas.", clave: "Con criterio." },
    items: [
      {
        titulo: "Más de 7 años resolviendo procesos",
        descripcion:
          "La marca es nueva; la experiencia no. Son más de siete años liderando proyectos de software, la mayoría resolviendo exactamente este tipo de problema.",
      },
      {
        titulo: "IA con orden, no IA a ciegas",
        descripcion:
          "Toda decisión automática queda registrada, con su hora, y las que importan pasan por una persona antes de ejecutarse. Usted puede reconstruir por qué el sistema hizo lo que hizo.",
      },
      {
        titulo: "Del concepto a producción en semanas",
        descripcion:
          "Trabajamos en entregas cortas sobre sus datos reales. No hay una fase de seis meses en la que usted no ve nada.",
      },
      {
        titulo: "Software que otro puede mantener",
        descripcion:
          "Código probado, documentado y suyo. Si mañana decide llevárselo a otro equipo, puede hacerlo.",
      },
    ],
    // Ejemplos de lo que se puede automatizar, no clientes: el titular del carrusel lo dice.
    casos: {
      titulo: "Ejemplos de automatización",
      anterior: "Ejemplo anterior",
      siguiente: "Ejemplo siguiente",
      hoyLabel: "Hoy",
      conIaLabel: "Con IA",
      items: [
        {
          area: "Ventas",
          titulo: "Leads de WhatsApp que llegan de noche",
          hoy: "Los mensajes de la noche se contestan al día siguiente, y algunos ya compraron en otro lado.",
          conIa: "Cada mensaje se clasifica al llegar; los interesados reciben respuesta y pasan a ventas con prioridad.",
        },
        {
          area: "Finanzas",
          titulo: "Conciliación bancaria a mano",
          hoy: "Una persona cruza el extracto contra el sistema línea por línea, y el cierre espera a que termine.",
          conIa: "El sistema cruza por referencia y monto; la persona revisa solo las partidas que no cuadran.",
        },
        {
          area: "Documentos",
          titulo: "Facturas en PDF que llegan por correo",
          hoy: "Cada factura se vuelve a digitar en el sistema, y los errores aparecen en el cierre siguiente.",
          conIa: "Las facturas se leen al llegar y los datos entran una sola vez, con revisión humana de lo dudoso.",
        },
        {
          area: "Cobranza",
          titulo: "Facturas vencidas sin seguimiento",
          hoy: "Alguien revisa quién debe y escribe a cada cliente uno por uno, cuando tiene tiempo.",
          conIa: "El sistema detecta los vencimientos, envía recordatorios y avisa a una persona cuando el cliente responde.",
        },
        {
          area: "Reportes",
          titulo: "El reporte semanal de cada lunes",
          hoy: "Se juntan varias hojas de cálculo a mano para armar el mismo reporte todas las semanas.",
          conIa: "El reporte se arma solo con los datos del sistema y llega por correo con lo que cambió.",
        },
        {
          area: "Operaciones",
          titulo: "Inventario que no cuadra con el sistema",
          hoy: "El stock de la hoja de cálculo no coincide con el sistema y nadie sabe cuál es el real.",
          conIa: "Ambos se concilian a diario y solo las diferencias llegan a quien tiene que decidir.",
        },
      ],
    },
  },
  preguntas: {
    eyebrow: "Preguntas frecuentes",
    titulo: { antes: "Lo que suelen", clave: "preguntarnos." },
    items: [
      {
        pregunta: "¿Cuánto cuesta?",
        respuesta:
          "Depende del proceso y de cuánto haya que conectar. En el diagnóstico de 15 minutos le damos un rango concreto para su caso, sin compromiso.",
      },
      {
        pregunta: "¿Cuánto demora?",
        respuesta:
          "El descubrimiento toma entre una y dos semanas. Después, la primera versión funcionando sobre sus datos suele estar en semanas, no en meses, porque entregamos por partes.",
      },
      {
        pregunta: "¿Qué pasa si la IA se equivoca?",
        respuesta:
          "Por eso no decide sola en lo que importa. Los pasos sensibles pasan por una persona antes de ejecutarse, y cada decisión queda registrada con su hora, así se puede ver qué hizo el sistema y corregirlo.",
      },
      {
        pregunta: "¿Qué pasa con los datos de mi empresa?",
        respuesta:
          "Se quedan donde usted decida, y firmamos confidencialidad antes de ver nada. Trabajamos bajo la Ley Orgánica de Protección de Datos Personales del Ecuador, y en el diagnóstico no necesitamos datos reales para decirle si el proceso se puede automatizar.",
      },
    ],
  },
  cta: {
    eyebrow: "Contacto",
    titulo: { antes: "Empiece por saber", clave: "qué le está costando más." },
    description:
      "En 15 minutos sabe qué proceso le está costando más y si se puede automatizar. Sin costo ni compromiso.",
    whatsapp: "Hablar por WhatsApp",
    correoLabel: "o escríbanos a",
  },
  whatsappFlotante: {
    titulo: "¿Necesita ayuda?",
    texto: "Escríbanos por WhatsApp",
    cerrar: "Cerrar aviso",
  },
  footer: {
    navegacion: "Navegación del pie",
    copyright: "© 2026 AIworks · Quito, Ecuador",
  },
} as const;
