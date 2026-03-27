/* ============================================================
   veille.js — Section Veille Technologique
   - Récupération des flux RSS via rss2json API
   - Classification automatique par mots-clés
   - Ticker défilant, filtres, synthèse IA animée
   ============================================================ */

/* ── SOURCES RSS ── */
const RSS_SOURCES = [
  { name: 'MIT Tech Review', url: 'https://www.technologyreview.com/feed/',                            color: '#3d9be9' },
  { name: 'VentureBeat AI',  url: 'https://venturebeat.com/category/ai/feed/',                        color: '#7fff6e' },
  { name: 'The Verge AI',    url: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml', color: '#ff6eb4' },
  { name: 'Wired AI',        url: 'https://www.wired.com/feed/tag/ai/latest/rss',                     color: '#ffcc44' },
  { name: 'ArXiv CS.AI',     url: 'https://rss.arxiv.org/rss/cs.AI',                                  color: '#b06eff' },
  { name: 'OpenAI Blog',     url: 'https://openai.com/news/rss.xml',                                  color: '#7fff6e' },
];

/* ── CLASSIFICATION PAR MOTS-CLÉS ── */
const TAGS_MAP = {
  generation: ['generat', 'text-to-image', 'text-to-video', 'diffusion', 'midjourney', 'dall-e', 'stable diffusion', 'sora', 'kling', 'gen-2', 'runway'],
  animation:  ['animat', 'motion', 'video', 'film', '3d', 'rendering', 'vfx', 'visual effect', 'frame', 'temporal'],
  modele:     ['model', 'llm', 'gpt', 'gemini', 'claude', 'llama', 'mistral', 'transformer', 'foundation', 'multimodal', 'training', 'fine-tun'],
  outil:      ['tool', 'plugin', 'software', 'app', 'platform', 'api', 'sdk', 'open source', 'framework', 'library', 'release', 'launch'],
  recherche:  ['research', 'paper', 'study', 'arxiv', 'benchmark', 'dataset', 'experiment', 'survey', 'academic'],
};

/* ── ARTICLES DE SECOURS (si flux indisponibles) ── */
const FALLBACK_ARTICLES = [
  {
    title: 'Sora : OpenAI dévoile la génération vidéo depuis le texte',
    desc: 'OpenAI présente Sora, un modèle capable de générer des vidéos réalistes de plusieurs secondes à partir de descriptions textuelles, marquant une avancée majeure pour l\'animation IA.',
    link: 'https://openai.com/sora',
    date: new Date().toISOString(),
    source: 'OpenAI Blog', color: '#7fff6e',
    tags: ['animation', 'generation', 'modele'],
  },
  {
    title: 'Stable Diffusion 3.5 : meilleure cohérence temporelle',
    desc: 'La dernière version apporte des améliorations notables en cohérence des frames, rendant la génération de séquences animées plus fluide et cohérente visuellement.',
    link: 'https://stability.ai',
    date: new Date(Date.now() - 3_600_000).toISOString(),
    source: 'VentureBeat AI', color: '#7fff6e',
    tags: ['animation', 'generation', 'outil'],
  },
  {
    title: 'Google DeepMind présente VideoPoet pour la génération vidéo',
    desc: 'VideoPoet est un modèle multimodal capable de générer, transformer et éditer des vidéos et animations à partir de texte, d\'images ou d\'audio.',
    link: 'https://deepmind.google',
    date: new Date(Date.now() - 7_200_000).toISOString(),
    source: 'MIT Tech Review', color: '#3d9be9',
    tags: ['animation', 'generation', 'modele', 'recherche'],
  },
  {
    title: 'RunwayML Gen-3 : l\'IA au service des studios d\'animation',
    desc: 'Gen-3 de Runway permet aux artistes de générer des séquences d\'animation broadcast depuis des prompts détaillés avec un contrôle précis du style et du mouvement.',
    link: 'https://runwayml.com',
    date: new Date(Date.now() - 10_800_000).toISOString(),
    source: 'The Verge AI', color: '#ff6eb4',
    tags: ['animation', 'outil', 'generation'],
  },
  {
    title: 'MusicGen + AnimateDiff : synergie audio-visuelle par IA',
    desc: 'Des chercheurs ont combiné MusicGen et AnimateDiff pour créer des clips animés synchronisés automatiquement avec de la musique générée, ouvrant de nouvelles perspectives créatives.',
    link: 'https://arxiv.org',
    date: new Date(Date.now() - 14_400_000).toISOString(),
    source: 'ArXiv CS.AI', color: '#b06eff',
    tags: ['animation', 'recherche', 'outil'],
  },
  {
    title: 'Le workflow IA de Pixar pour accélérer la pré-production',
    desc: 'Pixar intègre des outils d\'IA générative pour générer rapidement des concept arts et storyboards, réduisant le temps de création de 40% selon des sources internes.',
    link: 'https://www.wired.com',
    date: new Date(Date.now() - 18_000_000).toISOString(),
    source: 'Wired AI', color: '#ffcc44',
    tags: ['animation', 'outil', 'generation'],
  },
  {
    title: 'Kling AI : le concurrent de Sora qui impressionne Hollywood',
    desc: 'Kling, développé par Kuaishou, génère des vidéos HD de 2 minutes avec une cohérence physique remarquable et commence à être adopté par des studios de production.',
    link: 'https://venturebeat.com',
    date: new Date(Date.now() - 21_600_000).toISOString(),
    source: 'VentureBeat AI', color: '#7fff6e',
    tags: ['animation', 'generation', 'modele'],
  },
  {
    title: 'AnimateDiff v3 : contrôle précis du mouvement animé',
    desc: 'La version 3 introduit des ControlNets spécialisés pour le mouvement, permettant de diriger précisément les trajectoires et dynamiques des personnages générés par IA.',
    link: 'https://arxiv.org',
    date: new Date(Date.now() - 86_400_000).toISOString(),
    source: 'ArXiv CS.AI', color: '#b06eff',
    tags: ['animation', 'modele', 'recherche'],
  },
  {
    title: 'Midjourney v7 et la consistance de personnage pour l\'animation',
    desc: 'Midjourney v7 introduit une fonctionnalité de character reference qui maintient la cohérence visuelle d\'un personnage à travers de multiples générations, révolutionnant le design animé.',
    link: 'https://www.theverge.com',
    date: new Date(Date.now() - 172_800_000).toISOString(),
    source: 'The Verge AI', color: '#ff6eb4',
    tags: ['generation', 'animation', 'outil'],
  },
];

const AI_SUMMARY_TEXT =
  "L'IA générative révolutionne l'animation en 2024-2025. Des modèles comme Sora, Kling et Gen-3 " +
  "permettent de créer des séquences vidéo photoréalistes depuis un simple texte. Les studios intègrent " +
  "ces outils dans leur pipeline, réduisant drastiquement les coûts de pré-production. La cohérence " +
  "temporelle et le contrôle du mouvement restent les défis majeurs que chercheurs et entreprises s'efforcent de résoudre.";


/* ══════════════════════════════════════════════════════
   UTILITAIRES
   ══════════════════════════════════════════════════════ */

/**
 * Retourne "il y a X min / h / j" depuis une date ISO.
 */
function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 3600)  return Math.floor(diff / 60) + ' min';
  if (diff < 86400) return Math.floor(diff / 3600) + ' h';
  return Math.floor(diff / 86400) + ' j';
}

/**
 * Supprime les balises HTML et tronque à 200 caractères.
 */
function stripHTML(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html || '';
  return (tmp.textContent || tmp.innerText || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200) + '…';
}

/**
 * Classifie un article selon ses mots-clés.
 */
function classifyArticle(text) {
  const lower = text.toLowerCase();
  const tags  = [];
  for (const [tag, keywords] of Object.entries(TAGS_MAP)) {
    if (keywords.some(kw => lower.includes(kw))) tags.push(tag);
  }
  return tags.length ? tags : ['ia'];
}


/* ══════════════════════════════════════════════════════
   FETCH RSS
   ══════════════════════════════════════════════════════ */

/**
 * Récupère un flux RSS via l'API rss2json (proxy CORS gratuit).
 */
async function fetchFeed(source) {
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}&count=8`;
  try {
    const response = await fetch(apiUrl);
    const data     = await response.json();
    if (data.status !== 'ok') return [];

    return (data.items || []).map(item => ({
      title:  item.title  || 'Sans titre',
      desc:   stripHTML(item.description || item.content || ''),
      link:   item.link   || '#',
      date:   item.pubDate || new Date().toISOString(),
      source: source.name,
      color:  source.color,
      tags:   classifyArticle((item.title || '') + ' ' + (item.description || '')),
    }));
  } catch {
    return []; // Flux inaccessible → silencieux
  }
}


/* ══════════════════════════════════════════════════════
   CONSTRUCTION DU DOM
   ══════════════════════════════════════════════════════ */

/**
 * Crée une carte article.
 */
function buildArticleCard(article, index) {
  const card      = document.createElement('a');
  card.href        = article.link;
  card.target      = '_blank';
  card.rel         = 'noopener';
  card.className   = 'article-card';
  card.dataset.tags = article.tags.join(' ');
  card.style.animationDelay = `${index * 60}ms`;

  card.innerHTML = `
    <div class="article-source">
      <span class="source-dot" style="background:${article.color}"></span>
      <span class="source-name" style="color:${article.color}">${article.source}</span>
      <span class="source-date">${timeAgo(article.date)}</span>
    </div>
    <div class="article-title">${article.title}</div>
    <div class="article-desc">${article.desc}</div>
    <div class="article-tags">
      ${article.tags.map(t => `<span class="article-tag">${t}</span>`).join('')}
    </div>
    <span class="article-link">Lire l'article</span>
  `;

  return card;
}

/**
 * Construit le ticker défilant.
 */
function buildTicker(articles) {
  const track = document.getElementById('ticker-track');
  if (!track) return;

  const items = articles.slice(0, 16);
  // Duplication pour boucle seamless
  track.innerHTML = [...items, ...items]
    .map(a => `<span class="ticker-item">${a.title}<span class="t-src">[${a.source}]</span></span>`)
    .join('');
}

/**
 * Met à jour les statistiques.
 */
function updateStats(articles) {
  const elArticles = document.getElementById('stat-articles');
  const elToday    = document.getElementById('stat-today');

  if (elArticles) elArticles.textContent = articles.length;

  if (elToday) {
    const today = articles.filter(a =>
      new Date(a.date).toDateString() === new Date().toDateString()
    ).length;
    elToday.textContent = today || '—';
  }
}

/**
 * Effet machine à écrire.
 */
function typeWriter(element, text, speed = 20) {
  element.classList.add('ai-typing');
  let index = 0;
  element.textContent = '';

  const interval = setInterval(() => {
    element.textContent += text[index++];
    if (index >= text.length) {
      clearInterval(interval);
      element.classList.remove('ai-typing');
    }
  }, speed);
}


/* ══════════════════════════════════════════════════════
   FILTRES
   ══════════════════════════════════════════════════════ */

function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      document.querySelectorAll('.article-card').forEach(card => {
        const show = filter === 'all' || card.dataset.tags.includes(filter);
        card.classList.toggle('hidden', !show);
      });
    });
  });
}


/* ══════════════════════════════════════════════════════
   CHARGEMENT PRINCIPAL
   ══════════════════════════════════════════════════════ */

async function loadVeille() {
  const grid    = document.getElementById('veille-grid');
  const loading = document.getElementById('veille-loading');
  if (!grid || !loading) return;

  // Récupération parallèle de tous les flux
  const results  = await Promise.allSettled(RSS_SOURCES.map(fetchFeed));
  let articles   = results.flatMap(r => r.status === 'fulfilled' ? r.value : []);

  // Fallback si aucun article live
  if (articles.length === 0) {
    articles = FALLBACK_ARTICLES;
  }

  // Tri par date + déduplication
  articles.sort((a, b) => new Date(b.date) - new Date(a.date));
  articles = articles.filter((a, i, arr) => arr.findIndex(x => x.title === a.title) === i);

  // Affichage
  loading.style.display = 'none';
  articles.forEach((article, i) => grid.appendChild(buildArticleCard(article, i)));

  buildTicker(articles);
  updateStats(articles);

  // Synthèse IA avec effet machine à écrire
  const typingTarget = document.getElementById('ai-typing-target');
  if (typingTarget) {
    setTimeout(() => typeWriter(typingTarget, AI_SUMMARY_TEXT), 800);
  }
}


/* ══════════════════════════════════════════════════════
   INITIALISATION (lazy — déclenché à l'entrée en vue)
   ══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initFilters();

  const veilleSection = document.getElementById('veille');
  if (!veilleSection) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        loadVeille();
        observer.disconnect();
      }
    },
    { threshold: 0.05 }
  );

  observer.observe(veilleSection);
});
