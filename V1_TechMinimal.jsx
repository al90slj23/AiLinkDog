// V1 — Tech Minimal · themeable (light + full dark)
// AiLink.Dog brand: #f5b301 primary, #ff7a18 orange, Plus Jakarta Sans + IBM Plex Mono + Lora.
// Adds interactivity + breathing room: live ticker, animated model switcher,
// hover-lifted cards, collapsible FAQ, subtle scroll reveals.

(() => {
  const THEMES = {
    light: {
      bg: '#fdfdfd', card: '#fdfdfd', surface: '#f5f5f5', subsurface: '#fafbfd',
      accent: '#fff4d6', border: '#e7e7ee', fg: '#000000', dim: '#525252',
      codeBg: '#0f1115', codeFg: '#eaeaf0', codeDim: '#a1a1aa', codeLine: '#22242b',
      primary: '#f5b301', primaryDeep: '#b77900', orange: '#ff7a18',
      green: '#22c55e', chipFg: '#b77900',
    },
    dark: {
      bg: '#0f1115', card: '#181a20', surface: '#0f1115', subsurface: '#141720',
      accent: '#2a2112', border: '#2f323a', fg: '#eaeaf0', dim: '#a1a1aa',
      codeBg: '#000000', codeFg: '#eaeaf0', codeDim: '#a1a1aa', codeLine: '#22242b',
      primary: '#f5b301', primaryDeep: '#ffd166', orange: '#ff7a18',
      green: '#22c55e', chipFg: '#ffd166',
    },
  };

  const sans = '"Plus Jakarta Sans", "PingFang SC", "Hiragino Sans GB", system-ui, sans-serif';
  const mono = '"IBM Plex Mono", ui-monospace, Menlo, monospace';
  const serif = 'Lora, Georgia, serif';

  // Inject a tiny stylesheet once for interactive primitives (hover lift, ticker).
  if (typeof document !== 'undefined' && !document.getElementById('ald-v1-css')) {
    const s = document.createElement('style');
    s.id = 'ald-v1-css';
    s.textContent = `
      .ald-lift{transition:transform .25s cubic-bezier(.2,.7,.3,1),box-shadow .25s,border-color .25s}
      .ald-lift:hover{transform:translateY(-4px);box-shadow:0 18px 40px -18px rgba(245,179,1,0.35);border-color:#f5b301 !important}
      .ald-btn{transition:transform .15s,box-shadow .2s,background .2s;cursor:pointer}
      .ald-btn:hover{transform:translateY(-1px);box-shadow:0 6px 20px -6px rgba(245,179,1,0.55)}
      .ald-btn:active{transform:translateY(0)}
      .ald-chip{transition:background .2s,color .2s,border-color .2s;cursor:pointer}
      .ald-row{transition:background .15s}
      .ald-row:hover{background:rgba(245,179,1,0.06)}
      @keyframes aldTicker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
      .ald-ticker-track{display:flex;gap:48px;white-space:nowrap;animation:aldTicker 40s linear infinite}
      @keyframes aldPulse{0%,100%{opacity:1}50%{opacity:.35}}
      .ald-pulse{animation:aldPulse 1.6s ease-in-out infinite}
      @keyframes aldSpark{from{stroke-dashoffset:var(--len)}to{stroke-dashoffset:0}}
      .ald-spark path{stroke-dasharray:var(--len);stroke-dashoffset:var(--len);animation:aldSpark 2.2s ease-out forwards}
      .ald-faq summary{list-style:none;cursor:pointer}
      .ald-faq summary::-webkit-details-marker{display:none}
      .ald-faq[open] .ald-faq-toggle{transform:rotate(45deg)}
      .ald-faq-toggle{transition:transform .2s}
      .ald-tabs button{transition:color .2s,border-color .2s}
    `;
    document.head.appendChild(s);
  }

  const Logo = ({ t, h = 26 }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <img src="assets/ALD.png" alt="AiLink.Dog" style={{
        height: h, width: h, objectFit: 'cover', borderRadius: '50%', background: '#0f1115',
      }}/>
      <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.025em', color: t.fg }}>
        AiLink<span style={{ color: t.primary }}>.Dog</span>
      </span>
    </div>
  );

  // ─── code block: live tabs + animated route log ─────────────────
  function CodeBlock({ t }) {
    const [lang, setLang] = React.useState('curl');
    const [ticks, setTicks] = React.useState(0);
    React.useEffect(() => {
      const id = setInterval(() => setTicks(x => x + 1), 2200);
      return () => clearInterval(id);
    }, []);
    const latency = (1.0 + ((ticks * 0.17) % 0.6)).toFixed(2);
    const fallbackMs = 320 + ((ticks * 23) % 80);

    const snippets = {
      curl: (
        <>
          <span style={{ color: t.codeDim }}># 改一行 base_url,无需换 SDK</span>{'\n'}
          <span style={{ color: t.primary }}>curl</span> https://api.ailink.dog/v1/chat/completions \{'\n'}
          {'  '}-H <span style={{ color: '#ffd166' }}>"Authorization: Bearer $ALG_KEY"</span> \{'\n'}
          {'  '}-d <span style={{ color: '#ffd166' }}>{`'{"model":"claude-sonnet-4-5",`}</span>{'\n'}
          {'      '}<span style={{ color: '#ffd166' }}>{`"messages":[{"role":"user","content":"你好"}]}'`}</span>
        </>
      ),
      python: (
        <>
          <span style={{ color: t.codeDim }}># pip install openai</span>{'\n'}
          <span style={{ color: t.primary }}>from</span> openai <span style={{ color: t.primary }}>import</span> OpenAI{'\n\n'}
          client = OpenAI({'\n'}
          {'  '}api_key=<span style={{ color: '#ffd166' }}>"sk-alg-•••••"</span>,{'\n'}
          {'  '}base_url=<span style={{ color: '#ffd166' }}>"https://api.ailink.dog/v1"</span>,{'\n'}
          ){'\n\n'}
          client.chat.completions.create(model=<span style={{ color: '#ffd166' }}>"gpt-5"</span>, messages=[...])
        </>
      ),
      node: (
        <>
          <span style={{ color: t.codeDim }}>// npm i openai</span>{'\n'}
          <span style={{ color: t.primary }}>import</span> OpenAI <span style={{ color: t.primary }}>from</span> <span style={{ color: '#ffd166' }}>"openai"</span>;{'\n\n'}
          <span style={{ color: t.primary }}>const</span> client = <span style={{ color: t.primary }}>new</span> OpenAI({'{'}{'\n'}
          {'  '}apiKey: <span style={{ color: '#ffd166' }}>"sk-alg-•••••"</span>,{'\n'}
          {'  '}baseURL: <span style={{ color: '#ffd166' }}>"https://api.ailink.dog/v1"</span>,{'\n'}
          {'}'});{'\n\n'}
          <span style={{ color: t.primary }}>await</span> client.chat.completions.create({'{'} model: <span style={{ color: '#ffd166' }}>"gemini-2.5-pro"</span> {'}'});
        </>
      ),
      go: (
        <>
          <span style={{ color: t.codeDim }}>// go get github.com/openai/openai-go</span>{'\n'}
          client := openai.NewClient({'\n'}
          {'  '}option.WithAPIKey(<span style={{ color: '#ffd166' }}>"sk-alg-•••••"</span>),{'\n'}
          {'  '}option.WithBaseURL(<span style={{ color: '#ffd166' }}>"https://api.ailink.dog/v1"</span>),{'\n'}
          ){'\n\n'}
          client.Chat.Completions.New(ctx, openai.ChatCompletionNewParams{'{'}{'\n'}
          {'  '}Model: <span style={{ color: '#ffd166' }}>"deepseek-v3.2"</span>,{'\n'}
          {'}'})
        </>
      ),
    };

    return (
      <div style={{
        background: t.codeBg, color: t.codeFg, borderRadius: '1.4rem', overflow: 'hidden',
        border: `1px solid ${t.border}`, boxShadow: '0 30px 60px -30px rgba(245,179,1,0.35)',
      }}>
        <div className="ald-tabs" style={{
          padding: '12px 16px', borderBottom: `1px solid ${t.codeLine}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontFamily: mono, fontSize: 12, color: t.codeDim,
        }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {['curl', 'python', 'node', 'go'].map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: '6px 12px', borderRadius: 6,
                color: lang === l ? t.primary : t.codeDim,
                fontFamily: mono, fontSize: 12,
                borderBottom: lang === l ? `1.5px solid ${t.primary}` : '1.5px solid transparent',
              }}>{l}</button>
            ))}
          </div>
          <span>OpenAI 兼容 · /v1/chat/completions</span>
        </div>
        <pre style={{
          margin: 0, padding: '22px', fontFamily: mono, fontSize: 13, lineHeight: 1.75,
          whiteSpace: 'pre-wrap', minHeight: 196,
        }}>{snippets[lang]}</pre>
        <div style={{ borderTop: `1px solid ${t.codeLine}`, padding: '16px 22px', fontFamily: mono, fontSize: 12, color: t.codeDim }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span>路由日志 <span style={{ opacity: 0.6 }}>· 实时</span></span>
            <span style={{ color: t.green, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span className="ald-pulse" style={{ width: 6, height: 6, borderRadius: 3, background: t.green }}/>
              200 · {latency}s
            </span>
          </div>
          <div>→ upstream-a · <span style={{ color: t.orange }}>429 rate-limited</span></div>
          <div>→ upstream-b · <span style={{ color: t.green }}>200 · {fallbackMs}ms</span></div>
          <div style={{ color: t.primary }}>✓ 已自动回源,用户侧无感知</div>
        </div>
      </div>
    );
  }

  // ─── animated counter ───────────────────────────────────────────
  function Counter({ value, suffix = '', duration = 1200 }) {
    const [n, setN] = React.useState(0);
    const ref = React.useRef(null);
    React.useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const io = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          const start = performance.now();
          const step = (now) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(value * eased);
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          io.disconnect();
        }
      }, { threshold: 0.3 });
      io.observe(el);
      return () => io.disconnect();
    }, [value, duration]);
    const display = value % 1 === 0
      ? Math.round(n).toLocaleString()
      : n.toFixed(2);
    return <span ref={ref}>{display}{suffix}</span>;
  }

  // ─── model switcher (interactive) ───────────────────────────────
  const MODELS = [
    { name: 'claude-sonnet-4-5', in: '¥21.00', out: '¥105.00', lat: 1.18, st: 'ok', bars: [80,82,78,85,81,79,83,80,82,81] },
    { name: 'gpt-5', in: '¥17.50', out: '¥70.00', lat: 0.96, st: 'ok', bars: [65,70,68,72,69,74,71,70,73,69] },
    { name: 'gemini-2.5-pro', in: '¥8.80', out: '¥35.00', lat: 0.74, st: 'ok', bars: [50,55,52,58,54,56,53,57,55,56] },
    { name: 'deepseek-v3.2', in: '¥0.98', out: '¥1.96', lat: 0.52, st: 'ok', bars: [38,42,40,44,41,43,40,42,41,43] },
    { name: 'qwen3-max', in: '¥2.80', out: '¥8.40', lat: 0.61, st: 'ok', bars: [44,48,46,50,47,49,46,48,47,49] },
    { name: 'moonshot-v2', in: '¥4.20', out: '¥12.60', lat: 0.88, st: 'degraded', bars: [60,75,50,80,45,70,55,85,60,72] },
  ];

  function ModelExplorer({ t }) {
    const [sel, setSel] = React.useState(0);
    const m = MODELS[sel];
    return (
      <div style={{
        background: t.card, border: `1px solid ${t.border}`, borderRadius: '1.4rem', overflow: 'hidden',
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1.4fr 120px 120px 120px 120px',
          padding: '16px 24px', background: t.subsurface, color: t.dim, fontSize: 11,
          letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: `1px solid ${t.border}`,
          fontFamily: mono,
        }}>
          <span>MODEL</span><span style={{ textAlign: 'right' }}>IN / 1M</span>
          <span style={{ textAlign: 'right' }}>OUT / 1M</span>
          <span style={{ textAlign: 'right' }}>P50</span><span style={{ textAlign: 'right' }}>STATUS</span>
        </div>
        {MODELS.map((row, i) => (
          <div key={row.name} className="ald-row" onClick={() => setSel(i)} style={{
            display: 'grid', gridTemplateColumns: '1.4fr 120px 120px 120px 120px',
            padding: '16px 24px', alignItems: 'center', cursor: 'pointer', fontFamily: mono, fontSize: 13,
            borderTop: i ? `1px solid ${t.border}` : 'none',
            background: i === sel ? `${t.primary}12` : 'transparent',
            borderLeft: i === sel ? `3px solid ${t.primary}` : '3px solid transparent',
          }}>
            <span style={{ fontWeight: 600, color: t.fg }}>{row.name}</span>
            <span style={{ textAlign: 'right', color: t.fg }}>{row.in}</span>
            <span style={{ textAlign: 'right', color: t.fg }}>{row.out}</span>
            <span style={{ textAlign: 'right', color: t.dim }}>{row.lat}s</span>
            <span style={{ textAlign: 'right' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11,
                color: row.st === 'ok' ? t.green : t.orange, letterSpacing: '0.05em', fontWeight: 600,
              }}>
                <span className={row.st === 'ok' ? '' : 'ald-pulse'} style={{
                  width: 6, height: 6, borderRadius: 3,
                  background: row.st === 'ok' ? t.green : t.orange,
                }}/>
                {row.st === 'ok' ? 'OPERATIONAL' : 'DEGRADED'}
              </span>
            </span>
          </div>
        ))}
        {/* Detail band */}
        <div style={{
          padding: '28px 24px', borderTop: `1px solid ${t.border}`, background: t.subsurface,
          display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 32, alignItems: 'center',
        }}>
          <div>
            <div style={{ fontFamily: mono, fontSize: 11, color: t.dim, letterSpacing: '0.08em' }}>SELECTED</div>
            <div style={{ fontFamily: mono, fontSize: 18, fontWeight: 600, color: t.fg, marginTop: 4 }}>{m.name}</div>
          </div>
          <div>
            <div style={{ fontFamily: mono, fontSize: 11, color: t.dim, letterSpacing: '0.08em' }}>EST. 1K TOKENS</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: t.primary, marginTop: 4, letterSpacing: '-0.025em' }}>
              ¥{(parseFloat(m.in.slice(1)) / 1000 + parseFloat(m.out.slice(1)) / 1000 * 3).toFixed(4)}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: mono, fontSize: 11, color: t.dim, letterSpacing: '0.08em', marginBottom: 8 }}>
              LATENCY · LAST 10 MIN
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 40 }}>
              {m.bars.map((b, i) => (
                <div key={i} style={{
                  flex: 1, height: `${b}%`, background: m.st === 'ok' ? t.primary : t.orange,
                  borderRadius: 2, opacity: 0.3 + (i / m.bars.length) * 0.7,
                  transition: 'height .4s',
                }}/>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── FAQ collapsible ────────────────────────────────────────────
  function FAQ({ t }) {
    const items = [
      ['与直接调用 provider 官方 API 有什么区别?', '同样的接口格式,多一层路由与监控。provider 波动时自动回源,并且可以跨模型统一计费。'],
      ['会在中间存储我的 prompt 或 response 吗?', '默认不存储,仅保留计费所需的 token 计数与延迟指标。可在控制台显式开启日志。'],
      ['稳定性与监控具体是怎么做的?', '每个模型有多条上游渠道,后台鉴别系统持续探测质量,异常节点自动降权或剔除,整个切换在 80ms 内完成。'],
      ['能对接我们自部署的模型吗?', '可以。企业版支持将私有模型或私有路由纳入统一网关,共用同一套密钥、监控与计费体系。'],
      ['最低消费是多少?', '无最低消费。按实际 token 使用量计费,注册即送 ¥10 测试额度。'],
    ];
    return (
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '1.4rem', overflow: 'hidden' }}>
        {items.map(([q, a], i) => (
          <details key={q} className="ald-faq" style={{
            borderBottom: i < items.length - 1 ? `1px solid ${t.border}` : 'none',
          }}>
            <summary style={{
              padding: '26px 28px', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', gap: 24,
            }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: t.fg }}>{q}</span>
              <span className="ald-faq-toggle" style={{
                fontFamily: mono, fontSize: 22, color: t.primary, fontWeight: 300, lineHeight: 1,
              }}>+</span>
            </summary>
            <div style={{ padding: '0 28px 26px', fontSize: 14, color: t.dim, lineHeight: 1.65, maxWidth: 780 }}>
              {a}
            </div>
          </details>
        ))}
      </div>
    );
  }

  // ─── Ticker ─────────────────────────────────────────────────────
  function Ticker({ t }) {
    const items = [
      ['claude-sonnet-4-5', 'healthy', t.green],
      ['gpt-5', '+0.3% faster', t.green],
      ['gemini-2.5-pro', 'healthy', t.green],
      ['deepseek-v3.2', '-0.4¥ / 1M', t.primary],
      ['qwen3-max', 'healthy', t.green],
      ['moonshot-v2', 'degraded · rerouting', t.orange],
      ['llama-4-405b', 'new · available', t.primary],
      ['glm-4.6-plus', 'new · available', t.primary],
    ];
    const row = (
      <div className="ald-ticker-track">
        {[...items, ...items].map((it, i) => (
          <span key={i} style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            fontFamily: mono, fontSize: 12, color: t.dim,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: it[2] }}/>
            <span style={{ color: t.fg, fontWeight: 600 }}>{it[0]}</span>
            <span>· {it[1]}</span>
          </span>
        ))}
      </div>
    );
    return (
      <div style={{
        borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}`,
        background: t.subsurface, padding: '14px 0', overflow: 'hidden', width: '100%',
      }}>{row}</div>
    );
  }

  // ─── Main shell ────────────────────────────────────────────────
  function V1({ theme }) {
    const t = THEMES[theme];
    return (
      <div style={{
        background: t.bg, color: t.fg, fontFamily: sans,
        width: 1440, minHeight: 3000, letterSpacing: '-0.025em',
      }}>
        {/* Nav */}
        <div style={{
          padding: '20px 72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: `1px solid ${t.border}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
            <Logo t={t}/>
            <span style={{
              fontFamily: mono, fontSize: 10, color: t.chipFg, background: t.accent,
              padding: '3px 8px', borderRadius: 4, letterSpacing: '0.08em',
            }}>ALG</span>
            <nav style={{ display: 'flex', gap: 28, fontSize: 14, color: t.dim, marginLeft: 4 }}>
              <span>模型广场</span><span>定价</span><span>文档</span><span>状态监控</span><span>控制台</span>
            </nav>
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', fontSize: 14 }}>
            <span style={{
              fontFamily: mono, fontSize: 11, color: t.dim,
              border: `1px solid ${t.border}`, padding: '4px 8px', borderRadius: 6,
            }}>{theme === 'dark' ? '◐ dark' : '◑ light'}</span>
            <span style={{ color: t.dim }}>EN / 中</span>
            <span style={{ color: t.dim }}>登录</span>
            <button className="ald-btn" style={{
              background: t.primary, color: '#1a1a1a', border: 'none',
              padding: '10px 20px', borderRadius: '0.9rem', fontSize: 14, fontWeight: 700,
            }}>开始接入 →</button>
          </div>
        </div>

        {/* Ticker */}
        <Ticker t={t}/>

        {/* Hero */}
        <div style={{ padding: '120px 72px 100px', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 72, alignItems: 'center' }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10, padding: '7px 14px',
              background: t.accent, color: t.chipFg, borderRadius: 100, fontSize: 12, fontWeight: 600,
              marginBottom: 36, fontFamily: mono,
            }}>
              <span className="ald-pulse" style={{ width: 6, height: 6, borderRadius: 3, background: t.green }}/>
              All 128 models operational · 实时监控中
            </div>
            <h1 style={{
              fontSize: 84, lineHeight: 1.0, letterSpacing: '-0.04em', fontWeight: 700,
              margin: 0, marginBottom: 28,
            }}>
              接入所有模型,<br/>
              <span style={{ color: t.primary }}>自由定义选择。</span>
            </h1>
            <div style={{ fontSize: 19, color: t.dim, lineHeight: 1.6, maxWidth: 540, marginBottom: 18 }}>
              面向开发者与 AI 应用团队的 API 聚合与模型中转平台。
              统一接入,稳定、透明、可控。
            </div>
            <div style={{
              fontFamily: mono, fontSize: 13, color: t.orange,
              paddingBottom: 40, borderBottom: `1px solid ${t.border}`, marginBottom: 40,
            }}>
              All AI, One Link — Follow the Dog.
            </div>
            <div style={{ display: 'flex', gap: 14, marginBottom: 52 }}>
              <button className="ald-btn" style={{
                background: t.primary, color: '#1a1a1a', border: 'none',
                padding: '16px 28px', borderRadius: '1rem', fontSize: 15, fontWeight: 700,
              }}>开始接入</button>
              <button className="ald-btn" style={{
                background: t.card, color: t.fg, border: `1px solid ${t.border}`,
                padding: '16px 28px', borderRadius: '1rem', fontSize: 15, fontWeight: 600,
              }}>查看文档 →</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
              {[
                [99.98, '%', '30 天可用率'],
                [128, '+', '接入模型数'],
                [80, 'ms', '路由转发开销',  '<'],
              ].map(([n, suf, l, prefix]) => (
                <div key={l}>
                  <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.03em' }}>
                    {prefix && <span style={{ color: t.dim, marginRight: 4 }}>{prefix}</span>}
                    <Counter value={n} suffix={suf}/>
                  </div>
                  <div style={{ fontSize: 12, color: t.dim, marginTop: 6 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <CodeBlock t={t}/>
        </div>

        {/* Core capabilities */}
        <div style={{ padding: '40px 72px 140px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 48 }}>
            <span style={{ fontFamily: mono, fontSize: 12, color: t.chipFg, letterSpacing: '0.08em' }}>§ CORE</span>
            <h2 style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-0.035em', margin: 0 }}>六项核心能力</h2>
            <span style={{ color: t.dim, fontSize: 15, fontFamily: serif, fontStyle: 'italic' }}>
              Six things we take seriously.
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              ['01', '稳定性优先', 'Stability First', '多路由自动回源,provider 波动用户无感。持续监控模型健康状态。'],
              ['02', '真实、不掺水', 'No Dilution', '模型能力与运行状态透明展示,不做营销话术修饰。'],
              ['03', 'OpenAI 兼容', 'Drop-in API', '改 base_url 即可完成迁移。所有官方 SDK 与工具链开箱可用。'],
              ['04', '统一入口', 'One Gateway', '一个密钥、一套账单,按需在 128+ 模型之间自由切换。'],
              ['05', '鉴别与持续监控', 'Active Monitoring', '后台特有的渠道鉴别逻辑,实时筛选劣质节点,只保留健康上游。'],
              ['06', '综合成本更低', 'Real Lower Cost', '智能路由 + 缓存 + 压缩,让账单真实下降,而非仅卷表面单价。'],
            ].map(([n, zh, en, body]) => (
              <div key={n} className="ald-lift" style={{
                background: t.card, border: `1px solid ${t.border}`, borderRadius: '1.4rem', padding: 32,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 22 }}>
                  <span style={{ fontFamily: mono, fontSize: 12, color: t.chipFg, letterSpacing: '0.08em' }}>— {n}</span>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', background: t.accent,
                    display: 'grid', placeItems: 'center', color: t.chipFg, fontSize: 13, fontWeight: 700,
                  }}>●</div>
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.025em' }}>{zh}</div>
                <div style={{ fontFamily: mono, fontSize: 11, color: t.orange, letterSpacing: '0.05em', marginTop: 6, marginBottom: 18 }}>{en}</div>
                <div style={{ fontSize: 14, color: t.dim, lineHeight: 1.65 }}>{body}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Models */}
        <div style={{ background: t.surface, padding: '120px 72px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
            <div>
              <span style={{ fontFamily: mono, fontSize: 12, color: t.chipFg, letterSpacing: '0.08em' }}>§ MODELS</span>
              <h2 style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-0.035em', margin: '10px 0 10px' }}>
                多模型统一入口,按需自由切换
              </h2>
              <div style={{ color: t.dim, fontSize: 15 }}>点击任意模型查看实时延迟分布 · Click a row to inspect.</div>
            </div>
            <button className="ald-btn" style={{
              background: t.card, border: `1px solid ${t.border}`, color: t.fg,
              padding: '12px 22px', borderRadius: '1rem', fontSize: 14, fontWeight: 600,
            }}>查看全部 128 个模型 →</button>
          </div>
          <ModelExplorer t={t}/>
        </div>

        {/* Quick start + audience */}
        <div style={{ padding: '120px 72px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72 }}>
          <div>
            <span style={{ fontFamily: mono, fontSize: 12, color: t.chipFg, letterSpacing: '0.08em' }}>§ QUICK START</span>
            <h2 style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.035em', margin: '10px 0 28px' }}>
              3 步完成接入
            </h2>
            {[
              ['01', '注册账号,获取 API Key', 'ailink.dog/register'],
              ['02', '将 base_url 指向 api.ailink.dog/v1', '修改一行配置'],
              ['03', '调用任意模型,实时查看用量与账单', 'console.ailink.dog'],
            ].map(([n, ti, s]) => (
              <div key={n} className="ald-row" style={{
                padding: '28px 0', borderTop: `1px solid ${t.border}`,
                display: 'grid', gridTemplateColumns: '60px 1fr 220px', alignItems: 'center', gap: 18,
              }}>
                <span style={{ fontFamily: mono, fontSize: 13, color: t.chipFg, fontWeight: 700 }}>{n}</span>
                <span style={{ fontSize: 17, fontWeight: 600 }}>{ti}</span>
                <span style={{ fontFamily: mono, fontSize: 12, color: t.dim, textAlign: 'right' }}>{s}</span>
              </div>
            ))}
          </div>
          <div>
            <span style={{ fontFamily: mono, fontSize: 12, color: t.chipFg, letterSpacing: '0.08em' }}>§ FOR</span>
            <h2 style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.035em', margin: '10px 0 28px' }}>
              为谁而做
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                ['开发者 / 独立开发者', '一个人也能跑起来的底层 AI 基础设施。按量计费,零最低消费。'],
                ['AI 应用团队', '生产流量下的稳定保障,多渠道容灾,不被单一 provider 绑架。'],
                ['AI 创业团队', '把精力留给产品。账单、路由、鉴权、监控交给我们。'],
                ['出海团队', '中美双区节点,跨境可达,合规链路透明。'],
              ].map(([ti, b]) => (
                <div key={ti} className="ald-lift" style={{
                  border: `1px solid ${t.border}`, borderRadius: '1.4rem', padding: 24, background: t.card,
                }}>
                  <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{ti}</div>
                  <div style={{ fontSize: 13, color: t.dim, lineHeight: 1.6 }}>{b}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ background: t.surface, padding: '120px 72px' }}>
          <span style={{ fontFamily: mono, fontSize: 12, color: t.chipFg, letterSpacing: '0.08em' }}>§ FAQ</span>
          <h2 style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.035em', margin: '10px 0 36px' }}>常见问题</h2>
          <FAQ t={t}/>
        </div>

        {/* Final CTA */}
        <div style={{
          padding: '140px 72px', textAlign: 'center',
          background: theme === 'dark'
            ? `radial-gradient(ellipse at center top, rgba(245,179,1,0.08) 0%, ${t.bg} 55%)`
            : `radial-gradient(ellipse at center top, ${t.accent} 0%, ${t.bg} 55%)`,
        }}>
          <img src="assets/ALD.png" alt="AiLink.Dog" style={{
            width: 130, height: 130, borderRadius: '50%', objectFit: 'cover',
            background: '#0f1115', marginBottom: 32, boxShadow: '0 15px 40px rgba(245,179,1,0.3)',
          }}/>
          <div style={{ fontSize: 68, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.05 }}>
            接入所有模型,<span style={{ color: t.primary }}>自由定义选择</span>。
          </div>
          <div style={{ fontSize: 18, color: t.dim, marginTop: 20, marginBottom: 14 }}>
            更低算力成本,享受 AI 浪潮。
          </div>
          <div style={{ fontFamily: mono, fontSize: 13, color: t.orange, marginBottom: 40 }}>
            All AI, One Link — Follow the Dog.
          </div>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
            <button className="ald-btn" style={{
              background: t.primary, color: '#1a1a1a', border: 'none',
              padding: '18px 36px', borderRadius: '1.1rem', fontSize: 15, fontWeight: 700,
            }}>开始接入 →</button>
            <button className="ald-btn" style={{
              background: t.card, color: t.fg, border: `1px solid ${t.border}`,
              padding: '18px 36px', borderRadius: '1.1rem', fontSize: 15, fontWeight: 600,
            }}>查看文档</button>
          </div>
        </div>

        <div style={{
          padding: '32px 72px', borderTop: `1px solid ${t.border}`,
          display: 'flex', justifyContent: 'space-between', fontSize: 13, color: t.dim,
        }}>
          <span>© 2026 AiLink.Dog · ALG — AI API Aggregation Platform</span>
          <span>状态 · 文档 · 定价 · 条款 · 隐私</span>
        </div>
      </div>
    );
  }

  window.V1TechMinimal = () => <V1 theme="light"/>;
  window.V1TechMinimalDark = () => <V1 theme="dark"/>;
})();
