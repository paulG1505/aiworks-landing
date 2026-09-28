export const en = {
  header: {
    logo: "AIworks",
    nav: {
      servicios: "Services",
      procesos: "Processes",
      proceso: "How we work",
      porque: "Why AIworks",
      preguntas: "Questions",
      contacto: "Contact",
    },
    cta: "Message us on WhatsApp",
  },
  hero: {
    categoria: { antes: "", clave: "AI-powered", despues: " software." },
    beneficio: "Built for the work your team still does by hand.",
    subtitle:
      "We are a consultancy: we build the software that does that work on its own, and we leave every decision it makes in plain view.",
    trayectoria: "Over 7 years solving processes.",
    cta: {
      primary: "Message us on WhatsApp",
      correo: "or by email",
    },
  },
  registro: {
    titulo: "Operations log",
    etiqueta: "Sample flow",
    ventana: "aiworks — whatsapp-lead",
    comando: "analyze-lead --channel=whatsapp",
    lineas: [
      { hora: "21:47", tipo: "entrada", etiqueta: "input", texto: "“Hi, do you have the plan for 20 users? We need it this month.”" },
      { hora: "21:47", tipo: "ia", etiqueta: "ai", texto: "Intent: purchase. Urgency: high, needed this month." },
      { hora: "21:47", tipo: "ia", etiqueta: "ai", texto: "Checks the CRM: new customer, 20-person company." },
      { hora: "21:48", tipo: "decision", etiqueta: "decision", texto: "Replies with the plan and offers a call tomorrow." },
      { hora: "21:48", tipo: "revision", etiqueta: "review", texto: "Alerts sales to confirm the call." },
      { hora: "21:48", tipo: "registro", etiqueta: "log", texto: "Recorded with its timestamp and owner." },
    ],
    resultado: {
      label: "outcome",
      items: ["Priority lead", "Assigned to sales", "Answered in 1 minute"],
    },
    pie: "Every decision is stored with its timestamp, its owner and its record. That is what makes an automation auditable instead of something you have to take on trust.",
  },
  servicios: {
    eyebrow: "What we build",
    titulo: { antes: "Software shaped", clave: "around how your company works." },
    subtitle:
      "Four lines of work. All of them end in software running on your data, with human review where it matters.",
    ejemploLabel: "For example",
    items: [
      {
        icono: "procesos",
        titulo: "Process automation",
        descripcion:
          "Reconciliations, month-end close, reports and collections that today depend on copying and pasting between systems.",
        ejemplo: "A daily bank reconciliation that leaves a person only the entries that do not add up.",
        tecnologias: ["Python", "n8n", "PostgreSQL"],
      },
      {
        icono: "chatbots",
        titulo: "AI assistants and chatbots",
        descripcion:
          "They answer on WhatsApp and on your website using your business's real information, hand to a person what they cannot answer, and log every conversation.",
        ejemplo: "An assistant that answers pricing and availability after hours and books calls with sales.",
        tecnologias: ["Claude", "OpenAI", "LangChain", "WhatsApp"],
      },
      {
        icono: "documentos",
        titulo: "Document reading and classification",
        descripcion:
          "Invoices, PDFs, emails and forms are read as they arrive and the data is entered into the system once.",
        ejemplo: "Supplier invoices recorded without typing, with a person reviewing doubtful amounts.",
        tecnologias: ["Python", "Claude", "FastAPI"],
      },
      {
        icono: "nube",
        titulo: "Integration and cloud",
        descripcion:
          "We connect what you already use and deploy to your own cloud, Azure or AWS, with the infrastructure written as code.",
        ejemplo: "The whole environment defined in Terraform: reproducible, auditable and in your account.",
        tecnologias: ["Azure", "AWS", "Terraform", "Docker", "GitHub Actions"],
      },
    ],
  },
  procesos: {
    eyebrow: "Processes that can be automated",
    titulo: { antes: "What still gets done by hand", clave: "and shouldn't." },
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
    eyebrow: "How we work",
    titulo: { antes: "Three phases.", clave: "No surprises." },
    faseLabel: "Phase",
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
    stackLabel: "Technologies we work with",
    pausar: "Pause",
    reanudar: "Resume",
  },
  porque: {
    eyebrow: "Why AIworks",
    titulo: { antes: "No inflated promises.", clave: "Just sound judgement." },
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
    casos: {
      titulo: "Automation examples",
      anterior: "Previous example",
      siguiente: "Next example",
      hoyLabel: "Today",
      conIaLabel: "With AI",
      items: [
        {
          area: "Sales",
          titulo: "WhatsApp leads that arrive at night",
          hoy: "Night-time messages get answered the next day, and some have already bought elsewhere.",
          conIa: "Every message is classified on arrival; interested leads get a reply and go to sales first.",
        },
        {
          area: "Finance",
          titulo: "Bank reconciliation by hand",
          hoy: "Someone matches the statement against the system line by line, and the close waits until they finish.",
          conIa: "The system matches on reference and amount; the person reviews only the entries that do not add up.",
        },
        {
          area: "Documents",
          titulo: "PDF invoices arriving by email",
          hoy: "Every invoice is typed into the system again, and the mistakes surface at the next close.",
          conIa: "Invoices are read as they arrive and the data is entered once, with a person reviewing anything doubtful.",
        },
        {
          area: "Collections",
          titulo: "Overdue invoices nobody follows up",
          hoy: "Someone checks who owes what and writes to each customer one by one, when they find the time.",
          conIa: "The system spots overdue invoices, sends reminders and alerts a person when the customer replies.",
        },
        {
          area: "Reporting",
          titulo: "The Monday weekly report",
          hoy: "Several spreadsheets are stitched together by hand to build the same report every week.",
          conIa: "The report builds itself from the system's data and arrives by email with what changed.",
        },
        {
          area: "Operations",
          titulo: "Inventory that does not match the system",
          hoy: "Stock in the spreadsheet does not match the system, and nobody knows which one is right.",
          conIa: "Both are reconciled daily and only the differences reach whoever has to decide.",
        },
      ],
    },
  },
  preguntas: {
    eyebrow: "Frequently asked questions",
    titulo: { antes: "What people", clave: "usually ask us." },
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
        pregunta: "What if the AI gets it wrong?",
        respuesta:
          "That is why it does not decide alone on what matters. Sensitive steps go through a person before they execute, and every decision is recorded with its timestamp, so you can see what the system did and correct it.",
      },
      {
        pregunta: "What happens to my company's data?",
        respuesta:
          "It stays wherever you decide, and we sign a confidentiality agreement before seeing anything. We work under Ecuador's data protection law, and the assessment does not need real data for us to tell you whether the process can be automated.",
      },
    ],
  },
  cta: {
    eyebrow: "Contact",
    titulo: { antes: "Start by finding out", clave: "what is costing you most." },
    description:
      "In 15 minutes you will know which process is costing you the most and whether it can be automated. No cost, no obligation.",
    whatsapp: "Message us on WhatsApp",
    correoLabel: "or email us at",
  },
  whatsappFlotante: {
    titulo: "Need a hand?",
    texto: "Message us on WhatsApp",
    cerrar: "Dismiss",
  },
  footer: {
    navegacion: "Footer navigation",
    copyright: "© 2026 AIworks · Quito, Ecuador",
  },
} as const;
