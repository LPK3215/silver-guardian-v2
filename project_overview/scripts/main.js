/* ═══════════════════════════════════════════════
   Main — 交互逻辑 / 渲染 / 动画
   ═══════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
  renderHeroBadges();
  renderStats();
  renderFeatures();
  renderSkills();
  renderTechStack();
  renderStructure();
  renderTimeline();
  renderCommands();
  initTabs();
  initAccordion();
  initThemeToggle();
  initScrollSpy();
  initReveal();
});

/* ── Hero 徽章 ── */
function renderHeroBadges() {
  const el = document.getElementById("hero-badges");
  if (!el) return;
  const badges = [
    { text: "MIT License", cls: "badge--accent" },
    { text: "Python 3.12+", cls: "badge--blue" },
    { text: "Vue 3", cls: "badge--green" },
    { text: "Docker Compose", cls: "badge--purple" },
    { text: PROJECT_DATA.meta.version, cls: "badge--accent" }
  ];
  el.innerHTML = badges.map(b =>
    `<span class="badge ${b.cls}">${b.text}</span>`
  ).join("");
}

/* ── 统计卡 ── */
function renderStats() {
  const el = document.getElementById("stats");
  if (!el) return;
  el.innerHTML = PROJECT_DATA.stats.map((s, i) => `
    <div class="stat-card reveal" style="transition-delay:${i * 60}ms">
      <div class="stat-card__value">${s.value}</div>
      <div class="stat-card__label">${s.label}</div>
    </div>
  `).join("");
}

/* ── 核心功能 ── */
function renderFeatures() {
  const el = document.getElementById("features-grid");
  if (!el) return;
  const features = PROJECT_DATA.features;
  el.innerHTML = Object.values(features).map((f, i) => `
    <div class="card reveal" style="transition-delay:${i * 80}ms">
      <div class="card__icon" style="background:${f.color}22;color:${f.color}">${f.icon}</div>
      <h3 class="card__title">${f.title}</h3>
      <ul style="margin-top:0.6rem">
        ${f.items.map(item => `
          <li style="padding:0.3rem 0 0.3rem 1rem;position:relative;font-size:0.85rem;color:var(--text-dim);line-height:1.5">
            <span style="position:absolute;left:0;color:${f.color}">▸</span>${item}
          </li>`).join("")}
      </ul>
    </div>
  `).join("");
}

/* ── 技能列表 ── */
function renderSkills() {
  const el = document.getElementById("skills-list");
  if (!el) return;
  el.innerHTML = PROJECT_DATA.skills.map((s, i) => `
    <div class="card reveal" style="transition-delay:${i * 60}ms">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.4rem">
        <h3 class="card__title mono">${s.name}</h3>
        <span class="chip">${s.version}</span>
      </div>
      <p class="card__desc">${s.desc}</p>
      <div class="card__tags">
        ${s.custom
          ? '<span class="badge badge--accent">自定义</span>'
          : '<span class="badge badge--blue">内置</span>'}
      </div>
    </div>
  `).join("");
}

/* ── 技术栈表 ── */
function renderTechStack() {
  const el = document.getElementById("tech-stack");
  if (!el) return;
  el.innerHTML = `
    <table class="tech-table">
      <thead><tr><th>层级</th><th>技术</th><th>版本</th></tr></thead>
      <tbody>
        ${PROJECT_DATA.techStack.map(t => `
          <tr>
            <td style="font-weight:600">${t.layer}</td>
            <td>${t.tech}</td>
            <td class="mono" style="color:var(--text-dim)">${t.version}</td>
          </tr>`).join("")}
      </tbody>
    </table>`;
}

/* ── 目录树 ── */
function renderStructure() {
  const el = document.getElementById("structure-tree");
  if (!el) return;
  const lines = PROJECT_DATA.structure.split("\n");
  el.innerHTML = lines.map(line => {
    let cls = "tree-item--file";
    if (line.includes("/") && !line.includes(".") && line.trim() && !line.includes("──")) cls = "tree-item--dir";
    const commentMatch = line.match(/(\s{2}.+)$/);
    if (commentMatch && commentMatch[1] && !line.includes("├") && !line.includes("└") && !line.includes("│")) {
      // pure comment line
    }
    // detect comment after tree symbol
    const parts = line.split("  ");
    if (parts.length >= 2) {
      const treePart = parts[0];
      const rest = parts.slice(1).join("  ");
      const nameMatch = rest.match(/^([^\s]+)\s+(.+)$/);
      if (nameMatch) {
        return `<span class="${cls}">${treePart}  ${nameMatch[1]}</span>  <span class="tree-item--comment">${nameMatch[2]}</span>`;
      }
    }
    return `<span class="${cls}">${line}</span>`;
  }).join("\n");
}

/* ── 版本时间线 ── */
function renderTimeline() {
  const el = document.getElementById("timeline");
  if (!el) return;
  el.innerHTML = PROJECT_DATA.versions.map(v => `
    <div class="timeline-item">
      <div class="timeline-item__version">${v.version}${v.current ? ' <span class="badge badge--accent" style="font-size:0.65rem;padding:0.1rem 0.5rem">当前</span>' : ''}</div>
      <div class="timeline-item__desc">${v.desc}</div>
    </div>
  `).join("");
}

/* ── 开发命令 ── */
function renderCommands() {
  const el = document.getElementById("commands");
  if (!el) return;
  el.innerHTML = PROJECT_DATA.commands.map(c => `
    <div class="cmd-block">${c.cmd}<span style="color:var(--text-dim);margin-left:1rem"># ${c.desc}</span></div>
  `).join("");
}

/* ── Tab 切换 ── */
function initTabs() {
  document.querySelectorAll("[data-tabs]").forEach(group => {
    const tabs = group.querySelectorAll(".tab");
    const panels = group.querySelectorAll(".tab-panel");
    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        panels.forEach(p => p.classList.remove("active"));
        tab.classList.add("active");
        if (panels[i]) panels[i].classList.add("active");
      });
    });
  });
}

/* ── 折叠面板 ── */
function initAccordion() {
  document.querySelectorAll(".accordion").forEach(acc => {
    const header = acc.querySelector(".accordion__header");
    header.addEventListener("click", () => acc.classList.toggle("open"));
  });
}

/* ── 主题切换 ── */
function initThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
  const root = document.documentElement;
  const stored = localStorage.getItem("overview-theme");
  if (stored) root.setAttribute("data-theme", stored);
  updateThemeIcon(root.getAttribute("data-theme") || "dark");

  toggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("overview-theme", next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    toggle.innerHTML = theme === "dark"
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  }
}

/* ── 滚动高亮导航 ── */
function initScrollSpy() {
  const links = document.querySelectorAll(".top-nav__link");
  const sections = document.querySelectorAll("[data-section]");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("data-section");
        links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === `#${id}`));
      }
    });
  }, { rootMargin: "-30% 0px -60% 0px" });

  sections.forEach(s => observer.observe(s));
}

/* ── 渐入动画 ── */
function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}
