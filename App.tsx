import React, { useState, useEffect, useRef } from 'react';
import { Theme, NavItem, Project } from './types';
import { ChevronUp, Mail, User, Terminal, Layers } from 'lucide-react';
import Background from './components/Background';
import CyberButton from './components/CyberButton';
import CyberCard from './components/CyberCard';
import Project3D from './components/Project3D';

// --- Constants ---
const NAV_ITEMS: NavItem[] = [
  { label: '首页', id: 'home' },
  { label: '关于我', id: 'about' },
  { label: '项目展示', id: 'projects' },
  { label: '联系方式', id: 'contact' },
];

const PROJECTS: Project[] = [
  { 
    id: 1, 
    title: '霓虹交易站', 
    description: '具有实时 WebSocket 数据可视化的去中心化交易平台。使用 React 和 Three.js 构建，充满赛博朋克美学。', 
    tags: ['React', 'Three.js', 'Web3'],
    imageUrl: 'https://picsum.photos/id/48/600/400' 
  },
  { 
    id: 2, 
    title: '以太云管家', 
    description: '具有玻璃拟态 UI 和拖放资源分配功能的云基础设施管理仪表板。', 
    tags: ['Vue', 'AWS', 'Tailwind'],
    imageUrl: 'https://picsum.photos/id/180/600/400' 
  },
  { 
    id: 3, 
    title: '虚空信使', 
    description: '专注于隐私和阅后即焚内容的端到端加密消息传递应用程序。', 
    tags: ['Mobile', 'Encryption', 'Socket.io'],
    imageUrl: 'https://picsum.photos/id/366/600/400' 
  },
  { 
    id: 4, 
    title: '赛博合成器', 
    description: '利用 Web Audio API 的基于浏览器的合成器。直接在浏览器中创作复古波节拍。', 
    tags: ['Audio API', 'TypeScript', 'Canvas'],
    imageUrl: 'https://picsum.photos/id/453/600/400' 
  },
  { 
    id: 5, 
    title: '数据漂移', 
    description: '预测市场趋势的 AI 驱动分析工具。使用 Python 后端和 D3.js 前端可视化。', 
    tags: ['Python', 'AI', 'D3.js'],
    imageUrl: 'https://picsum.photos/id/532/600/400' 
  },
];

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(Theme.DARK);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [scrollY, setScrollY] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Refs for sections to observe
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Toggle Theme
  const toggleTheme = () => {
    setTheme(prev => prev === Theme.DARK ? Theme.LIGHT : Theme.DARK);
  };

  // Optimized Scroll Handler (RequestAnimationFrame)
  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      animationFrameId = requestAnimationFrame(() => {
        const currentScroll = window.scrollY;
        setScrollY(currentScroll);
        // Show button if we are past 50% of the viewport height (leaving home)
        setShowBackToTop(currentScroll > window.innerHeight * 0.5);
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Intersection Observer for Active Section Highlighting (Performance Boost)
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px', // Trigger when element is in the middle of the viewport
      threshold: 0
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    NAV_ITEMS.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        sectionRefs.current[item.id] = element;
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  // Smooth Scroll
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const isDark = theme === Theme.DARK;

  return (
    <div className={`min-h-screen w-full overflow-x-hidden relative transition-colors duration-500 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
      <Background theme={theme} />

      {/* --- Navigation --- */}
      <nav className={`fixed top-0 left-0 right-0 w-full z-[100] transition-all duration-300 
        ${scrollY > 50 
          ? (isDark ? 'bg-slate-900/90 backdrop-blur-md border-b border-cyan-900/50 h-20 shadow-lg' : 'bg-white/80 backdrop-blur-md border-b border-white/50 shadow-sm h-20') 
          : 'bg-transparent h-24'}`}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          
          {/* Updated Logo: King Kong (Using font-cyber / Smaller Size / Glow Effect) */}
          <button
            onClick={() => scrollToSection('home')}
            className="relative group bg-transparent p-0 border-none cursor-pointer select-none outline-none"
          >
            <div className="relative text-3xl md:text-4xl font-cyber tracking-widest uppercase leading-tight">
              {/* Base Text (Stroked / Transparent) */}
              <span
                className="block"
                style={{
                  color: 'transparent',
                  WebkitTextStroke: isDark ? '1px rgba(255, 255, 255, 0.8)' : '1px rgba(100, 116, 139, 0.8)',
                }}
              >
                King Kong
              </span>

              {/* Hover Text (Filled / Colored / Animated with Glow) */}
              <span
                className={`absolute inset-0 top-0 left-0 w-0 overflow-hidden transition-all duration-500 ease-out border-r-[4px] whitespace-nowrap group-hover:w-full
                  ${isDark ? 'text-cyan-400 border-cyan-400' : 'text-sky-500 border-sky-500'}`}
                style={{
                  filter: isDark 
                    ? 'drop-shadow(0 0 10px rgba(34,211,238,0.8)) drop-shadow(0 0 20px rgba(34,211,238,0.4))' 
                    : 'drop-shadow(0 0 10px rgba(14,165,233,0.6)) drop-shadow(0 0 20px rgba(14,165,233,0.3))',
                }}
              >
                King Kong
              </span>
            </div>
          </button>

          <div className="hidden md:flex gap-10">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-base font-bold tracking-widest transition-all duration-300 hover:-translate-y-1 relative group font-cyber
                  ${activeSection === item.id 
                    ? (isDark ? 'text-cyan-400' : 'text-sky-500') 
                    : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-sky-600')}`}
              >
                {item.label}
                <span className={`absolute -bottom-1 left-0 w-0 h-[3px] rounded-full transition-all duration-300 group-hover:w-full
                  ${isDark ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-sky-400'}
                  ${activeSection === item.id ? 'w-full' : ''}`} 
                />
              </button>
            ))}
          </div>

          {/* Custom Toggle Switch */}
          <label className="inline-flex items-center relative cursor-pointer transform scale-75 origin-right">
            <input 
              className="peer hidden" 
              id="toggle" 
              type="checkbox" 
              checked={isDark}
              onChange={toggleTheme}
            />
            <div
              className="relative w-[110px] h-[50px] bg-white peer-checked:bg-zinc-500 rounded-full after:absolute after:content-[''] after:w-[40px] after:h-[40px] after:bg-gradient-to-r from-orange-500 to-yellow-400 peer-checked:after:from-zinc-900 peer-checked:after:to-zinc-900 after:rounded-full after:top-[5px] after:left-[5px] active:after:w-[50px] peer-checked:after:left-[105px] peer-checked:after:translate-x-[-100%] shadow-sm duration-300 after:duration-300 after:shadow-md"
            ></div>
            <svg
              height="24"
              width="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-white peer-checked:opacity-60 absolute w-6 h-6 left-[13px] z-10 pointer-events-none transition-opacity duration-300"
            >
              <path
                d="M12,17c-2.76,0-5-2.24-5-5s2.24-5,5-5,5,2.24,5,5-2.24,5-5,5ZM13,0h-2V5h2V0Zm0,19h-2v5h2v-5ZM5,11H0v2H5v-2Zm19,0h-5v2h5v-2Zm-2.81-6.78l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54ZM7.76,17.66l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54Zm0-11.31l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Zm13.44,13.44l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Z"
              ></path>
            </svg>
            <svg
              height="24"
              width="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-black opacity-60 peer-checked:opacity-70 peer-checked:fill-white absolute w-6 h-6 right-[13px] z-10 pointer-events-none transition-all duration-300"
            >
              <path
                d="M12.009,24A12.067,12.067,0,0,1,.075,10.725,12.121,12.121,0,0,1,10.1.152a13,13,0,0,1,5.03.206,2.5,2.5,0,0,1,1.8,1.8,2.47,2.47,0,0,1-.7,2.425c-4.559,4.168-4.165,10.645.807,14.412h0a2.5,2.5,0,0,1-.7,4.319A13.875,13.875,0,0,1,12.009,24Zm.074-22a10.776,10.776,0,0,0-1.675.127,10.1,10.1,0,0,0-8.344,8.8A9.928,9.928,0,0,0,4.581,18.7a10.473,10.473,0,0,0,11.093,2.734.5.5,0,0,0,.138-.856h0C9.883,16.1,9.417,8.087,14.865,3.124a.459.459,0,0,0,.127-.465.491.491,0,0,0-.356-.362A10.68,10.68,0,0,0,12.083,2ZM20.5,12a1,1,0,0,1-.97-.757l-.358-1.43L17.74,9.428a1,1,0,0,1,.035-1.94l1.4-.325.351-1.406a1,1,0,0,1,1.94,0l.355,1.418,1.418.355a1,1,0,0,1,0,1.94l-1.418.355-.355,1.418A1,1,0,0,1,20.5,12ZM16,14a1,1,0,0,0,2,0A1,1,0,0,0,16,14Zm6,4a1,1,0,0,0,2,0A1,1,0,0,0,22,18Z"
              ></path>
            </svg>
          </label>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section id="home" className="min-h-screen w-full flex flex-col justify-center items-center relative px-6 pt-24 pb-24 z-10">
        <div className="max-w-4xl text-center z-10">
          <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8 text-sm font-mono border backdrop-blur-sm
            ${isDark ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'border-sky-200 bg-white/60 text-sky-600 shadow-sm'}`}>
            <Terminal size={16} />
            <span className="tracking-wider font-bold">全栈开发工程师</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-cyber font-bold mb-8 tracking-wide leading-tight">
             <span className={`block mb-4 ${isDark ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400' : 'text-slate-700'}`}>
              编织
             </span>
             <span className={`relative inline-block
               ${isDark ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 filter drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500'}`}>
               数字现实
               <span className="absolute top-0 left-0 -ml-1 opacity-50 animate-pulse text-red-500 mix-blend-screen pointer-events-none">数字现实</span>
             </span>
          </h1>

          <p className={`text-xl md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed font-light
            ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            打造沉浸式的 Web 体验，融合赛博美学与极致性能。让每一个像素都讲述故事。
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <CyberButton theme={theme} onClick={() => scrollToSection('projects')}>
              查看项目
            </CyberButton>
            <CyberButton theme={theme} variant="secondary" onClick={() => scrollToSection('contact')}>
              联系我
            </CyberButton>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer" onClick={() => scrollToSection('about')}>
          <ChevronUp className={`transform rotate-180 w-8 h-8 ${isDark ? 'text-slate-500 hover:text-cyan-400' : 'text-slate-400 hover:text-sky-600'} transition-colors`} />
        </div>
      </section>

      {/* Spacer between Hero and About */}
      <div className="h-20 md:h-48 w-full"></div>

      {/* --- About Section --- */}
      <section id="about" className="min-h-screen md:min-h-[80vh] flex flex-col justify-center py-10 md:py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Profile Image */}
            <div className="relative group mx-auto md:mx-0 w-full max-w-[320px] md:max-w-[400px]">
              <div className={`absolute -inset-4 rounded-3xl transform rotate-3 opacity-40 transition-transform group-hover:rotate-6 blur-md
                ${isDark ? 'bg-gradient-to-br from-cyan-500 to-purple-600' : 'bg-gradient-to-br from-sky-200 to-pink-200'}`} />
              
              <div className={`relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/5] z-10
                 ${isDark ? 'border border-slate-700 bg-slate-900' : 'border-4 border-white bg-white'}`}>
                <img src="https://picsum.photos/id/338/800/1000" alt="Profile" className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" />
                <div className={`absolute inset-0 bg-gradient-to-t opacity-40
                  ${isDark ? 'from-slate-900 via-transparent' : 'from-sky-900 via-transparent'}`} />
              </div>
            </div>

            {/* About Content */}
            <div className="relative z-20 flex flex-col gap-8">
              <div className="flex items-center gap-4">
                 <span className={`h-[4px] w-12 rounded-full ${isDark ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'bg-sky-400'}`} />
                 <h2 className="text-4xl md:text-5xl font-cyber font-bold tracking-wider">关于我</h2>
              </div>
              
              {/* Increased vertical space for mobile readability */}
              <div className="space-y-12">
                <CyberCard theme={theme}>
                  <div className="flex items-start gap-6">
                    <User className={`shrink-0 w-8 h-8 mt-1 ${isDark ? 'text-cyan-400' : 'text-sky-500'}`} />
                    <div>
                       <h3 className="font-bold text-2xl mb-3">架构师思维</h3>
                       <p className="leading-8 text-lg opacity-90">
                         我是一名对设计与技术交汇点充满痴迷的创意开发者。我的目标是创造既具未来感又灵动响应的界面，在视觉冲击与用户体验之间找到完美平衡。
                       </p>
                    </div>
                  </div>
                </CyberCard>

                <CyberCard theme={theme}>
                  <div className="flex items-start gap-6">
                    <Layers className={`shrink-0 w-8 h-8 mt-1 ${isDark ? 'text-purple-400' : 'text-pink-400'}`} />
                    <div>
                       <h3 className="font-bold text-2xl mb-3">技术栈</h3>
                       <div className="flex flex-wrap gap-3 mt-3">
                         {['React', 'TypeScript', 'Tailwind', 'Node.js', 'WebGL', 'Next.js'].map(tech => (
                           <span key={tech} className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all hover:scale-105 cursor-default
                             ${isDark 
                               ? 'border-slate-600 bg-slate-800/50 text-slate-300 hover:border-cyan-500 hover:text-cyan-400 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
                               : 'border-sky-100 bg-white/80 text-sky-600 hover:bg-white hover:shadow-md hover:border-sky-300'}`}>
                             {tech}
                           </span>
                         ))}
                       </div>
                    </div>
                  </div>
                </CyberCard>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Spacer between About and Projects to prevent overlap on all devices */}
      <div className="h-40 md:h-48 w-full"></div>

      {/* --- Projects Section (3D) --- */}
      <section id="projects" className={`py-20 md:py-32 px-6 relative overflow-visible z-20`}>
         <div className={`absolute inset-0 -z-10 transform skew-y-3 origin-top-left scale-105 md:scale-110
            ${isDark ? 'bg-slate-900/50' : 'bg-white/20 backdrop-blur-sm'}`} />

         <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-10 md:mb-20 pt-10">
              <h2 className="text-4xl md:text-6xl font-cyber font-bold mb-6 tracking-widest">项目展示</h2>
              <p className={`max-w-2xl mx-auto text-lg ${isDark ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>
                拖动下方的旋转轮播来探索我的近期作品。点击卡片可查看详情。
              </p>
            </div>

            <div className="min-h-[400px] md:min-h-[600px] flex items-center justify-center py-6 md:py-10">
              <Project3D items={PROJECTS} theme={theme} />
            </div>
         </div>
      </section>

      {/* Spacer to separate Projects and Contact */}
      <div className="h-20 md:h-32 w-full"></div>

      {/* --- Contact Section --- */}
      <section id="contact" className="py-20 md:py-32 px-6 relative z-10 mb-20">
        <div className="max-w-4xl mx-auto">
          <CyberCard theme={theme} className="p-8 md:p-16">
             <div className="text-center space-y-8 md:space-y-10">
                <div className={`w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full flex items-center justify-center mb-4 border-2
                  ${isDark ? 'bg-slate-800 border-cyan-500 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'bg-sky-50 border-sky-200 text-sky-500'}`}>
                  <Mail className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                
                <h2 className="text-4xl md:text-5xl font-cyber font-bold">发起联络</h2>
                
                <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto leading-relaxed">
                  准备好开始一个新项目了吗？或者对我的作品有疑问？
                  请通过下方的频段发送信号。
                </p>

                <div className="flex flex-col gap-6 max-w-lg mx-auto w-full">
                   <div className="relative group">
                     <input 
                       type="email" 
                       placeholder="输入您的邮箱地址" 
                       className={`w-full px-6 py-4 rounded-xl outline-none border-2 transition-all
                         ${isDark 
                           ? 'bg-slate-900/80 border-slate-700 focus:border-cyan-500 text-white placeholder-slate-600' 
                           : 'bg-white border-slate-100 focus:border-sky-400 text-slate-700 placeholder-slate-400 shadow-inner'}`}
                     />
                   </div>
                   <div className="relative group">
                     <textarea 
                       rows={5}
                       placeholder="传输信息内容..." 
                       className={`w-full px-6 py-4 rounded-xl outline-none border-2 transition-all resize-none
                         ${isDark 
                           ? 'bg-slate-900/80 border-slate-700 focus:border-cyan-500 text-white placeholder-slate-600' 
                           : 'bg-white border-slate-100 focus:border-sky-400 text-slate-700 placeholder-slate-400 shadow-inner'}`}
                     />
                   </div>
                   <CyberButton theme={theme} className="w-full justify-center text-lg py-4 mt-2">
                     发送传输信号
                   </CyberButton>
                </div>
             </div>
          </CyberCard>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className={`py-12 text-center border-t relative z-10
        ${isDark ? 'border-slate-800 bg-slate-900 text-slate-500' : 'border-slate-100 bg-white/80 text-slate-400'}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="font-cyber text-2xl font-bold opacity-50">CYBERZEN</div>
          <p className="text-sm">© 2024 个人作品集系统. 系统运行正常.</p>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button 
        onClick={() => scrollToSection('home')}
        className={`
          fixed bottom-8 right-8 z-[999]
          w-[50px] h-[50px] rounded-full
          flex items-center justify-center
          border-none cursor-pointer
          transition-all duration-300 ease-in-out
          overflow-hidden group
          ${showBackToTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}
          ${isDark 
            ? 'bg-[rgb(20,20,20)] shadow-[0px_0px_0px_4px_rgba(180,160,255,0.253)] hover:bg-[rgb(181,160,255)]' 
            : 'bg-white/80 backdrop-blur shadow-[0px_0px_0px_4px_rgba(14,165,233,0.2)] hover:bg-[#0ea5e9]'
          }
          hover:w-[140px] hover:rounded-[50px]
        `}
      >
        {/* Icon */}
        <div className="w-[12px] transition-transform duration-300 group-hover:-translate-y-[200%] flex justify-center">
           <ChevronUp className={`w-full ${isDark ? 'text-white' : 'text-sky-500 group-hover:text-white'}`} strokeWidth={4} />
        </div>

        {/* Text */}
        <span className={`
          absolute text-[0px] opacity-0
          group-hover:opacity-100 group-hover:text-[13px]
          transition-all duration-300
          font-bold text-white whitespace-nowrap
          flex items-center justify-center
          translate-y-4 group-hover:translate-y-0
        `}>
          回到顶部
        </span>
      </button>

    </div>
  );
};

export default App;