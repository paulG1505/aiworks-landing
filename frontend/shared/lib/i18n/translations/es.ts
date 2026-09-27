export const es = {
  header: {
    logo: "AIworks",
    nav: {
      procesos: "Procesos",
      proceso: "Cómo trabajamos",
      porque: "Por qué AIworks",
      preguntas: "Preguntas",
      contacto: "Contacto",
    },
    cta: "Hablar por WhatsApp",
  },
  hero: {
    headline: "Su equipo copia datos de un Excel a otro. Eso tiene un precio y no está en ningún informe.",
    subtitle:
      "Construimos el software que hace ese trabajo solo, y dejamos a la vista cada decisión que toma.",
    trayectoria: "Más de 7 años resolviendo procesos.",
    cta: {
      primary: "Hablar por WhatsApp",
      secondary: "Cómo trabajamos",
    },
    sectores: {
      label: "Trabajamos con",
      items: ["Fintech", "Cooperativas", "Retail", "Logística", "Salud"],
    },
  },
  registro: {
    etiqueta: "ejemplo de flujo",
    lineas: [
      { hora: "09:42:11", texto: "señal recibida" },
      { hora: "09:42:11", texto: "clasificada" },
      { hora: "09:42:12", texto: "decisión automática" },
      { hora: "09:42:14", texto: "revisión humana" },
      { hora: "09:42:15", texto: "registrado" },
    ],
    pie: "Cada decisión queda con hora, con responsable y con registro. Eso es lo que hace que una automatización se pueda auditar en lugar de tener que creerle.",
  },
  procesos: {
    title: "Procesos que se automatizan",
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
    title: "Cómo trabajamos",
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
    stackLabel: "Construido con",
    stack: "Python · FastAPI · PostgreSQL · Next.js · TypeScript · Docker",
  },
  porque: {
    title: "Por qué AIworks",
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
  },
  preguntas: {
    title: "Preguntas que nos hacen",
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
        pregunta: "¿No son un equipo muy chico?",
        respuesta:
          "Somos chicos, y por eso hablamos directo con quien hace el trabajo en lugar de pasar por tres capas. Lo que compensa el tamaño es el método: el proceso de tres fases es el mismo en cada proyecto y está escrito.",
      },
      {
        pregunta: "¿Qué pasa con los datos de mi empresa?",
        respuesta:
          "Se quedan donde usted decida, y firmamos confidencialidad antes de ver nada. Trabajamos bajo la Ley Orgánica de Protección de Datos Personales del Ecuador, y en el diagnóstico no necesitamos datos reales para decirle si el proceso se puede automatizar.",
      },
    ],
  },
  cta: {
    title: "Empiece por saber qué le está costando más",
    description:
      "En 15 minutos sabe qué proceso le está costando más y si se puede automatizar. Sin costo ni compromiso.",
    whatsapp: "Hablar por WhatsApp",
    correoLabel: "O escríbanos a",
  },
  footer: {
    brand: {
      name: "AIworks",
      description: "Software con inteligencia artificial para empresas que quieren dejar de digitar. Quito, Ecuador.",
    },
    navegacion: {
      title: "La página",
    },
    contacto: {
      title: "Contacto",
      whatsapp: "WhatsApp",
    },
    copyright: "© 2026 AIworks. Quito, Ecuador.",
  },
} as const;
