/* ============================================================
   PORTFOLIO DATA STORE & STATE MANAGEMENT
   Centralized data source with localStorage persistence
============================================================ */

const STORAGE_KEY = 'sreehari_portfolio_data';
const AUTH_KEY = 'sreehari_admin_pin';
const DEFAULT_PIN = 'admin123';

const DEFAULT_PORTFOLIO_DATA = {
  meta: {
    siteTitle: "Sreehari M | Developer Portfolio",
    metaDescription: "Sreehari M — Software Developer Portfolio. Full-stack developer specializing in web development, AI/ML, and building human-centered digital experiences.",
    brandName: "Sreehari",
    brandDot: "M",
    loaderText: "S",
    footerText: "Designed & Built by Sreehari M"
  },
  hero: {
    greeting: "Hi, my name is",
    name: "Sreehari",
    phrases: [
      "build things for the web.",
      "craft digital experiences.",
      "turn ideas into reality.",
      "love clean, impactful code."
    ],
    summary: "I'm a software developer specializing in building (and occasionally designing) exceptional digital experiences. Currently, I'm focused on building accessible, human-centered products.",
    primaryBtnText: "Check out my work",
    primaryBtnLink: "#projects",
    secondaryBtnText: "Get in touch",
    secondaryBtnLink: "#contact"
  },
  about: {
    headingNumber: "01.",
    headingTitle: "About Me",
    paragraphs: [
      "Hi, I'm Sreehari 👋\nI enjoy building things that live on the internet.",
      "My journey into tech started out of curiosity — experimenting, breaking things, and learning by doing. Over time, that curiosity turned into a strong interest in web development and intelligent systems.",
      "Today, I focus on creating meaningful digital experiences and working on projects in AI, ML, and full-stack development. I love combining creativity with technology to build solutions that actually make an impact."
    ],
    codeCard: {
      name: "Sreehari",
      role: "Full Stack",
      passion: "Coding",
      coffee: true,
      open: true
    },
    skills: [
      "JavaScript",
      "Python",
      "Node.js",
      "React",
      "Express.js",
      "MongoDB",
      "TypeScript",
      "Git & GitHub",
      "REST APIs",
      "Tailwind CSS"
    ]
  },
  projects: [
    {
      id: "project-qr",
      title: "Dynamic QR",
      description: "A dynamic QR code generator and manager. Create QR codes that can be updated without reprinting — perfect for menus, campaigns, and more.",
      techStack: ["JavaScript", "Node.js", "Express"],
      liveUrl: "https://qr.sreeharim.site/",
      githubUrl: "",
      featured: true,
      visible: true
    },
    {
      id: "project-trackmygov",
      title: "TrackMyGov",
      description: "A civic transparency platform to track government projects, schemes, and spending — empowering citizens to stay informed and hold authorities accountable.",
      techStack: ["JavaScript", "Node.js", "MongoDB"],
      liveUrl: "https://trackmygov.sreeharim.site/",
      githubUrl: "",
      featured: true,
      visible: true
    }
  ],
  contact: {
    overline: "03. What's Next?",
    heading: "Get In Touch",
    description: "I'm currently looking for any new opportunities, my inbox is always open. Whether you have a question or just want to say hi, I'll try my best to get back to you!",
    formEmail: "isreeharim@gmail.com",
    btnText: "Say Hello"
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
 * Deep merge to ensure backward compatibility if schema expands
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
 * Reset data back to repository defaults
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
