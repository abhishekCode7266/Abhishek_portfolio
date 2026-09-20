'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loadFromStorage, saveToStorage } from '@/lib/storage';
import { DEFAULT_PROFILE_IMAGE, DEFAULT_CERTIFICATE_IMAGE } from '@/lib/defaultAssets';

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
  featured: boolean;
};

export type Experience = {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
  isSeeking: boolean;
  certificateUrl?: string;
};

export type Education = {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  percentage: string;
  location: string;
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
  fileUrl?: string;
};

export type PortfolioData = {
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
    whatsapp?: string;
    facebook?: string;
    instagram?: string;
    telegram?: string;
    twitter?: string;
    youtube?: string;
    discord?: string;
  };
};

const defaultData: PortfolioData = {
  profileImage: DEFAULT_PROFILE_IMAGE,
  resumeUrl: null,
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
      title: "Software Developer Intern (Awaiting Placement)",
      company: "Open to Internship Opportunities",
      duration: "2024 - Present",
      description: "Actively seeking internship and trainee opportunities in software engineering, frontend development, and Python/Java application development. Passionate about contributing to impactful real-world software products.",
      isSeeking: true
    }
  ],
  projects: [
    {
      id: "f1",
      title: "Hospital Management System",
      description: "A comprehensive Java-based OOP desktop application designed for managing patient records, doctor schedules, and hospital administrative tasks efficiently.",
      tags: ["Java", "OOP", "Data Structures", "Desktop App"],
      github: "https://github.com/abhishekCode7266/java-developer-projects",
      demoUrl: "",
      imageUrl: "",
      featured: true
    },
    {
      id: "o1",
      title: "Hotel Booking System",
      description: "An intuitive booking application managing room reservations, customer data, and billing operations.",
      tags: ["Java", "OOP", "Management System"],
      github: "https://github.com/abhishekCode7266/java-developer-projects",
      featured: false
    },
    {
      id: "o2",
      title: "Student ERP System",
      description: "A robust ERP solution handling student registrations, grades, and administrative data workflows.",
      tags: ["Java", "Software Development", "Collections"],
      github: "https://github.com/abhishekCode7266/java-developer-projects",
      featured: false
    },
    {
      id: "o3",
      title: "Grocery Application",
      description: "A digital inventory and sales management tool handling grocery items, stock, and basic transactions.",
      tags: ["Python", "Data Handling", "CLI Tools"],
      github: "https://github.com/abhishekCode7266/python--Developer_projects-task",
      featured: false
    },
    {
      id: "o4",
      title: "T20 Cricket Data Project",
      description: "An analytical project parsing and visualizing T20 cricket statistics to uncover player performance trends.",
      tags: ["Python", "Data Analytics", "Pandas", "Matplotlib"],
      github: "https://github.com/abhishekCode7266/Data-Science_Task_project",
      featured: false
    },
    {
      id: "o5",
      title: "Basic Chatbot",
      description: "A logic-based conversational bot capable of answering simple predefined queries and tasks.",
      tags: ["Python", "Logic Programming", "Automation"],
      github: "https://github.com/abhishekCode7266/python--Developer_projects-task",
      featured: false
    },
    {
      id: "o6",
      title: "Frontend Development Project",
      description: "A responsive and interactive web interface showcasing modern UI/UX design principles.",
      tags: ["HTML5", "CSS3", "JavaScript"],
      github: "https://github.com/abhishekCode7266/frontend-_mini_project-",
      featured: false
    },
    {
      id: "o7",
      title: "FoodWise – Surplus Food Rescue",
      description: "Real-time food rescue platform connecting surplus food directly with shelters and community volunteers.",
      tags: ["Full Stack", "Web Development", "Social Impact"],
      github: "https://github.com/abhishekCode7266/FoodWise",
      featured: false
    },
    {
      id: "o8",
      title: "CarrerSphere-Ai",
      description: "All-in-one AI career platform for interview preparation, skill development, and career roadmaps.",
      tags: ["AI", "React", "Next.js", "Python"],
      github: "https://github.com/abhishekCode7266/CarrerSphere-Ai",
      featured: false
    }
  ],
  certifications: [
    {
      id: "cert-wadhwani-ai",
      name: "Fundamentals of Artificial Intelligence",
      issuer: "Wadhwani Foundation",
      date: "18/JULY/2026",
      link: "https://www.wadhwanifoundation.org",
      fileUrl: DEFAULT_CERTIFICATE_IMAGE
    }
  ],
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
  updateData: (newData: Partial<PortfolioData>) => void;
  isEditorOpen: boolean;
  setIsEditorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean;
  resetData: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData>(defaultData);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

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

        // Resolve certifications ensuring default has certificate preview
        const rawCerts = (saved?.certifications && saved.certifications.length > 0) 
          ? saved.certifications 
          : (remoteData?.certifications && remoteData.certifications.length > 0) 
            ? remoteData.certifications 
            : defaultData.certifications;

        const resolvedCerts = rawCerts.map((cert, index) => {
          if (index === 0 && !cert.fileUrl) {
            return { ...cert, fileUrl: DEFAULT_CERTIFICATE_IMAGE };
          }
          return cert;
        });

        if (saved) {
          setData({
            ...defaultData,
            ...(remoteData || {}),
            ...saved,
            profileImage: resolvedProfileImage,
            certifications: resolvedCerts,
            skills: (saved.skills && saved.skills.length > 0) ? saved.skills : (remoteData?.skills || defaultData.skills),
            projects: (saved.projects && saved.projects.length > 0) ? saved.projects : (remoteData?.projects || defaultData.projects),
          });
        } else if (remoteData) {
          setData({
            ...defaultData,
            ...remoteData,
            profileImage: resolvedProfileImage,
            certifications: resolvedCerts,
            skills: remoteData.skills || defaultData.skills,
            projects: remoteData.projects || defaultData.projects,
          });
        } else {
          setData({
            ...defaultData,
            profileImage: resolvedProfileImage,
            certifications: resolvedCerts,
          });
        }
      }
    }
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  const updateData = (newData: Partial<PortfolioData>) => {
    setData(prev => {
      const updated = { ...prev, ...newData };
      saveToStorage('portfolioData', updated).catch(error => {
        console.error("Storage error:", error);
      });
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
  };

  return (
    <PortfolioContext.Provider value={{ data, updateData, isEditorOpen, setIsEditorOpen, exportDataJSON, importDataJSON, resetData }}>
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
