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
    eyebrow: "Quito, Ecuador · Para PYMEs",
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
    etiqueta: "Ejemplo de flujo · ilustrativo",
    lineas: [
      { hora: "09:42", tipo: "entrada", etiqueta: "ENTRADA", texto: "Llega el extracto bancario del día." },
      { hora: "09:42", tipo: "ia", etiqueta: "IA", texto: "Cruza cada movimiento por referencia y monto." },
      { hora: "09:42", tipo: "sistema", etiqueta: "DECISIÓN", texto: "Concilia solos los movimientos que cuadran." },
      { hora: "09:43", tipo: "ia", etiqueta: "REVISIÓN", texto: "Uno no cuadra: pasa a una persona antes de seguir." },
      { hora: "09:43", tipo: "sistema", etiqueta: "REGISTRO", texto: "Queda anotado con hora y responsable." },
    ],
    pie: "Cada decisión queda con hora, con responsable y con registro. Eso es lo que hace que una automatización se pueda auditar en lugar de tener que creerle.",
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
    stackLabel: "Construido con",
    stack: "Python · FastAPI · PostgreSQL · Next.js · TypeScript · Docker",
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
    // Sustituyen a las "tarjetas de cifra grande": no hay clientes todavía, así que son
    // casos ilustrativos y lo dicen antes que nada. Cuando exista el primer cliente con
    // permiso, un caso real reemplaza a uno de estos.
    casos: {
      rotulo: "Caso ilustrativo · no es un cliente",
      hoyLabel: "Hoy",
      conIaLabel: "Con IA",
      items: [
        {
          titulo: "Un área contable que concilia el banco a mano",
          hoy: "Una persona cruza el extracto contra el sistema línea por línea, y el cierre espera a que termine.",
          conIa: "El sistema cruza por referencia y monto; la persona revisa solo las partidas que no cuadran.",
        },
        {
          titulo: "Una empresa que recibe facturas en PDF por correo",
          hoy: "Cada factura se vuelve a digitar en el sistema, y los errores aparecen en el cierre siguiente.",
          conIa: "Las facturas se leen al llegar y los datos entran una sola vez, con revisión humana de lo dudoso.",
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
    eyebrow: "Contacto",
    titulo: { antes: "Empiece por saber", clave: "qué le está costando más." },
    description:
      "En 15 minutos sabe qué proceso le está costando más y si se puede automatizar. Sin costo ni compromiso.",
    whatsapp: "Hablar por WhatsApp",
    correoLabel: "o escríbanos a",
  },
  footer: {
    navegacion: "Navegación del pie",
    copyright: "© 2026 AIworks · Quito, Ecuador",
  },
} as const;
