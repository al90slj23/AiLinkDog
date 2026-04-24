import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { Spotlight } from '../../../components/ui/spotlight';
import LandingHeroCopy from './LandingHeroCopy';
import LandingHeroMetrics from './LandingHeroMetrics';
import LandingHeroInfoCards from './LandingHeroInfoCards';
import LandingHeroCodeBlock from './LandingHeroCodeBlock';

const HeroRobotScene = lazy(() => import('./HeroRobotScene'));

const providerItems = [
  'OpenAI', 'Claude', 'Gemini', 'DeepSeek', 'Qwen', 'Moonshot', 'GLM', 'Llama',
  'Mistral', 'Cohere', 'Anthropic', 'Azure AI', 'Hunyuan', 'Minimax', 'Zhipu',
  'Wenxin', 'Spark', 'Xinference', 'Grok', 'Perplexity', '01.AI', 'Baichuan',
  'SenseTime', 'StepFun', 'Ollama', 'vLLM', 'LocalAI', 'Together', 'AWS',
  'Bedrock', 'HuggingFace', 'Replicate', 'Novita', 'Deep Infra', 'SiliconFlow',
  'Lepton', 'Fireworks', 'Groq', 'SambaNova', 'xAI', 'Stability AI', 'Baidu',
  'Alibaba', 'Tencent', 'ByteDance', 'NVIDIA', 'Meta', 'Google', 'Apple'
];

const snippets = {
  curl: (serverAddress) => [
    '# 改一行 base_url，无需换 SDK',
    `curl ${serverAddress}/v1/chat/completions \\`,
    '  -H "Authorization: Bearer $ALD_KEY" \\',
    "  -d '{\"model\":\"claude-sonnet-4-5\",\"messages\":[{\"role\":\"user\",\"content\":\"你好\"}]}'",
  ],
  python: (serverAddress) => [
    '# pip install openai',
    'from openai import OpenAI',
    '',
    'client = OpenAI(',
    '  api_key="sk-ald-•••••",',
    `  base_url="${serverAddress}/v1",`,
    ')',
    '',
    'client.chat.completions.create(model="gpt-5", messages=[...])',
  ],
  node: (serverAddress) => [
    '// npm i openai',
    'import OpenAI from "openai";',
    '',
    'const client = new OpenAI({',
    '  apiKey: "sk-ald-•••••",',
    `  baseURL: "${serverAddress}/v1",`,
    '});',
    '',
    'await client.chat.completions.create({ model: "gemini-2.5-pro" });',
  ],
  go: (serverAddress) => [
    '// go get github.com/openai/openai-go',
    'client := openai.NewClient(',
    '  option.WithAPIKey("sk-ald-•••••"),',
    `  option.WithBaseURL("${serverAddress}/v1"),`,
    ')',
    '',
    'client.Chat.Completions.New(ctx, openai.ChatCompletionNewParams{',
    '  Model: "deepseek-v3.2",',
    '})',
  ],
};

function RobotVendorLayer() {
  const containerRef = useRef(null);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const updateColumns = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      // Assume each column is roughly 130px wide + 16px gap
      const colWidth = 146;
      const numCols = Math.max(1, Math.floor(width / colWidth));
      
      const newCols = Array.from({ length: numCols }, (_, colIndex) => {
        // Randomly pick a subset of items to loop
        const shuffled = [...providerItems].sort(() => Math.random() - 0.5);
        // Take around 10-15 items per column
        const subset = shuffled.slice(0, 12);
        // Pre-calculate fixed indices for consistent coloring during scroll
        return subset.map(item => ({
          name: item,
          colorIndex: Math.floor(Math.random() * 3)
        }));
      });
      setColumns(newCols);
    };

    updateColumns();
    // Use a ResizeObserver for better responsiveness than window 'resize'
    const observer = new ResizeObserver(updateColumns);
    observer.observe(containerRef.current);
    
    return () => {
      window.removeEventListener('resize', updateColumns);
      observer.disconnect();
    };
  }, []);

  return (
    <div className='ald-home-hero__robot-vendors' ref={containerRef}>
      {columns.map((col, colIndex) => (
        <div key={colIndex} className={`ald-home-vendor-col ald-home-vendor-col--${colIndex % 7}`}>
          <div className='ald-home-vendor-col__track'>
            {[...col, ...col].map((item, index) => (
              <span key={`${item.name}-${index}`} className={`ald-home-proof__item ald-home-proof__item--${item.colorIndex}`}>
                {item.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function RobotPlaceholder() {
  return (
    <div className='ald-home-robot-bg ald-home-robot-bg--idle'>
      <div className='ald-home-robot-bg__gradient' aria-hidden='true' />
      <div className='ald-home-robot-bg__mid-layer'>
        <RobotVendorLayer />
      </div>
      <div className='ald-home-robot-bg__scene'>
        <div className='ald-home-robot-bg__placeholder' aria-hidden='true'>
          <div className='ald-home-robot-bg__orb' />
          <div className='ald-home-robot-bg__halo' />
          <div className='ald-home-robot-bg__core' />
        </div>
      </div>
    </div>
  );
}

function LandingHero({ docsLink, serverAddress, t }) {
  const [lang, setLang] = useState('curl');
  const [shouldLoadScene, setShouldLoadScene] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const robotRef = useRef(null);
  const codeSnippets = useMemo(() => {
    return {
      curl: snippets.curl(serverAddress),
      python: snippets.python(serverAddress),
      node: snippets.node(serverAddress),
      go: snippets.go(serverAddress),
    };
  }, [serverAddress]);

  useEffect(() => {
    const updateDesktopState = () => setIsDesktop(window.innerWidth >= 1024);
    updateDesktopState();
    window.addEventListener('resize', updateDesktopState);
    return () => window.removeEventListener('resize', updateDesktopState);
  }, []);

  useEffect(() => {
    if (!robotRef.current || !isDesktop) {
      setShouldLoadScene(false);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadScene(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(robotRef.current);
    return () => observer.disconnect();
  }, [isDesktop]);

  return (
    <section className='ald-home-hero' data-ald-reveal>
      <Spotlight className='ald-home-hero__primary-spotlight' size={320} />
      <div className='ald-home-hero__primary-background'></div>

      <div className='ald-home-hero__row ald-home-hero__row--primary'>
        <div className='ald-home-hero__primary-copy'>
          <LandingHeroCopy docsLink={docsLink} t={t} />
        </div>

        <div className='ald-home-hero__primary-robot' ref={robotRef}>
          <div className='ald-home-hero__robot-layer'>
            {isDesktop && shouldLoadScene ? (
              <Suspense fallback={<RobotPlaceholder />}>
                <HeroRobotScene isDesktop={isDesktop} shouldLoadScene={shouldLoadScene}>
                  <RobotVendorLayer />
                </HeroRobotScene>
              </Suspense>
            ) : (
              <RobotPlaceholder />
            )}
          </div>
        </div>
      </div>

      <div className='ald-home-hero__row ald-home-hero__row--secondary'>
        <div className='ald-home-hero__secondary-left'>
          <LandingHeroInfoCards serverAddress={serverAddress} t={t} />
        </div>

        <LandingHeroCodeBlock
          lang={lang}
          onChangeLang={setLang}
          snippets={codeSnippets}
          t={t}
        />
      </div>

      <div className='ald-home-hero__row ald-home-hero__row--metrics'>
        <LandingHeroMetrics t={t} />
      </div>
    </section>
  );
}

export default LandingHero;
