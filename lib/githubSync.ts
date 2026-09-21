export interface RawGitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics?: string[];
  fork: boolean;
  pushed_at: string;
}

export interface SyncedProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
  github: string;
  demoUrl?: string;
  imageUrl?: string;
  featured?: boolean;
  stars?: number;
  forks?: number;
  language?: string;
  category?: 'ai' | 'web' | 'java' | 'python' | 'all';
}

const KNOWN_PROJECT_META: Record<string, { title: string; description: string; tags: string[]; featured?: boolean; category?: 'ai' | 'web' | 'java' | 'python' | 'all'; imageUrl?: string }> = {
  'carrersphere-ai': {
    title: 'CarrerSphere-Ai',
    description: 'All-in-one AI career platform for learning, interview preparation, skill development, and discovering jobs across career fields.',
    tags: ['AI', 'React', 'Next.js', 'Python', 'Full Stack'],
    featured: true,
    category: 'ai'
  },
  'foodwise': {
    title: 'FoodWise – Surplus Food Rescue',
    description: 'Real-time food rescue platform connecting restaurants and donors with surplus food directly to local shelters and volunteers.',
    tags: ['Full Stack', 'TypeScript', 'Social Impact', 'Web App'],
    featured: true,
    category: 'web'
  },
  'om-ai-action-assistant': {
    title: 'OM – AI Action Assistant',
    description: 'Intelligent AI action assistant deconstructing complex goals into structured 4-phase execution roadmaps (Think, Plan, Act, Achieve).',
    tags: ['AI Assistant', 'JavaScript', 'Roadmap Engine', 'Automation'],
    featured: true,
    category: 'ai'
  },
  'edubridge': {
    title: 'EduBridge Learning Platform',
    description: 'Interactive educational web application delivering structured curricula, video courses, and student learning paths.',
    tags: ['TypeScript', 'Next.js', 'EdTech', 'Responsive Web'],
    featured: true,
    category: 'web'
  },
  'java-developer-projects': {
    title: 'Hospital & Hotel Management System',
    description: 'Advanced Java console-based management systems demonstrating OOP, collections, exception handling, data structures, and file persistence.',
    tags: ['Java', 'OOP', 'Data Structures', 'Console App'],
    featured: true,
    category: 'java'
  },
  'intelligence-graph-app': {
    title: 'AI Intelligence Graph Data Pipeline',
    description: 'Production-grade AI Intelligence Data Pipeline for automated ingestion, graph analytics, and data modeling in an AI ecosystem.',
    tags: ['AI Pipeline', 'Data Engineering', 'Graph Data', 'Python'],
    featured: false,
    category: 'ai'
  },
  'data-science_task_project': {
    title: 'T20 Cricket & Data Analytics',
    description: 'Comprehensive data science and analytical project parsing T20 cricket statistics to discover player performance trends.',
    tags: ['Python', 'Data Analytics', 'Pandas', 'Matplotlib'],
    featured: false,
    category: 'python'
  },
  'python--developer_projects-task': {
    title: 'Python Developer & Automation Tasks',
    description: 'A hands-on collection of Python developer projects, automation scripts, grocery management tools, and logic-based chatbots.',
    tags: ['Python', 'Automation', 'CLI Tools', 'OOP'],
    featured: false,
    category: 'python'
  },
  'frontend-_mini_project-': {
    title: 'Frontend UI Mini Projects',
    description: 'Collection of interactive web applications and responsive mini-projects showcasing modern JavaScript and CSS UI/UX.',
    tags: ['JavaScript', 'HTML5', 'CSS3', 'UI/UX Design'],
    featured: false,
    category: 'web'
  },
  'weather-dashboard': {
    title: 'Real-Time Weather Dashboard',
    description: 'Modern weather dashboard fetching real-time meteorological forecasts from public APIs with a responsive, dynamic UI.',
    tags: ['JavaScript', 'REST API', 'Weather', 'Dynamic UI'],
    featured: false,
    category: 'web'
  },
  'random-joke-generator': {
    title: 'Interactive Random Joke Generator',
    description: 'Engaging interactive web application fetching randomized jokes via REST API with smooth animations and theme toggles.',
    tags: ['JavaScript', 'REST API', 'Animations', 'Web App'],
    featured: false,
    category: 'web'
  },
  'software-developer_task': {
    title: 'Software Developer Engineering Challenges',
    description: 'Technical implementations of algorithmic problem solving, clean code architecture, and software developer tasks.',
    tags: ['Python', 'Software Engineering', 'Algorithms'],
    featured: false,
    category: 'python'
  },
  'yuva-intern_task': {
    title: 'Cybersecurity Threat Intelligence (CTI)',
    description: 'Cyber Threat Intelligence and security incident analysis report outlining threat modeling and defensive strategies.',
    tags: ['Cybersecurity', 'CTI', 'Threat Analysis'],
    featured: false,
    category: 'all'
  },
  'hello-app': {
    title: 'Flutter Mobile Hello App',
    description: 'Clean mobile application built with Flutter and Kotlin showcasing mobile architecture and user-friendly interface.',
    tags: ['Flutter', 'Kotlin', 'Mobile App', 'Android'],
    featured: false,
    category: 'all'
  },
  'skill-nexis-_task': {
    title: 'Skill-Nexis Developer Task',
    description: 'Technical project assessing data manipulation and algorithmic solutions.',
    tags: ['Python', 'Data Logic', 'Problem Solving'],
    featured: false,
    category: 'python'
  },
  'codec_technologies_task': {
    title: 'CodeC Technologies Assessment',
    description: 'Frontend implementation focusing on clean HTML/CSS architecture and semantic design.',
    tags: ['HTML5', 'CSS3', 'Responsive Design'],
    featured: false,
    category: 'web'
  }
};

/**
 * Format repo name into clean title
 */
function cleanTitle(rawName: string): string {
  const lower = rawName.toLowerCase();
  if (KNOWN_PROJECT_META[lower]) {
    return KNOWN_PROJECT_META[lower].title;
  }
  return rawName
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();
}

/**
 * Derives tags from GitHub repository metadata
 */
function deriveTags(repo: RawGitHubRepo): string[] {
  const lower = repo.name.toLowerCase();
  if (KNOWN_PROJECT_META[lower]?.tags) {
    return KNOWN_PROJECT_META[lower].tags;
  }

  const tags: string[] = [];
  if (repo.language) tags.push(repo.language);
  if (repo.topics && Array.isArray(repo.topics)) {
    repo.topics.forEach(t => {
      const clean = t.charAt(0).toUpperCase() + t.slice(1);
      if (!tags.includes(clean)) tags.push(clean);
    });
  }

  if (lower.includes('ai') || lower.includes('gpt') || lower.includes('bot')) {
    if (!tags.includes('AI')) tags.push('AI');
  }
  if (lower.includes('python')) {
    if (!tags.includes('Python')) tags.push('Python');
  }
  if (lower.includes('java')) {
    if (!tags.includes('Java')) tags.push('Java');
  }
  if (lower.includes('web') || lower.includes('frontend')) {
    if (!tags.includes('Web')) tags.push('Web');
  }

  return tags.length > 0 ? tags.slice(0, 5) : ['Software Development'];
}

/**
 * Categorizes a project based on its tags and name
 */
function categorize(title: string, tags: string[], language: string | null): 'ai' | 'web' | 'java' | 'python' | 'all' {
  const text = `${title} ${tags.join(' ')} ${language || ''}`.toLowerCase();
  if (text.includes('ai') || text.includes('machine learning') || text.includes('intelligence')) return 'ai';
  if (text.includes('java') && !text.includes('javascript')) return 'java';
  if (text.includes('python') || text.includes('pandas') || text.includes('data science') || text.includes('analytics')) return 'python';
  if (text.includes('web') || text.includes('frontend') || text.includes('html') || text.includes('javascript') || text.includes('typescript') || text.includes('react') || text.includes('next')) return 'web';
  return 'all';
}

/**
 * Transforms a GitHub repo into our standard SyncedProject
 */
export function transformRepo(repo: RawGitHubRepo): SyncedProject {
  const lower = repo.name.toLowerCase();
  const known = KNOWN_PROJECT_META[lower];

  const title = cleanTitle(repo.name);
  const description = known?.description || repo.description || `Software development project hosted on GitHub under @${repo.full_name.split('/')[0]}.`;
  const tags = deriveTags(repo);
  const category = known?.category || categorize(title, tags, repo.language);

  // Determine demo URL if present
  let demoUrl = repo.homepage || undefined;
  if (demoUrl && demoUrl.trim() === '') {
    demoUrl = undefined;
  }

  return {
    id: `gh-${repo.id || repo.name}`,
    title,
    description,
    tags,
    github: repo.html_url,
    demoUrl,
    imageUrl: known?.imageUrl || '',
    featured: known?.featured || repo.stargazers_count > 0,
    stars: repo.stargazers_count || 0,
    forks: repo.forks_count || 0,
    language: repo.language || undefined,
    category,
  };
}

/**
 * Fetch all repositories from GitHub API for a given username.
 * Accurately mirrors GitHub: newly uploaded repos appear, deleted repos disappear,
 * and repo updates (description, stars, tags) sync instantly.
 */
export async function fetchGitHubProjects(username: string = 'abhishekCode7266'): Promise<SyncedProject[]> {
  try {
    let repos: RawGitHubRepo[] | null = null;

    // 1. Try our server-side proxy route first (bypasses browser CORS & caching)
    try {
      const serverRes = await fetch(`/api/github/sync?username=${encodeURIComponent(username)}&_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' },
      });
      if (serverRes.ok) {
        const data = await serverRes.json();
        if (Array.isArray(data)) {
          repos = data;
        }
      }
    } catch {
      // Continue to direct GitHub fetch fallback
    }

    // 2. Direct client-side fetch fallback with fresh cache-busting timestamp
    if (!repos) {
      const directRes = await fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated&_t=${Date.now()}`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache',
          },
          cache: 'no-store',
        }
      );

      if (directRes.ok) {
        const data = await directRes.json();
        if (Array.isArray(data)) {
          repos = data;
        }
      } else {
        console.warn(`GitHub direct API returned status ${directRes.status}`);
      }
    }

    // If both network fetches failed (e.g. offline), fall back to bundled repository list
    if (!repos || !Array.isArray(repos) || repos.length === 0) {
      console.warn('Unable to load live GitHub repositories, using bundled fallback.');
      return getBundledGitHubProjects();
    }

    // Filter out the portfolio itself from the projects grid (unless desired)
    const filtered = repos.filter(r => {
      const n = r.name.toLowerCase();
      return n !== 'abhishek_portfolio' && n !== 'abhishek-portfolio';
    });

    const transformed = filtered.map(transformRepo);
    
    // Ensure featured projects are ordered nicely
    return transformed.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  } catch (err) {
    console.error('Error fetching GitHub repos:', err);
    return getBundledGitHubProjects();
  }
}

/**
 * Built-in bundled fallback list of all 16+ repositories
 * Guaranteed to work offline and with zero GitHub API rate limit issues!
 */
export function getBundledGitHubProjects(): SyncedProject[] {
  const repos = [
    {
      name: 'CarrerSphere-Ai',
      desc: 'All-in-one AI-powered career platform for interview preparation, skill development, and discovering jobs across every career field.',
      lang: 'TypeScript',
      hp: '',
      stars: 0,
      forks: 0
    },
    {
      name: 'FoodWise',
      desc: 'Real-time food rescue app connecting restaurants with surplus food directly to local shelters and volunteers.',
      lang: 'TypeScript',
      hp: 'https://abhishekcode7266.github.io/FoodWise/',
      stars: 0,
      forks: 0
    },
    {
      name: 'OM-AI-Action-Assistant',
      desc: 'OM – AI Action Assistant | Think. Plan. Act. Achieve. | Deconstruct goals into structured 4-phase execution roadmaps.',
      lang: 'JavaScript',
      hp: 'https://abhishekcode7266.github.io/OM-AI-Action-Assistant/',
      stars: 0,
      forks: 0
    },
    {
      name: 'EduBridge',
      desc: 'Interactive learning website and educational platform.',
      lang: 'TypeScript',
      hp: 'https://edu-bridge-self.vercel.app',
      stars: 0,
      forks: 0
    },
    {
      name: 'java-developer-projects',
      desc: 'Advanced Java console-based management systems (Hospital Management, Hotel Booking, Student ERP) demonstrating OOP and collections.',
      lang: 'Java',
      hp: '',
      stars: 0,
      forks: 0
    },
    {
      name: 'intelligence-graph-App',
      desc: 'Scalable data ingestion and intelligence pipeline for an AI and venture ecosystem.',
      lang: 'Python',
      hp: '',
      stars: 0,
      forks: 0
    },
    {
      name: 'Data-Science_Task_project',
      desc: 'Data science tasks and analytical projects parsing T20 cricket stats to discover trends.',
      lang: 'Jupyter Notebook',
      hp: 'https://abhishekcode7266.github.io/Data-Science_Task_project/',
      stars: 0,
      forks: 0
    },
    {
      name: 'python--Developer_projects-task',
      desc: 'Hands-on collection of Python developer projects, automation scripts, grocery tools, and chatbots.',
      lang: 'Python',
      hp: '',
      stars: 0,
      forks: 0
    },
    {
      name: 'frontend-_mini_project-',
      desc: 'Responsive frontend web mini-projects showcasing modern UI/UX design and JavaScript.',
      lang: 'JavaScript',
      hp: 'https://abhishekcode7266.github.io/frontend-_mini_project-/',
      stars: 0,
      forks: 0
    },
    {
      name: 'weather-dashboard',
      desc: 'Modern weather dashboard that fetches real-time weather data from a public API with clean UI.',
      lang: 'JavaScript',
      hp: '',
      stars: 0,
      forks: 0
    },
    {
      name: 'random-joke-generator',
      desc: 'Fun and interactive random joke generator fetching jokes from a public API with animations.',
      lang: 'JavaScript',
      hp: '',
      stars: 0,
      forks: 0
    },
    {
      name: 'Software-developer_Task',
      desc: 'Engineering tasks, logic implementations, and algorithmic exercises.',
      lang: 'Python',
      hp: 'https://abhishekcode7266.github.io/Software-developer_Task/',
      stars: 0,
      forks: 0
    },
    {
      name: 'hello-app',
      desc: 'Simple Flutter & Kotlin app that displays a personalized greeting with clean mobile UI.',
      lang: 'Kotlin',
      hp: '',
      stars: 0,
      forks: 0
    },
    {
      name: 'Yuva-intern_Task',
      desc: 'Cybersecurity incident report and Cyber Threat Intelligence defensive strategy.',
      lang: 'Python',
      hp: '',
      stars: 0,
      forks: 0
    },
    {
      name: 'Skill-Nexis-_Task',
      desc: 'Technical assessment and data processing tasks in Python.',
      lang: 'Python',
      hp: '',
      stars: 0,
      forks: 0
    },
    {
      name: 'CodeC_technologies_Task',
      desc: 'Responsive web layout and frontend assessment.',
      lang: 'HTML',
      hp: '',
      stars: 0,
      forks: 0
    }
  ];

  return repos.map((r, i) => {
    const raw: RawGitHubRepo = {
      id: 1000 + i,
      name: r.name,
      full_name: `abhishekCode7266/${r.name}`,
      html_url: `https://github.com/abhishekCode7266/${r.name}`,
      description: r.desc,
      homepage: r.hp || null,
      stargazers_count: r.stars,
      forks_count: r.forks,
      language: r.lang,
      fork: false,
      pushed_at: new Date().toISOString()
    };
    return transformRepo(raw);
  });
}
