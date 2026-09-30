/* ============================================================
   PORTFOLIO DATA STORE & STATE MANAGEMENT
   Centralized data source with localStorage persistence & backward compatibility
   Grounded 100% in Sreehari M's Resume & Verified Profile
============================================================ */

const STORAGE_KEY = 'sreehari_portfolio_data';
const AUTH_KEY = 'sreehari_admin_pin';
const DEFAULT_PIN = 'admin123';

const DEFAULT_PORTFOLIO_DATA = {
  meta: {
    siteTitle: "Sreehari M | Full-Stack & AI Software Developer",
    metaDescription: "Sreehari M — BCA in Artificial Intelligence, Machine Learning & Robotics. Full-stack developer building SaaS platforms, AI-powered systems, and secured API workflows.",
    brandName: "Sreehari M",
    brandDot: "",
    loaderText: "Sreehari M",
    statusBadge: "Available for new opportunities",
    footerText: "Designed & Engineered by Sreehari M",
    footerSubtext: "Built with vanilla HTML, CSS & JS · Deployed on GitHub Pages"
  },
  hero: {
    badge: "Available for new opportunities",
    showBadge: true,
    showMetrics: true,
    greeting: "Hello, I'm",
    name: "Sreehari M",
    phrases: [
      "build AI & Machine Learning applications.",
      "engineer SaaS platforms with React & Node.js.",
      "design role-based auth & JWT security.",
      "solve complex data & API workflow challenges.",
      "turn ambitious ideas into reliable software."
    ],
    summary: "BCA graduate specializing in Artificial Intelligence, Machine Learning, Robotics, and full-stack software development. Experienced in building practical applications, working through structured workflows, identifying data & API issues, and delivering secured, user-facing systems.",
    primaryBtnText: "Explore My Projects",
    primaryBtnLink: "#projects",
    secondaryBtnText: "Get in Touch",
    secondaryBtnLink: "#contact"
  },
  stats: [
    { id: "stat-1", icon: "⚡", label: "Full-Stack & AI", visible: true },
    { id: "stat-2", icon: "🛡️", label: "JWT & RBAC Security", visible: true },
    { id: "stat-3", icon: "🎓", label: "BCA (AI, ML & Robotics)", visible: true },
    { id: "stat-4", icon: "🟢", label: "Open to Opportunities", visible: true }
  ],
  about: {
    headingNumber: "01.",
    headingTitle: "About & Qualifications",
    paragraphs: [
      "Hi, I'm Sreehari M 👋 I'm a BCA graduate in Artificial Intelligence, Machine Learning & Robotics from Yenepoya University, with a strong foundation in full-stack web software development.",
      "I specialize in architecting practical applications — from full-stack SaaS platforms with dynamic URL redirection and real-time scan analytics to automated AI-powered job discovery engines. I focus on end-to-end data integrity, structured API workflows, JWT authentication, and Role-Based Access Control (RBAC).",
      "Whether it's quality review, error debugging, process improvement, context-aware AI operations, or responsive user-facing UI — I bring a detail-oriented problem-solving mindset and adaptability to fast-paced operational environments."
    ],
    education: [
      {
        institution: "Yenepoya deemed to be University",
        degree: "BCA – Artificial Intelligence, Machine Learning & Robotics",
        detail: "Foundation in AI, Machine Learning models, Robotics algorithms, and modern software engineering."
      },
      {
        institution: "GVHSS Pullanur",
        degree: "Higher Secondary Education",
        detail: "Higher secondary studies with focus on Computer Science and Mathematics."
      },
      {
        institution: "THS Manjeri",
        degree: "Secondary Education",
        detail: "Technical High School education with technical foundations."
      }
    ],
    codeCard: {
      name: "Sreehari M",
      role: "Software Developer",
      degree: "BCA (AI, ML & Robotics)",
      location: "Kerala, India",
      passion: "Full-Stack SaaS & AI Operations",
      coffee: true,
      open: true
    },
    skills: [
      "JavaScript",
      "Python",
      "HTML5",
      "CSS3",
      "React",
      "Tailwind CSS",
      "React Router",
      "Responsive Design",
      "Node.js",
      "Express.js",
      "REST APIs",
      "MongoDB",
      "Mongoose",
      "JWT Authentication",
      "RBAC Security",
      "Git",
      "GitHub",
      "Postman",
      "Vercel",
      "VS Code"
    ]
  },
  highlights: [
    {
      title: "AI & Machine Learning",
      desc: "Artificial Intelligence fundamentals, Machine Learning principles, automated job matching algorithms, data pipelines, and intelligent operational workflows.",
      icon: "cpu"
    },
    {
      title: "Full-Stack Software Development",
      desc: "Architecting end-to-end web platforms using React, Express, Node.js, and MongoDB with clean APIs, data export workflows, and responsive UIs.",
      icon: "code"
    },
    {
      title: "Security & Role-Based Access",
      desc: "Implementing JWT authentication, Role-Based Access Control (RBAC), protected API endpoints, authenticated CSV exports, and multi-tier user/admin management.",
      icon: "layers"
    }
  ],
  achievements: [
    "Developed and deployed a live full-stack SaaS platform with dynamic URL redirection and real-time geolocation scan analytics.",
    "Implemented JWT security and Role-Based Access Control (RBAC) for multi-tier user and administrator workflows.",
    "Built an authenticated CSV data-export workflow and global system controls using React, Express, and MongoDB."
  ],
  projects: [
    {
      id: "project-qr",
      title: "Dynamic QR Code Management System",
      description: "Developed & deployed a full-stack SaaS-style QR platform with dynamic URL redirects, real-time scan analytics, role-based access control (RBAC), multi-tier user & admin management, and authenticated CSV data export workflows using React, Express, MongoDB, and REST APIs.",
      techStack: ["React", "Node.js", "Express", "MongoDB", "REST APIs", "JWT", "RBAC"],
      liveUrl: "https://qr.sreeharim.site/",
      githubUrl: "https://github.com/isreeharim/qrsree",
      featured: true,
      visible: true
    },
    {
      id: "project-collegecentre",
      title: "CollegeCentre – AI-Powered Job Discovery Platform",
      description: "Built a job discovery platform helping students find relevant fresher opportunities from multiple sources. Designed workflows for job collection, duplicate detection, categorization, filtering, application tracking, and AI-based skill matching against candidate profiles.",
      techStack: ["React", "Node.js", "Express", "MongoDB", "AI Matching", "REST APIs"],
      liveUrl: "https://collegecentre.site/",
      githubUrl: "https://github.com/collegecentre/Collegecentre",
      featured: true,
      visible: true
    }
  ],
  contact: {
    overline: "04. Contact & Inquiries",
    heading: "Let's Connect & Build",
    description: "Based in Kerala, India. Open for full-stack software development roles, AI operations, and technical opportunities.",
    formEmail: "isreeharim@gmail.com",
    btnText: "Send Letter 📬"
  },
  socials: {
    location: "Kerala, India",
    phone: "+91 8129402549",
    email: "isreeharim@gmail.com",
    github: "https://github.com/isreeharim",
    linkedin: "https://www.linkedin.com/in/isreeharim/",
    twitter: "https://x.com/iamsreehari_",
    instagram: "https://www.instagram.com/iamsreehari_/"
  }
};

/**
 * Retrieve current portfolio data from localStorage or default
 */
function getPortfolioData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
    const parsed = JSON.parse(raw);
    return deepMerge(DEFAULT_PORTFOLIO_DATA, parsed);
  } catch (err) {
    console.error("Error reading portfolio data:", err);
    return JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
  }
}

/**
 * Deep merge to ensure backward compatibility
 */
function deepMerge(target, source) {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] });
        else output[key] = deepMerge(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Save data to localStorage and dispatch custom event for live updates
 */
function savePortfolioData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('portfolioDataUpdated', { detail: data }));
    return { success: true };
  } catch (err) {
    console.error("Error saving portfolio data:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Reset data back to defaults
 */
function resetPortfolioData() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('portfolioDataUpdated', { detail: DEFAULT_PORTFOLIO_DATA }));
  return JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
}

/**
 * Export portfolio data as a JSON file download
 */
function exportPortfolioData() {
  const data = getPortfolioData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `portfolio-data-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Import portfolio data from JSON string
 */
function importPortfolioData(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') throw new Error("Invalid JSON structure");
    savePortfolioData(parsed);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Admin PIN helpers
 */
function getAdminPin() {
  return localStorage.getItem(AUTH_KEY) || DEFAULT_PIN;
}

function setAdminPin(newPin) {
  if (!newPin || newPin.trim().length < 4) {
    return { success: false, error: "PIN must be at least 4 characters." };
  }
  localStorage.setItem(AUTH_KEY, newPin.trim());
  return { success: true };
}

function verifyAdminPin(enteredPin) {
  const current = getAdminPin();
  return enteredPin === current;
}
