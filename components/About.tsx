'use client';
import { motion } from 'motion/react';
import { SectionHeading } from './SectionHeading';

export function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading>About Me</SectionHeading>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="prose prose-slate lg:prose-lg text-slate-600 leading-relaxed"
          >
            <p>
              I am a 7th-semester B.Tech Computer Science student at the 
              <strong> LDC Institute of Technical Studies</strong>, affiliated with 
              Dr. A.P.J. Abdul Kalam Technical University (AKTU).
            </p>
            <p className="mt-4">
              With a strong foundation in computer science principles, I have a deep interest in 
              software development, frontend development, and real-world problem solving. My 
              technical toolkit primarily revolves around <strong>Python, Java, and JavaScript</strong>.
            </p>
            <p className="mt-4">
              I love turning complex problems into elegant, functional, and user-friendly software 
              solutions. Currently, I am actively seeking internship opportunities to apply my 
              knowledge in a professional environment and continue growing as a developer.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            {/* Python Snippet */}
            <div className="bg-[#1e1e1e] rounded-2xl shadow-xl overflow-hidden w-full sm:w-64 border border-slate-700/50">
              <div className="bg-[#2d2d2d] px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-slate-400 font-mono ml-2">hello.py</span>
              </div>
              <div className="p-5 text-sm font-mono text-slate-300">
                <p><span className="text-blue-400">def</span> <span className="text-yellow-300">greet</span>():</p>
                <p className="ml-4"><span className="text-blue-400">print</span>(<span className="text-green-400">&quot;Hello, World!&quot;</span>)</p>
                <br/>
                <p>greet()</p>
              </div>
            </div>

            {/* Java Snippet */}
            <div className="bg-[#1e1e1e] rounded-2xl shadow-xl overflow-hidden w-full sm:w-64 border border-slate-700/50 sm:translate-y-8">
              <div className="bg-[#2d2d2d] px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-slate-400 font-mono ml-2">Hello.java</span>
              </div>
              <div className="p-5 text-sm font-mono text-slate-300">
                <p><span className="text-blue-400">class</span> <span className="text-yellow-300">Hello</span> {'{'}</p>
                <p className="ml-4"><span className="text-blue-400">public static void</span> <span className="text-yellow-300">main</span>() {'{'}</p>
                <p className="ml-8 text-slate-400">System.out.<span className="text-blue-400">print</span>(<span className="text-green-400">&quot;Hi!&quot;</span>);</p>
                <p className="ml-4">{'}'}</p>
                <p>{'}'}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
