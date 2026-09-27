export const en = {
  header: {
    logo: "AIworks",
    nav: {
      procesos: "Processes",
      proceso: "How we work",
      porque: "Why AIworks",
      preguntas: "Questions",
      contacto: "Contact",
    },
    cta: "Message us on WhatsApp",
  },
  hero: {
    headline: "Your team copies data from one spreadsheet into another. That has a cost, and it shows up in no report.",
    subtitle:
      "We build the software that does that work on its own, and we leave every decision it makes in plain view.",
    trayectoria: "Over 7 years solving processes.",
    cta: {
      primary: "Message us on WhatsApp",
      secondary: "How we work",
    },
    sectores: {
      label: "We work with",
      items: ["Fintech", "Credit unions", "Retail", "Logistics", "Healthcare"],
    },
  },
  registro: {
    etiqueta: "sample flow",
    lineas: [
      { hora: "09:42:11", texto: "signal received" },
      { hora: "09:42:11", texto: "classified" },
      { hora: "09:42:12", texto: "automated decision" },
      { hora: "09:42:14", texto: "human review" },
      { hora: "09:42:15", texto: "recorded" },
    ],
    pie: "Every decision is stored with its timestamp, its owner and its record. That is what makes an automation auditable instead of something you have to take on trust.",
  },
  procesos: {
    title: "Processes that can be automated",
    subtitle:
      "If you recognise any of these in your company, you already know where the hours that show up in no report are going.",
    ctaItem: "Talk about this",
    items: [
      {
        numero: "01",
        titulo: "Bank reconciliation",
        hoy: "Someone matches the statement against the system, line by line. The close depends on how many lines they get through before the day ends.",
        resuelve:
          "The system reads the statement, matches on reference and amount, and sets aside only the entries that do not add up. A person reviews the exceptions, not the five thousand rows.",
      },
      {
        numero: "02",
        titulo: "Month-end close and data entry",
        hoy: "Data arrives in emails, PDFs and spreadsheets, and someone types it into the system again. Whatever is mistyped surfaces at the next close.",
        resuelve:
          "Documents are read as they arrive and the data is entered once. The team stops typing and starts deciding on what the system flagged.",
      },
      {
        numero: "03",
        titulo: "Customer questions after hours",
        hoy: "Enquiries pile up overnight and Monday starts with a queue. The questions are almost always the same ones.",
        resuelve:
          "An assistant answers the repeat enquiries using your business's real information, and hands anything it cannot answer to a person. It does not improvise.",
      },
    ],
  },
  proceso: {
    title: "How we work",
    subtitle:
      "Three phases, each ending with something concrete you receive. If the first one finds nothing worth automating, we tell you and it stops there.",
    entregableLabel: "You receive",
    fases: [
      {
        numero: "01",
        titulo: "Discovery",
        descripcion:
          "We look at the process where it lives, with the people who run it today. We measure how long it takes and where it breaks.",
        entregable: "A document with the process as it actually is, which part can be automated and which is better left alone.",
      },
      {
        numero: "02",
        titulo: "Architecture and build",
        descripcion:
          "We design the solution and build it in short increments, so you see it working before it is finished.",
        entregable: "The system running on your real data, with the human-review rules already defined.",
      },
      {
        numero: "03",
        titulo: "Going live",
        descripcion:
          "We connect it to what you already use, train whoever will operate it, and leave the audit log running.",
        entregable: "The system in production, the documentation to operate it, and the record of every decision it makes.",
      },
    ],
    stackLabel: "Built with",
    stack: "Python · FastAPI · PostgreSQL · Next.js · TypeScript · Docker",
  },
  porque: {
    title: "Why AIworks",
    items: [
      {
        titulo: "Over 7 years solving processes",
        descripcion:
          "The brand is new; the experience is not. It is over seven years leading software projects, most of it solving exactly this kind of problem.",
      },
      {
        titulo: "AI with a paper trail, not AI on blind faith",
        descripcion:
          "Every automated decision is recorded with its timestamp, and the ones that matter go through a person before they execute. You can reconstruct why the system did what it did.",
      },
      {
        titulo: "From concept to production in weeks",
        descripcion:
          "We work in short increments on your real data. There is no six-month phase where you see nothing.",
      },
      {
        titulo: "Software someone else can maintain",
        descripcion:
          "Tested, documented code, and it is yours. If you decide tomorrow to hand it to another team, you can.",
      },
    ],
  },
  preguntas: {
    title: "Questions we get",
    items: [
      {
        pregunta: "What does it cost?",
        respuesta:
          "It depends on the process and on how much has to be connected. In the 15-minute assessment we give you a concrete range for your case, with no obligation.",
      },
      {
        pregunta: "How long does it take?",
        respuesta:
          "Discovery takes one to two weeks. After that, the first working version on your data is usually weeks away rather than months, because we deliver in parts.",
      },
      {
        pregunta: "Aren't you a very small team?",
        respuesta:
          "We are small, which is why you talk directly to whoever does the work instead of going through three layers. What makes up for the size is the method: the three-phase process is the same on every project and it is written down.",
      },
      {
        pregunta: "What happens to my company's data?",
        respuesta:
          "It stays wherever you decide, and we sign a confidentiality agreement before seeing anything. We work under Ecuador's data protection law, and the assessment does not need real data for us to tell you whether the process can be automated.",
      },
    ],
  },
  cta: {
    title: "Start by finding out what is costing you most",
    description:
      "In 15 minutes you will know which process is costing you the most and whether it can be automated. No cost, no obligation.",
    whatsapp: "Message us on WhatsApp",
    correoLabel: "Or email us at",
  },
  footer: {
    brand: {
      name: "AIworks",
      description: "Software with artificial intelligence for companies that want to stop typing. Quito, Ecuador.",
    },
    navegacion: {
      title: "The page",
    },
    contacto: {
      title: "Contact",
      whatsapp: "WhatsApp",
    },
    copyright: "© 2026 AIworks. Quito, Ecuador.",
  },
} as const;
