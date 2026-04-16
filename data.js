// All portfolio content lives here.
// To update anything — just edit this file.

const FORMSPREE_URL = 'https://formspree.io/f/YOUR_FORM_ID'; // replace with your Formspree endpoint

const FILES = {
  'welcome.md': `# welcome.md

Hey, glad you're here.

This site looks like VS Code - the text editor most developers live in. You don't need to know that to get around. Here's all you need:

- Click any file on the **left sidebar** to open it
- Press **Ctrl+K** (or the search icon) to jump anywhere fast
- Click the **×** on a tab to close it
- Press **Ctrl+\`** to open a terminal if you're curious

## Quick links

| File | What's inside |
|------|---------------|
| \`about-me.md\` | Who I am and what I work on |
| \`projects/\` | Four real projects with context and impact |
| \`skills.json\` | Languages, tools, and certifications |
| \`experience.md\` | Work history and education |
| \`resume.pdf\` | Downloads automatically |
| \`contact.md\` | How to reach me |

---

*Currently open to backend, AI, and security engineering roles.*`,

  'about-me.md': `# about-me.md

## Hi, I'm Sneha

I'm a computer science student at the University of South Florida (GPA 3.72, Dean's List 2025). I build backend systems and security automation tools. Right now I'm a Security Analyst at Cyber Florida, writing automation for a 10+ analyst SOC team and investigating 50+ daily alerts using Splunk and Microsoft Defender.

## What I work on

**Backend development.** I build APIs with Python and FastAPI, containerize with Docker, and deploy on AWS and cloud platforms. I care about clean architecture and systems that hold up under real use.

**Security engineering.** I write automation that makes SOC work faster and more consistent. I've blocked 15+ malicious IPs weekly through threat analysis and built tools that cut analyst reporting time by 25%.

**AI tooling.** I've shipped tools that put LLMs to practical use — a code explainer that combines static analysis with LLM reasoning, a syllabus planner that parses PDFs into structured study schedules, and a wellbeing companion with a structured reasoning framework.

## Right now

Security Analyst at Cyber Florida. CS student at USF. Building projects on weekends.

Looking for roles in **backend engineering**, **security engineering**, or **AI tooling**. Internships or full-time.

## Outside of code

Bellini College Ambassador at USF. Tech Lead at Google Developers Group USF. Development Director at Trinket for Education. Secretary of the Nepalese Student Association.

## Get in touch

- Email: [lsneha991@gmail.com](mailto:lsneha991@gmail.com)
- GitHub: [github.com/typicaleoxx](https://github.com/typicaleoxx)
- LinkedIn: [linkedin.com/in/snehalama](https://www.linkedin.com/in/snehalama)`,

  'projects/syllabAI.md': `# syllabAI.md

## SyllabAI

An AI-powered academic planner that turns syllabus PDFs or pasted text into structured deadlines, risk scores, weekly study plans, and calendar exports.

**The problem.** Syllabus documents are dense and unstructured. Students miss high-impact deadlines because the information is scattered across 10-page PDFs with no urgency signaling.

**What it does.**

- Upload a PDF or paste syllabus text
- Extracts assignments, exams, deadlines, course codes, and instructor contacts
- Scores each item by risk level: HIGH, MEDIUM, or LOW based on due date and weight
- Dashboard shows today's focus, weekly plan, and upcoming items
- Exports deadlines as ICS for Google Calendar, Apple Calendar, and Outlook
- Chat assistant with configurable tone for planning questions

## Tech stack

\`\`\`json
{
  "frontend": ["Next.js 14", "React 18", "TypeScript", "Tailwind CSS"],
  "backend": ["FastAPI", "Pydantic", "Uvicorn"],
  "ai_and_parsing": ["Groq API", "PyPDF2"],
  "storage": "Browser localStorage"
}
\`\`\`

## Impact

Full pipeline from raw PDF to action-oriented calendar. Multi-syllabus merge on the dashboard. Risk-aware color-coded UI. ICS file download. Chat quick-add updates the calendar directly.

## Links

- GitHub: [github.com/typicaleoxx/syllabAI](https://github.com/typicaleoxx/syllabAI)
- Live: [syllab-ai-five.vercel.app](https://syllab-ai-five.vercel.app)

**Status:** Deployed`,

  'projects/ai-code-explainer.md': `# ai-code-explainer.md

## AI Code Explainer

A developer tool that converts raw source code into plain-language explanations of logic, security risks, and performance issues.

**The problem.** Reading unfamiliar code is slow. Security reviewers and new team members spend most of their time just understanding what code does before they can evaluate it.

**What it does.**

- Paste any source code into the input
- Hybrid analysis pipeline: Python AST for static analysis combined with LLM reasoning
- Returns what the code does, security risks present, and performance notes
- 40% improvement in contextual code understanding compared to static analysis alone

## Tech stack

\`\`\`json
{
  "backend": ["Python", "FastAPI", "Python AST"],
  "ai": ["LLM APIs", "Hugging Face"],
  "infrastructure": ["Docker", "AWS ECS", "CI/CD Pipelines"]
}
\`\`\`

## Impact

Containerized and deployed to AWS ECS via CI/CD pipelines. Real-time inference through cloud LLM APIs. 40% improvement in contextual understanding over static analysis alone.

**Status:** Deployed`,

  'projects/ai-wellbeing-companion.md': `# ai-wellbeing-companion.md

## AI Wellbeing Companion

A conversational assistant built to respond to stress and anxiety messages through a real-time chat interface.

**The problem.** People dealing with stress often want to talk it through, but don't always have someone available. Most chatbots give robotic, generic responses that feel dismissive.

**What it does.**

- Real-time chat interface for stress and anxiety messages
- 5-stage reasoning framework guiding how each response is structured
- Designed to feel like talking to a thoughtful person, not a FAQ bot
- 50% improvement in response clarity and conversational flow

## Tech stack

\`\`\`json
{
  "backend": ["Python"],
  "ai": ["LLM APIs", "Structured reasoning pipeline"],
  "interface": "Real-time chat UI"
}
\`\`\`

## Impact

50% improvement in response clarity through the structured 5-stage reasoning framework. Focused on practical usefulness over novelty.

**Status:** Completed`,

  'projects/soc-macro-extension.md': `# soc-macro-extension.md

## SOC Macro Chrome Extension

A Chrome extension that automates repetitive incident documentation for Security Operations Center analysts.

**The problem.** SOC analysts spend a chunk of every shift copy-pasting the same information into incident tickets. It's manual, error-prone, and draining during high-alert periods.

**What it does.**

- One-click automation for standard incident documentation workflows
- Designed and deployed for the Cyber Florida SOC team
- Adopted by 10+ analysts across the team
- Reduced analyst reporting time by 25%
- Improved consistency across SOC investigation tickets

## Tech stack

\`\`\`json
{
  "extension": ["JavaScript", "Chrome Extension APIs"],
  "devops": ["Git", "CI/CD Pipelines"],
  "deployment": "Internal Chrome distribution"
}
\`\`\`

## Impact

Actively used by 10+ SOC analysts. 25% reduction in reporting time. Measurably improved ticket consistency across the team. Built during my role as Security Analyst at Cyber Florida.

**Status:** Deployed, actively used`,

  'skills.json': `{
  "languages": [
    "Python",
    "JavaScript",
    "Java",
    "C",
    "C++",
    "SQL"
  ],
  "frameworks": [
    "FastAPI",
    "Django",
    "Django REST Framework",
    "Next.js",
    "Streamlit"
  ],
  "databases": [
    "PostgreSQL",
    "Firestore"
  ],
  "security": [
    "Splunk",
    "Microsoft Defender",
    "Incident Response",
    "Threat Modeling",
    "NIST CSF",
    "ICS/OT Security"
  ],
  "tools": [
    "Git",
    "Docker",
    "Linux",
    "Postman",
    "Hugging Face",
    "CI/CD Pipelines"
  ],
  "cloud": [
    "AWS ECS",
    "Vercel",
    "Render"
  ],
  "currently_learning": [
    "Distributed Systems",
    "Cloud Infrastructure"
  ],
  "certifications": [
    "Security BTL1",
    "SANS ICS410",
    "SANS ICS310"
  ]
}`,

  'experience.md': `# experience.md

## Education

**University of South Florida**
Bachelor of Science, Computer Science — Tampa, FL

- GPA: 3.72
- Dean's List 2025
- Coursework: Data Structures, Algorithms, Computer Organization, Discrete Mathematics, Software Design

## Work experience

### Security Analyst — Cyber Florida
*Tampa, FL | May 2025 - Present*

- Built SOC automation microservices in JavaScript using Docker and CI/CD pipelines, cutting repetitive analyst effort by 25% across a 10+ analyst team
- Investigated 50+ daily security alerts using Splunk and Microsoft Defender, optimized alert parsing routines, and blocked 15+ malicious IPs weekly
- Developed standardized incident response documentation through Python scripts and version-controlled repos, improving triage consistency

### NIST Security Assistant — Cyber Florida
*Tampa, FL | Jan 2025 - May 2025*

- Conducted ICS/OT security assessments using structured threat modeling, NIST cybersecurity frameworks, and Python-based simulations
- Investigated system anomalies and automated report generation on cloud platforms, supporting proactive cyber defense

## Leadership

### Bellini College Ambassador — USF
*2026 - Present*

- Represent Bellini College at outreach events and open houses, engaging 100+ prospective students and families
- Promote academic pathways in AI, cybersecurity, and computing

### Tech Lead — Google Developers Group USF
*May 2025 - Dec 2025*

- Led backend development using Firebase, Firestore, and Next.js API routes to build community developer tools
- Mentored student developers on backend architecture, Git workflows, and software engineering best practices

### Development Director — Trinket for Education
*Jan 2025 - Present*

- Directed development for Project Students, supporting academically underprivileged students through mentorship and program coordination

### Secretary — Nepalese Student Association USF
*May 2024 - Present*

- Organized 3+ campus events, increasing student participation by 25%

## Certifications

- **Security BTL1**
- **SANS ICS410** — Industrial Control Systems Security
- **SANS ICS310** — Business of ICS Security`,

  'contact.md': `# contact.md

## Let's talk

I'm open to backend engineering, security engineering, and AI tooling roles. Internships or full-time.

| | |
|--|--|
| Email | lsneha991@gmail.com |
| GitHub | [github.com/typicaleoxx](https://github.com/typicaleoxx) |
| LinkedIn | [linkedin.com/in/snehalama](https://www.linkedin.com/in/snehalama) |
| Phone | (602) 663-4616 |

---

## Send a message

<contact-form></contact-form>`,
};

const TREE = [
  { type: 'file', name: 'welcome.md' },
  { type: 'file', name: 'about-me.md' },
  {
    type: 'folder', name: 'projects', open: false,
    children: [
      { type: 'file', name: 'syllabAI.md' },
      { type: 'file', name: 'ai-code-explainer.md' },
      { type: 'file', name: 'ai-wellbeing-companion.md' },
      { type: 'file', name: 'soc-macro-extension.md' },
    ],
  },
  { type: 'file', name: 'skills.json' },
  { type: 'file', name: 'experience.md' },
  { type: 'file', name: 'contact.md' },
  { type: 'file', name: 'resume.pdf' },
];

const COMMANDS = [
  { id: 'about',      label: 'Open About Me',           icon: 'file-md',  action: () => openFile('about-me.md') },
  { id: 'projects',   label: 'View Projects',            icon: 'folder',   action: () => { expandFolder('projects'); openFile('projects/syllabAI.md'); } },
  { id: 'syllab',     label: 'syllabAI',                 icon: 'file-md',  action: () => openFile('projects/syllabAI.md') },
  { id: 'codeexp',    label: 'AI Code Explainer',        icon: 'file-md',  action: () => openFile('projects/ai-code-explainer.md') },
  { id: 'wellbeing',  label: 'AI Wellbeing Companion',   icon: 'file-md',  action: () => openFile('projects/ai-wellbeing-companion.md') },
  { id: 'socmacro',   label: 'SOC Macro Extension',      icon: 'file-md',  action: () => openFile('projects/soc-macro-extension.md') },
  { id: 'skills',     label: 'View Skills',              icon: 'file-json',action: () => openFile('skills.json') },
  { id: 'experience', label: 'Open Experience',          icon: 'file-md',  action: () => openFile('experience.md') },
  { id: 'contact',    label: 'Contact Me',               icon: 'file-md',  action: () => openFile('contact.md') },
  { id: 'resume',     label: 'Download Resume',          icon: 'file-pdf', action: () => downloadResume() },
  { id: 'github',     label: 'Open GitHub',              icon: 'external', action: () => window.open('https://github.com/typicaleoxx', '_blank') },
  { id: 'linkedin',   label: 'Open LinkedIn',            icon: 'external', action: () => window.open('https://www.linkedin.com/in/snehalama', '_blank') },
  { id: 'theme',      label: 'Toggle Theme',             icon: 'theme',    action: () => toggleTheme() },
  { id: 'terminal',   label: 'Open Terminal',            icon: 'terminal', action: () => toggleTerminal(true) },
  { id: 'cleartabs',  label: 'Close All Tabs',           icon: 'close',    action: () => closeAllTabs() },
  { id: 'welcome',    label: 'Open Welcome',             icon: 'file-md',  action: () => openFile('welcome.md') },
];

const TERMINAL_RESPONSES = {
  whoami: `<span class="t-green">sneha lama</span> — security analyst &amp; backend engineer
cs student @ university of south florida (gpa 3.72)
building backend systems, security automation, and ai tools
<span class="t-muted">currently open to: backend | security | ai engineering roles</span>`,

  ls: `<span class="t-blue">projects/</span>   about-me.md   skills.json   experience.md   contact.md   resume.pdf   welcome.md`,

  'ls projects': `<span class="t-blue">projects/</span>
  syllabAI.md
  ai-code-explainer.md
  ai-wellbeing-companion.md
  soc-macro-extension.md`,

  skills: `<span class="t-yellow">languages:</span>    Python, JavaScript, Java, C, C++, SQL
<span class="t-yellow">frameworks:</span>   FastAPI, Django, Next.js, Streamlit
<span class="t-yellow">security:</span>     Splunk, Microsoft Defender, NIST CSF, Incident Response
<span class="t-yellow">tools:</span>        Git, Docker, Linux, Postman, CI/CD
<span class="t-yellow">cloud:</span>        AWS ECS, Vercel, Render
<span class="t-yellow">certs:</span>        Security BTL1, SANS ICS410, SANS ICS310`,

  contact: `<span class="t-yellow">email:</span>    lsneha991@gmail.com
<span class="t-yellow">github:</span>   github.com/typicaleoxx
<span class="t-yellow">linkedin:</span> linkedin.com/in/snehalama
<span class="t-yellow">phone:</span>    (602) 663-4616`,

  help: `<span class="t-green">available commands:</span>
  <span class="t-blue">whoami</span>          who is sneha
  <span class="t-blue">ls</span>              list files
  <span class="t-blue">ls projects</span>     list all projects
  <span class="t-blue">open &lt;file&gt;</span>     open a file in the editor
  <span class="t-blue">open resume</span>     download resume.pdf
  <span class="t-blue">skills</span>          print skills summary
  <span class="t-blue">contact</span>         print contact info
  <span class="t-blue">clear</span>           clear terminal
  <span class="t-blue">git log</span>         ...
  <span class="t-blue">git status</span>      ...
  <span class="t-blue">git blame</span>       ...`,

  'git log': `<span class="t-yellow">commit a1b2c3d</span> <span class="t-muted">(HEAD -> main, origin/main)</span>
Author: Sneha Lama &lt;lsneha991@gmail.com&gt;
Date:   just now

    finally finished the portfolio at 2am

<span class="t-yellow">commit f9e8d7c</span>
    fixed that one bug that was definitely not my fault

<span class="t-yellow">commit 3a4b5c6</span>
    added more projects (hired yet?)

<span class="t-yellow">commit 7f8e9d0</span>
    initial commit: existence`,

  'git status': `On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, everything is deployed
<span class="t-green">(and looking for opportunities)</span>`,

  'git blame': `<span class="t-muted">^</span> about-me.md    <span class="t-yellow">(Sneha Lama</span>  2026-04-16) # about-me.md
<span class="t-muted">^</span> skills.json    <span class="t-yellow">(Sneha Lama</span>  2026-04-16) built these
<span class="t-muted">^</span> projects/      <span class="t-yellow">(Sneha Lama</span>  2026-04-16) shipped these
<span class="t-muted">^</span> this portfolio <span class="t-yellow">(Sneha Lama</span>  2026-04-16) made this too

<span class="t-muted">// yeah, it's all her</span>`,
};
