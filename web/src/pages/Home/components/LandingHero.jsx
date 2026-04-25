/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import React, {
  Suspense,
  lazy,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Spotlight } from '../../../components/ui/spotlight';
import LandingHeroCopy from './LandingHeroCopy';
import LandingHeroMetrics from './LandingHeroMetrics';
import LandingHeroInfoCards from './LandingHeroInfoCards';
import LandingHeroCodeBlock from './LandingHeroCodeBlock';

const HeroRobotScene = lazy(() => import('./HeroRobotScene'));

const providerItems = [
  'OpenAI',
  'Claude',
  'Gemini',
  'DeepSeek',
  'Qwen',
  'Moonshot',
  'GLM',
  'Llama',
  'Mistral',
  'Cohere',
  'Anthropic',
  'Azure AI',
  'Hunyuan',
  'Minimax',
  'Zhipu',
  'Wenxin',
  'Spark',
  'Xinference',
  'Grok',
  'Perplexity',
  '01.AI',
  'Baichuan',
  'SenseTime',
  'StepFun',
  'Ollama',
  'vLLM',
  'LocalAI',
  'Together',
  'AWS',
  'Bedrock',
  'HuggingFace',
  'Replicate',
  'Novita',
  'Deep Infra',
  'SiliconFlow',
  'Lepton',
  'Fireworks',
  'Groq',
  'SambaNova',
  'xAI',
  'Stability AI',
  'Baidu',
  'Alibaba',
  'Tencent',
  'ByteDance',
  'NVIDIA',
  'Meta',
  'Google',
  'Apple',
];

const snippets = {
  curl: (serverAddress) => [
    '# 改一行 base_url，无需换 SDK',
    `curl ${serverAddress}/v1/chat/completions \\`,
    '  -H "Authorization: Bearer $ALD_KEY" \\',
    '  -d \'{"model":"claude-sonnet-4-5","messages":[{"role":"user","content":"你好"}]}\'',
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
  java: (serverAddress) => [
    '// add openai-java dependency',
    'OpenAIClient client = OpenAIClient.builder()',
    '    .apiKey("sk-ald-•••••")',
    `    .baseUrl("${serverAddress}/v1")`,
    '    .build();',
    '',
    'ChatCompletionRequest request = ChatCompletionRequest.builder()',
    '    .model("gpt-4o")',
    '    .build();',
  ],
  rust: (serverAddress) => [
    '// cargo add async-openai',
    'let config = OpenAIConfig::new()',
    '    .with_api_key("sk-ald-•••••")',
    `    .with_api_base("${serverAddress}/v1");`,
    '',
    'let client = Client::with_config(config);',
    'let request = CreateChatCompletionRequestArgs::default()',
    '    .model("claude-3-5-sonnet-20240620")',
    '    .build()?;',
  ],
  php: (serverAddress) => [
    '// composer require openai-php/client',
    '$client = OpenAI::factory()',
    "    ->withApiKey('sk-ald-•••••')",
    `    ->withBaseUri('${serverAddress}/v1')`,
    '    ->make();',
    '',
    '$response = $client->chat()->create([',
    "    'model' => 'gemini-1.5-pro',",
    ']);',
  ],
  ruby: (serverAddress) => [
    '# gem install ruby-openai',
    'client = OpenAI::Client.new(',
    "  access_token: 'sk-ald-•••••',",
    `  uri_base: '${serverAddress}/v1'`,
    ')',
  ],
  csharp: (serverAddress) => [
    '// using OpenAI SDK',
    'var client = new OpenAIClient(',
    "  apiKey: \"sk-ald-•••••\",",
    `  baseUrl: \"${serverAddress}/v1\"`,
    ');',
  ],
  swift: (serverAddress) => [
    '// Swift example',
    'let client = OpenAI(',
    "  apiKey: \"sk-ald-•••••\",",
    `  baseURL: \"${serverAddress}/v1\"`,
    ')',
  ],
  kotlin: (serverAddress) => [
    '// Kotlin example',
    'val client = OpenAIClient(',
    "  apiKey = \"sk-ald-•••••\",",
    `  baseUrl = \"${serverAddress}/v1\"`,
    ')',
  ],
  dart: (serverAddress) => [
    '// Dart example',
    'final client = OpenAIClient(',
    "  apiKey: 'sk-ald-•••••',",
    `  baseUrl: '${serverAddress}/v1',`,
    ');',
  ],
  cpp: (serverAddress) => [
    "// C++ HTTP client example",
    `// POST ${serverAddress}/v1/chat/completions`,
    '// Authorization: Bearer sk-ald-•••••',
  ],
  r: (serverAddress) => [
    '# R httr2 example',
    `req <- request('${serverAddress}/v1/chat/completions')`,
    "req <- req_headers(req, Authorization = 'Bearer sk-ald-•••••')",
  ],
  scala: (serverAddress) => [
    '// Scala example',
    `// baseURL = ${serverAddress}/v1`,
  ],
  perl: (serverAddress) => [
    '# Perl example',
    "# Authorization: Bearer sk-ald-•••••",
    `# POST ${serverAddress}/v1/chat/completions`,
  ],
  elixir: (serverAddress) => [
    '# Elixir Finch example',
    `# POST ${serverAddress}/v1/chat/completions`,
    "# authorization: bearer sk-ald-•••••",
  ],
  bash: (serverAddress) => [
    '# Bash example',
    `curl ${serverAddress}/v1/models \\`,
    "  -H 'Authorization: Bearer sk-ald-•••••'",
  ],
};

function RobotVendorLayer() {
  const containerRef = useRef(null);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const updateColumns = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      // Column width: 220px + 32px gap = 252px
      const colWidth = 252;
      const numCols = Math.max(1, Math.floor(width / colWidth));

      const newCols = Array.from({ length: numCols }, (_, colIndex) => {
        // Randomly pick a subset of items to loop
        const shuffled = [...providerItems].sort(() => Math.random() - 0.5);
        // Take 8 items per column
        const subset = shuffled.slice(0, 8);
        // Pre-calculate fixed indices for consistent coloring during scroll
        return subset.map((item) => ({
          name: item,
          colorIndex: Math.floor(Math.random() * 3),
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
        <div
          key={colIndex}
          className={`ald-home-vendor-col ald-home-vendor-col--${colIndex % 7}`}
        >
          <div className='ald-home-vendor-col__track'>
            {[...col, ...col].map((item, index) => (
              <span
                key={`${item.name}-${index}`}
                className={`ald-home-proof__item ald-home-proof__item--${item.colorIndex}`}
              >
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
      java: snippets.java(serverAddress),
      rust: snippets.rust(serverAddress),
      php: snippets.php(serverAddress),
      ruby: snippets.ruby(serverAddress),
      csharp: snippets.csharp(serverAddress),
      swift: snippets.swift(serverAddress),
      kotlin: snippets.kotlin(serverAddress),
      dart: snippets.dart(serverAddress),
      cpp: snippets.cpp(serverAddress),
      r: snippets.r(serverAddress),
      scala: snippets.scala(serverAddress),
      perl: snippets.perl(serverAddress),
      elixir: snippets.elixir(serverAddress),
      bash: snippets.bash(serverAddress),
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
                <HeroRobotScene
                  isDesktop={isDesktop}
                  shouldLoadScene={shouldLoadScene}
                >
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
