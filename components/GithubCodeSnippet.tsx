'use client';

import { useState, useEffect, useMemo } from 'react';
import { Terminal, Code2, FileCode } from 'lucide-react';

interface GithubCodeSnippetProps {
  githubUrl: string;
  title?: string;
  language?: string;
  category?: string;
}

function getContextualSnippet(title?: string, language?: string, githubUrl?: string) {
  const t = (title || '').toLowerCase();
  const lang = (language || '').toLowerCase();
  const repoName = (githubUrl || '').split('/').pop()?.replace('.git', '') || 'main';

  if (t.includes('career') || t.includes('sphere')) {
    return {
      fileName: 'career_matcher.ts',
      langLabel: 'TypeScript',
      code: `// AI-Driven Career Roadmap & Skill Matrix Engine
import { GoogleGenAI } from '@google/genai';

export async function matchCareerPath(skills: string[]) {
  const agent = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });
  const evaluation = await agent.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: \`Map roadmap for: \${skills.join(', ')}\`
  });
  return evaluation.response;
}`
    };
  }

  if (t.includes('food') || t.includes('wise') || t.includes('rescue')) {
    return {
      fileName: 'rescue_engine.ts',
      langLabel: 'TypeScript',
      code: `// Surplus Food Rescue & NGO Allocation Engine
export async function allocateSurplus(batch: SurplusBatch) {
  const verifiedNGOs = await geoSpatialIndex.findNearby({
    coords: batch.pickupLocation,
    maxDistanceKm: 8.5
  });
  return await dispatchQueue.broadcastTo(verifiedNGOs);
}`
    };
  }

  if (t.includes('om') || t.includes('assistant') || t.includes('action')) {
    return {
      fileName: 'action_pipeline.py',
      langLabel: 'Python',
      code: `# 4-Phase Autonomous Goal Deconstruction Pipeline
class ActionOrchestrator:
    def __init__(self, objective: str):
        self.phases = ["THINK", "PLAN", "ACT", "ACHIEVE"]
        self.agent = AutonomousAgent(goal=objective)

    async def run(self):
        return await self.agent.execute_pipeline()`
    };
  }

  if (t.includes('hotel') || t.includes('hospital') || lang.includes('java')) {
    return {
      fileName: 'ReservationSystem.java',
      langLabel: 'Java',
      code: `// Enterprise Booking & Room Allocation System
public class ReservationSystem {
    private final DatabaseService db = new DatabaseService();

    public synchronized BookingResult reserve(Customer c, int roomId) {
        if (!inventory.checkAvailability(roomId)) return FAILED;
        return db.commitReservation(c.getId(), roomId);
    }
}`
    };
  }

  if (t.includes('cricket') || t.includes('data') || t.includes('t20') || lang.includes('python')) {
    return {
      fileName: 'cricket_analytics.py',
      langLabel: 'Python',
      code: `# T20 Match & Player Performance Analyzer
import pandas as pd
import numpy as np

def compute_impact_metric(match_df: pd.DataFrame):
    strike_rates = (match_df['runs'] / match_df['balls']) * 100
    economy = match_df['runs_conceded'] / match_df['overs']
    return strike_rates.mean() - economy.mean()`
    };
  }

  if (t.includes('weather') || lang.includes('javascript') || lang.includes('typescript')) {
    return {
      fileName: 'weather_service.ts',
      langLabel: 'TypeScript',
      code: `// Real-Time Meteorological Telemetry Stream
export async function getLiveForecast(city: string) {
  const res = await fetch(\`/api/forecast?q=\${encodeURIComponent(city)}\`);
  const telemetry = await res.json();
  return { temp: telemetry.celsius, humidity: telemetry.humidity };
}`
    };
  }

  return {
    fileName: `${repoName}.ts`,
    langLabel: language || 'Code',
    code: `// Repository Source Code
$ git clone ${githubUrl || 'https://github.com/abhishekCode7266/project'}
$ cd ${repoName}
$ npm install
$ npm run dev
> Initializing build environment...
> System status: READY`
  };
}

export function GithubCodeSnippet({ githubUrl, title, language, category }: GithubCodeSnippetProps) {
  const fallback = useMemo(() => getContextualSnippet(title, language, githubUrl), [title, language, githubUrl]);
  const [code, setCode] = useState<string>(fallback.code);
  const [fileName, setFileName] = useState<string>(fallback.fileName);
  const [langLabel, setLangLabel] = useState<string>(fallback.langLabel);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function fetchReadme() {
      if (!githubUrl) return;
      
      try {
        const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) return;

        const owner = match[1];
        const repo = match[2].replace('.git', '');

        let res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`);
        if (!res.ok) {
          res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`);
        }

        if (res.ok && !isCancelled) {
          const text = await res.text();
          const codeBlockMatch = text.match(/```([a-z]*)\n([\s\S]*?)```/);
          if (codeBlockMatch && codeBlockMatch[2] && codeBlockMatch[2].trim().length > 20) {
            const detectedLang = codeBlockMatch[1] || language || 'code';
            setCode(codeBlockMatch[2].trim());
            setLangLabel(detectedLang.toUpperCase());
            setFileName(`${repo}.${detectedLang || 'ts'}`);
          }
        }
      } catch {
        // Fallback remains in place smoothly
      }
    }

    fetchReadme();
    return () => { isCancelled = true; };
  }, [githubUrl, language]);

  const lines = useMemo(() => {
    return code.split('\n').slice(0, 10);
  }, [code]);

  return (
    <div className="absolute inset-0 flex flex-col bg-[#121316] text-[#e2e8f0] font-mono select-none overflow-hidden">
      {/* IDE Editor Header Bar */}
      <div className="h-8 bg-[#18191e] border-b border-slate-800/80 flex items-center justify-between px-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex items-center gap-1.5 ml-2 px-2 py-0.5 rounded bg-[#1e2026] border border-slate-700/50 text-[11px] text-slate-300">
            <FileCode size={12} className="text-indigo-400" />
            <span className="truncate max-w-[130px]">{fileName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span className="text-indigo-300 font-semibold">{langLabel}</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline">main</span>
        </div>
      </div>

      {/* Editor Body with Line Numbers */}
      <div className="flex-1 p-3.5 flex text-[11px] leading-5 overflow-hidden">
        {/* Line Gutter */}
        <div className="select-none pr-2.5 text-right text-slate-600 border-r border-slate-800/80 mr-3 flex flex-col">
          {lines.map((_, i) => (
            <span key={i} className="text-[10px] opacity-75">{i + 1}</span>
          ))}
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-x-hidden text-slate-300">
          {lines.map((line, idx) => {
            let colorClass = 'text-slate-300';
            if (line.trim().startsWith('//') || line.trim().startsWith('#') || line.trim().startsWith('>')) {
              colorClass = 'text-slate-500 italic';
            } else if (line.includes('import ') || line.includes('from ') || line.includes('export ') || line.includes('public ') || line.includes('class ') || line.includes('def ')) {
              colorClass = 'text-purple-400 font-semibold';
            } else if (line.includes('const ') || line.includes('let ') || line.includes('async ') || line.includes('return ')) {
              colorClass = 'text-indigo-300';
            } else if (line.includes('function ') || line.includes('class ') || line.includes('new ')) {
              colorClass = 'text-amber-300';
            }

            return (
              <div key={idx} className={`truncate ${colorClass}`}>
                {line || ' '}
              </div>
            );
          })}
        </div>
      </div>

      {/* Subtle Terminal Bottom Status Bar */}
      <div className="h-5 bg-[#15161a] border-t border-slate-800/80 flex items-center justify-between px-3 text-[9px] text-slate-500 shrink-0">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>UTF-8</span>
        </span>
        <span className="text-slate-400">Ready</span>
      </div>
    </div>
  );
}
