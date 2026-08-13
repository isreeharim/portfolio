/* ============================================================
   PORTFOLIO DATA STORE & STATE MANAGEMENT
   Centralized data source with localStorage persistence & backward compatibility
============================================================ */

const STORAGE_KEY = 'sreehari_portfolio_data';
const AUTH_KEY = 'sreehari_admin_pin';
const DEFAULT_PIN = 'admin123';

const DEFAULT_PORTFOLIO_DATA = {
  meta: {
    siteTitle: "Sreehari M | Software Developer & Builder",
    metaDescription: "Sreehari M — Software Developer & Engineer specializing in full-stack web development, AI/ML, and crafting human-centered digital experiences.",
    brandName: "Sreehari",
    brandDot: "M",
    loaderText: "S",
    statusBadge: "Available for new opportunities",
    footerText: "Designed & Engineered by Sreehari M",
    footerSubtext: "Written in ink on digital parchment • Handcrafted with care."
  },
  hero: {
    badge: "Available for new opportunities",
    showBadge: true,
    greeting: "Hello, I'm",
    name: "Sreehari M",
    phrases: [
      "engineer resilient full-stack systems.",
      "craft human-centered digital products.",
      "build intelligent AI-powered apps.",
      "obsess over UI polish & micro-interactions.",
      "turn ambitious ideas into reality."
    ],
    summary: "A passionate Software Developer specializing in building high-performance web applications and intelligent systems. Focused on craft, accessibility, and invisible design details that make software feel great.",
    primaryBtnText: "Explore My Work",
    primaryBtnLink: "#projects",
    secondaryBtnText: "Get in Touch",
    secondaryBtnLink: "#contact"
  },
  stats: [
    { label: "Core Focus", value: "Full Stack & AI" },
    { label: "Mindset", value: "Craft & Detail" },
    { label: "Status", value: "Open to Work" }
  ],
  about: {
    headingNumber: "01.",
    headingTitle: "About & Philosophy",
    paragraphs: [
      "Hi, I'm Sreehari 👋 I'm a developer who cares deeply about the intersection of engineering rigor and thoughtful user experience.",
      "My journey started out of curiosity — pulling systems apart, understanding how things tick under the hood, and building from scratch. Over time, that curiosity evolved into designing and engineering production-grade web systems and exploring modern AI/ML applications.",
      "I believe great software is built on unseen details: instant feedback, sensible defaults, rock-solid reliability, and interfaces that feel effortless to use."
    ],
    codeCard: {
      name: "Sreehari M",
      role: "Software Developer",
      location: "India",
      passion: "Crafting Great Software",
      coffee: true,
      open: true
    },
    skills: [
      "JavaScript (ESNext)",
      "TypeScript",
      "Python",
      "React",
      "Node.js",
      "Express.js",
      "Next.js",
      "MongoDB",
      "PostgreSQL",
      "Tailwind CSS",
      "REST APIs",
      "Docker"
    ]
  },
  highlights: [
    {
      title: "Full-Stack Development",
      desc: "Architecting clean, resilient web applications from reactive frontends to scalable backend services.",
      icon: "code"
    },
    {
      title: "AI & Machine Learning",
      desc: "Integrating intelligent models, LLM workflows, and data pipelines to solve real problems.",
      icon: "cpu"
    },
    {
      title: "Design Engineering",
      desc: "Obsessing over physics-based motion, tactile feedback, typography hierarchy, and accessibility.",
      icon: "layers"
    }
  ],
  projects: [
    {
      id: "project-qr",
      title: "Dynamic QR",
      description: "A high-performance dynamic QR code manager with real-time analytics and instant destination redirection without reprinting.",
      techStack: ["JavaScript", "Node.js", "Express", "Analytics"],
      liveUrl: "https://qr.sreeharim.site/",
      githubUrl: "",
      featured: true,
      visible: true
    },
    {
      id: "project-trackmygov",
      title: "TrackMyGov",
      description: "A civic transparency and governance tracking platform allowing citizens to monitor public projects, schemes, and budget allocations.",
      techStack: ["JavaScript", "Node.js", "MongoDB", "Express"],
      liveUrl: "https://trackmygov.sreeharim.site/",
      githubUrl: "",
      featured: true,
      visible: true
    }
  ],
  contact: {
    overline: "04. What's Next?",
    heading: "Let's Build Something Together",
    description: "Whether you have an exciting project, a role opening, or just want to discuss software and design engineering — my inbox is always open.",
    formEmail: "isreeharim@gmail.com",
    btnText: "Send Letter 📬"
  },
  socials: {
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
