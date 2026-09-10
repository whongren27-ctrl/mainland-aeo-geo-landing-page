import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const WECHAT_ID = 'AEO-GEO-Clinic';

const navItems = [
  ['趋势', '#trend'],
  ['行业分析', '#industries'],
  ['服务', '#services'],
  ['年度订阅', '#subscription'],
  ['流程', '#process'],
  ['反馈', '#proof'],
  ['FAQ', '#faq'],
];

const painPoints = [
  {
    title: '没进前几个，就等于没进候选名单',
    text: '越来越多咨询从“先问 AI”开始：种牙疼不疼、热玛吉值不值、附近哪家靠谱。豆包、Kimi、DeepSeek 给出的前几个机构，决定谁先被用户比较。',
  },
  {
    title: '传统 SEO 排名不等于 AI 前排',
    text: '网页有排名，不代表机构会进入 AI 的前几个推荐结果。我们围绕 AI 搜索排名与推荐位做诊断、布点和追踪，内容只是实现前排结果的手段。',
  },
  {
    title: '前排位置决定第一轮信任',
    text: '牙科和医美都属于高信任、高客单、强比较行业。机构先进入前几个候选，才有机会展示医生、项目、安全边界和真实服务能力。',
  },
];

const trendCards = [
  ['从搜索框到对话框', '用户把“哪里好”变成“我这种情况该怎么选”。内容必须覆盖症状、预算、风险、流程与本地决策。'],
  ['从网页排名到前排候选', '豆包、Kimi、DeepSeek 会综合网页、问答、百科、口碑和机构信息生成候选答案。只做首页关键词，可能仍然进不了前几个推荐位置。'],
  ['从流量到咨询质量', 'AI 已经替用户做第一轮筛选。能被解释清楚、对比清楚、风险说清楚的机构，更容易获得高意向微信咨询。'],
];

const compareRows = [
  ['目标', '让网页在关键词结果中靠前', '让机构信息进入 AI 回答、推荐理由和对比清单'],
  ['内容形态', '文章、栏目页、项目页为主', '问答库、证据库、服务边界、医生资质、场景化决策路径'],
  ['评估重点', '标题、外链、收录、网页排名', 'AI 前排位置、候选名单出现率、推荐理由、实体可信度与问题覆盖'],
  ['转化路径', '搜索结果页点击后再咨询', '先进入 AI 前几个候选，再引导用户到微信咨询'],
];

const industryData = [
  {
    id: 'dental',
    label: '牙科诊所',
    title: '让牙科医院进入 AI 搜索前几个候选',
    intro: '牙科咨询往往从症状、疼痛、价格和方案比较开始。目标是让医院在用户问“哪家好、怎么选”时进入前几个推荐候选，再用专业信息承接预约。',
    journey: ['牙疼/缺牙/矫正困扰', '问豆包/Kimi/DeepSeek 方案', '比较风险、周期、价格', '筛选附近诊所与医生', '加微信预约初诊'],
    questions: ['我适合种植牙还是固定桥？', '隐形矫正和金属托槽怎么选？', '根管治疗后一定要做牙冠吗？', '儿童早矫什么时候开始比较好？'],
    opportunities: ['种植牙/矫正前排问题词', '医生专长与设备信号', '价格组成与地区竞争位', '术前术后问答布点', '本地医院候选追踪'],
    funnel: '先冲进 AI 给出的前几个就诊候选，再用方案对比降低犹豫，最后通过医生与预约入口完成微信转化。',
  },
  {
    id: 'aesthetic',
    label: '医美机构',
    title: '让医美机构进入 AI 搜索前几个候选',
    intro: '医美咨询更关注审美结果、安全风险、恢复期和项目适配。目标是让机构在用户问“哪个项目/哪家机构适合我”时进入前几个推荐结果。',
    journey: ['皮肤/轮廓/抗衰需求', '询问 AI 项目适配', '比较仪器、医生、恢复期', '查看风险与真实体验', '加微信做面诊评估'],
    questions: ['水光、光子、超声炮分别适合什么人？', '第一次做医美如何避坑？', '玻尿酸和再生材料差异是什么？', '术后多久可以上班化妆？'],
    opportunities: ['光电/注射前排问题词', '风险与禁忌信号', '医生审美与资质证据', '恢复期决策问答', '城市竞品前排追踪'],
    funnel: '先进入 AI 给出的前几个医美候选，机构用专业边界与案例结构承接，再用微信面诊把疑问转为到店。',
  },
];

const services = [
  ['AI 前排结果诊断', '实测机构在豆包、Kimi、DeepSeek 高频问题中的出现位置，记录前几个结果、竞品和缺失的排名机会。'],
  ['AI 推荐位竞争分析', '拆解同城同项目机构为什么进入前排，找到机构在实体、信任信号、问题覆盖和推荐理由上的差距。'],
  ['高频问题排名布点', '围绕种植牙、矫正、光电、注射、抗衰等决策词，设计冲击前几个结果的页面、问答和证据布点。'],
  ['机构实体与权威信号建设', '统一机构名称、地址、医生、项目、资质、服务范围和口碑线索，为 AI 推荐前排提供可信实体基础。'],
  ['前排结果与微信承接', '让进入 AI 前几个候选的用户快速找到微信入口，并用项目、城市和需求话术承接高意向咨询。'],
  ['月度排名追踪迭代', '持续记录 AI 前排位置、候选名单变化、竞品动作和咨询质量，按排名机会调整布点。'],
];

const subscriptionItems = [
  ['前排排名基线', '建立机构在豆包、Kimi、DeepSeek 的问题词清单，持续记录前几个结果、候选名单和同城竞品位置。'],
  ['年度问题地图', '围绕种植牙、矫正、光电、注射、抗衰等核心项目，持续扩展城市词、需求词、比较词和高意向咨询词。'],
  ['排名布点与页面建设', '规划并上线项目页、医生页、机构实体页、FAQ、对比说明和风险边界，让机构具备进入前排的信号基础。'],
  ['竞品与推荐理由拆解', '每月分析谁进入了前几个结果、AI 为什么推荐他们、机构缺少哪些可信信号，并形成下一轮动作清单。'],
  ['微信转化系统', '设计从 AI 前排结果到微信咨询的入口、话术、项目标签和预约承接，让前排曝光转成可跟进线索。'],
  ['月度复盘与策略迭代', '按排名变化、模型回答、城市竞争和真实咨询反馈调整重点，持续冲击更高的候选位置。'],
];

const process = [
  ['01', '测前排', '采集行业问题、AI 前几个结果、同城竞品和机构当前排名位置。'],
  ['02', '定策略', '确定要冲的项目词、城市词、问题词和推荐位竞争策略。'],
  ['03', '做布点', '上线页面、FAQ、实体信号和微信承接，让机构具备进入前排的条件。'],
  ['04', '追排名', '持续记录前排变化、竞品动作和咨询质量，滚动迭代冲击结果。'],
];

const feedback = [
  {
    tag: '匿名示例 · 口腔门诊',
    result: '从不出现到进入候选',
    text: '示例：围绕“同城种植牙怎么选”做前排布点后，机构从 AI 回答中不出现，进入了前几个候选名单，用户开始带着推荐理由来咨询。',
  },
  {
    tag: '匿名示例 · 皮肤管理机构',
    result: '进入同城项目候选',
    text: '示例：针对“光子嫩肤哪家靠谱”的问题持续追踪与布点后，机构进入 AI 前几个推荐候选，用户带着肤质、预算和恢复期要求来咨询。',
  },
  {
    tag: '体验型反馈 · 机构运营',
    result: '前排之后承接更顺',
    text: '体验型反馈：当机构开始进入 AI 前几个结果，FAQ 和风险说明让客服、咨询师、医生对用户追问的承接更一致，减少“先营销、后解释”。',
  },
];

const faqs = [
  ['你们做的是不是普通内容优化？', '不是。我们的业务目标是让牙科医院和医美机构进入豆包、Kimi、DeepSeek 的 AI 搜索前几个结果或推荐候选。页面、FAQ、实体信号和内容结构，都是为了争取前排位置的手段。'],
  ['能不能保证第一名？', '不能承诺固定第一名。AI 结果会受城市、问题、时间、数据源和模型变化影响。我们会以“进入前几个候选、提高出现率、持续追踪排名机会”为服务目标，不用虚假保证替代真实追踪。'],
  ['AEO 和 GEO 是不是替代 SEO？', '不是。SEO 仍然重要，但 AI 搜索会重新组织页面、问答、口碑和实体信息。AEO/GEO 的新增目标，是让机构不只在网页排名里出现，还能进入 AI 的前排答案和推荐名单。'],
  ['为什么只写豆包、Kimi、DeepSeek？', '这是为了贴合中国大陆用户更常见的 AI 搜索和问答环境。我们的排名监测、问题设计和推荐位策略也会围绕这些模型展开。'],
  ['没有真实案例可以写吗？', '可以写匿名示例、体验型反馈和可验证的内部观察，但不能伪造客户名称或夸大数据。第一版会明确标注示例属性。'],
  ['牙科和医美能共用一套内容吗？', '底层方法可以共用，但用户关心点不同。牙科偏症状、治疗方案、疼痛、价格和周期；医美偏审美适配、安全风险、恢复期和项目边界。'],
  ['微信导流怎么承接？', '页面会用多处 CTA、二维码占位弹窗、微信号复制和咨询问题提示，把用户从教育内容自然带到微信沟通。'],
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [wechatOpen, setWechatOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);
  const [copied, setCopied] = useState(false);

  const openWechat = () => setWechatOpen(true);
  const copyWechat = async () => {
    try {
      await navigator.clipboard.writeText(WECHAT_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = wechatOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [wechatOpen]);

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="返回首页">
          <span className="brand-mark">A</span>
          <span>AI 搜索增长顾问</span>
        </a>
        <nav className="desktop-nav" aria-label="主导航">
          {navItems.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <button className="nav-cta" onClick={openWechat}>微信咨询</button>
        <button
          className="menu-button"
          aria-label="打开菜单"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </header>

      {menuOpen && (
        <div className="mobile-panel">
          {navItems.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
          <button onClick={openWechat}>添加微信咨询</button>
        </div>
      )}

      <main id="top">
        <section className="hero section-pad">
          <div className="hero-copy reveal">
            <h1>让牙科医院与医美机构，排进豆包、Kimi、DeepSeek 的 AI 搜索前几个结果</h1>
            <p>
              我们做的不是普通内容优化，而是围绕 AI 搜索前排结果与推荐候选，帮助机构在用户问“哪家好、怎么选”时进入前几个。项目、医生、风险、价格和问答结构，都是为了争取豆包、Kimi、DeepSeek 的前排位置。
            </p>
            <div className="hero-actions">
              <button className="primary-btn" onClick={openWechat}>微信评估前排机会</button>
              <a className="secondary-btn" href="#industries">查看行业路径</a>
            </div>
            <div className="hero-note">
              <span>前排监测：豆包</span>
              <span>Kimi</span>
              <span>DeepSeek</span>
            </div>
          </div>

          <div className="answer-board reveal" aria-label="AI 搜索答案示意">
            <div className="board-top">
              <span>AI 搜索前排模拟</span>
              <strong>Top Candidate Map</strong>
            </div>
            <div className="query-card">
              <span>用户提问</span>
              <p>“我想做光子嫩肤，帮我比较成都成华区的医院并给我做个推荐。”</p>
            </div>
            <div className="answer-stream">
              <div className="answer-line wide" />
              <div className="answer-line" />
              <div className="answer-line short" />
            </div>
            <div className="source-list">
              <div>
                <b>前排推荐理由</b>
                <span>同城医院 / 医生专长 / 方案对比 / 价格边界</span>
              </div>
              <div className="score-pill">前几个候选 +</div>
            </div>
            <div className="wechat-strip">
              <span>下一步</span>
              <b>引导用户微信预约初诊</b>
            </div>
          </div>
        </section>

        <section className="section-pad pain-grid" id="pain">
          {painPoints.map((item) => (
            <article className="soft-card reveal" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </section>

        <section className="section-pad trend" id="trend">
          <div className="section-head">
            <h2>AI 搜索时代，机构被选择的入口正在变化</h2>
            <p>传统搜索让用户自己翻资料，AI 搜索会先替用户总结、比较、排除和推荐。医疗消费决策越复杂，越需要提前把机构知识组织成可被回答的结构。</p>
          </div>
          <div className="trend-grid">
            {trendCards.map(([title, text]) => (
              <article className="trend-card reveal" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-pad compare" id="compare">
          <div className="section-head compact">
            <h2>传统 SEO 与 AI 搜索优化的差异</h2>
            <p>不是把旧内容换个标题，而是把机构变成 AI 能解释清楚的可信实体。</p>
          </div>
          <div className="compare-table">
            <div className="compare-row table-head">
              <span>维度</span>
              <span>传统 SEO</span>
              <span>AEO/GEO</span>
            </div>
            {compareRows.map((row) => (
              <div className="compare-row" key={row[0]}>
                {row.map((cell) => <span key={cell}>{cell}</span>)}
              </div>
            ))}
          </div>
        </section>

        <section className="section-pad industries" id="industries">
          <div className="section-head">
            <h2>主攻牙科医院与医美机构：两类业务，分别冲进 AI 前排</h2>
            <p>用户并不是搜索一个“项目名”就下单。他们会围绕自身情况不断追问，AI 会在这个过程中筛选并排列前几个机构。</p>
          </div>
          <div className="industry-grid">
            {industryData.map((industry) => (
              <IndustryCard key={industry.id} industry={industry} />
            ))}
          </div>
        </section>

        <CtaBand onClick={openWechat} />

        <section className="section-pad services" id="services">
          <div className="section-head compact">
            <h2>我们交付什么</h2>
            <p>围绕“进入 AI 搜索前几个结果”这个目标，完成诊断、竞争分析、排名布点、追踪和微信承接。</p>
          </div>
          <div className="service-grid">
            {services.map(([title, text]) => (
              <article className="service-card reveal" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-pad subscription" id="subscription">
          <div className="section-head compact">
            <h2>年度 AI 搜索前排订阅</h2>
            <p>适合希望持续进入 AI 搜索前几个结果、而不是做一次性页面优化的牙科医院与医美机构。</p>
          </div>
          <div className="subscription-card">
            <div className="subscription-summary">
              <span className="subscription-badge">年度合作方案</span>
              <div className="subscription-price"><strong>¥100,000</strong><span>/ 年</span></div>
              <p>围绕机构的城市、项目与目标客群，持续做 AI 前排排名监测、推荐位竞争、内容与实体布点、微信转化承接。</p>
              <button className="primary-btn" onClick={openWechat}>微信咨询年度订阅</button>
              <small>不承诺固定第一名；以进入前几个候选、提高出现率和持续排名追踪为目标。</small>
            </div>
            <div className="subscription-list">
              {subscriptionItems.map(([title, text], index) => (
                <div className="subscription-item" key={title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div><h3>{title}</h3><p>{text}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad advantage">
          <div className="advantage-panel">
            <div>
              <h2>为什么牙科与医美必须抢 AI 前排</h2>
              <p>这两个行业共同特点是客单高、信任门槛高、用户问题多、方案差异大。谁先进入 AI 给出的前几个候选，谁就先获得比较与咨询机会。</p>
            </div>
            <ul>
              <li>找到机构要冲的 AI 前排问题和项目词</li>
              <li>把医生与设备优势变成推荐理由信号</li>
              <li>把价格、风险和恢复期做成前排承接证据</li>
              <li>把前排结果入口统一导向微信咨询</li>
            </ul>
          </div>
        </section>

        <section className="section-pad process" id="process">
          <div className="section-head compact">
            <h2>四步实施流程</h2>
            <p>第一版先快速补齐关键路径，再按 AI 回答和咨询质量持续迭代。</p>
          </div>
          <div className="process-line">
            {process.map(([num, title, text]) => (
              <article className="process-step reveal" key={num}>
                <span>{num}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-pad proof" id="proof">
          <div className="section-head">
            <h2>示例反馈与匿名案例结果</h2>
            <p>以下为示例化、匿名化表达，用于展示服务可能带来的业务变化，不代表可验证客户背书或保证结果。</p>
          </div>
          <div className="feedback-grid">
            {feedback.map((item) => (
              <article className="feedback-card reveal" key={item.tag}>
                <span>{item.tag}</span>
                <h3>{item.result}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-pad faq" id="faq">
          <div className="section-head compact">
            <h2>常见问题</h2>
            <p>把经营者最容易犹豫的地方先讲清楚。</p>
          </div>
          <div className="faq-list">
            {faqs.map(([question, answer], index) => (
              <div className="faq-item" key={question}>
                <button
                  aria-expanded={activeFaq === index}
                  onClick={() => setActiveFaq(activeFaq === index ? -1 : index)}
                >
                  <span>{question}</span>
                  <b>{activeFaq === index ? '−' : '+'}</b>
                </button>
                <div className={activeFaq === index ? 'faq-answer open' : 'faq-answer'}>
                  <p>{answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="final-cta section-pad">
          <h2>先看你的机构，能不能冲进 AI 搜索前几个结果</h2>
          <p>添加微信，发送机构名称、城市、主营项目，我们先帮你判断豆包、Kimi、DeepSeek 的前排机会与竞品位置。</p>
          <button className="primary-btn" onClick={openWechat}>微信开始评估排名</button>
        </section>
      </main>

      <footer className="footer">
        <div>
          <strong>AI 搜索增长顾问</strong>
          <p>大陆版牙科与医美 AI 搜索前排增长服务第一版</p>
        </div>
        <button onClick={openWechat}>WeChat / 微信咨询</button>
      </footer>

      {wechatOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setWechatOpen(false)}>
          <div
            className="wechat-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wechat-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="close-btn" aria-label="关闭微信咨询弹窗" onClick={() => setWechatOpen(false)}>×</button>
            <h2 id="wechat-title">微信咨询 AI 前排排名评估</h2>
            <p>复制微信号或扫码占位添加。请备注“牙科/医美 + 城市 + 想冲的项目词”，方便快速判断 AI 搜索前排机会。</p>
            <div className="qr-placeholder">
              <div />
              <span>二维码占位</span>
            </div>
            <div className="copy-row">
              <code>{WECHAT_ID}</code>
              <button onClick={copyWechat}>{copied ? '已复制' : '复制微信号'}</button>
            </div>
            <ul className="modal-tips">
              <li>发送：机构名称与城市</li>
              <li>发送：主营项目与目标客群</li>
              <li>可附：现有官网或大众点评/小红书主页</li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

function IndustryCard({ industry }) {
  const content = useMemo(() => industry, [industry]);
  return (
    <article className={`industry-card ${content.id} reveal`}>
      <div className="industry-label">{content.label}</div>
      <h3>{content.title}</h3>
      <p>{content.intro}</p>
      <div className="journey">
        {content.journey.map((step) => <span key={step}>{step}</span>)}
      </div>
      <div className="mini-columns">
        <div>
          <h4>常见问题</h4>
          <ul>
            {content.questions.map((question) => <li key={question}>{question}</li>)}
          </ul>
        </div>
        <div>
          <h4>前排机会</h4>
          <ul>
            {content.opportunities.map((opportunity) => <li key={opportunity}>{opportunity}</li>)}
          </ul>
        </div>
      </div>
      <div className="funnel">{content.funnel}</div>
    </article>
  );
}

function CtaBand({ onClick }) {
  return (
    <section className="cta-band">
      <div>
        <h2>AI 已经在替用户做第一轮筛选</h2>
        <p>你可以继续等用户搜到官网，也可以先把机构推进入 AI 给出的前几个候选。</p>
      </div>
      <button onClick={onClick}>添加微信，评估前排机会</button>
    </section>
  );
}

createRoot(document.getElementById('root')).render(<App />);
