export const en = {
  header: {
    logo: "AIworks",
    nav: {
      services: "Services",
      processes: "Processes",
      howWeWork: "How we work",
      why: "Why AIworks",
      faq: "Questions",
      contact: "Contact",
    },
    cta: "Message us on WhatsApp",
  },
  hero: {
    category: { before: "", highlight: "AI-powered", after: " software." },
    benefit: "Built for the work your team still does by hand.",
    subtitle:
      "We are a consultancy: we build the software that does that work on its own, and we leave every decision it makes in plain view.",
    trackRecord: "Over 7 years solving processes.",
    cta: {
      primary: "Try our assistant",
      whatsapp: "Message us on WhatsApp",
    },
  },
  log: {
    title: "Operations log",
    label: "Sample flow",
    windowTitle: "aiworks — whatsapp-lead",
    command: "analyze-lead --channel=whatsapp",
    lines: [
      { time: "21:47", kind: "input", label: "input", text: "“Hi, do you have the plan for 20 users? We need it this month.”" },
      { time: "21:47", kind: "ai", label: "ai", text: "Intent: purchase. Urgency: high, needed this month." },
      { time: "21:47", kind: "ai", label: "ai", text: "Checks the CRM: new customer, 20-person company." },
      { time: "21:48", kind: "decision", label: "decision", text: "Replies with the plan and offers a call tomorrow." },
      { time: "21:48", kind: "review", label: "review", text: "Alerts sales to confirm the call." },
      { time: "21:48", kind: "log", label: "log", text: "Recorded with its timestamp and owner." },
    ],
    result: {
      label: "outcome",
      items: ["Priority lead", "Assigned to sales", "Answered in 1 minute"],
    },
    footnote: "Every decision is stored with its timestamp, its owner and its record. That is what makes an automation auditable instead of something you have to take on trust.",
  },
  services: {
    eyebrow: "What we build",
    title: { before: "Software shaped", highlight: "around how your company works." },
    subtitle:
      "Four lines of work. All of them end in software running on your data, with human review where it matters.",
    exampleLabel: "For example",
    items: [
      {
        icon: "processes",
        title: "Process automation",
        description:
          "Reconciliations, month-end close, reports and collections that today depend on copying and pasting between systems.",
        example: "A daily bank reconciliation that leaves a person only the entries that do not add up.",
        technologies: ["Python", "n8n", "PostgreSQL"],
      },
      {
        icon: "chatbots",
        title: "AI assistants and chatbots",
        description:
          "They answer on WhatsApp and on your website using your business's real information, hand to a person what they cannot answer, and log every conversation.",
        example: "An assistant that answers pricing and availability after hours and books calls with sales.",
        technologies: ["Claude", "OpenAI", "LangChain", "WhatsApp"],
      },
      {
        icon: "documents",
        title: "Document reading and classification",
        description:
          "Invoices, PDFs, emails and forms are read as they arrive and the data is entered into the system once.",
        example: "Supplier invoices recorded without typing, with a person reviewing doubtful amounts.",
        technologies: ["Python", "Claude", "FastAPI"],
      },
      {
        icon: "cloud",
        title: "Integration and cloud",
        description:
          "We connect what you already use and deploy to your own cloud, Azure or AWS, with the infrastructure written as code.",
        example: "The whole environment defined in Terraform: reproducible, auditable and in your account.",
        technologies: ["Azure", "AWS", "Terraform", "Docker", "GitHub Actions"],
      },
    ],
  },
  processes: {
    eyebrow: "Processes that can be automated",
    title: { before: "What still gets done by hand", highlight: "and shouldn't." },
    subtitle:
      "If you recognise any of these in your company, you already know where the hours that show up in no report are going.",
    itemCta: "Talk about this",
    items: [
      {
        number: "01",
        title: "Bank reconciliation",
        today: "Someone matches the statement against the system, line by line. The close depends on how many lines they get through before the day ends.",
        solution:
          "The system reads the statement, matches on reference and amount, and sets aside only the entries that do not add up. A person reviews the exceptions, not the five thousand rows.",
      },
      {
        number: "02",
        title: "Month-end close and data entry",
        today: "Data arrives in emails, PDFs and spreadsheets, and someone types it into the system again. Whatever is mistyped surfaces at the next close.",
        solution:
          "Documents are read as they arrive and the data is entered once. The team stops typing and starts deciding on what the system flagged.",
      },
      {
        number: "03",
        title: "Customer questions after hours",
        today: "Enquiries pile up overnight and Monday starts with a queue. The questions are almost always the same ones.",
        solution:
          "An assistant answers the repeat enquiries using your business's real information, and hands anything it cannot answer to a person. It does not improvise.",
      },
    ],
  },
  howWeWork: {
    eyebrow: "How we work",
    title: { before: "Three phases.", highlight: "No surprises." },
    phaseLabel: "Phase",
    subtitle:
      "Three phases, each ending with something concrete you receive. If the first one finds nothing worth automating, we tell you and it stops there.",
    deliverableLabel: "You receive",
    phases: [
      {
        number: "01",
        title: "Discovery",
        description:
          "We look at the process where it lives, with the people who run it today. We measure how long it takes and where it breaks.",
        deliverable: "A document with the process as it actually is, which part can be automated and which is better left alone.",
      },
      {
        number: "02",
        title: "Architecture and build",
        description:
          "We design the solution and build it in short increments, so you see it working before it is finished.",
        deliverable: "The system running on your real data, with the human-review rules already defined.",
      },
      {
        number: "03",
        title: "Going live",
        description:
          "We connect it to what you already use, train whoever will operate it, and leave the audit log running.",
        deliverable: "The system in production, the documentation to operate it, and the record of every decision it makes.",
      },
    ],
    stackLabel: "Technologies we work with",
    pause: "Pause",
    resume: "Resume",
  },
  why: {
    eyebrow: "Why AIworks",
    title: { before: "No inflated promises.", highlight: "Just sound judgement." },
    items: [
      {
        title: "Over 7 years solving processes",
        description:
          "The brand is new; the experience is not. It is over seven years leading software projects, most of it solving exactly this kind of problem.",
      },
      {
        title: "AI with a paper trail, not AI on blind faith",
        description:
          "Every automated decision is recorded with its timestamp, and the ones that matter go through a person before they execute. You can reconstruct why the system did what it did.",
      },
      {
        title: "From concept to production usually takes weeks",
        description:
          "We work in short increments on your real data. There is no six-month phase where you see nothing.",
      },
      {
        title: "Software someone else can maintain",
        description:
          "Tested, documented code, and it is yours. If you decide tomorrow to hand it to another team, you can.",
      },
    ],
    examples: {
      title: "Automation examples",
      previous: "Previous example",
      next: "Next example",
      todayLabel: "Today",
      withAiLabel: "With AI",
      items: [
        {
          area: "Sales",
          title: "WhatsApp leads that arrive at night",
          today: "Night-time messages get answered the next day, and some have already bought elsewhere.",
          withAi: "Every message is classified on arrival; interested leads get a reply and go to sales first.",
        },
        {
          area: "Finance",
          title: "Bank reconciliation by hand",
          today: "Someone matches the statement against the system line by line, and the close waits until they finish.",
          withAi: "The system matches on reference and amount; the person reviews only the entries that do not add up.",
        },
        {
          area: "Documents",
          title: "PDF invoices arriving by email",
          today: "Every invoice is typed into the system again, and the mistakes surface at the next close.",
          withAi: "Invoices are read as they arrive and the data is entered once, with a person reviewing anything doubtful.",
        },
        {
          area: "Collections",
          title: "Overdue invoices nobody follows up",
          today: "Someone checks who owes what and writes to each customer one by one, when they find the time.",
          withAi: "The system spots overdue invoices, sends reminders and alerts a person when the customer replies.",
        },
        {
          area: "Reporting",
          title: "The Monday weekly report",
          today: "Several spreadsheets are stitched together by hand to build the same report every week.",
          withAi: "The report builds itself from the system's data and arrives by email with what changed.",
        },
        {
          area: "Operations",
          title: "Inventory that does not match the system",
          today: "Stock in the spreadsheet does not match the system, and nobody knows which one is right.",
          withAi: "Both are reconciled daily and only the differences reach whoever has to decide.",
        },
      ],
    },
  },
  faq: {
    eyebrow: "Frequently asked questions",
    title: { before: "What people", highlight: "usually ask us." },
    items: [
      {
        question: "What does it cost?",
        answer:
          "It depends on the process and on how much has to be connected. In the 15-minute assessment we give you a concrete range for your case, with no obligation.",
      },
      {
        question: "How long does it take?",
        answer:
          "Discovery usually takes one to two weeks. After that, the first working version on your data is usually weeks away rather than months, because we deliver in parts.",
      },
      {
        question: "What if the AI gets it wrong?",
        answer:
          "That is why it does not decide alone on what matters. Sensitive steps go through a person before they execute, and every decision is recorded with its timestamp, so you can see what the system did and correct it.",
      },
      {
        question: "What happens to my company's data?",
        answer:
          "It stays wherever you decide, and we agree on confidentiality when the project starts. We work under Ecuador's data protection law, and the assessment does not need real data for us to tell you whether the process can be automated.",
      },
    ],
  },
  cta: {
    eyebrow: "Contact",
    title: { before: "Start by finding out", highlight: "what is costing you most." },
    description:
      "In 15 minutes you will know which process is costing you the most and whether it can be automated. No cost, no obligation.",
    whatsapp: "Message us on WhatsApp",
    emailLabel: "or email us at",
  },
  floatingWhatsapp: {
    title: "Need a hand?",
    text: "Message us on WhatsApp",
    close: "Dismiss",
  },
  footer: {
    description: "AI software consultancy for small and mid-sized businesses. Quito, Ecuador.",
    columns: {
      services: "Services",
      company: "Company",
      contact: "Contact",
      legal: "Legal",
    },
    examples: "Examples",
    location: "Quito, Ecuador",
    privacy: "Privacy policy",
    navigation: "Footer navigation",
    copyright: "© 2026 AIworks · Quito, Ecuador",
  },
  legal: {
    back: "Back to home",
    privacy: {
      title: "Privacy policy",
      updated: "Last updated: October 8, 2026",
      intro:
        "This policy explains which personal data AIworks receives through this website, what it is used for, and how you can exercise your rights under Ecuador's Organic Law on Personal Data Protection (LOPDP).",
      sections: [
        {
          title: "Who is responsible",
          paragraphs: [
            "AIworks, a software consultancy based in Quito, Ecuador, is responsible for processing the data described here. You can write to us at {email}.",
          ],
        },
        {
          title: "What data we receive",
          paragraphs: [
            "This website has a chat assistant. If you use it, we keep the conversation for 30 days to improve the answers and then delete it. We do not store your IP address in plain form: only a fingerprint that changes every day and is used to limit abuse.",
            "If you ask for a call, the company and job title you give us go into our sales records. Your phone number only reaches us if you message us on WhatsApp. By email we receive what you choose to send us: your address and the content of your message.",
            "The website uses no tracking cookies or analytics tools. Your browser stores two local preferences — language and light or dark mode — and, while the tab stays open, a chat session identifier. None of it can identify you.",
          ],
        },
        {
          title: "What we use it for",
          paragraphs: [
            "To answer your enquiry, prepare an assessment or a proposal, and follow up on the conversation you started. The legal basis is your consent when you contact us and, if we work together, the performance of the contract.",
            "We do not sell or share your data with third parties. We do not use it to send you advertising you did not ask for.",
          ],
        },
        {
          title: "Where it is kept and for how long",
          paragraphs: [
            "Messages stay in the services you chose to contact us through (Meta's WhatsApp or our email provider), which may process data outside Ecuador. We keep the conversation for as long as the business relationship lasts or until you ask us to delete it.",
          ],
        },
        {
          title: "Your rights",
          paragraphs: [
            "At any time you can ask to access your data, correct it, delete it, object to its processing, or receive it in a portable format. Write to us at {email} and we will reply within 15 days at most.",
            "If you believe we did not handle your request properly, you can contact Ecuador's Superintendency of Personal Data Protection.",
          ],
        },
        {
          title: "Changes to this policy",
          paragraphs: [
            "If this policy changes, we will publish the new version on this same page with its update date.",
          ],
        },
      ],
    },
  },
} as const;
