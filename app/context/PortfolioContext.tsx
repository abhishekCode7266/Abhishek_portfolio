'use client';
import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { loadFromStorage, saveToStorage } from '@/lib/storage';
import { DEFAULT_PROFILE_IMAGE, DEFAULT_CERTIFICATE_IMAGE } from '@/lib/defaultAssets';
import { getBundledGitHubProjects, fetchGitHubProjects } from '@/lib/githubSync';

export type SkillGroup = {
  id: string;
  category: string;
  tags: string[];
};

export type Project = {
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
};

export type Experience = {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
  isSeeking: boolean;
  type?: 'internship' | 'job';
  certificateUrl?: string;
};

export type Education = {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  percentage?: string;
  location: string;
  description?: string;
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
  fileUrl?: string;
  startDate?: string;
  credentialId?: string;
  recipientName?: string;
  skills?: string[];
};

export type PortfolioData = {
  name?: string;
  headline?: string;
  phone?: string;
  address?: string;
  careerMode?: 'internship' | 'job';
  profileImage: string | null;
  resumeUrl: string | null;
  resumeName: string | null;
  aboutBio: string;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
  skills: SkillGroup[];
  socialLinks: {
    github: string;
    linkedin: string;
    email: string;
    whatsapp: string;
    facebook?: string;
    instagram: string;
    telegram: string;
    twitter: string;
    youtube: string;
    discord: string;
  };
};

const defaultData: PortfolioData = {
  name: "Abhishek Singh Yadav",
  headline: "Computer Science Student • Software Developer",
  phone: "+91 98765 43210",
  address: "Uttar Pradesh, India",
  careerMode: "internship",
  profileImage: DEFAULT_PROFILE_IMAGE,
  resumeUrl: "/Abhishek_Singh_Yadav_Resume.pdf",
  resumeName: "Abhishek_Singh_Yadav_Resume.pdf",
  aboutBio: "I am a 7th-semester B.Tech Computer Science student at the LDC Institute of Technical Studies, affiliated with Dr. A.P.J. Abdul Kalam Technical University (AKTU).\n\nWith a strong foundation in computer science principles, I have a deep interest in software development, frontend development, and real-world problem solving. My technical toolkit primarily revolves around Python, Java, and JavaScript.\n\nI love turning complex problems into elegant, functional, and user-friendly software solutions. Currently, I am actively seeking internship opportunities to apply my knowledge in a professional environment and continue growing as a developer.",
  education: [
    {
      id: "1",
      degree: "B.Tech – Computer Science",
      institution: "LDC Institute of Technical Studies (Affiliated with AKTU)",
      startDate: "2024",
      endDate: "2027",
      percentage: "75%",
      location: "Uttar Pradesh, India"
    }
  ],
  experience: [
    {
      id: "1",
      title: "Software Developer Intern",
      company: "Seeking Internship Opportunities",
      duration: "2024 - Present",
      description: "Actively seeking internship and full-time trainee opportunities in software engineering, frontend development, and Python/Java application development. Ready to deliver immediate impact on production codebases.",
      isSeeking: true
    }
  ],
  projects: getBundledGitHubProjects(),
  certifications: [],
  skills: [
    {
      id: "s1",
      category: "Frontend Development",
      tags: ["HTML5", "CSS3", "JavaScript", "Responsive Web Design", "DOM Manipulation", "Git & GitHub"]
    },
    {
      id: "s2",
      category: "Data Analytics",
      tags: ["Python", "Pandas", "NumPy", "Matplotlib", "Data Cleaning", "Data Analysis", "Data Visualization", "EDA", "Jupyter Notebook"]
    },
    {
      id: "s3",
      category: "AI / ML",
      tags: ["Python", "NumPy", "Pandas", "Matplotlib", "ML Fundamentals", "Data Preprocessing", "EDA", "Basic Model Evaluation"]
    },
    {
      id: "s4",
      category: "Software Development",
      tags: ["Python", "Java", "JavaScript", "OOP", "Problem Solving"]
    },
    {
      id: "s5",
      category: "Tools & Environment",
      tags: ["VS Code", "Git", "GitHub", "Jupyter Notebook"]
    }
  ],
  socialLinks: {
    github: "https://github.com/abhishekCode7266",
    linkedin: "https://linkedin.com",
    email: "abhisheksoraon9@gmail.com",
    whatsapp: "",
    facebook: "",
    instagram: "",
    telegram: "",
    twitter: "https://twitter.com/SinghYadav59280",
    youtube: "",
    discord: ""
  }
};

interface PortfolioContextType {
  data: PortfolioData;
  updateData: (newData: Partial<PortfolioData>, immediate?: boolean) => void;
  isEditorOpen: boolean;
  setIsEditorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean;
  resetData: () => void;
  syncWithGitHub: (overrideUsername?: string) => Promise<number>;
  isSyncingGitHub: boolean;
  lastGitHubSync: Date | null;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData>(defaultData);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSyncingGitHub, setIsSyncingGitHub] = useState(false);
  const [lastGitHubSync, setLastGitHubSync] = useState<Date | null>(null);

  const syncWithGitHub = async (overrideUsername?: string): Promise<number> => {
    setIsSyncingGitHub(true);
    try {
      let username = overrideUsername || 'abhishekCode7266';
      if (!overrideUsername && data.socialLinks.github) {
        const match = data.socialLinks.github.match(/github\.com\/([^/]+)/i);
        if (match && match[1]) {
          username = match[1];
        }
      }

      const fetched = await fetchGitHubProjects(username);
      if (fetched && fetched.length > 0) {
        setData(prev => {
          // Merge preserving any custom images or featured preferences
          const merged = fetched.map(item => {
            const existing = prev.projects.find(
              p => p.github.toLowerCase() === item.github.toLowerCase() ||
                   p.title.toLowerCase() === item.title.toLowerCase()
            );
            return {
              ...item,
              imageUrl: existing?.imageUrl || item.imageUrl || '',
              featured: existing?.featured !== undefined ? existing.featured : item.featured,
            };
          });

          const updated = { ...prev, projects: merged };
          saveToStorage('portfolioData', updated).catch(() => {});
          
          // Sync to AI Studio project workspace
          if (typeof window !== 'undefined') {
            fetch('/api/portfolio/save-data', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updated),
            }).catch(() => {});
          }

          return updated;
        });
        setLastGitHubSync(new Date());
        return fetched.length;
      }
    } catch (err) {
      console.error('GitHub sync failed:', err);
    } finally {
      setIsSyncingGitHub(false);
    }
    return 0;
  };

  useEffect(() => {
    let isMounted = true;
    async function init() {
      // 1. Fetch bundled/deployed portfolio-data.json with multi-path resolution (ensures GitHub Pages subpath works)
      let remoteData: Partial<PortfolioData> | null = null;
      const candidateUrls: string[] = [];

      if (typeof window !== 'undefined') {
        const cleanPath = window.location.pathname.replace(/\/+$/, '');
        if (cleanPath) {
          candidateUrls.push(`${cleanPath}/portfolio-data.json`);
        }
        candidateUrls.push('./portfolio-data.json');
        candidateUrls.push('portfolio-data.json');
      }
      if (process.env.NEXT_PUBLIC_BASE_PATH) {
        candidateUrls.push(`${process.env.NEXT_PUBLIC_BASE_PATH}/portfolio-data.json`);
      }
      candidateUrls.push('/portfolio-data.json');

      for (const url of candidateUrls) {
        try {
          const res = await fetch(url, { cache: 'no-store' });
          if (res.ok) {
            const parsed = await res.json();
            if (parsed && typeof parsed === 'object') {
              remoteData = parsed;
              break;
            }
          }
        } catch {
          // try next path
        }
      }

      // 2. Load device-specific live edits from IndexedDB/localStorage
      const saved = await loadFromStorage<PortfolioData>('portfolioData');

      if (isMounted) {
        // Resolve profile image with fallback to real built-in photo
        const resolvedProfileImage = 
          saved?.profileImage || 
          remoteData?.profileImage || 
          DEFAULT_PROFILE_IMAGE;

        // Resolve certifications
        const resolvedCerts = Array.isArray(saved?.certifications)
          ? saved.certifications
          : Array.isArray(remoteData?.certifications)
            ? remoteData.certifications
            : defaultData.certifications;

        const initialProjects = (saved?.projects && saved.projects.length >= 12)
          ? saved.projects
          : (remoteData?.projects && remoteData.projects.length >= 12)
            ? remoteData.projects
            : defaultData.projects;

        if (saved) {
          setData({
            ...defaultData,
            ...(remoteData || {}),
            ...saved,
            profileImage: resolvedProfileImage,
            certifications: resolvedCerts,
            skills: (saved.skills && saved.skills.length > 0) ? saved.skills : (remoteData?.skills || defaultData.skills),
            projects: initialProjects,
          });
        } else if (remoteData) {
          setData({
            ...defaultData,
            ...remoteData,
            profileImage: resolvedProfileImage,
            certifications: resolvedCerts,
            skills: remoteData.skills || defaultData.skills,
            projects: initialProjects,
          });
        } else {
          setData({
            ...defaultData,
            profileImage: resolvedProfileImage,
            certifications: resolvedCerts,
            projects: initialProjects,
          });
        }

        // Automatic background sync with GitHub to ensure new repositories appear automatically
        setTimeout(() => {
          if (isMounted) {
            syncWithGitHub().catch(() => {});
          }
        }, 1500);
      }
    }
    init();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for tab focus and run periodic background check so repo additions or deletions on GitHub reflect live
  useEffect(() => {
    const handleFocus = () => {
      syncWithGitHub().catch(() => {});
    };
    window.addEventListener('focus', handleFocus);

    // Periodic check every 90 seconds
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        syncWithGitHub().catch(() => {});
      }
    }, 90000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const persistData = (payload: PortfolioData) => {
    saveToStorage('portfolioData', payload).catch(error => {
      console.error("Storage error:", error);
    });

    // Synchronize directly into public/portfolio-data.json in AI Studio workspace
    if (typeof window !== 'undefined') {
      fetch('/api/portfolio/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {});
    }
  };

  const updateData = (newData: Partial<PortfolioData>, immediate = false) => {
    setData(prev => {
      const updated = { ...prev, ...newData };

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      if (immediate) {
        persistData(updated);
      } else {
        saveTimeoutRef.current = setTimeout(() => {
          persistData(updated);
        }, 500);
      }

      return updated;
    });
  };

  const exportDataJSON = () => {
    return JSON.stringify(data, null, 2);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (typeof parsed === 'object' && parsed !== null) {
        const sanitized: PortfolioData = {
          ...defaultData,
          ...parsed,
          skills: Array.isArray(parsed.skills) && parsed.skills.length > 0 ? parsed.skills : defaultData.skills,
          certifications: Array.isArray(parsed.certifications) ? parsed.certifications : defaultData.certifications,
          projects: Array.isArray(parsed.projects) ? parsed.projects : defaultData.projects,
          education: Array.isArray(parsed.education) ? parsed.education : defaultData.education,
        };
        setData(sanitized);
        saveToStorage('portfolioData', sanitized);

        if (typeof window !== 'undefined') {
          fetch('/api/portfolio/save-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sanitized),
          }).catch(() => {});
        }

        return true;
      }
    } catch (err) {
      console.error("Invalid JSON import:", err);
    }
    return false;
  };

  const resetData = () => {
    setData(defaultData);
    saveToStorage('portfolioData', defaultData);
    if (typeof window !== 'undefined') {
      fetch('/api/portfolio/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(defaultData),
      }).catch(() => {});
    }
  };

  return (
    <PortfolioContext.Provider value={{ 
      data, 
      updateData, 
      isEditorOpen, 
      setIsEditorOpen, 
      exportDataJSON, 
      importDataJSON, 
      resetData,
      syncWithGitHub,
      isSyncingGitHub,
      lastGitHubSync,
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
