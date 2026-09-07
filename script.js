const GITHUB_USERNAME = "epoundor";
const LINKEDIN_URL = "https://www.linkedin.com/in/freedauss-epoundor-tanda/";
const EMAIL = "freedausstanda@gmail.com";
const SPOTIFY_PLAYLIST_URL="https://open.spotify.com/playlist/5JIxTjQ6Mgv5nLd4yy7F8e?utm_source=native-share-menu&pi=pdf7llMRS2eiE";
const FAMILY_PHOTO_SRC = "epoundor_family.JPG";
const GRASS_PHOTO_SRC = "epoundor_after_running.JPG";
const CV_LINK = "https://docs.google.com/document/d/1PDHW-CzmBi-bVykSQidmtsimGjbUgSTqqX7UJkaT1C0/export?format=pdf";
import { PROJECTS } from "./projects.js";

const thread = document.getElementById("thread");
const promptWrap = document.getElementById("promptWrap");
const promptForm = document.getElementById("promptForm");
const promptInput = document.getElementById("promptInput");
const suggestions = document.getElementById("suggestions");

let refCounter = 0;

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function makeId() {
  refCounter += 1;
  return `ref-${refCounter}`;
}

/* ---------- reusable response fragments ---------- */

function footnote(text, refId) {
  return `<span class="footnote" data-ref="${refId}">${text}<sup>[${refId.split("-")[1]}]</sup></span>`;
}
function inlineSuggestion(text,prompt) {
  return `<span class="inline-suggestion" data-prompt="${prompt}">${text}</span>`;
}

function refCard({ href, host, title, desc }) {
  return `<a class="ref-card" href="${href}" target="_blank" rel="noopener noreferrer">
    <div class="ref-host">${escapeHtml(host)}</div>
    <div class="ref-title">${escapeHtml(title)}</div>
    <div class="ref-desc">${escapeHtml(desc)}</div>
  </a>`;
}

function photoCard({ src, alt, caption }) {
  return `<div class="photo-card">
    <img src="${src}" alt="${escapeHtml(alt)}" loading="lazy" onerror="this.closest('.photo-card').classList.add('photo-missing')">
    <div class="photo-fallback">photo not found: ${escapeHtml(src)}</div>
    ${caption ? `<div class="photo-caption">${escapeHtml(caption)}</div>` : ""}
  </div>`;
}

function contribGraphPlaceholder(wrapId) {
  return `<div class="contrib-wrap" id="${wrapId}">
    <div class="contrib-loading">loading contribution graph&hellip;</div>
  </div>`;
}

async function loadContribGraph(wrapId) {
  const wrap = document.getElementById(wrapId);
  if (!wrap) return;
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(GITHUB_USERNAME)}?y=last`);
    if (!res.ok) throw new Error("bad response");
    const data = await res.json();
    const days = data.contributions || [];
    if (!days.length) throw new Error("no data");

    const weeks = [];
    let currentWeek = [];
    days.forEach((day, i) => {
      currentWeek.push(day);
      if (currentWeek.length === 7 || i === days.length - 1) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    const cells = weeks
      .map((week) => `<div class="contrib-col">${week.map((d) => `<span class="contrib-cell" data-level="${d.level}" title="${d.date}: ${d.count} contribution${d.count === 1 ? "" : "s"}"></span>`).join("")}</div>`)
      .join("");

    wrap.innerHTML = `
      <div class="contrib-grid">${cells}</div>
      <div class="contrib-caption">${(data.total?.lastYear ?? 0).toLocaleString()} contributions in the last year &middot; github.com/${escapeHtml(GITHUB_USERNAME)}</div>
    `;
    scrollThreadToBottom();
  } catch (err) {
    wrap.innerHTML = `<div class="contrib-caption">Couldn't load the live graph for github.com/${escapeHtml(GITHUB_USERNAME)}.</div>`;
    scrollThreadToBottom();
  }
}

/* ---------- canned Q&A content ---------- */

function getVariation(variations) {
  return variations[Math.floor(Math.random() * variations.length)];
}

const RESPONSES = [
  {
    key: "facts",
    triggers: ["top 5 facts", "top5 facts", "facts about him", "tell me about him", "fun facts", "les 5 choses les plus intéressantes", "top 5 des choses les plus intéressantes","Quelques informations sur lui", "Dis-moi des choses sur lui"],
    build: () => {
      const variations = [
        `
        &bull; Writing software for a few years now<br>
        &bull; Currently deep in a side project he swears he'll finish <a href="https://stakpass.com" target="_blank" rel="noopener noreferrer">(visit StakPass)</a><br>
        &bull; Enjoys tinkering with things that don't need tinkering<br>
        &bull; Thinks he's funnier than he actually is<br>
        &bull; Is, notably, bad at talking about himself
    `
  ,
  `
      &bull; Has been shipping software for a few years<br>
      &bull; Chipping away at a side project he insists he'll ship <a href="https://stakpass.com" target="_blank" rel="noopener noreferrer">(visit StakPass)</a><br>
      &bull; Rap and movies take up more headspace than they should <a href="${SPOTIFY_PLAYLIST_URL}" target="_blank" rel="noopener noreferrer">(playlist here)</a><br>
      &bull; Thinks his jokes land more than they do<br>
      &bull; Struggles to say anything real about himself
  `,
      `
      &bull; Been writing code for a few years now<br>
      &bull; Currently buried in a side project he swears is almost done <a href="https://stakpass.com" target="_blank" rel="noopener noreferrer">(visit StakPass)</a><br>
      &bull; Likes fixing things that were already working fine<br>
      &bull; Convinced he's funnier than he is<br>
      &bull; Genuinely terrible at talking about himself
  `,
  `
      &bull; Has been shipping software for a few years<br>
      &bull; Chipping away at a side project he insists he'll ship <a href="https://stakpass.com" target="_blank" rel="noopener noreferrer">(visit StakPass)</a><br>
      &bull; Can't leave a working thing alone<br>
      &bull; Thinks his jokes land more than they do<br>
      &bull; Struggles to say anything real about himself
  `,
  `
      &bull; Been writing code for a few years now<br>
      &bull; Currently buried in a side project he swears is almost done <a href="https://stakpass.com" target="_blank" rel="noopener noreferrer">(visit StakPass)</a><br>
      &bull; Likes fixing things that were already working fine<br>
      &bull; Big into rap and cinema <a href="${SPOTIFY_PLAYLIST_URL}" target="_blank" rel="noopener noreferrer">(his playlist)</a><br>
      &bull; Convinced he's funnier than he is<br>
  `,
  `
      &bull; A few years into writing software, still going<br>
      &bull; Deep in a side project that's "almost finished" <a href="https://stakpass.com" target="_blank" rel="noopener noreferrer">(visit StakPass)</a><br>
      &bull; Tinkers with stuff that didn't need it<br>
      &bull; Rap and cinema, in heavy rotation <a href="${SPOTIFY_PLAYLIST_URL}" target="_blank" rel="noopener noreferrer">(the playlist)</a><br>
      &bull; Rates his own humor higher than everyone else does<br>
  `,
  `
      &bull; Has been shipping software for a few years now<br>
      &bull; Chipping away at a side project he insists he'll ship <a href="https://stakpass.com" target="_blank" rel="noopener noreferrer">(visit StakPass)</a><br>
      &bull; Can't leave a working thing alone<br>
      &bull; Thinks his jokes land more than they do<br>
      &bull; Struggles to say anything real about himself
  `,
  `
      &bull; Been writing code for a few years now<br>
      &bull; Currently buried in a side project he swears is almost done <a href="https://stakpass.com" target="_blank" rel="noopener noreferrer">(visit StakPass)</a><br>
      &bull; Likes fixing things that were already working fine<br>
      &bull; Loves writing, drops articles on <a href="https://dev.to/epoundev" target="_blank" rel="noopener noreferrer">dev.to</a><br>
      &bull; Deep into AI and all that comes with it<br>
`,
`
      &bull; Has been shipping software for a few years<br>
      &bull; Chipping away at a side project he insists he'll ship <a href="https://stakpass.com" target="_blank" rel="noopener noreferrer">(visit StakPass)</a><br>
      &bull; Writes when he can, mostly on <a href="https://dev.to/epoundev" target="_blank" rel="noopener noreferrer">dev.to</a><br>
      &bull; Follows AI stuff a little too closely<br>
      &bull; Thinks his jokes land more than they do<br>
      `

    ]
    return getVariation(variations);
  },
  },
  {
    key: "rewrite",
    triggers: ["rewrite for the professionals", "professional", "formal bio", "linkedin bio"],
    build: () => {
      const variations = [
        "epoundor is a software engineer with a growing body of work across the stack, currently focused on building things that are equal parts useful and slightly overengineered. He values clean code, strong coffee, and pretending he read the whole changelog.",
        "epoundor builds software for a living and side projects for fun, which are occasionally the same project. He's detail-oriented, mildly stubborn about tabs vs. spaces, and always down to argue about tooling.",
        "epoundor is an engineer who enjoys solving problems that probably didn't need solving, but does it well anyway. Equal parts curious and caffeinated, he's usually mid-refactor on something nobody asked him to touch.",
        "epoundor is a software engineer currently building useful and occasionally overengineered things. He writes on dev.to when inspiration (or a deadline) strikes, and is deeply invested in the current AI wave. Equal parts curious and caffeinated, he’s usually mid-refactor on something nobody asked him to touch.",
        "epoundor is a software engineer who enjoys solving problems that probably didn't need solving, but does it well anyway. Equal parts curious and caffeinated, he's usually mid-refactor on something nobody asked him to touch.",
        "Epoundor TANDA is a senior Frontend Engineer with 6+ years of experience, having contributed to fintech and SaaS products deployed across 4+ West African countries, with a focus on application performance and user experience. I lead frontend teams, define engineering standards, and drive architecture end-to-end — from design to production.",
        "Epoundor TANDA is a senior Frontend Engineer with over 6 years in the field, building fintech and SaaS products live in 4+ West African countries, focused on application performance and user experience. I mentor frontend teams, set engineering standards, and own architecture from design through to production.",
        "Epoundor TANDA is a senior Frontend Engineer, 6+ years of experience shipping fintech and SaaS products across 4+ countries in West Africa, with a strong focus on app performance and UX. I lead frontend teams, establish engineering standards, and drive end-to-end architecture — from design to deployment.",
        "Epoundor TANDA is a senior Frontend Engineer, 6+ years of experience, building fintech and SaaS products across West Africa, with a strong focus on application performance and user experience. I lead frontend teams, define engineering standards, and drive architecture from design to production.",
      ];
      return getVariation(variations);
    },
  },
  {
    key: "proudof",
    triggers: ["most proud of", "proud of", "achievements", "accomplishments"],
    build: () => {
      const githubRef = makeId();
      const stakpassRef = makeId();
      const familyRef = makeId();
      const grassRef = makeId();
      const contribId = `contrib-${Math.random().toString(36).slice(2, 9)}`;
      setTimeout(() => {
        wireFootnotesAndInlineSuggestion();
        loadContribGraph(contribId);
      }, 0);
      return `
        Keeps ${footnote("shipping commits", githubRef)} on the regular,
        built many side ${inlineSuggestion("projects","show me his projects")} that actually got ${footnote("some real users", stakpassRef)},
        lives with ${footnote("his fiancée and kids", familyRef)},
        and still finds time to ${footnote("touch grass", grassRef)} occasionally.
        ${contribGraphPlaceholder(contribId)}
        <div class="ref-grid">
          <div id="${githubRef}">${refCard({ href: `https://github.com/${GITHUB_USERNAME}`, host: "github.com", title: "GitHub", desc: "epoundor's repos and commit history" })}</div>
          <div id="${stakpassRef}">${refCard({ href: "https://stakpass.com", host: "stakpass.com", title: "StakPass", desc: "A side project epoundor shipped" })}</div>
          <div id="${familyRef}">${photoCard({ src: FAMILY_PHOTO_SRC, alt: "epoundor with his fiancée and kid", caption: "Home team" })}</div>
          <div id="${grassRef}">${photoCard({ src: GRASS_PHOTO_SRC, alt: "epoundor touching grass after a run", caption: "Touching grass" })}</div>
        </div>
      `;
    },
  },
  {
    key: "cv",
    triggers: ["cv", "resume", "download cv", "download resume", "his cv", "his resume", "see his cv", "send his cv"],
    build: () => `
      Here's his CV — up to date, mostly honest.
      <div class="ref-grid">
        ${refCard({ href: CV_LINK, host: "docs.google.com", title: "Download CV", desc: "PDF export, opens in a new tab" })}
      </div>
    `,
  },
  {
    key: "contact",
    triggers: ["contact", "reach him", "get in touch", "how do i contact him"],
    build: () => `
      Add him on <a href="${LINKEDIN_URL}" target="_blank" rel="noopener noreferrer">LinkedIn</a>,
      follow him on <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" rel="noopener noreferrer">GitHub</a>,
      or <a href="mailto:${EMAIL}">email him</a>.
    `,
  },
   {
    key: "projects",
    triggers: ["projects", "show projects", "project", "show project", "show my projects", "list my projects", "list projects"],
    build: () => `
      Here are some of his projects.
      <div class="project-grid">
        ${ Object.entries(PROJECTS).map(([key, value]) => refCard({ href: value.link, host: value.link, title: key, desc: value.description })).join('')}
      </div>
      You can find more projects <a href="/projects">here</a>.
    `,
  },
];

function matchResponse(input) {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return null;
  for (const entry of RESPONSES) {
    if (entry.triggers.some((t) => normalized.includes(t) || t.includes(normalized))) {
      return entry;
    }
  }
  return null;
}

function fallbackResponse() {
  return `epoundor did not add support for custom prompts. Please forward all other questions and concerns to
    <a href="mailto:${EMAIL}">his inbox</a>. &#9757;&#65039;`;
}

/* ---------- rendering ---------- */

function scrollThreadToBottom() {
  thread.scrollTop = thread.scrollHeight;
}

function addUserMessage(text) {
  const el = document.createElement("div");
  el.className = "msg user";
  el.textContent = text;
  thread.appendChild(el);
  scrollThreadToBottom();
}

function addTypingIndicator() {
  const el = document.createElement("div");
  el.className = "msg assistant typing-msg";
  el.innerHTML = `
    <div class="avatar-row"><span class="avatar"></span><span class="model-name">epoundor-5-turbo</span></div>
    <div class="typing"><span></span><span></span><span></span></div>
  `;
  thread.appendChild(el);
  scrollThreadToBottom();
  return el;
}

function addAssistantMessage(html) {
  const el = document.createElement("div");
  el.className = "msg assistant";
  el.innerHTML = `
    <div class="avatar-row"><span class="avatar"></span><span class="model-name">epoundor-5-turbo</span></div>
    <div class="body">${html}</div>
  `;
  thread.appendChild(el);
  scrollThreadToBottom();
}

function wireFootnotesAndInlineSuggestion() {
  document.querySelectorAll(".footnote[data-ref]").forEach((node) => {
    if (node.dataset.wired) return;
    node.dataset.wired = "true";
    node.addEventListener("click", () => {
      const target = document.getElementById(node.dataset.ref);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  document.querySelectorAll(".inline-suggestion[data-prompt]").forEach((node) => {
    if (node.dataset.wired) return;
    node.dataset.wired = "true";
    node.addEventListener("click", () => {
      const target = node.dataset.prompt;
      promptInput.value = target;
      handleSubmit(target);
      promptInput.focus();
    });
  });


}

function dockPrompt() {
  if (!promptWrap.classList.contains("docked")) {
    promptWrap.classList.add("docked");
  }
}

function handleSubmit(rawText) {
  const text = rawText.trim();
  if (!text) return;

  dockPrompt();
  addUserMessage(text);
  promptInput.value = "";

  const typingEl = addTypingIndicator();
  const entry = matchResponse(text);

  setTimeout(() => {
    typingEl.remove();
    addAssistantMessage(entry ? entry.build() : fallbackResponse());
  }, 650 + Math.random() * 400);

  // suggest another question to ask
  
}

promptForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSubmit(promptInput.value);
});

promptInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSubmit(promptInput.value);
  }
});

suggestions.addEventListener("click", (e) => {
  const btn = e.target.closest(".suggestion-chip");
  if (!btn) return;
  handleSubmit(btn.dataset.prompt);
});

if (!("ontouchstart" in window)) {
  promptInput.focus();
}
