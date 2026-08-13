/* ============================================================
   ADMIN STUDIO SCRIPT — Full CRUD, Authentication & State Sync
============================================================ */

const SESSION_KEY = 'sreehari_admin_auth_session';

// In-memory working copy
let localPhrases = [];
let localSkills = [];
let localParagraphs = [];
let localStats = [];
let editingProjectId = null;
let editingMetricId = null;

// ── AUTHENTICATION GATE ───────────────────────────────────────
function initAuth() {
  const authGate = document.getElementById('auth-gate');
  const adminApp = document.getElementById('admin-app');
  const authForm = document.getElementById('auth-form');
  const authPinInput = document.getElementById('auth-pin');
  const authError = document.getElementById('auth-error');
  const togglePinBtn = document.getElementById('toggle-pin-visibility');
  const btnLock = document.getElementById('btn-lock');

  // Check existing session
  if (sessionStorage.getItem(SESSION_KEY) === 'true') {
    authGate.classList.add('hidden');
    adminApp.classList.remove('hidden');
    loadAllFormData();
  }

  // Toggle PIN visibility
  if (togglePinBtn) {
    togglePinBtn.addEventListener('click', () => {
      const isPassword = authPinInput.type === 'password';
      authPinInput.type = isPassword ? 'text' : 'password';
    });
  }

  // Handle Login Submit
  if (authForm) {
    authForm.addEventListener('submit', e => {
      e.preventDefault();
      const enteredPin = authPinInput.value.trim();
      
      if (verifyAdminPin(enteredPin)) {
        sessionStorage.setItem(SESSION_KEY, 'true');
        authError.textContent = '';
        authPinInput.value = '';
        authGate.classList.add('hidden');
        adminApp.classList.remove('hidden');
        loadAllFormData();
        showToast('Studio unlocked successfully!');
      } else {
        authError.textContent = 'Incorrect PIN. Please try again.';
        authPinInput.focus();
        authPinInput.select();
      }
    });
  }

  // Lock / Logout
  if (btnLock) {
    btnLock.addEventListener('click', () => {
      sessionStorage.removeItem(SESSION_KEY);
      adminApp.classList.add('hidden');
      authGate.classList.remove('hidden');
      authPinInput.value = '';
      showToast('Studio locked.');
    });
  }
}

// ── NAVIGATION TABS ───────────────────────────────────────────
function initTabs() {
  const navItems = document.querySelectorAll('.nav-item');
  const panels = document.querySelectorAll('.admin-panel');

  navItems.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.getAttribute('data-tab');

      navItems.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const activePanel = document.getElementById(targetTabId);
      if (activePanel) activePanel.classList.add('active');
    });
  });
}

// ── LOAD ALL FORM DATA ────────────────────────────────────────
function loadAllFormData() {
  const data = getPortfolioData();

  // 1. Hero
  if (data.hero) {
    setCheckbox('hero-input-badge-visible', data.hero.showBadge !== false);
    setCheckbox('hero-input-metrics-visible', data.hero.showMetrics !== false);
    setValue('hero-input-badge', data.hero.badge || data.meta?.statusBadge || '');
    setValue('hero-input-greeting', data.hero.greeting || '');
    setValue('hero-input-name', data.hero.name || '');
    setValue('hero-input-summary', data.hero.summary || '');
    setValue('hero-btn1-text', data.hero.primaryBtnText || '');
    setValue('hero-btn1-link', data.hero.primaryBtnLink || '');
    setValue('hero-btn2-text', data.hero.secondaryBtnText || '');
    setValue('hero-btn2-link', data.hero.secondaryBtnLink || '');
    localPhrases = Array.isArray(data.hero.phrases) ? [...data.hero.phrases] : [];
    renderHeroPhrases();
  }

  // Hero Metrics / Stats
  localStats = Array.isArray(data.stats) ? JSON.parse(JSON.stringify(data.stats)) : [];
  renderHeroMetricsAdminList();

  // 2. About
  if (data.about) {
    setValue('about-input-title', data.about.headingTitle || 'About Me');
    localParagraphs = Array.isArray(data.about.paragraphs) ? [...data.about.paragraphs] : [];
    renderAboutParagraphs();

    if (data.about.codeCard) {
      setValue('code-name', data.about.codeCard.name || '');
      setValue('code-role', data.about.codeCard.role || '');
      setValue('code-passion', data.about.codeCard.passion || '');
      setCheckbox('code-coffee', Boolean(data.about.codeCard.coffee));
      setCheckbox('code-open', Boolean(data.about.codeCard.open));
    }

    localSkills = Array.isArray(data.about.skills) ? [...data.about.skills] : [];
    renderSkillsTags();
  }

  // 3. Projects
  renderProjectsList();

  // 4. Socials & Contact & Meta
  if (data.socials) {
    setValue('social-email', data.socials.email || '');
    setValue('social-github-url', data.socials.github || '');
    setValue('social-linkedin-url', data.socials.linkedin || '');
    setValue('social-twitter-url', data.socials.twitter || '');
    setValue('social-instagram-url', data.socials.instagram || '');
  }

  if (data.contact) {
    setValue('contact-input-overline', data.contact.overline || '');
    setValue('contact-input-heading', data.contact.heading || '');
    setValue('contact-input-desc', data.contact.description || '');
    setValue('contact-form-email', data.contact.formEmail || '');
    setValue('contact-btn-text', data.contact.btnText || '');
  }

  if (data.meta) {
    setValue('meta-site-title', data.meta.siteTitle || '');
    setValue('meta-footer-text', data.meta.footerText || '');
    setValue('meta-footer-subtext', data.meta.footerSubtext || '');
    setValue('meta-desc-input', data.meta.metaDescription || '');
  }
}

function setValue(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}

function setCheckbox(id, checked) {
  const el = document.getElementById(id);
  if (el) el.checked = checked;
}

// ── 1. HERO SECTION HANDLERS ──────────────────────────────────
function renderHeroPhrases() {
  const container = document.getElementById('hero-phrases-list');
  if (!container) return;

  if (localPhrases.length === 0) {
    container.innerHTML = '<span style="color:var(--text-muted); font-size:0.8rem; font-family:var(--font-mono)">No phrases added yet.</span>';
    return;
  }

  container.innerHTML = localPhrases.map((phrase, index) => `
    <div class="tag-chip">
      <span>"${escapeHtml(phrase)}"</span>
      <button type="button" class="chip-remove" onclick="removeHeroPhrase(${index})" title="Remove phrase">✕</button>
    </div>
  `).join('');
}

function addHeroPhrase() {
  const input = document.getElementById('new-phrase-input');
  if (!input) return;
  const val = input.value.trim();
  if (!val) return;
  localPhrases.push(val);
  input.value = '';
  renderHeroPhrases();
  input.focus();
}

function removeHeroPhrase(index) {
  localPhrases.splice(index, 1);
  renderHeroPhrases();
}

// ── HERO METRIC PILLS (CRUD & TOGGLE) ─────────────────────────
function renderHeroMetricsAdminList() {
  const container = document.getElementById('hero-metrics-admin-list');
  if (!container) return;

  if (localStats.length === 0) {
    container.innerHTML = `<div style="font-family:var(--font-hand); font-size:1.15rem; color:var(--ink-muted); padding:10px;">No metric pills added yet. Use the builder above or presets below.</div>`;
    return;
  }

  container.innerHTML = localStats.map((stat, idx) => {
    const isHidden = stat.visible === false;
    const isFirst = idx === 0;
    const isLast = idx === localStats.length - 1;
    const labelText = stat.label || stat.value || 'Untitled Metric';
    const icon = stat.icon || '✦';

    return `
      <div class="admin-metric-row ${isHidden ? 'is-hidden' : ''}">
        <div class="admin-metric-left">
          <div class="proj-reorder-btns">
            <button type="button" class="btn-arrow" onclick="reorderMetric(${idx}, -1)" ${isFirst ? 'disabled' : ''} title="Move Up">▲</button>
            <button type="button" class="btn-arrow" onclick="reorderMetric(${idx}, 1)" ${isLast ? 'disabled' : ''} title="Move Down">▼</button>
          </div>
          <div class="metric-pill-preview">
            <span>${escapeHtml(icon)}</span>
            <strong>${escapeHtml(labelText)}</strong>
          </div>
        </div>
        <div class="admin-metric-actions">
          <button type="button" class="icon-action-btn" onclick="toggleMetricVisibility('${stat.id || idx}')" title="${isHidden ? 'Show on site' : 'Hide from site'}">
            ${isHidden ? '⚪ Hidden' : '🟢 Visible'}
          </button>
          <button type="button" class="icon-action-btn" onclick="editMetric('${stat.id || idx}')" title="Edit pill">
            ✏️ Edit
          </button>
          <button type="button" class="icon-action-btn delete-btn" onclick="deleteMetric('${stat.id || idx}')" title="Delete pill">
            ✕
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function setMetricEmoji(emoji) {
  const input = document.getElementById('metric-input-icon');
  if (input) {
    input.value = emoji;
    input.focus();
  }
}

function handleAddOrUpdateMetric() {
  const iconInput = document.getElementById('metric-input-icon');
  const labelInput = document.getElementById('metric-input-label');
  const icon = (iconInput ? iconInput.value.trim() : '') || '✦';
  const label = labelInput ? labelInput.value.trim() : '';

  if (!label) {
    showToast('Please enter a label for the metric pill.', 'error');
    if (labelInput) labelInput.focus();
    return;
  }

  if (editingMetricId) {
    const idx = localStats.findIndex(s => (s.id || '') === editingMetricId || String(localStats.indexOf(s)) === editingMetricId);
    if (idx !== -1) {
      localStats[idx] = {
        ...localStats[idx],
        icon: icon,
        label: label
      };
      showToast(`Updated metric "${label}"!`);
    }
    cancelEditMetric();
  } else {
    localStats.push({
      id: `stat-${Date.now()}`,
      icon: icon,
      label: label,
      visible: true
    });
    showToast(`Added metric pill "${label}"!`);
    if (labelInput) labelInput.value = '';
  }

  renderHeroMetricsAdminList();
}

function editMetric(id) {
  const stat = localStats.find(s => (s.id || '') === id || String(localStats.indexOf(s)) === id);
  if (!stat) return;

  editingMetricId = id;
  const iconInput = document.getElementById('metric-input-icon');
  const labelInput = document.getElementById('metric-input-label');
  const saveBtn = document.getElementById('btn-save-metric');
  const cancelBtn = document.getElementById('btn-cancel-edit-metric');

  if (iconInput) iconInput.value = stat.icon || '';
  if (labelInput) labelInput.value = stat.label || stat.value || '';
  if (saveBtn) saveBtn.innerHTML = '<span>Save Changes ✍️</span>';
  if (cancelBtn) cancelBtn.style.display = 'inline-flex';
  if (labelInput) labelInput.focus();
}

function cancelEditMetric() {
  editingMetricId = null;
  const iconInput = document.getElementById('metric-input-icon');
  const labelInput = document.getElementById('metric-input-label');
  const saveBtn = document.getElementById('btn-save-metric');
  const cancelBtn = document.getElementById('btn-cancel-edit-metric');

  if (iconInput) iconInput.value = '';
  if (labelInput) labelInput.value = '';
  if (saveBtn) saveBtn.innerHTML = '<span>+ Add Metric Pill</span>';
  if (cancelBtn) cancelBtn.style.display = 'none';
}

function quickAddMetric(icon, label) {
  localStats.push({
    id: `stat-${Date.now()}`,
    icon: icon,
    label: label,
    visible: true
  });
  renderHeroMetricsAdminList();
  showToast(`Added "${icon} ${label}"!`);
}

function toggleMetricVisibility(id) {
  const idx = localStats.findIndex(s => (s.id || '') === id || String(localStats.indexOf(s)) === id);
  if (idx !== -1) {
    localStats[idx].visible = localStats[idx].visible === false ? true : false;
    renderHeroMetricsAdminList();
  }
}

function deleteMetric(id) {
  localStats = localStats.filter(s => (s.id || '') !== id && String(localStats.indexOf(s)) !== id);
  renderHeroMetricsAdminList();
  showToast('Metric pill removed.');
}

function reorderMetric(index, direction) {
  const target = index + direction;
  if (target < 0 || target >= localStats.length) return;
  const temp = localStats[index];
  localStats[index] = localStats[target];
  localStats[target] = temp;
  renderHeroMetricsAdminList();
}

function saveHeroSection() {
  const data = getPortfolioData();
  data.hero = {
    ...data.hero,
    showBadge: document.getElementById('hero-input-badge-visible') ? document.getElementById('hero-input-badge-visible').checked : true,
    showMetrics: document.getElementById('hero-input-metrics-visible') ? document.getElementById('hero-input-metrics-visible').checked : true,
    badge: document.getElementById('hero-input-badge').value.trim(),
    greeting: document.getElementById('hero-input-greeting').value.trim(),
    name: document.getElementById('hero-input-name').value.trim(),
    summary: document.getElementById('hero-input-summary').value.trim(),
    primaryBtnText: document.getElementById('hero-btn1-text').value.trim(),
    primaryBtnLink: document.getElementById('hero-btn1-link').value.trim(),
    secondaryBtnText: document.getElementById('hero-btn2-text').value.trim(),
    secondaryBtnLink: document.getElementById('hero-btn2-link').value.trim(),
    phrases: [...localPhrases]
  };
  data.stats = [...localStats];

  const res = savePortfolioData(data);
  if (res.success) {
    showToast('Hero section & metric pills saved successfully!');
  } else {
    showToast('Error saving hero section.', 'error');
  }
}

// ── 2. ABOUT SECTION HANDLERS ─────────────────────────────────
function renderAboutParagraphs() {
  const container = document.getElementById('about-paragraphs-list');
  if (!container) return;

  if (localParagraphs.length === 0) {
    localParagraphs = ['Hi, I\'m Sreehari 👋\nI enjoy building things that live on the internet.'];
  }

  container.innerHTML = localParagraphs.map((p, index) => `
    <div class="paragraph-item">
      <textarea rows="3" onchange="updateParagraph(${index}, this.value)" placeholder="Paragraph text...">${escapeHtml(p)}</textarea>
      <button type="button" class="btn-remove-p" onclick="removeParagraph(${index})" title="Delete paragraph">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
  `).join('');
}

function updateParagraph(index, val) {
  localParagraphs[index] = val;
}

function addAboutParagraph() {
  localParagraphs.push('');
  renderAboutParagraphs();
}

function removeParagraph(index) {
  if (localParagraphs.length <= 1) {
    showToast('At least one bio paragraph is recommended.', 'error');
    return;
  }
  localParagraphs.splice(index, 1);
  renderAboutParagraphs();
}

function saveAboutSection() {
  const data = getPortfolioData();
  data.about = {
    ...data.about,
    headingTitle: document.getElementById('about-input-title').value.trim(),
    paragraphs: localParagraphs.filter(p => p.trim() !== ''),
    codeCard: {
      name: document.getElementById('code-name').value.trim(),
      role: document.getElementById('code-role').value.trim(),
      passion: document.getElementById('code-passion').value.trim(),
      coffee: document.getElementById('code-coffee').checked,
      open: document.getElementById('code-open').checked
    }
  };

  const res = savePortfolioData(data);
  if (res.success) {
    showToast('About section saved successfully!');
  } else {
    showToast('Error saving about section.', 'error');
  }
}

// ── 3. SKILLS SECTION HANDLERS ────────────────────────────────
function renderSkillsTags() {
  const container = document.getElementById('skills-tags-container');
  if (!container) return;

  if (localSkills.length === 0) {
    container.innerHTML = '<span style="color:var(--text-muted); font-size:0.8rem; font-family:var(--font-mono)">No skills added yet.</span>';
    return;
  }

  container.innerHTML = localSkills.map((skill, index) => `
    <div class="tag-chip">
      <span>${escapeHtml(skill)}</span>
      <button type="button" class="chip-remove" onclick="removeSkillTag(${index})" title="Remove skill">✕</button>
    </div>
  `).join('');
}

function addSkillTag() {
  const input = document.getElementById('new-skill-input');
  if (!input) return;
  const val = input.value.trim();
  if (!val) return;

  if (!localSkills.includes(val)) {
    localSkills.push(val);
    renderSkillsTags();
  }
  input.value = '';
  input.focus();
}

function removeSkillTag(index) {
  localSkills.splice(index, 1);
  renderSkillsTags();
}

function quickAddSkill(skill) {
  if (!localSkills.includes(skill)) {
    localSkills.push(skill);
    renderSkillsTags();
    showToast(`Added "${skill}" to skills!`);
  } else {
    showToast(`"${skill}" is already in your skills.`, 'error');
  }
}

function saveSkillsSection() {
  const data = getPortfolioData();
  data.about = {
    ...data.about,
    skills: [...localSkills]
  };

  const res = savePortfolioData(data);
  if (res.success) {
    showToast('Skills updated successfully!');
  } else {
    showToast('Error saving skills.', 'error');
  }
}

// ── 4. PROJECTS CRUD HANDLERS ─────────────────────────────────
function renderProjectsList(filterQuery = '') {
  const container = document.getElementById('admin-projects-list');
  const countBadge = document.getElementById('projects-count-badge');
  if (!container) return;

  const data = getPortfolioData();
  const projects = data.projects || [];
  
  if (countBadge) countBadge.textContent = `${projects.length} Project${projects.length === 1 ? '' : 's'}`;

  const filtered = projects.filter(p => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    const matchTitle = (p.title || '').toLowerCase().includes(q);
    const matchDesc = (p.description || '').toLowerCase().includes(q);
    const matchTech = (p.techStack || []).some(t => t.toLowerCase().includes(q));
    return matchTitle || matchDesc || matchTech;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--text-secondary); font-family: var(--font-mono);">
        <p>No projects found matching your filter.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((proj, idx) => {
    const originalIndex = projects.findIndex(p => p.id === proj.id);
    const isFirst = originalIndex === 0;
    const isLast = originalIndex === projects.length - 1;
    const isVisible = proj.visible !== false;

    const techPills = (proj.techStack || []).map(t => `<span class="proj-tech-pill">${escapeHtml(t)}</span>`).join('');

    return `
      <div class="admin-project-card ${isVisible ? '' : 'is-hidden'}">
        <div class="proj-card-left">
          <div class="proj-reorder-btns">
            <button type="button" class="btn-arrow" onclick="moveProject(${originalIndex}, -1)" ${isFirst ? 'disabled' : ''} title="Move Up">▲</button>
            <button type="button" class="btn-arrow" onclick="moveProject(${originalIndex}, 1)" ${isLast ? 'disabled' : ''} title="Move Down">▼</button>
          </div>
          <div class="proj-info">
            <h4>
              <span>${escapeHtml(proj.title || 'Untitled Project')}</span>
              <span class="tag-status ${isVisible ? 'active' : 'hidden-tag'}">
                ${isVisible ? 'Active' : 'Hidden'}
              </span>
              ${proj.featured ? '<span class="tag-status active" style="border-color:#0070f3; color:#0070f3;">Featured</span>' : ''}
            </h4>
            <p class="proj-desc">${escapeHtml(proj.description || 'No description.')}</p>
            <div class="proj-tech-tags">
              ${techPills}
            </div>
          </div>
        </div>

        <div class="proj-card-actions">
          <button type="button" class="icon-action-btn" onclick="toggleProjectVisibility('${escapeHtml(proj.id)}')" title="${isVisible ? 'Hide from landing page' : 'Show on landing page'}">
            ${isVisible ? '👁️ Hide' : '👁️ Show'}
          </button>
          <button type="button" class="icon-action-btn" onclick="openEditProjectModal('${escapeHtml(proj.id)}')" title="Edit Project">
            ✏️ Edit
          </button>
          <button type="button" class="icon-action-btn delete-btn" onclick="deleteProject('${escapeHtml(proj.id)}')" title="Delete Project">
            🗑️ Delete
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function filterProjectsList() {
  const query = document.getElementById('project-search-input').value.trim();
  renderProjectsList(query);
}

function openAddProjectModal() {
  editingProjectId = null;
  document.getElementById('modal-project-title').textContent = 'Add New Project';
  document.getElementById('modal-project-id').value = '';
  document.getElementById('modal-input-title').value = '';
  document.getElementById('modal-input-desc').value = '';
  document.getElementById('modal-input-tech').value = '';
  document.getElementById('modal-input-live').value = '';
  document.getElementById('modal-input-github').value = '';
  document.getElementById('modal-input-visible').checked = true;
  document.getElementById('modal-input-featured').checked = true;

  document.getElementById('project-modal').classList.remove('hidden');
}

function openEditProjectModal(projectId) {
  const data = getPortfolioData();
  const proj = (data.projects || []).find(p => p.id === projectId);
  if (!proj) return;

  editingProjectId = projectId;
  document.getElementById('modal-project-title').textContent = 'Edit Project';
  document.getElementById('modal-project-id').value = proj.id;
  document.getElementById('modal-input-title').value = proj.title || '';
  document.getElementById('modal-input-desc').value = proj.description || '';
  document.getElementById('modal-input-tech').value = (proj.techStack || []).join(', ');
  document.getElementById('modal-input-live').value = proj.liveUrl || '';
  document.getElementById('modal-input-github').value = proj.githubUrl || '';
  document.getElementById('modal-input-visible').checked = proj.visible !== false;
  document.getElementById('modal-input-featured').checked = Boolean(proj.featured);

  document.getElementById('project-modal').classList.remove('hidden');
}

function closeProjectModal() {
  document.getElementById('project-modal').classList.add('hidden');
  editingProjectId = null;
}

function handleSaveProject(e) {
  e.preventDefault();
  const data = getPortfolioData();
  if (!data.projects) data.projects = [];

  const rawTech = document.getElementById('modal-input-tech').value;
  const techStack = rawTech.split(',').map(t => t.trim()).filter(t => t.length > 0);

  const projectPayload = {
    id: editingProjectId || `project-${Date.now()}`,
    title: document.getElementById('modal-input-title').value.trim(),
    description: document.getElementById('modal-input-desc').value.trim(),
    techStack: techStack,
    liveUrl: document.getElementById('modal-input-live').value.trim(),
    githubUrl: document.getElementById('modal-input-github').value.trim(),
    visible: document.getElementById('modal-input-visible').checked,
    featured: document.getElementById('modal-input-featured').checked
  };

  if (editingProjectId) {
    const idx = data.projects.findIndex(p => p.id === editingProjectId);
    if (idx !== -1) {
      data.projects[idx] = projectPayload;
      showToast(`Updated "${projectPayload.title}"!`);
    }
  } else {
    data.projects.push(projectPayload);
    showToast(`Created new project "${projectPayload.title}"!`);
  }

  savePortfolioData(data);
  closeProjectModal();
  renderProjectsList();
}

function deleteProject(projectId) {
  const data = getPortfolioData();
  const proj = (data.projects || []).find(p => p.id === projectId);
  const title = proj ? proj.title : 'this project';

  if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

  data.projects = data.projects.filter(p => p.id !== projectId);
  savePortfolioData(data);
  renderProjectsList();
  showToast(`Deleted "${title}".`);
}

function toggleProjectVisibility(projectId) {
  const data = getPortfolioData();
  const proj = (data.projects || []).find(p => p.id === projectId);
  if (!proj) return;

  proj.visible = !(proj.visible !== false);
  savePortfolioData(data);
  renderProjectsList();
  showToast(`Project is now ${proj.visible ? 'Visible' : 'Hidden'}.`);
}

function moveProject(index, direction) {
  const data = getPortfolioData();
  const projects = data.projects || [];
  const targetIndex = index + direction;

  if (targetIndex < 0 || targetIndex >= projects.length) return;

  const temp = projects[index];
  projects[index] = projects[targetIndex];
  projects[targetIndex] = temp;

  data.projects = projects;
  savePortfolioData(data);
  renderProjectsList();
}

// ── 5. SOCIALS & CONTACT & META HANDLERS ──────────────────────
function saveSocialsAndMetaSection() {
  const data = getPortfolioData();

  data.socials = {
    ...data.socials,
    email: document.getElementById('social-email').value.trim(),
    github: document.getElementById('social-github-url').value.trim(),
    linkedin: document.getElementById('social-linkedin-url').value.trim(),
    twitter: document.getElementById('social-twitter-url').value.trim(),
    instagram: document.getElementById('social-instagram-url').value.trim()
  };

  data.contact = {
    ...data.contact,
    overline: document.getElementById('contact-input-overline').value.trim(),
    heading: document.getElementById('contact-input-heading').value.trim(),
    description: document.getElementById('contact-input-desc').value.trim(),
    formEmail: document.getElementById('contact-form-email').value.trim(),
    btnText: document.getElementById('contact-btn-text').value.trim()
  };

  data.meta = {
    ...data.meta,
    siteTitle: document.getElementById('meta-site-title').value.trim(),
    footerText: document.getElementById('meta-footer-text').value.trim(),
    footerSubtext: document.getElementById('meta-footer-subtext') ? document.getElementById('meta-footer-subtext').value.trim() : '',
    metaDescription: document.getElementById('meta-desc-input').value.trim()
  };

  const res = savePortfolioData(data);
  if (res.success) {
    showToast('Contact, Socials & Meta settings saved!');
  } else {
    showToast('Error saving settings.', 'error');
  }
}

// ── 6. BACKUP, RESTORE & SECURITY HANDLERS ────────────────────
function handleFileImport(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    const content = e.target.result;
    const res = importPortfolioData(content);
    if (res.success) {
      loadAllFormData();
      showToast('Portfolio data restored from JSON backup!');
    } else {
      showToast(`Import failed: ${res.error}`, 'error');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

function handleResetDefaults() {
  if (!confirm('⚠️ WARNING: This will erase all custom changes and restore original repository defaults. Are you sure?')) {
    return;
  }
  resetPortfolioData();
  loadAllFormData();
  showToast('Reset back to original template defaults.');
}

function handleChangePin(e) {
  e.preventDefault();
  const currentPin = document.getElementById('current-pin-input').value.trim();
  const newPin = document.getElementById('new-pin-input').value.trim();

  if (!verifyAdminPin(currentPin)) {
    showToast('Current PIN is incorrect.', 'error');
    return;
  }

  const res = setAdminPin(newPin);
  if (res.success) {
    document.getElementById('change-pin-form').reset();
    showToast('Studio PIN changed successfully!');
  } else {
    showToast(res.error, 'error');
  }
}

// ── TOAST NOTIFICATION HELPER ─────────────────────────────────
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'error' : ''}`;
  toast.innerHTML = `
    <span>${type === 'error' ? '✗' : '✓'}</span>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    if (toast.parentNode) toast.parentNode.removeChild(toast);
  }, 4000);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ── INITIALIZATION ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  initTabs();

  // Quick export button in header
  const quickExport = document.getElementById('btn-quick-export');
  if (quickExport) {
    quickExport.addEventListener('click', () => {
      exportPortfolioData();
      showToast('Exported portfolio backup!');
    });
  }

  // Handle Enter on dynamic tag inputs
  const phraseInput = document.getElementById('new-phrase-input');
  if (phraseInput) {
    phraseInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addHeroPhrase();
      }
    });
  }

  const skillInput = document.getElementById('new-skill-input');
  if (skillInput) {
    skillInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addSkillTag();
      }
    });
  }
});
