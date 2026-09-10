'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  profileImage: null,
  resumeUrl: null,
  resumeName: null,
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
      title: "[ Future Role Title ]",
      company: "[ Company Name ]",
      duration: "[ Duration ]",
      description: "[ Description of responsibilities and achievements will go here. Awaiting internship opportunities to apply technical skills in a professional environment. ]",
      isSeeking: true
    }
  ],
  projects: [
    {
      id: "f1",
      title: "Hospital Management System",
      description: "A comprehensive Java-based OOP desktop application designed for managing patient records, doctor schedules, and hospital administrative tasks efficiently.",
      tags: ["Java", "OOP", "Data Structures", "Desktop App"],
      github: "#",
      demoUrl: "",
      imageUrl: "",
      featured: true
    },
    {
      id: "o1",
      title: "Hotel Booking System",
      description: "An intuitive booking application managing room reservations, customer data, and billing operations.",
      tags: ["Java", "OOP"],
      github: "#",
      featured: false
    },
    {
      id: "o2",
      title: "Student ERP System",
      description: "A robust ERP solution handling student registrations, grades, and administrative data workflows.",
      tags: ["Java", "Software Development"],
      github: "#",
      featured: false
    },
    {
      id: "o3",
      title: "Grocery Application",
      description: "A digital inventory and sales management tool handling grocery items, stock, and basic transactions.",
      tags: ["Python", "Data Handling"],
      github: "#",
      featured: false
    },
    {
      id: "o4",
      title: "T20 Cricket Data Project",
      description: "An analytical project parsing and visualizing T20 cricket statistics to uncover player performance trends.",
      tags: ["Python", "Data Analytics", "Pandas"],
      github: "#",
      featured: false
    },
    {
      id: "o5",
      title: "Basic Chatbot",
      description: "A logic-based conversational bot capable of answering simple predefined queries and tasks.",
      tags: ["Python", "Logic Programming"],
      github: "#",
      featured: false
    },
    {
      id: "o6",
      title: "Frontend Development Project",
      description: "A responsive and interactive web interface showcasing modern UI/UX design principles.",
      tags: ["HTML5", "CSS3", "JavaScript"],
      github: "#",
      featured: false
    }
  ],
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
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "abhisheksoraon9@gmail.com",
    whatsapp: "",
    facebook: "",
    instagram: "",
    telegram: "",
    twitter: "",
    youtube: "",
    discord: ""
  }
};

interface PortfolioContextType {
  data: PortfolioData;
  updateData: (newData: Partial<PortfolioData>) => void;
  isEditorOpen: boolean;
  setIsEditorOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData>(defaultData);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('portfolioData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setData(prev => ({
          ...defaultData,
          ...parsed,
          skills: parsed.skills || defaultData.skills,
        }));
      } catch (e) {
        console.error("Failed to parse portfolio data");
      }
    }
  }, []);

  const updateData = (newData: Partial<PortfolioData>) => {
    setData(prev => {
      const updated = { ...prev, ...newData };
      try {
        localStorage.setItem('portfolioData', JSON.stringify(updated));
      } catch (error) {
        console.error("Storage error:", error);
        alert("Could not save data. The file size (image/resume) might be too large for local storage.");
      }
      return updated;
    });
  };

  return (
    <PortfolioContext.Provider value={{ data, updateData, isEditorOpen, setIsEditorOpen }}>
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
