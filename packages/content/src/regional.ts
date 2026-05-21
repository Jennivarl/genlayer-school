import type { Lesson, RegionalTrack, RegionSlug } from "./types";

type RegionSeed = {
  slug: RegionSlug;
  regionName: string;
  nativeRegionName: string;
  languageName: string;
  nativeLanguageName: string;
  locale: string;
  title: string;
  description: string;
  unityMessage: string;
  certificateTitle: string;
  lessons: Lesson[];
  quizTitle: string;
  questions: RegionalTrack["quiz"]["questions"];
};

function createRegionalTrack(region: RegionSeed): RegionalTrack {
  return {
    slug: region.slug,
    regionName: region.regionName,
    nativeRegionName: region.nativeRegionName,
    languageName: region.languageName,
    nativeLanguageName: region.nativeLanguageName,
    locale: region.locale,
    title: region.title,
    description: region.description,
    unityMessage: region.unityMessage,
    certificateTitle: region.certificateTitle,
    lessons: region.lessons,
    quiz: {
      slug: `${region.slug}-quiz`,
      title: region.quizTitle,
      passPercent: 70,
      questions: region.questions,
    },
  };
}

// Correct answer positions Q1–Q17 (same topic order, all regions):
// [1,0,3,2,0,1,2,3,1,0,3,0,2,1,3,2,0]
// B A D C A B C D B A D A C B D C A

export const regionalTracks: RegionalTrack[] = [

  // ─── CHINA ───────────────────────────────────────────────────────────────
  createRegionalTrack({
    slug: "china",
    regionName: "China",
    nativeRegionName: "中国",
    languageName: "Chinese",
    nativeLanguageName: "中文",
    locale: "zh-CN",
    title: "GenLayer 中文基础课",
    description: "用中文学习 GenLayer：AI 原生区块链、Intelligent Contracts、共识机制和 DApp 开发。",
    unityMessage: "中国社区用母语学习 GenLayer，与全球生态共同建设。",
    certificateTitle: "GenLayer 中文基础证书",
    quizTitle: "GenLayer 中文综合测验",
    lessons: [
      { slug: "what-is-genlayer", title: "什么是 GenLayer？", durationMinutes: 5, summary: "了解 GenLayer 的核心定位——代理经济的 AI 原生仲裁层。", objectives: ["理解 GenLayer 是什么", "了解它与比特币和以太坊的区别"], content: [
        { type: "paragraph", text: "GenLayer 是一个 AI 原生区块链，专为需要判断和推理的场景设计。比特币处理交易，以太坊执行代码，GenLayer 则处理需要理解和判断的决策。" },
        { type: "list", items: ["定位：代理经济的仲裁层", "支持主观问题的链上可信验证", "由 AI 验证者达成共识"] },
        { type: "callout", title: "简单理解", text: "当答案不是简单的是或否，而需要判断时，就是 GenLayer 的用武之地。" },
      ] },
      { slug: "problem-genlayer-solves", title: "GenLayer 解决什么问题？", durationMinutes: 5, summary: "理解传统区块链为何无法处理主观决策，以及 GenLayer 如何填补这一空缺。", objectives: ["认识现有区块链的局限", "了解 GenLayer 的独特价值"], content: [
        { type: "paragraph", text: "比特币和以太坊擅长确定性任务，但无法处理需要理解、判断或 AI 推理的问题。内容评估、纠纷仲裁、里程碑验证——这些都需要 GenLayer。" },
        { type: "list", items: ["传统合约：只能处理固定逻辑", "GenLayer：可处理主观和模糊的结果", "填补了区块链技术的关键空白"] },
        { type: "callout", title: "关键区别", text: "以太坊问'代码是否执行'，GenLayer 问'结果是否正确'。" },
      ] },
      { slug: "intelligent-contracts", title: "Intelligent Contracts vs. 传统智能合约", durationMinutes: 5, summary: "了解 GenLayer 的 Intelligent Contracts 比传统智能合约多了哪些能力。", objectives: ["识别 Intelligent Contracts 的独特功能", "理解为何使用 Python"], content: [
        { type: "paragraph", text: "传统智能合约只能执行固定逻辑。GenLayer 的 Intelligent Contracts 可访问实时网络数据、调用大语言模型（LLM），并用 Python 编写——更直观，更强大。" },
        { type: "list", items: ["可直接访问互联网数据，无需 Oracle", "可调用 LLM（如 GPT-4）进行 AI 推理", "使用 Python 编写，降低开发门槛"] },
        { type: "callout", title: "类比", text: "传统合约是计算器，Intelligent Contracts 是带推理能力的助手。" },
      ] },
      { slug: "blockchain-stack", title: "GenLayer 在区块链架构中的位置", durationMinutes: 5, summary: "了解 GenLayer 是 Layer 1，以及它如何与以太坊协同工作。", objectives: ["理解区块链分层", "知道 GenLayer 属于哪一层"], content: [
        { type: "paragraph", text: "GenLayer 是 Layer 1 区块链，通过 ZKSync 等 rollup 技术与以太坊集成，同时自己负责 AI 原生共识。它不是以太坊的竞争者，而是专注于 AI 仲裁的新层级。" },
        { type: "list", items: ["比特币：共识交易顺序", "以太坊：共识代码执行", "GenLayer：共识决策含义"] },
        { type: "callout", title: "定位", text: "GenLayer 与以太坊互补，而非竞争。" },
      ] },
      { slug: "optimistic-democracy", title: "乐观民主共识机制", durationMinutes: 5, summary: "了解 GenLayer 如何通过多验证者投票安全处理主观结果。", objectives: ["理解共识的四个阶段", "明白为何多验证者更可靠"], content: [
        { type: "paragraph", text: "Optimistic Democracy 让多个验证者独立执行合约并投票。基于孔多塞陪审团定理：一组独立的判断者，比任何单一个体都更可能得出正确答案。" },
        { type: "list", items: ["四阶段：提议 → 提交 → 揭示 → 接受", "任何人可对结果提出申诉", "最终结果不可逆"] },
        { type: "callout", title: "核心理念", text: "多个验证者的集体独立判断，比任何单一节点都更可信。" },
      ] },
      { slug: "validators-staking", title: "验证者与质押", durationMinutes: 5, summary: "了解验证者的角色、如何质押 GEN 代币以及奖励机制。", objectives: ["理解验证者职责", "了解质押所需 GEN 数量"], content: [
        { type: "paragraph", text: "验证者质押 GEN 代币、运行节点，通过 Optimistic Democracy 参与共识并赚取奖励。没有 42,000 GEN 也可作为委托者参与。" },
        { type: "list", items: ["成为验证者：质押 42,000 GEN", "委托者：最低 42 GEN 即可参与", "验证者获 10% 运营费 + 质押奖励"] },
        { type: "callout", title: "两种参与方式", text: "大额质押当验证者，小额质押做委托者，均可获得收益。" },
      ] },
      { slug: "equivalence-principle", title: "等价原则", durationMinutes: 5, summary: "了解 GenLayer 如何安全处理 AI 输出等非确定性结果。", objectives: ["理解等价原则的作用", "了解两种验证方法"], content: [
        { type: "paragraph", text: "不同验证者运行同一 AI 查询可能得到略有差异的结果。等价原则定义何时认为这些结果'足够一致'，使非确定性在区块链上变得可管理。" },
        { type: "list", items: ["strict_eq()：要求所有验证者结果完全一致", "prompt_non_comparative()：验证者判断结果是否满足标准", "开发者定义'等价'的含义"] },
        { type: "callout", title: "关键洞见", text: "AI 每次回答可能略有不同，但这不影响区块链安全——等价原则处理了这个问题。" },
      ] },
      { slug: "genvm", title: "GenVM 执行环境", durationMinutes: 5, summary: "了解 GenVM 如何在区块链上运行 Python 代码并支持 AI 集成。", objectives: ["理解 GenVM 与 EVM 的区别", "知道 GenVM 的技术基础"], content: [
        { type: "paragraph", text: "GenVM 是 Intelligent Contracts 的运行环境，基于 WebAssembly 构建，原生支持 Python，并可直接与 LLM 和网络数据交互——这是 EVM 无法做到的。" },
        { type: "list", items: ["基于 WebAssembly，执行高效", "原生运行 Python（非 Solidity）", "内置 LLM 调用和网络访问支持"] },
        { type: "callout", title: "本质区别", text: "EVM 为确定性代码设计，GenVM 专门处理非确定性——是根本性的架构创新。" },
      ] },
      { slug: "gen-token", title: "GEN 代币与经济模型", durationMinutes: 5, summary: "了解 GEN 代币的用途、质押奖励结构和申诉机制。", objectives: ["了解 GEN 代币的功能", "理解奖励分配比例"], content: [
        { type: "paragraph", text: "GEN 是网络原生代币，用于质押、支付 gas 和治理。初始质押 APY 为 15%，随时间逐渐降至 4%，确保网络长期可持续。" },
        { type: "list", items: ["初始 APY 15%，逐步降至 4%", "75% 奖励归全体质押者", "10% 归验证者运营商，15% 归开发者"] },
        { type: "callout", title: "申诉机制", text: "不认同某个结果？质押 GEN 提出申诉，触发更大范围的验证者重新评估。" },
      ] },
      { slug: "genlayer-studio", title: "GenLayer Studio 开发沙盒", durationMinutes: 5, summary: "了解如何用 GenLayer Studio 在本地测试 Intelligent Contracts。", objectives: ["知道 Studio 是什么", "了解其主要功能"], content: [
        { type: "paragraph", text: "GenLayer Studio 是基于浏览器的沙盒，无需安装即可测试 Intelligent Contracts。它模拟完整验证者网络，提供实时日志和错误反馈。" },
        { type: "list", items: ["浏览器直接访问，无需安装", "模拟多验证者共识环境", "支持查看详细日志和调试信息"] },
        { type: "callout", title: "立即开始", text: "访问 studio.genlayer.com 或运行 genlayer init 启动本地 Studio。" },
      ] },
      { slug: "cli-sdks", title: "CLI 与开发者工具", durationMinutes: 5, summary: "了解 genlayer CLI、GenLayerJS 和 GenLayerPY 的用途。", objectives: ["知道如何安装 CLI", "了解两个 SDK 的适用场景"], content: [
        { type: "paragraph", text: "GenLayer 提供完整工具链：CLI 快速启动本地环境，GenLayerJS 构建前端 DApp，GenLayerPY 支持 Python 后端集成。" },
        { type: "list", items: ["npm install -g genlayer，然后 genlayer init", "GenLayerJS：TypeScript，适合前端开发", "GenLayerPY：Python 3.12+，适合后端"] },
        { type: "callout", title: "新手推荐", text: "先运行 genlayer init，用 Studio 浏览示例合约，再动手写代码。" },
      ] },
      { slug: "first-contract", title: "你的第一个 Intelligent Contract", durationMinutes: 5, summary: "了解 Intelligent Contract 的基本结构：类、初始化和装饰器。", objectives: ["理解合约基本结构", "知道如何声明状态变量"], content: [
        { type: "paragraph", text: "每个 Intelligent Contract 都是继承自 gl.Contract 的 Python 类。状态变量在类体中声明，方法用装饰器标注读写权限。" },
        { type: "code", language: "python", code: "import gl\n\nclass Counter(gl.Contract):\n    count: gl.u256\n\n    def __init__(self):\n        self.count = 0\n\n    @gl.public.view\n    def get(self) -> int:\n        return self.count\n\n    @gl.public.write\n    def increment(self):\n        self.count += 1" },
        { type: "callout", title: "记住", text: "所有持久化字段必须在类体中用类型注解声明，不能在运行时动态创建。" },
      ] },
      { slug: "storage-types", title: "存储与数据类型", durationMinutes: 5, summary: "了解 GenLayer 的持久化存储规则和专用数据类型。", objectives: ["理解为何不能直接用 dict 和 list", "知道正确的替代类型"], content: [
        { type: "paragraph", text: "GenLayer 有严格的存储规则。普通 Python 的 dict 和 list 不会被持久化，必须使用 TreeMap 和 DynArray，并使用固定大小整数类型。" },
        { type: "list", items: ["dict → TreeMap[K, V]", "list → DynArray[T]", "int → u256、i32 等固定类型"] },
        { type: "callout", title: "常见错误", text: "运行时动态创建的字段不会被保存。所有持久化字段必须在类体中提前声明。" },
      ] },
      { slug: "read-write-methods", title: "读取与写入方法", durationMinutes: 5, summary: "了解 @gl.public.view 和 @gl.public.write 装饰器的区别。", objectives: ["理解读写装饰器的区别", "知道何时使用 payable"], content: [
        { type: "paragraph", text: "@gl.public.view 标注只读方法，不改变状态。@gl.public.write 标注修改状态的方法。@gl.public.write.payable 用于接受 GEN 转账。" },
        { type: "list", items: ["@gl.public.view：只读，gas 费用较低", "@gl.public.write：修改链上状态", "@gl.public.write.payable：接受 GEN 代币转入"] },
        { type: "callout", title: "好习惯", text: "先用只读方法测试逻辑，确认正确后再添加写入逻辑，节省调试时间。" },
      ] },
      { slug: "llm-integration", title: "LLM 集成与提示工程", durationMinutes: 5, summary: "了解如何在合约中调用 LLM 以及编写好提示的关键原则。", objectives: ["知道如何使用 gl.nondet.exec_prompt()", "理解提示工程最佳实践"], content: [
        { type: "paragraph", text: "gl.nondet.exec_prompt() 是调用 LLM 的核心方法。提示质量至关重要——模糊的提示会导致验证者结果不一致，引发共识失败。" },
        { type: "list", items: ["始终要求返回 JSON（response_format='json'）", "避免返回时间戳等动态数据", "比较 AI 得出的结论，而非原始数据"] },
        { type: "callout", title: "共识失败首因", text: "让 LLM 返回不稳定数据会导致验证者结果各异。始终提取稳定字段。" },
      ] },
      { slug: "web-data", title: "访问实时网络数据", durationMinutes: 5, summary: "了解如何在合约中直接获取和验证网络数据，无需 Oracle。", objectives: ["知道如何使用 gl.nondet.web.get()", "了解网络数据访问的注意事项"], content: [
        { type: "paragraph", text: "GenLayer 允许合约直接访问互联网，无需 Oracle。gl.nondet.web.get(url) 获取文本，gl.nondet.web.render(url) 处理动态页面。所有数据经过验证者等价验证。" },
        { type: "list", items: ["gl.nondet.web.get(url)：获取原始文本内容", "gl.nondet.web.render(url)：处理 JS 渲染的页面", "只提取稳定字段，避免动态内容"] },
        { type: "callout", title: "可靠性提示", text: "外部网站可能宕机或改变结构。只从可信来源获取数据，存储前先验证。" },
      ] },
      { slug: "deploy-dapp", title: "构建与部署 DApp", durationMinutes: 5, summary: "了解从本地测试到 Testnet 部署的完整 DApp 开发流程。", objectives: ["理解三阶段部署流程", "知道如何将合约与前端集成"], content: [
        { type: "paragraph", text: "GenLayer DApp 开发分三阶段：在 Studio 进行本地原型开发，用测试框架全面测试，最后部署到 Testnet（Asimov 或 Bradbury）进行真实 AI 工作负载测试，再用 GenLayerJS 构建前端。" },
        { type: "list", items: ["阶段一：GenLayer Studio 本地原型", "阶段二：genlayer-test 框架测试", "阶段三：GenLayerJS 前端 + Testnet 部署"] },
        { type: "callout", title: "发布前检查", text: "部署到 Testnet 前，确保已用直连模式和 Studio 模式完成测试，处理所有共识失败情况。" },
      ] },
    ],
    questions: [
      { id: "china-q01", prompt: "GenLayer 最准确的描述是？", options: ["去中心化文件存储系统", "代理经济的 AI 原生仲裁层", "以太坊的 Layer 2 扩容方案", "中心化支付网络"], correctOption: 1, explanation: "GenLayer 是专为代理经济设计的 AI 原生仲裁层。" },
      { id: "china-q02", prompt: "GenLayer 主要解决什么问题？", options: ["让区块链处理主观的、需要判断的决策", "加快比特币交易速度", "取代所有现有智能合约平台", "创建新的编程语言"], correctOption: 0, explanation: "GenLayer 的核心价值是让链上系统能够处理需要判断和推理的问题。" },
      { id: "china-q03", prompt: "Intelligent Contracts 比传统智能合约多了什么能力？", options: ["在链上存储静态文件", "只执行确定性计算", "只在以太坊上运行", "访问实时网络数据并处理 AI 输出"], correctOption: 3, explanation: "Intelligent Contracts 可访问互联网并调用 LLM，传统合约做不到这些。" },
      { id: "china-q04", prompt: "GenLayer 在区块链架构中属于哪一层？", options: ["Layer 0", "Layer 2", "Layer 1", "Layer 3"], correctOption: 2, explanation: "GenLayer 是 Layer 1 区块链。" },
      { id: "china-q05", prompt: "Optimistic Democracy 是什么？", options: ["使用多验证者验证结果的共识机制", "仅面向代币持有者的投票系统", "删除错误交易的方式", "社交媒体治理工具"], correctOption: 0, explanation: "Optimistic Democracy 是 GenLayer 的共识机制，多个验证者独立投票验证结果。" },
      { id: "china-q06", prompt: "成为验证者需要质押多少 GEN？", options: ["4,200 GEN", "42,000 GEN", "420 GEN", "420,000 GEN"], correctOption: 1, explanation: "成为验证者需要质押 42,000 GEN。" },
      { id: "china-q07", prompt: "等价原则确保什么？", options: ["所有验证者获得相同奖励", "每笔交易手续费相同", "非确定性输出在验证者间得到一致验证", "每笔交易只由一个验证者处理"], correctOption: 2, explanation: "等价原则让非确定性输出（如 AI 结果）可以在多个验证者之间安全一致地验证。" },
      { id: "china-q08", prompt: "GenVM 原生执行哪种语言？", options: ["Solidity", "Rust", "JavaScript", "Python"], correctOption: 3, explanation: "GenVM 原生支持 Python，这使 Intelligent Contracts 的开发更加直观。" },
      { id: "china-q09", prompt: "GEN 质押的初始年化收益率（APY）是多少？", options: ["4%", "15%", "50%", "100%"], correctOption: 1, explanation: "初始 APY 为 15%，随时间逐渐降至 4%。" },
      { id: "china-q10", prompt: "GenLayer Studio 是什么？", options: ["用于本地测试 Intelligent Contracts 的浏览器沙盒", "代币交易移动端应用", "开发者社交网络", "硬件钱包界面"], correctOption: 0, explanation: "GenLayer Studio 是免安装的浏览器沙盒，模拟完整验证者网络。" },
      { id: "china-q11", prompt: "genlayer init 命令的作用是？", options: ["创建新的 GEN 钱包", "删除所有本地合约", "向测试网提交交易", "下载并启动 GenLayer Studio"], correctOption: 3, explanation: "genlayer init 自动下载所需组件并在本地启动 GenLayer Studio。" },
      { id: "china-q12", prompt: "Intelligent Contract 必须继承哪个类？", options: ["gl.Contract", "SmartContract", "BaseChain", "BlockchainApp"], correctOption: 0, explanation: "所有 Intelligent Contracts 都必须继承 gl.Contract 类。" },
      { id: "china-q13", prompt: "在 GenLayer 存储中，哪种数据结构替代 Python 的 dict？", options: ["HashMap", "OrderedDict", "TreeMap", "ArrayList"], correctOption: 2, explanation: "GenLayer 中必须用 TreeMap[K, V] 替代普通 Python dict 以实现持久化存储。" },
      { id: "china-q14", prompt: "哪个装饰器标注只读方法？", options: ["@gl.public.write", "@gl.public.view", "@gl.private.read", "@gl.readonly.method"], correctOption: 1, explanation: "@gl.public.view 标注只读方法，不修改链上状态。" },
      { id: "china-q15", prompt: "在合约中执行 LLM 提示的方法是？", options: ["gl.web.fetch()", "gl.contract.ask()", "gl.ai.run()", "gl.nondet.exec_prompt()"], correctOption: 3, explanation: "gl.nondet.exec_prompt() 是在 Intelligent Contract 中调用 LLM 的标准方法。" },
      { id: "china-q16", prompt: "获取实时网络内容的方法是？", options: ["gl.llm.browse()", "gl.http.get()", "gl.nondet.web.get()", "gl.fetch.url()"], correctOption: 2, explanation: "gl.nondet.web.get() 用于在合约中直接获取网络数据。" },
      { id: "china-q17", prompt: "部署 Intelligent Contract 推荐的第一个环境是？", options: ["Localnet", "以太坊主网", "比特币网络", "Centralnet"], correctOption: 0, explanation: "Localnet 是本地开发环境，是测试合约的最佳起点，完全可控且可重置。" },
    ],
  }),

  // ─── INDIA ───────────────────────────────────────────────────────────────
  createRegionalTrack({
    slug: "india",
    regionName: "India",
    nativeRegionName: "Bharat",
    languageName: "Hindi",
    nativeLanguageName: "Hindi",
    locale: "hi-IN",
    title: "GenLayer Hindi Course",
    description: "Hindi mein GenLayer seekhein: AI-native blockchain, Intelligent Contracts, consensus aur DApp development.",
    unityMessage: "India ki community apni bhasha mein GenLayer seekhti hai aur global ecosystem se judti hai.",
    certificateTitle: "GenLayer Hindi Basics Certificate",
    quizTitle: "GenLayer Hindi Quiz",
    lessons: [
      { slug: "what-is-genlayer", title: "GenLayer kya hai?", durationMinutes: 5, summary: "GenLayer ki core identity samjhein — agentic economy ka AI-native adjudication layer.", objectives: ["GenLayer kya hai samajhna", "Bitcoin aur Ethereum se fark jaanna"], content: [
        { type: "paragraph", text: "GenLayer ek AI-native blockchain hai jo judgment aur reasoning waale scenarios ke liye bana hai. Bitcoin transactions handle karta hai, Ethereum code execute karta hai, lekin GenLayer decisions ka meaning samajhta hai." },
        { type: "list", items: ["Position: agentic economy ka adjudication layer", "Subjective questions ka on-chain trusted verification", "AI validators consensus tak pahunchte hain"] },
        { type: "callout", title: "Aasaan samajh", text: "Jab answer sirf haan ya na nahi hota, balki judgment chahiye — wohi GenLayer ka kaam hai." },
      ] },
      { slug: "problem-genlayer-solves", title: "GenLayer kis samasya ko hal karta hai?", durationMinutes: 5, summary: "Traditional blockchains ki limitations aur GenLayer ki unique value samjhein.", objectives: ["Existing chains ki limitations", "GenLayer ka unique value"], content: [
        { type: "paragraph", text: "Bitcoin aur Ethereum deterministic tasks mein acche hain, lekin judgment ya AI reasoning waale problems handle nahi kar sakte. Content evaluation, disputes, milestone verification — inke liye GenLayer hai." },
        { type: "list", items: ["Traditional contracts: sirf fixed logic", "GenLayer: subjective aur ambiguous results handle karta hai", "Blockchain technology ka critical gap fill karta hai"] },
        { type: "callout", title: "Mukhya antar", text: "Ethereum poochta hai 'kya code execute hua?' GenLayer poochta hai 'kya result sahi hai?'" },
      ] },
      { slug: "intelligent-contracts", title: "Intelligent Contracts vs Smart Contracts", durationMinutes: 5, summary: "Jaanein GenLayer ke Intelligent Contracts mein kya extra capabilities hain.", objectives: ["Intelligent Contracts ki unique features", "Python kyun use hota hai"], content: [
        { type: "paragraph", text: "Traditional smart contracts sirf fixed logic execute karte hain. GenLayer ke Intelligent Contracts real-time web data access kar sakte hain, LLMs call kar sakte hain, aur Python mein likhe jaate hain." },
        { type: "list", items: ["Oracle ke bina directly internet data access", "LLMs (jaise GPT-4) call karke AI reasoning", "Python mein likhe jaate hain — familiar aur powerful"] },
        { type: "callout", title: "Analogy", text: "Traditional contract calculator hai, Intelligent Contract reasoning ability waala assistant hai." },
      ] },
      { slug: "blockchain-stack", title: "Blockchain Stack mein GenLayer ki jagah", durationMinutes: 5, summary: "GenLayer Layer 1 hai aur Ethereum ke saath kaise kaam karta hai.", objectives: ["Blockchain layers samajhna", "GenLayer kis layer par hai"], content: [
        { type: "paragraph", text: "GenLayer Layer 1 blockchain hai jo ZKSync jaise rollups ke through Ethereum se integrate hota hai. Yeh Ethereum ka competitor nahi balki AI adjudication ka ek naya layer hai." },
        { type: "list", items: ["Bitcoin: transaction order par consensus", "Ethereum: code execution par consensus", "GenLayer: decision meaning par consensus"] },
        { type: "callout", title: "Position", text: "GenLayer Ethereum ko compete nahi karta, complement karta hai." },
      ] },
      { slug: "optimistic-democracy", title: "Optimistic Democracy", durationMinutes: 5, summary: "GenLayer ke consensus mechanism ko samjhein jo multiple validators use karta hai.", objectives: ["4 phases of consensus", "Multiple validators kyun better hain"], content: [
        { type: "paragraph", text: "Optimistic Democracy mein multiple validators independently contract execute karke vote karte hain. Condorcet's Jury Theorem par based: ek diverse independent group ke sahi answer tak pahunchne ki zyada probability hoti hai." },
        { type: "list", items: ["4 phases: Propose → Commit → Reveal → Accept", "Koi bhi result ko appeal kar sakta hai", "Final result irreversible hota hai"] },
        { type: "callout", title: "Core idea", text: "Collective independent judgment single node se zyada trustworthy hota hai." },
      ] },
      { slug: "validators-staking", title: "Validators aur Staking", durationMinutes: 5, summary: "Validators ki role, GEN staking aur rewards mechanism samjhein.", objectives: ["Validator responsibilities", "Staking requirements"], content: [
        { type: "paragraph", text: "Validators GEN stake karke nodes run karte hain aur Optimistic Democracy mein participate karke rewards earn karte hain. 42,000 GEN nahi hai? Delegator bankar participate karein." },
        { type: "list", items: ["Validator banne ke liye: 42,000 GEN stake", "Delegator: minimum 42 GEN se participate", "Validators ko 10% operational fee + staking rewards"] },
        { type: "callout", title: "Do tarike", text: "Bada stake? Validator banein. Chota stake? Delegate karein. Dono earn karte hain." },
      ] },
      { slug: "equivalence-principle", title: "Equivalence Principle", durationMinutes: 5, summary: "GenLayer AI outputs jaise non-deterministic results ko safely kaise handle karta hai.", objectives: ["Equivalence Principle kya hai", "Do verification methods"], content: [
        { type: "paragraph", text: "Different validators same AI query run karne par slightly different results paa sakte hain. Equivalence Principle define karta hai kab results 'kaafi same' hain — blockchain par non-determinism ko manageable banata hai." },
        { type: "list", items: ["strict_eq(): sabhi validators ka exact same result", "prompt_non_comparative(): validators judge karte hain criteria meet hua?", "Developer 'equivalence' ki definition deta hai"] },
        { type: "callout", title: "Key insight", text: "AI har baar thoda different answer de sakta hai — Equivalence Principle ise blockchain par safe banata hai." },
      ] },
      { slug: "genvm", title: "GenVM kya hai?", durationMinutes: 5, summary: "GenVM Python code run karta hai aur AI integration support karta hai.", objectives: ["GenVM vs EVM ka fark", "GenVM ki technical foundation"], content: [
        { type: "paragraph", text: "GenVM Intelligent Contracts ka execution environment hai. Yeh WebAssembly par build hua hai, natively Python run karta hai, aur directly LLMs aur web data se interact kar sakta hai — EVM yeh nahi kar sakta." },
        { type: "list", items: ["WebAssembly based, fast execution", "Python natively run karta hai (Solidity nahi)", "Built-in LLM calls aur internet access"] },
        { type: "callout", title: "Fundamental difference", text: "EVM deterministic code ke liye hai, GenVM non-determinism ke liye — yeh core architectural innovation hai." },
      ] },
      { slug: "gen-token", title: "GEN Token aur Economy", durationMinutes: 5, summary: "GEN token ki utility, staking rewards aur appeal mechanism jaanein.", objectives: ["GEN token ke functions", "Reward distribution"], content: [
        { type: "paragraph", text: "GEN network ka native token hai — staking, gas fees aur governance ke liye. Initial staking APY 15% se shuru hokar 4% tak aata hai, long-term sustainability ke liye." },
        { type: "list", items: ["Initial APY 15%, dheere-dheere 4% tak", "75% rewards sabhi stakers ko", "10% validators ko, 15% developers ko"] },
        { type: "callout", title: "Appeal mechanism", text: "Kisi result se disagree? GEN stake karke appeal karein, larger validator set re-evaluate karega." },
      ] },
      { slug: "genlayer-studio", title: "GenLayer Studio", durationMinutes: 5, summary: "Browser-based sandbox mein Intelligent Contracts test karein.", objectives: ["Studio kya hai", "Main features"], content: [
        { type: "paragraph", text: "GenLayer Studio browser-based sandbox hai — installation nahi chahiye. Full validator network simulate karta hai, real-time logs aur error feedback deta hai." },
        { type: "list", items: ["Browser mein directly, no installation", "Multiple validator consensus simulate", "Detailed logs aur debugging support"] },
        { type: "callout", title: "Shuru karein", text: "studio.genlayer.com visit karein ya genlayer init run karke local Studio start karein." },
      ] },
      { slug: "cli-sdks", title: "CLI aur SDKs", durationMinutes: 5, summary: "genlayer CLI, GenLayerJS aur GenLayerPY developer tools jaanein.", objectives: ["CLI install aur use karna", "Do SDKs ke use cases"], content: [
        { type: "paragraph", text: "GenLayer complete toolchain deta hai: CLI local environment quickly start karta hai, GenLayerJS frontend DApps ke liye hai, GenLayerPY Python backend integration ke liye hai." },
        { type: "list", items: ["npm install -g genlayer, phir genlayer init", "GenLayerJS: TypeScript, frontend development", "GenLayerPY: Python 3.12+, backend"] },
        { type: "callout", title: "Beginner tip", text: "Pehle genlayer init run karein, Studio mein example contracts explore karein, phir code likhein." },
      ] },
      { slug: "first-contract", title: "Pehla Intelligent Contract", durationMinutes: 5, summary: "Intelligent Contract ki basic structure: class, init aur decorators.", objectives: ["Contract ki basic structure", "State variables kaise declare karein"], content: [
        { type: "paragraph", text: "Har Intelligent Contract gl.Contract se inherit karne waali Python class hai. State variables class body mein declare hote hain, methods ko decorators se read/write permission milti hai." },
        { type: "code", language: "python", code: "import gl\n\nclass Counter(gl.Contract):\n    count: gl.u256\n\n    def __init__(self):\n        self.count = 0\n\n    @gl.public.view\n    def get(self) -> int:\n        return self.count\n\n    @gl.public.write\n    def increment(self):\n        self.count += 1" },
        { type: "callout", title: "Yaad rakhein", text: "Sabhi persistent fields class body mein type annotation ke saath declare hone chahiye, runtime mein dynamically nahi ban sakte." },
      ] },
      { slug: "storage-types", title: "Storage aur Data Types", durationMinutes: 5, summary: "GenLayer ke persistent storage rules aur special data types.", objectives: ["dict aur list directly kyun nahi", "Correct replacement types"], content: [
        { type: "paragraph", text: "GenLayer mein strict storage rules hain. Regular Python dict aur list persist nahi hote. TreeMap aur DynArray use karna hoga, aur fixed-size integer types." },
        { type: "list", items: ["dict → TreeMap[K, V]", "list → DynArray[T]", "int → u256, i32 jaise fixed types"] },
        { type: "callout", title: "Common mistake", text: "Runtime mein dynamically create hue fields save nahi hote. Sabhi persistent fields pehle se class body mein declare karein." },
      ] },
      { slug: "read-write-methods", title: "Read aur Write Methods", durationMinutes: 5, summary: "@gl.public.view aur @gl.public.write decorators ka fark aur use.", objectives: ["Read/write decorators ka fark", "Payable kab use karein"], content: [
        { type: "paragraph", text: "@gl.public.view read-only methods ke liye, state change nahi hota. @gl.public.write state modify karta hai. @gl.public.write.payable GEN tokens accept karne ke liye use hota hai." },
        { type: "list", items: ["@gl.public.view: read-only, lower gas", "@gl.public.write: state modify karta hai", "@gl.public.write.payable: GEN transfers accept"] },
        { type: "callout", title: "Good practice", text: "Pehle read-only methods se logic test karein, confirm hone par write logic add karein." },
      ] },
      { slug: "llm-integration", title: "LLM Integration", durationMinutes: 5, summary: "Contract mein LLM call karna aur good prompts likhne ke principles.", objectives: ["gl.nondet.exec_prompt() use karna", "Prompt engineering best practices"], content: [
        { type: "paragraph", text: "gl.nondet.exec_prompt() LLM call karne ka main method hai. Prompt quality critical hai — vague prompts validators mein inconsistent results dete hain aur consensus fail hota hai." },
        { type: "list", items: ["Hamesha JSON return maangein (response_format='json')", "Timestamps ya dynamic data avoid karein", "Raw data nahi, AI-derived conclusions compare karein"] },
        { type: "callout", title: "Consensus failure #1 reason", text: "Unstable data (jaise 'current price') LLM se mangaane par validators ke results differ hote hain. Always stable fields extract karein." },
      ] },
      { slug: "web-data", title: "Web Data Access", durationMinutes: 5, summary: "Contract mein directly internet data fetch karein — Oracle ki zaroorat nahi.", objectives: ["gl.nondet.web.get() use karna", "Web data ke considerations"], content: [
        { type: "paragraph", text: "GenLayer contracts Oracle ke bina directly internet access kar sakte hain. gl.nondet.web.get(url) text laata hai, gl.nondet.web.render(url) dynamic pages handle karta hai. Sabhi validators ke beech equivalence se verified hota hai." },
        { type: "list", items: ["gl.nondet.web.get(url): raw text content", "gl.nondet.web.render(url): JS-rendered pages", "Stable fields extract karein, dynamic content avoid"] },
        { type: "callout", title: "Reliability tip", text: "External websites down ho sakti hain ya structure change ho sakta hai. Trusted sources se hi fetch karein." },
      ] },
      { slug: "deploy-dapp", title: "DApp Build aur Deploy", durationMinutes: 5, summary: "Local testing se Testnet deployment tak ka complete DApp workflow.", objectives: ["3-phase deployment process", "Contract ko frontend se connect karna"], content: [
        { type: "paragraph", text: "GenLayer DApp development 3 phases mein hoti hai: Studio mein local prototype banaein, testing framework se thorough testing karein, phir Testnet (Asimov/Bradbury) par deploy karke GenLayerJS se frontend build karein." },
        { type: "list", items: ["Phase 1: GenLayer Studio mein local prototype", "Phase 2: genlayer-test framework se testing", "Phase 3: GenLayerJS frontend + Testnet deployment"] },
        { type: "callout", title: "Launch checklist", text: "Testnet deploy karne se pehle direct mode aur Studio mode dono mein tests complete karein." },
      ] },
    ],
    questions: [
      { id: "india-q01", prompt: "GenLayer ko sabse sateek kaise describe karenge?", options: ["Decentralized file storage", "Agentic economy ka AI-native adjudication layer", "Ethereum ka Layer 2 solution", "Centralized payment network"], correctOption: 1, explanation: "GenLayer agentic economy ke liye AI-native adjudication layer hai." },
      { id: "india-q02", prompt: "GenLayer mukhya roop se kaun si problem solve karta hai?", options: ["Blockchain ko subjective judgment-based decisions handle karne dena", "Bitcoin transactions tez karna", "Sabhi smart contract platforms replace karna", "Nayi programming language banana"], correctOption: 0, explanation: "GenLayer ka core value judgment aur reasoning waale on-chain decisions ko possible banana hai." },
      { id: "india-q03", prompt: "Intelligent Contracts traditional smart contracts se kya extra kar sakte hain?", options: ["On-chain static files store karna", "Sirf deterministic calculations", "Kewal Ethereum par run karna", "Live web data access aur AI outputs process karna"], correctOption: 3, explanation: "Intelligent Contracts internet access kar sakte hain aur LLMs call kar sakte hain." },
      { id: "india-q04", prompt: "GenLayer blockchain stack mein kis layer par hai?", options: ["Layer 0", "Layer 2", "Layer 1", "Layer 3"], correctOption: 2, explanation: "GenLayer ek Layer 1 blockchain hai." },
      { id: "india-q05", prompt: "Optimistic Democracy kya hai?", options: ["Multiple validators se results verify karne ka consensus mechanism", "Kewal token holders ka voting system", "Incorrect transactions delete karne ka tarika", "Social media governance tool"], correctOption: 0, explanation: "Optimistic Democracy GenLayer ka consensus mechanism hai jahaan multiple validators independently vote karte hain." },
      { id: "india-q06", prompt: "Validator banne ke liye kitna GEN stake chahiye?", options: ["4,200 GEN", "42,000 GEN", "420 GEN", "420,000 GEN"], correctOption: 1, explanation: "Validator banne ke liye 42,000 GEN stake karna hoga." },
      { id: "india-q07", prompt: "Equivalence Principle kya ensure karta hai?", options: ["Sabhi validators ko equal rewards", "Har transaction ka same fee", "Non-deterministic outputs ka validators mein consistent validation", "Har transaction ko ek hi validator process kare"], correctOption: 2, explanation: "Equivalence Principle non-deterministic outputs ko multiple validators mein safely validate karta hai." },
      { id: "india-q08", prompt: "GenVM natively kaun si language execute karta hai?", options: ["Solidity", "Rust", "JavaScript", "Python"], correctOption: 3, explanation: "GenVM natively Python run karta hai." },
      { id: "india-q09", prompt: "GEN staking ki starting APY kitni hai?", options: ["4%", "15%", "50%", "100%"], correctOption: 1, explanation: "Initial APY 15% hai jo dheere-dheere 4% tak aati hai." },
      { id: "india-q10", prompt: "GenLayer Studio kya hai?", options: ["Intelligent Contracts locally test karne ka browser sandbox", "Token trading mobile app", "Developer social network", "Hardware wallet interface"], correctOption: 0, explanation: "GenLayer Studio browser-based sandbox hai jo full validator network simulate karta hai." },
      { id: "india-q11", prompt: "genlayer init command kya karta hai?", options: ["Naya GEN wallet banana", "Sabhi local contracts delete karna", "Testnet par transaction submit karna", "GenLayer Studio download aur launch karna"], correctOption: 3, explanation: "genlayer init components download karke locally GenLayer Studio launch karta hai." },
      { id: "india-q12", prompt: "Intelligent Contract kis class ko extend karna chahiye?", options: ["gl.Contract", "SmartContract", "BaseChain", "BlockchainApp"], correctOption: 0, explanation: "Sabhi Intelligent Contracts gl.Contract class extend karte hain." },
      { id: "india-q13", prompt: "GenLayer storage mein Python ke dict ko kaun replace karta hai?", options: ["HashMap", "OrderedDict", "TreeMap", "ArrayList"], correctOption: 2, explanation: "Persistent storage ke liye dict ki jagah TreeMap[K, V] use karna hoga." },
      { id: "india-q14", prompt: "Read-only method ke liye kaun sa decorator use hota hai?", options: ["@gl.public.write", "@gl.public.view", "@gl.private.read", "@gl.readonly.method"], correctOption: 1, explanation: "@gl.public.view read-only methods mark karta hai." },
      { id: "india-q15", prompt: "Contract mein LLM prompt execute karne ka method kaun sa hai?", options: ["gl.web.fetch()", "gl.contract.ask()", "gl.ai.run()", "gl.nondet.exec_prompt()"], correctOption: 3, explanation: "gl.nondet.exec_prompt() Intelligent Contract mein LLM call karne ka standard method hai." },
      { id: "india-q16", prompt: "Live web content fetch karne ka method kaun sa hai?", options: ["gl.llm.browse()", "gl.http.get()", "gl.nondet.web.get()", "gl.fetch.url()"], correctOption: 2, explanation: "gl.nondet.web.get() contract mein directly web data fetch karta hai." },
      { id: "india-q17", prompt: "Intelligent Contract deploy karne ke liye recommended first environment kaun sa hai?", options: ["Localnet", "Ethereum Mainnet", "Bitcoin network", "Centralnet"], correctOption: 0, explanation: "Localnet local development environment hai — contracts test karne ka best starting point." },
    ],
  }),

  // ─── INDONESIA ────────────────────────────────────────────────────────────
  createRegionalTrack({
    slug: "indonesia",
    regionName: "Indonesia",
    nativeRegionName: "Indonesia",
    languageName: "Indonesian",
    nativeLanguageName: "Bahasa Indonesia",
    locale: "id-ID",
    title: "Kursus GenLayer Bahasa Indonesia",
    description: "Pelajari GenLayer dalam Bahasa Indonesia: blockchain AI-native, Intelligent Contracts, konsensus, dan pengembangan DApp.",
    unityMessage: "Komunitas Indonesia belajar GenLayer dengan bahasa sendiri dan bergabung dengan ekosistem global.",
    certificateTitle: "Sertifikat GenLayer Indonesia",
    quizTitle: "Kuis GenLayer Indonesia",
    lessons: [
      { slug: "what-is-genlayer", title: "Apa itu GenLayer?", durationMinutes: 5, summary: "Kenali identitas inti GenLayer — lapisan adjudikasi AI-native untuk ekonomi agentic.", objectives: ["Memahami apa itu GenLayer", "Mengetahui bedanya dengan Bitcoin dan Ethereum"], content: [
        { type: "paragraph", text: "GenLayer adalah blockchain AI-native yang dirancang untuk skenario yang membutuhkan penilaian dan penalaran. Bitcoin menangani transaksi, Ethereum menjalankan kode, GenLayer memahami makna keputusan." },
        { type: "list", items: ["Posisi: lapisan adjudikasi untuk ekonomi agentic", "Verifikasi on-chain tepercaya untuk pertanyaan subjektif", "Validator-validator AI mencapai konsensus"] },
        { type: "callout", title: "Mudahnya", text: "Ketika jawaban bukan sekadar ya atau tidak, tapi butuh penilaian — itulah peran GenLayer." },
      ] },
      { slug: "problem-genlayer-solves", title: "Masalah yang Dipecahkan GenLayer", durationMinutes: 5, summary: "Pahami keterbatasan blockchain tradisional dan nilai unik GenLayer.", objectives: ["Keterbatasan blockchain yang ada", "Nilai unik GenLayer"], content: [
        { type: "paragraph", text: "Bitcoin dan Ethereum bagus untuk tugas deterministik, tapi tidak bisa menangani masalah yang butuh penilaian atau penalaran AI. Evaluasi konten, sengketa, verifikasi pencapaian — itulah kebutuhan GenLayer." },
        { type: "list", items: ["Kontrak tradisional: hanya logika tetap", "GenLayer: menangani hasil subjektif dan ambigu", "Mengisi celah kritis teknologi blockchain"] },
        { type: "callout", title: "Perbedaan kunci", text: "Ethereum bertanya 'apakah kode dijalankan?' GenLayer bertanya 'apakah hasilnya benar?'" },
      ] },
      { slug: "intelligent-contracts", title: "Intelligent Contracts vs Smart Contracts", durationMinutes: 5, summary: "Ketahui kemampuan tambahan Intelligent Contracts dibanding smart contract biasa.", objectives: ["Fitur unik Intelligent Contracts", "Mengapa Python digunakan"], content: [
        { type: "paragraph", text: "Smart contract tradisional hanya menjalankan logika tetap. Intelligent Contracts GenLayer bisa mengakses data web secara langsung, memanggil LLM, dan ditulis dalam Python — lebih intuitif dan powerful." },
        { type: "list", items: ["Akses data internet langsung tanpa Oracle", "Panggil LLM (seperti GPT-4) untuk penalaran AI", "Ditulis dalam Python — familiar dan mudah"] },
        { type: "callout", title: "Analogi", text: "Smart contract biasa itu kalkulator, Intelligent Contract itu asisten dengan kemampuan berpikir." },
      ] },
      { slug: "blockchain-stack", title: "Posisi GenLayer di Ekosistem Blockchain", durationMinutes: 5, summary: "GenLayer adalah Layer 1 dan cara kerjanya bersama Ethereum.", objectives: ["Memahami lapisan blockchain", "Layer mana GenLayer"], content: [
        { type: "paragraph", text: "GenLayer adalah blockchain Layer 1 yang berintegrasi dengan Ethereum melalui rollup seperti ZKSync, sambil menangani konsensus AI-native sendiri. Bukan pesaing Ethereum, tapi lapisan baru untuk adjudikasi AI." },
        { type: "list", items: ["Bitcoin: konsensus urutan transaksi", "Ethereum: konsensus eksekusi kode", "GenLayer: konsensus makna keputusan"] },
        { type: "callout", title: "Posisi", text: "GenLayer melengkapi Ethereum, bukan bersaing dengannya." },
      ] },
      { slug: "optimistic-democracy", title: "Optimistic Democracy", durationMinutes: 5, summary: "Mekanisme konsensus GenLayer yang menggunakan banyak validator.", objectives: ["4 fase konsensus", "Mengapa banyak validator lebih baik"], content: [
        { type: "paragraph", text: "Optimistic Democracy membuat banyak validator mengeksekusi kontrak secara independen dan memilih. Berdasarkan Teorema Juri Condorcet: kelompok penilai independen lebih mungkin mencapai jawaban yang benar." },
        { type: "list", items: ["4 fase: Propose → Commit → Reveal → Accept", "Siapa pun bisa mengajukan banding atas hasil", "Hasil akhir tidak bisa diubah"] },
        { type: "callout", title: "Ide inti", text: "Penilaian kolektif independen lebih tepercaya dari satu node tunggal." },
      ] },
      { slug: "validators-staking", title: "Validator dan Staking", durationMinutes: 5, summary: "Peran validator, cara staking GEN, dan mekanisme reward.", objectives: ["Tanggung jawab validator", "Persyaratan staking"], content: [
        { type: "paragraph", text: "Validator men-stake GEN, menjalankan node, berpartisipasi dalam Optimistic Democracy, dan mendapat reward. Tidak punya 42.000 GEN? Jadilah delegator dan tetap berpartisipasi." },
        { type: "list", items: ["Jadi validator: stake 42.000 GEN", "Delegator: minimum 42 GEN untuk partisipasi", "Validator dapat biaya operasional 10% + reward staking"] },
        { type: "callout", title: "Dua cara", text: "Stake besar? Jadi validator. Stake kecil? Delegasikan. Keduanya bisa earn reward." },
      ] },
      { slug: "equivalence-principle", title: "Prinsip Ekuivalensi", durationMinutes: 5, summary: "Cara GenLayer menangani hasil non-deterministik seperti output AI dengan aman.", objectives: ["Apa itu Prinsip Ekuivalensi", "Dua metode verifikasi"], content: [
        { type: "paragraph", text: "Validator berbeda yang menjalankan query AI yang sama mungkin mendapat hasil sedikit berbeda. Prinsip Ekuivalensi mendefinisikan kapan hasil 'cukup sama' — membuat non-determinisme bisa dikelola di blockchain." },
        { type: "list", items: ["strict_eq(): semua validator harus hasil persis sama", "prompt_non_comparative(): validator menilai apakah kriteria terpenuhi", "Developer mendefinisikan apa artinya 'ekuivalen'"] },
        { type: "callout", title: "Wawasan kunci", text: "AI bisa memberi jawaban sedikit berbeda tiap kali — Prinsip Ekuivalensi membuatnya aman di blockchain." },
      ] },
      { slug: "genvm", title: "GenVM: Mesin Eksekusi", durationMinutes: 5, summary: "GenVM menjalankan Python di blockchain dan mendukung integrasi AI.", objectives: ["Perbedaan GenVM vs EVM", "Fondasi teknis GenVM"], content: [
        { type: "paragraph", text: "GenVM adalah lingkungan eksekusi Intelligent Contracts. Dibangun di atas WebAssembly, menjalankan Python secara native, dan bisa berinteraksi langsung dengan LLM dan data web — hal yang tidak bisa dilakukan EVM." },
        { type: "list", items: ["Berbasis WebAssembly, eksekusi cepat", "Menjalankan Python secara native (bukan Solidity)", "Dukungan bawaan untuk panggilan LLM dan akses internet"] },
        { type: "callout", title: "Perbedaan mendasar", text: "EVM untuk kode deterministik, GenVM untuk non-determinisme — inovasi arsitektur yang fundamental." },
      ] },
      { slug: "gen-token", title: "Token GEN dan Ekonomi", durationMinutes: 5, summary: "Kegunaan token GEN, struktur reward staking, dan mekanisme banding.", objectives: ["Fungsi token GEN", "Distribusi reward"], content: [
        { type: "paragraph", text: "GEN adalah token native jaringan untuk staking, gas, dan governance. APY staking awal 15% turun perlahan ke 4% demi keberlanjutan jangka panjang." },
        { type: "list", items: ["APY awal 15%, turun bertahap ke 4%", "75% reward untuk semua staker", "10% untuk validator, 15% untuk developer"] },
        { type: "callout", title: "Mekanisme banding", text: "Tidak setuju dengan hasil? Stake GEN untuk mengajukan banding, set validator lebih besar akan mengevaluasi ulang." },
      ] },
      { slug: "genlayer-studio", title: "GenLayer Studio", durationMinutes: 5, summary: "Sandbox berbasis browser untuk menguji Intelligent Contracts secara lokal.", objectives: ["Apa itu Studio", "Fitur utama"], content: [
        { type: "paragraph", text: "GenLayer Studio adalah sandbox berbasis browser tanpa instalasi untuk menguji Intelligent Contracts. Mensimulasikan jaringan validator penuh dengan log real-time dan feedback error." },
        { type: "list", items: ["Langsung di browser, tanpa instalasi", "Simulasikan konsensus multi-validator", "Log detail dan dukungan debugging"] },
        { type: "callout", title: "Mulai sekarang", text: "Kunjungi studio.genlayer.com atau jalankan genlayer init untuk mulai Studio lokal." },
      ] },
      { slug: "cli-sdks", title: "CLI dan SDK", durationMinutes: 5, summary: "Tools developer GenLayer: CLI, GenLayerJS, dan GenLayerPY.", objectives: ["Cara install dan gunakan CLI", "Use case dua SDK"], content: [
        { type: "paragraph", text: "GenLayer menyediakan toolchain lengkap: CLI untuk mulai cepat, GenLayerJS untuk frontend DApp, GenLayerPY untuk integrasi backend Python." },
        { type: "list", items: ["npm install -g genlayer, lalu genlayer init", "GenLayerJS: TypeScript, untuk frontend", "GenLayerPY: Python 3.12+, untuk backend"] },
        { type: "callout", title: "Tips pemula", text: "Jalankan genlayer init dulu, eksplorasi contoh di Studio, baru mulai menulis kode." },
      ] },
      { slug: "first-contract", title: "Intelligent Contract Pertama Anda", durationMinutes: 5, summary: "Struktur dasar Intelligent Contract: class, init, dan dekorator.", objectives: ["Struktur dasar kontrak", "Cara deklarasi variabel state"], content: [
        { type: "paragraph", text: "Setiap Intelligent Contract adalah class Python yang mewarisi gl.Contract. Variabel state dideklarasikan di body class, metode diberi izin baca/tulis dengan dekorator." },
        { type: "code", language: "python", code: "import gl\n\nclass Counter(gl.Contract):\n    count: gl.u256\n\n    def __init__(self):\n        self.count = 0\n\n    @gl.public.view\n    def get(self) -> int:\n        return self.count\n\n    @gl.public.write\n    def increment(self):\n        self.count += 1" },
        { type: "callout", title: "Ingat", text: "Semua field persisten harus dideklarasikan di body class dengan anotasi tipe — tidak bisa dibuat secara dinamis saat runtime." },
      ] },
      { slug: "storage-types", title: "Penyimpanan dan Tipe Data", durationMinutes: 5, summary: "Aturan penyimpanan persisten GenLayer dan tipe data khusus.", objectives: ["Mengapa tidak bisa pakai dict dan list biasa", "Tipe pengganti yang benar"], content: [
        { type: "paragraph", text: "GenLayer punya aturan penyimpanan ketat. Dict dan list Python biasa tidak akan tersimpan. Gunakan TreeMap dan DynArray, serta tipe integer ukuran tetap." },
        { type: "list", items: ["dict → TreeMap[K, V]", "list → DynArray[T]", "int → u256, i32, dan tipe tetap lainnya"] },
        { type: "callout", title: "Kesalahan umum", text: "Field yang dibuat dinamis saat runtime tidak tersimpan. Deklarasikan semua field persisten lebih dulu di body class." },
      ] },
      { slug: "read-write-methods", title: "Metode Baca dan Tulis", durationMinutes: 5, summary: "Perbedaan dan penggunaan dekorator @gl.public.view dan @gl.public.write.", objectives: ["Perbedaan dekorator baca/tulis", "Kapan menggunakan payable"], content: [
        { type: "paragraph", text: "@gl.public.view untuk metode read-only yang tidak mengubah state. @gl.public.write untuk memodifikasi state. @gl.public.write.payable untuk menerima transfer GEN." },
        { type: "list", items: ["@gl.public.view: read-only, gas lebih rendah", "@gl.public.write: ubah state on-chain", "@gl.public.write.payable: terima transfer GEN"] },
        { type: "callout", title: "Kebiasaan baik", text: "Test logika dengan metode read-only dulu, baru tambahkan logika write setelah yakin benar." },
      ] },
      { slug: "llm-integration", title: "Integrasi LLM", durationMinutes: 5, summary: "Cara memanggil LLM dalam kontrak dan prinsip prompt yang baik.", objectives: ["Cara pakai gl.nondet.exec_prompt()", "Best practices prompt engineering"], content: [
        { type: "paragraph", text: "gl.nondet.exec_prompt() adalah metode utama untuk memanggil LLM. Kualitas prompt sangat krusial — prompt yang ambigu menyebabkan hasil tidak konsisten antar validator dan konsensus gagal." },
        { type: "list", items: ["Selalu minta respons JSON (response_format='json')", "Hindari timestamp atau data dinamis", "Bandingkan kesimpulan AI, bukan data mentah"] },
        { type: "callout", title: "Penyebab #1 kegagalan konsensus", text: "Meminta LLM mengembalikan data tidak stabil membuat hasil validator berbeda. Selalu ekstrak field yang stabil." },
      ] },
      { slug: "web-data", title: "Akses Data Web", durationMinutes: 5, summary: "Ambil dan validasi data internet langsung dalam kontrak tanpa Oracle.", objectives: ["Cara pakai gl.nondet.web.get()", "Pertimbangan akses data web"], content: [
        { type: "paragraph", text: "GenLayer memungkinkan kontrak mengakses internet langsung tanpa Oracle. gl.nondet.web.get(url) mengambil teks, gl.nondet.web.render(url) menangani halaman dinamis. Semua data diverifikasi ekuivalensi antar validator." },
        { type: "list", items: ["gl.nondet.web.get(url): konten teks mentah", "gl.nondet.web.render(url): halaman JS-rendered", "Ekstrak field stabil, hindari konten dinamis"] },
        { type: "callout", title: "Tips keandalan", text: "Website eksternal bisa down atau berubah struktur. Ambil hanya dari sumber terpercaya dan validasi sebelum disimpan." },
      ] },
      { slug: "deploy-dapp", title: "Membangun dan Men-deploy DApp", durationMinutes: 5, summary: "Alur lengkap pengembangan DApp dari uji lokal hingga deployment Testnet.", objectives: ["Proses deployment 3 fase", "Cara connect kontrak ke frontend"], content: [
        { type: "paragraph", text: "Pengembangan DApp GenLayer dalam 3 fase: prototype lokal di Studio, pengujian menyeluruh dengan testing framework, lalu deploy ke Testnet (Asimov/Bradbury) dan bangun frontend dengan GenLayerJS." },
        { type: "list", items: ["Fase 1: Prototype lokal di GenLayer Studio", "Fase 2: Pengujian dengan genlayer-test", "Fase 3: Frontend GenLayerJS + deployment Testnet"] },
        { type: "callout", title: "Checklist sebelum rilis", text: "Sebelum deploy ke Testnet, pastikan sudah selesai uji direct mode dan Studio mode serta tangani semua kegagalan konsensus." },
      ] },
    ],
    questions: [
      { id: "indonesia-q01", prompt: "GenLayer paling tepat digambarkan sebagai apa?", options: ["Sistem penyimpanan file terdesentralisasi", "Lapisan adjudikasi AI-native untuk ekonomi agentic", "Solusi Layer 2 untuk Ethereum", "Jaringan pembayaran terpusat"], correctOption: 1, explanation: "GenLayer adalah lapisan adjudikasi AI-native untuk ekonomi agentic." },
      { id: "indonesia-q02", prompt: "Masalah utama apa yang dipecahkan GenLayer?", options: ["Membuat blockchain bisa menangani keputusan subjektif berbasis penilaian", "Mempercepat transaksi Bitcoin", "Menggantikan semua platform smart contract", "Membuat bahasa pemrograman baru"], correctOption: 0, explanation: "Nilai inti GenLayer adalah memungkinkan sistem on-chain menangani keputusan yang butuh penilaian." },
      { id: "indonesia-q03", prompt: "Apa yang bisa dilakukan Intelligent Contracts tapi tidak bisa oleh smart contract biasa?", options: ["Menyimpan file statis on-chain", "Hanya kalkulasi deterministik", "Hanya berjalan di Ethereum", "Akses data web langsung dan proses output AI"], correctOption: 3, explanation: "Intelligent Contracts bisa akses internet dan memanggil LLM." },
      { id: "indonesia-q04", prompt: "GenLayer ada di layer mana dalam ekosistem blockchain?", options: ["Layer 0", "Layer 2", "Layer 1", "Layer 3"], correctOption: 2, explanation: "GenLayer adalah blockchain Layer 1." },
      { id: "indonesia-q05", prompt: "Apa itu Optimistic Democracy?", options: ["Mekanisme konsensus yang menggunakan banyak validator untuk memverifikasi hasil", "Sistem voting hanya untuk pemegang token", "Cara menghapus transaksi yang salah", "Alat governance media sosial"], correctOption: 0, explanation: "Optimistic Democracy adalah mekanisme konsensus GenLayer di mana banyak validator memilih secara independen." },
      { id: "indonesia-q06", prompt: "Berapa GEN yang dibutuhkan untuk menjadi validator?", options: ["4.200 GEN", "42.000 GEN", "420 GEN", "420.000 GEN"], correctOption: 1, explanation: "Diperlukan stake 42.000 GEN untuk menjadi validator." },
      { id: "indonesia-q07", prompt: "Apa yang dijamin Prinsip Ekuivalensi?", options: ["Semua validator mendapat reward sama", "Setiap transaksi biaya sama", "Output non-deterministik divalidasi konsisten di semua validator", "Setiap transaksi hanya diproses satu validator"], correctOption: 2, explanation: "Prinsip Ekuivalensi memastikan output non-deterministik dapat divalidasi dengan aman di semua validator." },
      { id: "indonesia-q08", prompt: "Bahasa apa yang dijalankan GenVM secara native?", options: ["Solidity", "Rust", "JavaScript", "Python"], correctOption: 3, explanation: "GenVM menjalankan Python secara native." },
      { id: "indonesia-q09", prompt: "Berapa APY awal untuk staking GEN?", options: ["4%", "15%", "50%", "100%"], correctOption: 1, explanation: "APY awal adalah 15%, turun perlahan ke 4%." },
      { id: "indonesia-q10", prompt: "Apa itu GenLayer Studio?", options: ["Sandbox berbasis browser untuk menguji Intelligent Contracts secara lokal", "Aplikasi mobile trading token", "Jaringan sosial developer", "Antarmuka hardware wallet"], correctOption: 0, explanation: "GenLayer Studio adalah sandbox berbasis browser yang mensimulasikan jaringan validator penuh." },
      { id: "indonesia-q11", prompt: "Apa yang dilakukan perintah genlayer init?", options: ["Membuat wallet GEN baru", "Menghapus semua kontrak lokal", "Submit transaksi ke testnet", "Mengunduh dan meluncurkan GenLayer Studio"], correctOption: 3, explanation: "genlayer init mengunduh komponen dan meluncurkan GenLayer Studio secara lokal." },
      { id: "indonesia-q12", prompt: "Class apa yang harus di-extend oleh Intelligent Contract?", options: ["gl.Contract", "SmartContract", "BaseChain", "BlockchainApp"], correctOption: 0, explanation: "Semua Intelligent Contracts harus meng-extend class gl.Contract." },
      { id: "indonesia-q13", prompt: "Struktur data apa yang menggantikan dict Python di storage GenLayer?", options: ["HashMap", "OrderedDict", "TreeMap", "ArrayList"], correctOption: 2, explanation: "Gunakan TreeMap[K, V] sebagai pengganti dict Python untuk penyimpanan persisten." },
      { id: "indonesia-q14", prompt: "Dekorator mana yang menandai metode read-only?", options: ["@gl.public.write", "@gl.public.view", "@gl.private.read", "@gl.readonly.method"], correctOption: 1, explanation: "@gl.public.view menandai metode read-only yang tidak mengubah state." },
      { id: "indonesia-q15", prompt: "Metode apa yang mengeksekusi prompt LLM dalam kontrak?", options: ["gl.web.fetch()", "gl.contract.ask()", "gl.ai.run()", "gl.nondet.exec_prompt()"], correctOption: 3, explanation: "gl.nondet.exec_prompt() adalah metode standar untuk memanggil LLM dalam Intelligent Contract." },
      { id: "indonesia-q16", prompt: "Metode apa yang mengambil konten web secara langsung?", options: ["gl.llm.browse()", "gl.http.get()", "gl.nondet.web.get()", "gl.fetch.url()"], correctOption: 2, explanation: "gl.nondet.web.get() digunakan untuk mengambil data web langsung dalam kontrak." },
      { id: "indonesia-q17", prompt: "Environment pertama yang direkomendasikan untuk deploy Intelligent Contract?", options: ["Localnet", "Ethereum Mainnet", "Jaringan Bitcoin", "Centralnet"], correctOption: 0, explanation: "Localnet adalah lingkungan pengembangan lokal — titik awal terbaik untuk menguji kontrak." },
    ],
  }),

  // ─── LATAM-ES ─────────────────────────────────────────────────────────────
  createRegionalTrack({
    slug: "latam-es",
    regionName: "LATAM (Spanish)",
    nativeRegionName: "América Latina",
    languageName: "Spanish",
    nativeLanguageName: "Español",
    locale: "es-LATAM",
    title: "Curso GenLayer en Español",
    description: "Aprende GenLayer en español: blockchain AI-native, Intelligent Contracts, consenso y desarrollo de DApps.",
    unityMessage: "La comunidad latinoamericana aprende GenLayer en su idioma y construye junto al ecosistema global.",
    certificateTitle: "Certificado GenLayer Básico en Español",
    quizTitle: "Quiz GenLayer en Español",
    lessons: [
      {
        slug: "what-is-genlayer", title: "¿Qué es GenLayer?", durationMinutes: 5,
        summary: "Conoce la identidad de GenLayer: la capa de adjudicación AI-native para la economía agéntica.",
        objectives: ["Entender qué es GenLayer", "Conocer su diferencia con Bitcoin y Ethereum"],
        content: [
          { type: "paragraph", text: "GenLayer es un blockchain AI-native diseñado para situaciones que requieren juicio y razonamiento. Bitcoin maneja transacciones, Ethereum ejecuta código, GenLayer entiende el significado de las decisiones." },
          { type: "list", items: ["Posición: capa de adjudicación para la economía agéntica", "Verificación confiable on-chain de preguntas subjetivas", "Validadores de IA llegan a consenso"] },
          { type: "callout", title: "En pocas palabras", text: "Cuando la respuesta no es solo sí o no, sino que requiere criterio, GenLayer entra en acción." },
        ],
      },
      {
        slug: "problem-genlayer-solves", title: "¿Qué problema resuelve GenLayer?", durationMinutes: 5,
        summary: "Entiende por qué los blockchains tradicionales no pueden manejar decisiones subjetivas.",
        objectives: ["Reconocer las limitaciones de los blockchains existentes", "Entender el valor único de GenLayer"],
        content: [
          { type: "paragraph", text: "Bitcoin y Ethereum son buenos en tareas deterministas, pero no pueden manejar problemas que requieren juicio o razonamiento AI. Evaluación de contenido, disputas, verificación de hitos — para eso está GenLayer." },
          { type: "list", items: ["Contratos tradicionales: solo lógica fija", "GenLayer: maneja resultados subjetivos y ambiguos", "Llena un vacío crítico en la tecnología blockchain"] },
          { type: "callout", title: "Diferencia clave", text: "Ethereum pregunta '¿se ejecutó el código?' GenLayer pregunta '¿es correcto el resultado?'" },
        ],
      },
      {
        slug: "intelligent-contracts", title: "Intelligent Contracts vs Contratos Inteligentes", durationMinutes: 5,
        summary: "Descubre qué capacidades extra tienen los Intelligent Contracts de GenLayer.",
        objectives: ["Identificar las funciones únicas de los Intelligent Contracts", "Entender por qué se usa Python"],
        content: [
          { type: "paragraph", text: "Los contratos inteligentes tradicionales solo ejecutan lógica fija. Los Intelligent Contracts de GenLayer pueden acceder a datos web en tiempo real, llamar modelos de lenguaje (LLMs) y están escritos en Python — más intuitivos y poderosos." },
          { type: "list", items: ["Acceso directo a datos de internet sin Oracle", "Llamadas a LLMs (como GPT-4) para razonamiento AI", "Escritos en Python — familiar y potente"] },
          { type: "callout", title: "Analogía", text: "Un contrato tradicional es una calculadora. Un Intelligent Contract es un asistente que puede razonar." },
        ],
      },
      {
        slug: "blockchain-stack", title: "GenLayer en la Arquitectura Blockchain", durationMinutes: 5,
        summary: "Entiende que GenLayer es Layer 1 y cómo trabaja junto a Ethereum.",
        objectives: ["Comprender las capas del blockchain", "Saber en qué capa está GenLayer"],
        content: [
          { type: "paragraph", text: "GenLayer es un blockchain Layer 1 que se integra con Ethereum a través de rollups como ZKSync, mientras gestiona su propio consenso AI-native. No compite con Ethereum — es una nueva capa especializada en adjudicación AI." },
          { type: "list", items: ["Bitcoin: consenso sobre el orden de transacciones", "Ethereum: consenso sobre la ejecución de código", "GenLayer: consenso sobre el significado de decisiones"] },
          { type: "callout", title: "Posición", text: "GenLayer complementa a Ethereum, no compite con él." },
        ],
      },
      {
        slug: "optimistic-democracy", title: "Democracia Optimista", durationMinutes: 5,
        summary: "Aprende cómo GenLayer alcanza consenso usando múltiples validadores.",
        objectives: ["Entender las cuatro fases del consenso", "Por qué múltiples validadores son más confiables"],
        content: [
          { type: "paragraph", text: "Optimistic Democracy hace que múltiples validadores ejecuten el contrato de forma independiente y voten. Se basa en el Teorema del Jurado de Condorcet: un grupo de jueces independientes tiene mayor probabilidad de llegar a la respuesta correcta." },
          { type: "list", items: ["4 fases: Proponer → Confirmar → Revelar → Aceptar", "Cualquiera puede apelar un resultado", "El resultado final es irreversible"] },
          { type: "callout", title: "Idea central", text: "El juicio colectivo e independiente es más confiable que un solo nodo." },
        ],
      },
      {
        slug: "validators-staking", title: "Validadores y Staking", durationMinutes: 5,
        summary: "Entiende el rol de los validadores, cómo hacer staking de GEN y las recompensas.",
        objectives: ["Comprender las responsabilidades de un validador", "Conocer cuánto GEN se necesita para hacer staking"],
        content: [
          { type: "paragraph", text: "Los validadores hacen staking de GEN, ejecutan nodos y participan en Optimistic Democracy para ganar recompensas. ¿No tienes 42.000 GEN? Puedes participar como delegador." },
          { type: "list", items: ["Ser validador: hacer staking de 42.000 GEN", "Delegador: mínimo 42 GEN para participar", "Validadores reciben 10% de comisión + recompensas de staking"] },
          { type: "callout", title: "Dos formas de participar", text: "Staking grande: sé validador. Staking pequeño: delega. Ambos generan ganancias." },
        ],
      },
      {
        slug: "equivalence-principle", title: "Principio de Equivalencia", durationMinutes: 5,
        summary: "Cómo GenLayer maneja de forma segura resultados no deterministas como los outputs de AI.",
        objectives: ["Entender para qué sirve el Principio de Equivalencia", "Conocer los dos métodos de verificación"],
        content: [
          { type: "paragraph", text: "Distintos validadores que ejecutan la misma consulta AI pueden obtener resultados ligeramente diferentes. El Principio de Equivalencia define cuándo esos resultados son 'suficientemente iguales', haciendo manejable el no determinismo en blockchain." },
          { type: "list", items: ["strict_eq(): todos los validadores deben tener exactamente el mismo resultado", "prompt_non_comparative(): los validadores juzgan si se cumple el criterio", "El desarrollador define qué significa 'equivalente'"] },
          { type: "callout", title: "Clave", text: "La AI puede dar respuestas levemente distintas cada vez — el Principio de Equivalencia lo hace seguro en blockchain." },
        ],
      },
      {
        slug: "genvm", title: "GenVM: El Entorno de Ejecución", durationMinutes: 5,
        summary: "Cómo GenVM ejecuta Python en blockchain y soporta integración AI.",
        objectives: ["Diferencias entre GenVM y EVM", "Base técnica de GenVM"],
        content: [
          { type: "paragraph", text: "GenVM es el entorno de ejecución de los Intelligent Contracts. Está construido sobre WebAssembly, ejecuta Python de forma nativa e interactúa directamente con LLMs y datos web — algo que EVM no puede hacer." },
          { type: "list", items: ["Basado en WebAssembly, ejecución rápida", "Ejecuta Python de forma nativa (no Solidity)", "Soporte integrado para llamadas LLM y acceso a internet"] },
          { type: "callout", title: "Diferencia fundamental", text: "EVM está diseñado para código determinista. GenVM maneja no determinismo — es una innovación arquitectónica profunda." },
        ],
      },
      {
        slug: "gen-token", title: "El Token GEN y su Economía", durationMinutes: 5,
        summary: "Conoce la utilidad del token GEN, las recompensas de staking y el mecanismo de apelación.",
        objectives: ["Funciones del token GEN", "Distribución de recompensas"],
        content: [
          { type: "paragraph", text: "GEN es el token nativo de la red, usado para staking, gas y gobernanza. El APY inicial es del 15%, bajando gradualmente al 4% para garantizar la sostenibilidad a largo plazo." },
          { type: "list", items: ["APY inicial 15%, baja progresivamente al 4%", "75% de recompensas para todos los stakers", "10% para validadores, 15% para desarrolladores"] },
          { type: "callout", title: "Mecanismo de apelación", text: "¿No estás de acuerdo con un resultado? Haz staking de GEN para apelar y un grupo mayor de validadores lo reevaluará." },
        ],
      },
      {
        slug: "genlayer-studio", title: "GenLayer Studio", durationMinutes: 5,
        summary: "Sandbox en el navegador para probar Intelligent Contracts sin instalar nada.",
        objectives: ["Qué es Studio", "Sus funciones principales"],
        content: [
          { type: "paragraph", text: "GenLayer Studio es un sandbox en el navegador sin instalación para probar Intelligent Contracts. Simula una red completa de validadores con logs en tiempo real y retroalimentación de errores." },
          { type: "list", items: ["Directo en el navegador, sin instalación", "Simula consenso con múltiples validadores", "Logs detallados y soporte de depuración"] },
          { type: "callout", title: "Empieza ya", text: "Visita studio.genlayer.com o ejecuta genlayer init para iniciar Studio de forma local." },
        ],
      },
      {
        slug: "cli-sdks", title: "CLI y SDKs", durationMinutes: 5,
        summary: "Herramientas para desarrolladores: CLI de genlayer, GenLayerJS y GenLayerPY.",
        objectives: ["Cómo instalar el CLI", "Casos de uso de los dos SDKs"],
        content: [
          { type: "paragraph", text: "GenLayer ofrece un conjunto de herramientas completo: el CLI para arrancar rápido, GenLayerJS para DApps frontend y GenLayerPY para integración backend en Python." },
          { type: "list", items: ["npm install -g genlayer, luego genlayer init", "GenLayerJS: TypeScript, para desarrollo frontend", "GenLayerPY: Python 3.12+, para backend"] },
          { type: "callout", title: "Consejo para principiantes", text: "Primero ejecuta genlayer init, explora los contratos de ejemplo en Studio y luego empieza a escribir código." },
        ],
      },
      {
        slug: "first-contract", title: "Tu Primer Intelligent Contract", durationMinutes: 5,
        summary: "Estructura básica de un Intelligent Contract: clase, inicialización y decoradores.",
        objectives: ["Entender la estructura básica de un contrato", "Cómo declarar variables de estado"],
        content: [
          { type: "paragraph", text: "Cada Intelligent Contract es una clase Python que hereda de gl.Contract. Las variables de estado se declaran en el cuerpo de la clase y los métodos se etiquetan con decoradores para indicar permisos de lectura o escritura." },
          { type: "code", language: "python", code: "import gl\n\nclass Counter(gl.Contract):\n    count: gl.u256\n\n    def __init__(self):\n        self.count = 0\n\n    @gl.public.view\n    def get(self) -> int:\n        return self.count\n\n    @gl.public.write\n    def increment(self):\n        self.count += 1" },
          { type: "callout", title: "Recuerda", text: "Todos los campos persistentes deben declararse en el cuerpo de la clase con anotación de tipo. No pueden crearse dinámicamente en tiempo de ejecución." },
        ],
      },
      {
        slug: "storage-types", title: "Almacenamiento y Tipos de Datos", durationMinutes: 5,
        summary: "Reglas de almacenamiento persistente y tipos de datos especiales en GenLayer.",
        objectives: ["Por qué no se puede usar dict y list directamente", "Los tipos de reemplazo correctos"],
        content: [
          { type: "paragraph", text: "GenLayer tiene reglas estrictas de almacenamiento. Los dict y list normales de Python no se persisten. Debes usar TreeMap y DynArray, junto con tipos enteros de tamaño fijo." },
          { type: "list", items: ["dict → TreeMap[K, V]", "list → DynArray[T]", "int → u256, i32 y otros tipos fijos"] },
          { type: "callout", title: "Error común", text: "Los campos creados dinámicamente en tiempo de ejecución no se guardan. Declara todos los campos persistentes en el cuerpo de la clase desde el inicio." },
        ],
      },
      {
        slug: "read-write-methods", title: "Métodos de Lectura y Escritura", durationMinutes: 5,
        summary: "Diferencia y uso de los decoradores @gl.public.view y @gl.public.write.",
        objectives: ["Diferencia entre decoradores de lectura y escritura", "Cuándo usar payable"],
        content: [
          { type: "paragraph", text: "@gl.public.view marca métodos de solo lectura que no cambian el estado. @gl.public.write modifica el estado. @gl.public.write.payable acepta transferencias de GEN." },
          { type: "list", items: ["@gl.public.view: solo lectura, menor costo de gas", "@gl.public.write: modifica el estado on-chain", "@gl.public.write.payable: acepta tokens GEN"] },
          { type: "callout", title: "Buena práctica", text: "Prueba la lógica con métodos de solo lectura primero. Agrega la lógica de escritura solo cuando estés seguro." },
        ],
      },
      {
        slug: "llm-integration", title: "Integración con LLMs", durationMinutes: 5,
        summary: "Cómo llamar un LLM en un contrato y principios para escribir buenos prompts.",
        objectives: ["Usar gl.nondet.exec_prompt()", "Mejores prácticas de ingeniería de prompts"],
        content: [
          { type: "paragraph", text: "gl.nondet.exec_prompt() es el método principal para llamar un LLM. La calidad del prompt es crítica — prompts vagos generan resultados inconsistentes entre validadores y el consenso falla." },
          { type: "list", items: ["Siempre pide respuesta en JSON (response_format='json')", "Evita timestamps o datos dinámicos", "Compara conclusiones derivadas por AI, no datos crudos"] },
          { type: "callout", title: "Causa #1 de fallo de consenso", text: "Pedir al LLM datos inestables hace que los validadores obtengan resultados distintos. Extrae siempre campos estables." },
        ],
      },
      {
        slug: "web-data", title: "Acceso a Datos Web", durationMinutes: 5,
        summary: "Obtén y verifica datos de internet directamente en el contrato sin Oracle.",
        objectives: ["Usar gl.nondet.web.get()", "Consideraciones al acceder a datos web"],
        content: [
          { type: "paragraph", text: "GenLayer permite que los contratos accedan directamente a internet sin Oracle. gl.nondet.web.get(url) obtiene texto, gl.nondet.web.render(url) maneja páginas dinámicas. Todo es verificado por equivalencia entre validadores." },
          { type: "list", items: ["gl.nondet.web.get(url): contenido de texto sin procesar", "gl.nondet.web.render(url): páginas renderizadas con JS", "Extrae campos estables, evita contenido dinámico"] },
          { type: "callout", title: "Consejo de confiabilidad", text: "Los sitios externos pueden caerse o cambiar su estructura. Obtén datos solo de fuentes confiables y valídalos antes de guardar." },
        ],
      },
      {
        slug: "deploy-dapp", title: "Construir y Desplegar una DApp", durationMinutes: 5,
        summary: "Flujo completo de desarrollo de DApp: desde pruebas locales hasta el despliegue en Testnet.",
        objectives: ["Proceso de despliegue en 3 fases", "Cómo conectar el contrato al frontend"],
        content: [
          { type: "paragraph", text: "El desarrollo de DApps en GenLayer tiene 3 fases: prototipo local en Studio, pruebas exhaustivas con el framework de testing y luego despliegue en Testnet (Asimov/Bradbury) con frontend en GenLayerJS." },
          { type: "list", items: ["Fase 1: Prototipo local en GenLayer Studio", "Fase 2: Testing con genlayer-test", "Fase 3: Frontend GenLayerJS + despliegue en Testnet"] },
          { type: "callout", title: "Checklist antes de lanzar", text: "Antes de desplegar en Testnet, completa pruebas en modo directo y modo Studio, y maneja todos los fallos de consenso." },
        ],
      },
    ],
    questions: [
      { id: "latam-es-q01", prompt: "¿Cuál es la mejor descripción de GenLayer?", options: ["Sistema de almacenamiento de archivos descentralizado", "Capa de adjudicación AI-native para la economía agéntica", "Solución Layer 2 para Ethereum", "Red de pagos centralizada"], correctOption: 1, explanation: "GenLayer es la capa de adjudicación AI-native diseñada para la economía agéntica." },
      { id: "latam-es-q02", prompt: "¿Qué problema principal resuelve GenLayer?", options: ["Permitir que blockchain maneje decisiones subjetivas basadas en juicio", "Acelerar las transacciones de Bitcoin", "Reemplazar todas las plataformas de contratos inteligentes", "Crear un nuevo lenguaje de programación"], correctOption: 0, explanation: "El valor central de GenLayer es permitir decisiones on-chain que requieren juicio y razonamiento." },
      { id: "latam-es-q03", prompt: "¿Qué pueden hacer los Intelligent Contracts que los contratos inteligentes tradicionales no pueden?", options: ["Almacenar archivos estáticos on-chain", "Solo cálculos deterministas", "Solo ejecutarse en Ethereum", "Acceder a datos web en vivo y procesar outputs de AI"], correctOption: 3, explanation: "Los Intelligent Contracts pueden acceder a internet y llamar LLMs, algo que los contratos tradicionales no pueden." },
      { id: "latam-es-q04", prompt: "¿En qué capa de blockchain está GenLayer?", options: ["Layer 0", "Layer 2", "Layer 1", "Layer 3"], correctOption: 2, explanation: "GenLayer es un blockchain Layer 1." },
      { id: "latam-es-q05", prompt: "¿Qué es Optimistic Democracy?", options: ["Mecanismo de consenso que usa múltiples validadores para verificar resultados", "Sistema de votación solo para holders de tokens", "Forma de eliminar transacciones incorrectas", "Herramienta de gobernanza en redes sociales"], correctOption: 0, explanation: "Optimistic Democracy es el mecanismo de consenso de GenLayer donde múltiples validadores votan de forma independiente." },
      { id: "latam-es-q06", prompt: "¿Cuánto GEN se necesita para ser validador?", options: ["4.200 GEN", "42.000 GEN", "420 GEN", "420.000 GEN"], correctOption: 1, explanation: "Se necesita hacer staking de 42.000 GEN para convertirse en validador." },
      { id: "latam-es-q07", prompt: "¿Qué garantiza el Principio de Equivalencia?", options: ["Que todos los validadores reciban las mismas recompensas", "Que cada transacción tenga la misma comisión", "Que los outputs no deterministas se validen de forma consistente entre validadores", "Que cada transacción sea procesada por un solo validador"], correctOption: 2, explanation: "El Principio de Equivalencia permite que outputs no deterministas (como resultados de AI) sean validados de forma segura y consistente." },
      { id: "latam-es-q08", prompt: "¿Qué lenguaje ejecuta GenVM de forma nativa?", options: ["Solidity", "Rust", "JavaScript", "Python"], correctOption: 3, explanation: "GenVM ejecuta Python de forma nativa, lo que hace más intuitivo el desarrollo de Intelligent Contracts." },
      { id: "latam-es-q09", prompt: "¿Cuál es el APY inicial de staking de GEN?", options: ["4%", "15%", "50%", "100%"], correctOption: 1, explanation: "El APY inicial es del 15%, bajando gradualmente al 4%." },
      { id: "latam-es-q10", prompt: "¿Qué es GenLayer Studio?", options: ["Sandbox en el navegador para probar Intelligent Contracts localmente", "App móvil para trading de tokens", "Red social para desarrolladores", "Interfaz de hardware wallet"], correctOption: 0, explanation: "GenLayer Studio es un sandbox en el navegador que simula una red completa de validadores." },
      { id: "latam-es-q11", prompt: "¿Qué hace el comando genlayer init?", options: ["Crear una nueva wallet de GEN", "Eliminar todos los contratos locales", "Enviar una transacción al testnet", "Descargar y lanzar GenLayer Studio"], correctOption: 3, explanation: "genlayer init descarga los componentes necesarios y lanza GenLayer Studio de forma local." },
      { id: "latam-es-q12", prompt: "¿De qué clase debe heredar un Intelligent Contract?", options: ["gl.Contract", "SmartContract", "BaseChain", "BlockchainApp"], correctOption: 0, explanation: "Todos los Intelligent Contracts deben heredar de la clase gl.Contract." },
      { id: "latam-es-q13", prompt: "¿Qué estructura de datos reemplaza al dict de Python en el almacenamiento de GenLayer?", options: ["HashMap", "OrderedDict", "TreeMap", "ArrayList"], correctOption: 2, explanation: "Se debe usar TreeMap[K, V] en lugar del dict de Python para almacenamiento persistente." },
      { id: "latam-es-q14", prompt: "¿Qué decorador marca un método de solo lectura?", options: ["@gl.public.write", "@gl.public.view", "@gl.private.read", "@gl.readonly.method"], correctOption: 1, explanation: "@gl.public.view marca métodos de solo lectura que no modifican el estado." },
      { id: "latam-es-q15", prompt: "¿Cuál es el método para ejecutar un prompt LLM en un contrato?", options: ["gl.web.fetch()", "gl.contract.ask()", "gl.ai.run()", "gl.nondet.exec_prompt()"], correctOption: 3, explanation: "gl.nondet.exec_prompt() es el método estándar para llamar un LLM en un Intelligent Contract." },
      { id: "latam-es-q16", prompt: "¿Qué método obtiene contenido web en tiempo real?", options: ["gl.llm.browse()", "gl.http.get()", "gl.nondet.web.get()", "gl.fetch.url()"], correctOption: 2, explanation: "gl.nondet.web.get() se usa para obtener datos web directamente en el contrato." },
      { id: "latam-es-q17", prompt: "¿Cuál es el primer entorno recomendado para desplegar un Intelligent Contract?", options: ["Localnet", "Ethereum Mainnet", "Red de Bitcoin", "Centralnet"], correctOption: 0, explanation: "Localnet es el entorno de desarrollo local — el mejor punto de partida para probar contratos." },
    ],
  }),

  // ─── LATAM-PT ─────────────────────────────────────────────────────────────
  createRegionalTrack({
    slug: "latam-pt",
    regionName: "LATAM (Portuguese)",
    nativeRegionName: "América Latina",
    languageName: "Portuguese",
    nativeLanguageName: "Português",
    locale: "pt-BR",
    title: "Curso GenLayer em Português",
    description: "Aprenda GenLayer em português: blockchain AI-native, Intelligent Contracts, consenso e desenvolvimento de DApps.",
    unityMessage: "A comunidade latinoamericana aprende GenLayer no seu idioma e constrói junto ao ecossistema global.",
    certificateTitle: "Certificado GenLayer Básico em Português",
    quizTitle: "Quiz GenLayer em Português",
    lessons: [
      {
        slug: "what-is-genlayer", title: "O que é o GenLayer?", durationMinutes: 5,
        summary: "Conheça a identidade do GenLayer: a camada de adjudicação AI-native para a economia agêntica.",
        objectives: ["Entender o que é o GenLayer", "Conhecer sua diferença em relação ao Bitcoin e ao Ethereum"],
        content: [
          { type: "paragraph", text: "GenLayer é um blockchain AI-native projetado para situações que exigem julgamento e raciocínio. O Bitcoin lida com transações, o Ethereum executa código, o GenLayer entende o significado das decisões." },
          { type: "list", items: ["Posição: camada de adjudicação para a economia agêntica", "Verificação confiável on-chain de questões subjetivas", "Validadores de IA chegam a consenso"] },
          { type: "callout", title: "Em poucas palavras", text: "Quando a resposta não é só sim ou não, mas exige critério, o GenLayer entra em ação." },
        ],
      },
      {
        slug: "problem-genlayer-solves", title: "Que problema o GenLayer resolve?", durationMinutes: 5,
        summary: "Entenda por que blockchains tradicionais não conseguem lidar com decisões subjetivas.",
        objectives: ["Reconhecer as limitações dos blockchains existentes", "Entender o valor único do GenLayer"],
        content: [
          { type: "paragraph", text: "Bitcoin e Ethereum são bons em tarefas deterministas, mas não conseguem lidar com problemas que exigem julgamento ou raciocínio de IA. Avaliação de conteúdo, disputas, verificação de marcos — para isso existe o GenLayer." },
          { type: "list", items: ["Contratos tradicionais: apenas lógica fixa", "GenLayer: lida com resultados subjetivos e ambíguos", "Preenche uma lacuna crítica na tecnologia blockchain"] },
          { type: "callout", title: "Diferença-chave", text: "O Ethereum pergunta 'o código foi executado?' O GenLayer pergunta 'o resultado está correto?'" },
        ],
      },
      {
        slug: "intelligent-contracts", title: "Intelligent Contracts vs Contratos Inteligentes", durationMinutes: 5,
        summary: "Descubra quais capacidades extras os Intelligent Contracts do GenLayer possuem.",
        objectives: ["Identificar as funções únicas dos Intelligent Contracts", "Entender por que Python é utilizado"],
        content: [
          { type: "paragraph", text: "Contratos inteligentes tradicionais apenas executam lógica fixa. Os Intelligent Contracts do GenLayer podem acessar dados da web em tempo real, chamar modelos de linguagem (LLMs) e são escritos em Python — mais intuitivos e poderosos." },
          { type: "list", items: ["Acesso direto a dados da internet sem Oracle", "Chamadas a LLMs (como GPT-4) para raciocínio de IA", "Escritos em Python — familiar e poderoso"] },
          { type: "callout", title: "Analogia", text: "Um contrato tradicional é uma calculadora. Um Intelligent Contract é um assistente capaz de raciocinar." },
        ],
      },
      {
        slug: "blockchain-stack", title: "GenLayer na Arquitetura Blockchain", durationMinutes: 5,
        summary: "Entenda que o GenLayer é Layer 1 e como ele trabalha junto ao Ethereum.",
        objectives: ["Compreender as camadas do blockchain", "Saber em qual camada o GenLayer está"],
        content: [
          { type: "paragraph", text: "GenLayer é um blockchain Layer 1 que se integra ao Ethereum por meio de rollups como ZKSync, enquanto gerencia seu próprio consenso AI-native. Não compete com o Ethereum — é uma nova camada especializada em adjudicação de IA." },
          { type: "list", items: ["Bitcoin: consenso sobre a ordem das transações", "Ethereum: consenso sobre a execução do código", "GenLayer: consenso sobre o significado das decisões"] },
          { type: "callout", title: "Posição", text: "O GenLayer complementa o Ethereum, não compete com ele." },
        ],
      },
      {
        slug: "optimistic-democracy", title: "Democracia Otimista", durationMinutes: 5,
        summary: "Aprenda como o GenLayer alcança consenso usando múltiplos validadores.",
        objectives: ["Entender as quatro fases do consenso", "Por que múltiplos validadores são mais confiáveis"],
        content: [
          { type: "paragraph", text: "A Optimistic Democracy faz com que múltiplos validadores executem o contrato de forma independente e votem. Baseia-se no Teorema do Júri de Condorcet: um grupo de juízes independentes tem maior probabilidade de chegar à resposta correta." },
          { type: "list", items: ["4 fases: Propor → Confirmar → Revelar → Aceitar", "Qualquer pessoa pode recorrer de um resultado", "O resultado final é irreversível"] },
          { type: "callout", title: "Ideia central", text: "O julgamento coletivo e independente é mais confiável do que um único nó." },
        ],
      },
      {
        slug: "validators-staking", title: "Validadores e Staking", durationMinutes: 5,
        summary: "Entenda o papel dos validadores, como fazer staking de GEN e as recompensas.",
        objectives: ["Compreender as responsabilidades de um validador", "Saber quanto GEN é necessário para staking"],
        content: [
          { type: "paragraph", text: "Validadores fazem staking de GEN, executam nós e participam da Optimistic Democracy para ganhar recompensas. Não tem 42.000 GEN? Participe como delegador." },
          { type: "list", items: ["Ser validador: fazer staking de 42.000 GEN", "Delegador: mínimo de 42 GEN para participar", "Validadores recebem 10% de comissão + recompensas de staking"] },
          { type: "callout", title: "Duas formas de participar", text: "Staking grande: seja validador. Staking pequeno: delegue. Ambos geram ganhos." },
        ],
      },
      {
        slug: "equivalence-principle", title: "Princípio de Equivalência", durationMinutes: 5,
        summary: "Como o GenLayer lida com resultados não determinísticos como outputs de IA de forma segura.",
        objectives: ["Entender para que serve o Princípio de Equivalência", "Conhecer os dois métodos de verificação"],
        content: [
          { type: "paragraph", text: "Validadores diferentes que executam a mesma consulta de IA podem obter resultados ligeiramente diferentes. O Princípio de Equivalência define quando esses resultados são 'suficientemente iguais', tornando o não determinismo gerenciável no blockchain." },
          { type: "list", items: ["strict_eq(): todos os validadores devem ter exatamente o mesmo resultado", "prompt_non_comparative(): validadores julgam se o critério foi atendido", "O desenvolvedor define o que significa 'equivalente'"] },
          { type: "callout", title: "Ponto-chave", text: "A IA pode dar respostas ligeiramente diferentes a cada vez — o Princípio de Equivalência torna isso seguro no blockchain." },
        ],
      },
      {
        slug: "genvm", title: "GenVM: O Ambiente de Execução", durationMinutes: 5,
        summary: "Como o GenVM executa Python no blockchain e suporta integração de IA.",
        objectives: ["Diferenças entre GenVM e EVM", "Base técnica do GenVM"],
        content: [
          { type: "paragraph", text: "GenVM é o ambiente de execução dos Intelligent Contracts. Construído sobre WebAssembly, executa Python nativamente e interage diretamente com LLMs e dados da web — algo que a EVM não consegue fazer." },
          { type: "list", items: ["Baseado em WebAssembly, execução rápida", "Executa Python nativamente (não Solidity)", "Suporte integrado para chamadas LLM e acesso à internet"] },
          { type: "callout", title: "Diferença fundamental", text: "A EVM foi projetada para código determinístico. O GenVM lida com não determinismo — uma inovação arquitetural profunda." },
        ],
      },
      {
        slug: "gen-token", title: "O Token GEN e sua Economia", durationMinutes: 5,
        summary: "Conheça a utilidade do token GEN, as recompensas de staking e o mecanismo de apelação.",
        objectives: ["Funções do token GEN", "Distribuição de recompensas"],
        content: [
          { type: "paragraph", text: "GEN é o token nativo da rede, usado para staking, gas e governança. O APY inicial é de 15%, caindo gradualmente para 4% para garantir a sustentabilidade a longo prazo." },
          { type: "list", items: ["APY inicial de 15%, cai progressivamente para 4%", "75% das recompensas para todos os stakers", "10% para validadores, 15% para desenvolvedores"] },
          { type: "callout", title: "Mecanismo de apelação", text: "Discorda de um resultado? Faça staking de GEN para recorrer e um grupo maior de validadores irá reavaliar." },
        ],
      },
      {
        slug: "genlayer-studio", title: "GenLayer Studio", durationMinutes: 5,
        summary: "Sandbox no navegador para testar Intelligent Contracts sem instalar nada.",
        objectives: ["O que é o Studio", "Suas principais funcionalidades"],
        content: [
          { type: "paragraph", text: "GenLayer Studio é um sandbox no navegador sem instalação para testar Intelligent Contracts. Simula uma rede completa de validadores com logs em tempo real e feedback de erros." },
          { type: "list", items: ["Direto no navegador, sem instalação", "Simula consenso com múltiplos validadores", "Logs detalhados e suporte de depuração"] },
          { type: "callout", title: "Comece agora", text: "Acesse studio.genlayer.com ou execute genlayer init para iniciar o Studio localmente." },
        ],
      },
      {
        slug: "cli-sdks", title: "CLI e SDKs", durationMinutes: 5,
        summary: "Ferramentas para desenvolvedores: CLI do genlayer, GenLayerJS e GenLayerPY.",
        objectives: ["Como instalar o CLI", "Casos de uso dos dois SDKs"],
        content: [
          { type: "paragraph", text: "GenLayer oferece um conjunto completo de ferramentas: o CLI para começar rapidamente, GenLayerJS para DApps frontend e GenLayerPY para integração backend em Python." },
          { type: "list", items: ["npm install -g genlayer, depois genlayer init", "GenLayerJS: TypeScript, para desenvolvimento frontend", "GenLayerPY: Python 3.12+, para backend"] },
          { type: "callout", title: "Dica para iniciantes", text: "Primeiro execute genlayer init, explore os contratos de exemplo no Studio e depois comece a escrever código." },
        ],
      },
      {
        slug: "first-contract", title: "Seu Primeiro Intelligent Contract", durationMinutes: 5,
        summary: "Estrutura básica de um Intelligent Contract: classe, inicialização e decoradores.",
        objectives: ["Entender a estrutura básica de um contrato", "Como declarar variáveis de estado"],
        content: [
          { type: "paragraph", text: "Cada Intelligent Contract é uma classe Python que herda de gl.Contract. As variáveis de estado são declaradas no corpo da classe e os métodos recebem permissões de leitura ou escrita por meio de decoradores." },
          { type: "code", language: "python", code: "import gl\n\nclass Counter(gl.Contract):\n    count: gl.u256\n\n    def __init__(self):\n        self.count = 0\n\n    @gl.public.view\n    def get(self) -> int:\n        return self.count\n\n    @gl.public.write\n    def increment(self):\n        self.count += 1" },
          { type: "callout", title: "Lembre-se", text: "Todos os campos persistentes devem ser declarados no corpo da classe com anotação de tipo. Não podem ser criados dinamicamente em tempo de execução." },
        ],
      },
      {
        slug: "storage-types", title: "Armazenamento e Tipos de Dados", durationMinutes: 5,
        summary: "Regras de armazenamento persistente e tipos de dados especiais no GenLayer.",
        objectives: ["Por que não se pode usar dict e list diretamente", "Os tipos substitutos corretos"],
        content: [
          { type: "paragraph", text: "GenLayer tem regras rígidas de armazenamento. Os dict e list normais do Python não são persistidos. É preciso usar TreeMap e DynArray, junto com tipos inteiros de tamanho fixo." },
          { type: "list", items: ["dict → TreeMap[K, V]", "list → DynArray[T]", "int → u256, i32 e outros tipos fixos"] },
          { type: "callout", title: "Erro comum", text: "Campos criados dinamicamente em tempo de execução não são salvos. Declare todos os campos persistentes no corpo da classe desde o início." },
        ],
      },
      {
        slug: "read-write-methods", title: "Métodos de Leitura e Escrita", durationMinutes: 5,
        summary: "Diferença e uso dos decoradores @gl.public.view e @gl.public.write.",
        objectives: ["Diferença entre decoradores de leitura e escrita", "Quando usar payable"],
        content: [
          { type: "paragraph", text: "@gl.public.view marca métodos somente leitura que não alteram o estado. @gl.public.write modifica o estado. @gl.public.write.payable aceita transferências de GEN." },
          { type: "list", items: ["@gl.public.view: somente leitura, menor custo de gas", "@gl.public.write: modifica o estado on-chain", "@gl.public.write.payable: aceita tokens GEN"] },
          { type: "callout", title: "Boa prática", text: "Teste a lógica com métodos somente leitura primeiro. Adicione a lógica de escrita apenas quando tiver certeza." },
        ],
      },
      {
        slug: "llm-integration", title: "Integração com LLMs", durationMinutes: 5,
        summary: "Como chamar um LLM em um contrato e princípios para escrever bons prompts.",
        objectives: ["Usar gl.nondet.exec_prompt()", "Melhores práticas de engenharia de prompts"],
        content: [
          { type: "paragraph", text: "gl.nondet.exec_prompt() é o método principal para chamar um LLM. A qualidade do prompt é crítica — prompts vagos geram resultados inconsistentes entre validadores e o consenso falha." },
          { type: "list", items: ["Sempre peça resposta em JSON (response_format='json')", "Evite timestamps ou dados dinâmicos", "Compare conclusões derivadas pela IA, não dados brutos"] },
          { type: "callout", title: "Principal causa de falha de consenso", text: "Pedir ao LLM dados instáveis faz com que os validadores obtenham resultados diferentes. Extraia sempre campos estáveis." },
        ],
      },
      {
        slug: "web-data", title: "Acesso a Dados da Web", durationMinutes: 5,
        summary: "Obtenha e valide dados da internet diretamente no contrato sem Oracle.",
        objectives: ["Usar gl.nondet.web.get()", "Considerações ao acessar dados web"],
        content: [
          { type: "paragraph", text: "GenLayer permite que contratos acessem a internet diretamente sem Oracle. gl.nondet.web.get(url) obtém texto, gl.nondet.web.render(url) lida com páginas dinâmicas. Tudo é verificado por equivalência entre validadores." },
          { type: "list", items: ["gl.nondet.web.get(url): conteúdo de texto bruto", "gl.nondet.web.render(url): páginas renderizadas com JS", "Extraia campos estáveis, evite conteúdo dinâmico"] },
          { type: "callout", title: "Dica de confiabilidade", text: "Sites externos podem ficar fora do ar ou mudar de estrutura. Busque dados apenas de fontes confiáveis e valide antes de salvar." },
        ],
      },
      {
        slug: "deploy-dapp", title: "Construir e Implantar uma DApp", durationMinutes: 5,
        summary: "Fluxo completo de desenvolvimento de DApp: dos testes locais à implantação no Testnet.",
        objectives: ["Processo de implantação em 3 fases", "Como conectar o contrato ao frontend"],
        content: [
          { type: "paragraph", text: "O desenvolvimento de DApps no GenLayer tem 3 fases: protótipo local no Studio, testes completos com o framework de testes e depois implantação no Testnet (Asimov/Bradbury) com frontend em GenLayerJS." },
          { type: "list", items: ["Fase 1: Protótipo local no GenLayer Studio", "Fase 2: Testes com genlayer-test", "Fase 3: Frontend GenLayerJS + implantação no Testnet"] },
          { type: "callout", title: "Checklist antes de lançar", text: "Antes de implantar no Testnet, conclua os testes em modo direto e modo Studio e trate todas as falhas de consenso." },
        ],
      },
    ],
    questions: [
      { id: "latam-pt-q01", prompt: "Qual é a melhor descrição do GenLayer?", options: ["Sistema de armazenamento de arquivos descentralizado", "Camada de adjudicação AI-native para a economia agêntica", "Solução Layer 2 para o Ethereum", "Rede de pagamentos centralizada"], correctOption: 1, explanation: "GenLayer é a camada de adjudicação AI-native projetada para a economia agêntica." },
      { id: "latam-pt-q02", prompt: "Qual problema principal o GenLayer resolve?", options: ["Permitir que o blockchain lide com decisões subjetivas baseadas em julgamento", "Acelerar as transações do Bitcoin", "Substituir todas as plataformas de contratos inteligentes", "Criar uma nova linguagem de programação"], correctOption: 0, explanation: "O valor central do GenLayer é possibilitar decisões on-chain que exigem julgamento e raciocínio." },
      { id: "latam-pt-q03", prompt: "O que os Intelligent Contracts podem fazer que os contratos inteligentes tradicionais não conseguem?", options: ["Armazenar arquivos estáticos on-chain", "Apenas cálculos determinísticos", "Executar somente no Ethereum", "Acessar dados web ao vivo e processar outputs de IA"], correctOption: 3, explanation: "Intelligent Contracts podem acessar a internet e chamar LLMs, algo que contratos tradicionais não conseguem." },
      { id: "latam-pt-q04", prompt: "Em qual camada de blockchain o GenLayer está?", options: ["Layer 0", "Layer 2", "Layer 1", "Layer 3"], correctOption: 2, explanation: "GenLayer é um blockchain Layer 1." },
      { id: "latam-pt-q05", prompt: "O que é Optimistic Democracy?", options: ["Mecanismo de consenso que usa múltiplos validadores para verificar resultados", "Sistema de votação apenas para holders de tokens", "Forma de excluir transações incorretas", "Ferramenta de governança em redes sociais"], correctOption: 0, explanation: "Optimistic Democracy é o mecanismo de consenso do GenLayer onde múltiplos validadores votam de forma independente." },
      { id: "latam-pt-q06", prompt: "Quanto GEN é necessário para ser validador?", options: ["4.200 GEN", "42.000 GEN", "420 GEN", "420.000 GEN"], correctOption: 1, explanation: "É necessário fazer staking de 42.000 GEN para se tornar validador." },
      { id: "latam-pt-q07", prompt: "O que o Princípio de Equivalência garante?", options: ["Que todos os validadores recebam as mesmas recompensas", "Que cada transação tenha a mesma taxa", "Que outputs não determinísticos sejam validados de forma consistente entre os validadores", "Que cada transação seja processada por apenas um validador"], correctOption: 2, explanation: "O Princípio de Equivalência permite que outputs não determinísticos sejam validados com segurança e consistência." },
      { id: "latam-pt-q08", prompt: "Qual linguagem o GenVM executa nativamente?", options: ["Solidity", "Rust", "JavaScript", "Python"], correctOption: 3, explanation: "GenVM executa Python nativamente, tornando o desenvolvimento de Intelligent Contracts mais intuitivo." },
      { id: "latam-pt-q09", prompt: "Qual é o APY inicial de staking de GEN?", options: ["4%", "15%", "50%", "100%"], correctOption: 1, explanation: "O APY inicial é de 15%, caindo gradualmente para 4%." },
      { id: "latam-pt-q10", prompt: "O que é o GenLayer Studio?", options: ["Sandbox no navegador para testar Intelligent Contracts localmente", "App móvel para trading de tokens", "Rede social para desenvolvedores", "Interface de hardware wallet"], correctOption: 0, explanation: "GenLayer Studio é um sandbox no navegador que simula uma rede completa de validadores." },
      { id: "latam-pt-q11", prompt: "O que o comando genlayer init faz?", options: ["Criar uma nova carteira GEN", "Excluir todos os contratos locais", "Enviar uma transação para o testnet", "Baixar e iniciar o GenLayer Studio"], correctOption: 3, explanation: "genlayer init baixa os componentes necessários e inicia o GenLayer Studio localmente." },
      { id: "latam-pt-q12", prompt: "De qual classe um Intelligent Contract deve herdar?", options: ["gl.Contract", "SmartContract", "BaseChain", "BlockchainApp"], correctOption: 0, explanation: "Todos os Intelligent Contracts devem herdar da classe gl.Contract." },
      { id: "latam-pt-q13", prompt: "Qual estrutura de dados substitui o dict do Python no armazenamento do GenLayer?", options: ["HashMap", "OrderedDict", "TreeMap", "ArrayList"], correctOption: 2, explanation: "Deve-se usar TreeMap[K, V] no lugar do dict do Python para armazenamento persistente." },
      { id: "latam-pt-q14", prompt: "Qual decorador marca um método somente leitura?", options: ["@gl.public.write", "@gl.public.view", "@gl.private.read", "@gl.readonly.method"], correctOption: 1, explanation: "@gl.public.view marca métodos somente leitura que não modificam o estado." },
      { id: "latam-pt-q15", prompt: "Qual é o método para executar um prompt LLM em um contrato?", options: ["gl.web.fetch()", "gl.contract.ask()", "gl.ai.run()", "gl.nondet.exec_prompt()"], correctOption: 3, explanation: "gl.nondet.exec_prompt() é o método padrão para chamar um LLM em um Intelligent Contract." },
      { id: "latam-pt-q16", prompt: "Qual método obtém conteúdo web em tempo real?", options: ["gl.llm.browse()", "gl.http.get()", "gl.nondet.web.get()", "gl.fetch.url()"], correctOption: 2, explanation: "gl.nondet.web.get() é usado para buscar dados da web diretamente no contrato." },
      { id: "latam-pt-q17", prompt: "Qual é o primeiro ambiente recomendado para implantar um Intelligent Contract?", options: ["Localnet", "Ethereum Mainnet", "Rede Bitcoin", "Centralnet"], correctOption: 0, explanation: "Localnet é o ambiente de desenvolvimento local — o melhor ponto de partida para testar contratos." },
    ],
  }),

  // ─── NIGERIA ──────────────────────────────────────────────────────────────
  createRegionalTrack({
    slug: "nigeria",
    regionName: "Nigeria",
    nativeRegionName: "Nigeria",
    languageName: "Pidgin",
    nativeLanguageName: "Naija Pidgin",
    locale: "en-NG",
    title: "GenLayer Course for Naija",
    description: "Learn GenLayer for Naija: AI-native blockchain, Intelligent Contracts, consensus and DApp development for di Nigerian community.",
    unityMessage: "Di Naija community don dey learn GenLayer for dem own language and don join di global ecosystem.",
    certificateTitle: "GenLayer Naija Basics Certificate",
    quizTitle: "GenLayer Naija Quiz",
    lessons: [
      {
        slug: "what-is-genlayer", title: "Wetin Be GenLayer?", durationMinutes: 5,
        summary: "Know wetin GenLayer be — di AI-native adjudication layer for di agentic economy.",
        objectives: ["Understand wetin GenLayer be", "Know how e different from Bitcoin and Ethereum"],
        content: [
          { type: "paragraph", text: "GenLayer na AI-native blockchain wey dem don build for situations wey need judgment and reasoning. Bitcoin dey handle transactions, Ethereum dey run code, but GenLayer dey understand di meaning of decisions." },
          { type: "list", items: ["Position: adjudication layer for di agentic economy", "On-chain trusted verification for subjective questions", "AI validators dey reach consensus"] },
          { type: "callout", title: "Simple explanation", text: "When di answer no be just yes or no, but e need real judgment — na there GenLayer don enter." },
        ],
      },
      {
        slug: "problem-genlayer-solves", title: "Di Problem Wey GenLayer Don Solve", durationMinutes: 5,
        summary: "Understand why traditional blockchains no fit handle subjective decisions.",
        objectives: ["Know di limitations of existing blockchains", "Understand GenLayer unique value"],
        content: [
          { type: "paragraph", text: "Bitcoin and Ethereum don show say dem dey good for deterministic tasks, but dem no fit handle problems wey need judgment or AI reasoning. Content evaluation, disputes, milestone verification — na GenLayer dem need for those ones." },
          { type: "list", items: ["Traditional contracts: only fixed logic", "GenLayer: handle subjective and ambiguous results", "E don fill critical gap for blockchain technology"] },
          { type: "callout", title: "Key difference", text: "Ethereum dey ask 'did di code run?' GenLayer dey ask 'is di result correct?'" },
        ],
      },
      {
        slug: "intelligent-contracts", title: "Intelligent Contracts vs Smart Contracts", durationMinutes: 5,
        summary: "See wetin extra Intelligent Contracts of GenLayer fit do.",
        objectives: ["Identify di unique features of Intelligent Contracts", "Understand why Python dey used"],
        content: [
          { type: "paragraph", text: "Traditional smart contracts only dey execute fixed logic. GenLayer don build Intelligent Contracts wey fit access real-time web data, call LLMs, and dem don write am in Python — more intuitive and powerful." },
          { type: "list", items: ["Direct internet data access without Oracle", "Call LLMs (like GPT-4) for AI reasoning", "Written in Python — familiar and powerful"] },
          { type: "callout", title: "Analogy", text: "Traditional contract na calculator. Intelligent Contract na assistant wey don get sense to reason." },
        ],
      },
      {
        slug: "blockchain-stack", title: "Where GenLayer Don Land for Blockchain Stack", durationMinutes: 5,
        summary: "Understand say GenLayer na Layer 1 and how e dey work with Ethereum.",
        objectives: ["Understand blockchain layers", "Know which layer GenLayer dey"],
        content: [
          { type: "paragraph", text: "GenLayer na Layer 1 blockchain wey don integrate with Ethereum through rollups like ZKSync, while e dey handle im own AI-native consensus. E no dey compete with Ethereum — na new layer wey don specialize for AI adjudication." },
          { type: "list", items: ["Bitcoin: consensus on transaction order", "Ethereum: consensus on code execution", "GenLayer: consensus on decision meaning"] },
          { type: "callout", title: "Position", text: "GenLayer don complement Ethereum, e no dey compete with am." },
        ],
      },
      {
        slug: "optimistic-democracy", title: "Optimistic Democracy", durationMinutes: 5,
        summary: "Learn how GenLayer dey reach consensus using multiple validators.",
        objectives: ["Understand di four phases of consensus", "Why multiple validators better pass one"],
        content: [
          { type: "paragraph", text: "Optimistic Democracy dey make multiple validators execute di contract independently and vote. E don base on Condorcet's Jury Theorem: a group of independent judges get higher chance to reach di correct answer." },
          { type: "list", items: ["4 phases: Propose → Commit → Reveal → Accept", "Anyone fit appeal a result", "Final result no fit change"] },
          { type: "callout", title: "Core idea", text: "Collective independent judgment don prove say e more trustworthy than one single node." },
        ],
      },
      {
        slug: "validators-staking", title: "Validators and Staking", durationMinutes: 5,
        summary: "Understand di role of validators, how to stake GEN and di rewards.",
        objectives: ["Understand validator responsibilities", "Know how much GEN you need to stake"],
        content: [
          { type: "paragraph", text: "Validators don stake GEN, dey run nodes and participate for Optimistic Democracy to earn rewards. You no get 42,000 GEN? You fit participate as delegator." },
          { type: "list", items: ["To be validator: stake 42,000 GEN", "Delegator: minimum 42 GEN to participate", "Validators don dey collect 10% operational fee plus staking rewards"] },
          { type: "callout", title: "Two ways to participate", text: "Big stake? Be validator. Small stake? Delegate. Both of dem don dey earn." },
        ],
      },
      {
        slug: "equivalence-principle", title: "Equivalence Principle", durationMinutes: 5,
        summary: "How GenLayer dey safely handle non-deterministic results like AI outputs.",
        objectives: ["Understand wetin Equivalence Principle dey do", "Know di two verification methods"],
        content: [
          { type: "paragraph", text: "Different validators wey run di same AI query fit get slightly different results. Equivalence Principle don define when those results are 'similar enough', making non-determinism manageable on blockchain." },
          { type: "list", items: ["strict_eq(): all validators must get exactly di same result", "prompt_non_comparative(): validators judge if di criteria don meet", "Developer define wetin 'equivalent' mean"] },
          { type: "callout", title: "Key insight", text: "AI fit give slightly different answer each time — Equivalence Principle don make am safe for blockchain." },
        ],
      },
      {
        slug: "genvm", title: "GenVM: Di Execution Environment", durationMinutes: 5,
        summary: "How GenVM dey run Python on blockchain and support AI integration.",
        objectives: ["Difference between GenVM and EVM", "Technical foundation of GenVM"],
        content: [
          { type: "paragraph", text: "GenVM na di execution environment for Intelligent Contracts. E don build on WebAssembly, e dey run Python natively, and e fit interact directly with LLMs and web data — something EVM no fit do." },
          { type: "list", items: ["WebAssembly-based, fast execution", "Runs Python natively (not Solidity)", "Built-in support for LLM calls and internet access"] },
          { type: "callout", title: "Fundamental difference", text: "EVM don design for deterministic code. GenVM don handle non-determinism — na fundamental architectural innovation." },
        ],
      },
      {
        slug: "gen-token", title: "GEN Token and Economy", durationMinutes: 5,
        summary: "Know di utility of GEN token, staking rewards and di appeal mechanism.",
        objectives: ["Functions of GEN token", "Reward distribution"],
        content: [
          { type: "paragraph", text: "GEN na di native token of di network, used for staking, gas and governance. Initial staking APY don start at 15%, e go drop small small to 4% to ensure long-term sustainability." },
          { type: "list", items: ["Initial APY 15%, go drop small small to 4%", "75% of rewards go to all stakers", "10% to validators, 15% to developers"] },
          { type: "callout", title: "Appeal mechanism", text: "You no agree with a result? Stake GEN to appeal and a larger set of validators go re-evaluate am." },
        ],
      },
      {
        slug: "genlayer-studio", title: "GenLayer Studio", durationMinutes: 5,
        summary: "Browser sandbox to test Intelligent Contracts without installing anything.",
        objectives: ["Wetin Studio be", "Im main features"],
        content: [
          { type: "paragraph", text: "GenLayer Studio na browser-based sandbox with no installation to test Intelligent Contracts. E don dey simulate full validator network with real-time logs and error feedback." },
          { type: "list", items: ["Directly for browser, no installation needed", "Simulate multi-validator consensus", "Detailed logs and debugging support"] },
          { type: "callout", title: "Start now", text: "Visit studio.genlayer.com or run genlayer init to start Studio locally." },
        ],
      },
      {
        slug: "cli-sdks", title: "CLI and SDKs", durationMinutes: 5,
        summary: "Developer tools: genlayer CLI, GenLayerJS and GenLayerPY.",
        objectives: ["How to install di CLI", "Use cases of di two SDKs"],
        content: [
          { type: "paragraph", text: "GenLayer don provide complete toolchain: CLI to start quickly, GenLayerJS for frontend DApps, GenLayerPY for Python backend integration." },
          { type: "list", items: ["npm install -g genlayer, then genlayer init", "GenLayerJS: TypeScript, for frontend development", "GenLayerPY: Python 3.12+, for backend"] },
          { type: "callout", title: "Beginner tip", text: "First run genlayer init, explore example contracts for Studio, then start to write code." },
        ],
      },
      {
        slug: "first-contract", title: "Your First Intelligent Contract", durationMinutes: 5,
        summary: "Basic structure of Intelligent Contract: class, initialization and decorators.",
        objectives: ["Understand di basic structure of a contract", "How to declare state variables"],
        content: [
          { type: "paragraph", text: "Every Intelligent Contract na Python class wey don inherit from gl.Contract. State variables don declare for di class body, and methods don tag with decorators for read or write permissions." },
          { type: "code", language: "python", code: "import gl\n\nclass Counter(gl.Contract):\n    count: gl.u256\n\n    def __init__(self):\n        self.count = 0\n\n    @gl.public.view\n    def get(self) -> int:\n        return self.count\n\n    @gl.public.write\n    def increment(self):\n        self.count += 1" },
          { type: "callout", title: "Remember", text: "All persistent fields must don declare inside di class body with type annotation. Dem no fit create am dynamically at runtime." },
        ],
      },
      {
        slug: "storage-types", title: "Storage and Data Types", durationMinutes: 5,
        summary: "Persistent storage rules and special data types for GenLayer.",
        objectives: ["Why you no fit use dict and list directly", "Di correct replacement types"],
        content: [
          { type: "paragraph", text: "GenLayer don get strict storage rules. Regular Python dict and list no go persist. You must use TreeMap and DynArray, plus fixed-size integer types." },
          { type: "list", items: ["dict → TreeMap[K, V]", "list → DynArray[T]", "int → u256, i32 and other fixed types"] },
          { type: "callout", title: "Common mistake", text: "Fields wey dem don create dynamically at runtime no go save. Declare all persistent fields inside di class body from di beginning." },
        ],
      },
      {
        slug: "read-write-methods", title: "Read and Write Methods", durationMinutes: 5,
        summary: "Difference and use of @gl.public.view and @gl.public.write decorators.",
        objectives: ["Difference between read and write decorators", "When to use payable"],
        content: [
          { type: "paragraph", text: "@gl.public.view don mark read-only methods wey no dey change state. @gl.public.write dey modify state. @gl.public.write.payable dey accept GEN transfers." },
          { type: "list", items: ["@gl.public.view: read-only, lower gas cost", "@gl.public.write: modify on-chain state", "@gl.public.write.payable: accept GEN tokens"] },
          { type: "callout", title: "Good practice", text: "Test your logic with read-only methods first. Add write logic only when you don confirm am." },
        ],
      },
      {
        slug: "llm-integration", title: "LLM Integration", durationMinutes: 5,
        summary: "How to call LLM inside contract and principles for writing good prompts.",
        objectives: ["Use gl.nondet.exec_prompt()", "Best practices for prompt engineering"],
        content: [
          { type: "paragraph", text: "gl.nondet.exec_prompt() na di main method to call LLM. Prompt quality don dey critical — vague prompts go cause inconsistent results among validators and consensus go fail." },
          { type: "list", items: ["Always request JSON response (response_format='json')", "Avoid timestamps or dynamic data", "Compare AI-derived conclusions, not raw data"] },
          { type: "callout", title: "Number 1 cause of consensus failure", text: "Asking LLM for unstable data go make validators get different results. Always extract stable fields." },
        ],
      },
      {
        slug: "web-data", title: "Web Data Access", durationMinutes: 5,
        summary: "Fetch and verify internet data directly inside di contract without Oracle.",
        objectives: ["Use gl.nondet.web.get()", "Considerations when accessing web data"],
        content: [
          { type: "paragraph", text: "GenLayer don allow contracts to access internet directly without Oracle. gl.nondet.web.get(url) dey fetch text, gl.nondet.web.render(url) dey handle dynamic pages. Everything don verify by equivalence among validators." },
          { type: "list", items: ["gl.nondet.web.get(url): raw text content", "gl.nondet.web.render(url): JS-rendered pages", "Extract stable fields, avoid dynamic content"] },
          { type: "callout", title: "Reliability tip", text: "External websites fit go down or change structure. Only fetch from trusted sources and validate before saving." },
        ],
      },
      {
        slug: "deploy-dapp", title: "Build and Deploy DApp", durationMinutes: 5,
        summary: "Complete DApp development flow from local testing to Testnet deployment.",
        objectives: ["3-phase deployment process", "How to connect contract to frontend"],
        content: [
          { type: "paragraph", text: "GenLayer DApp development don break into 3 phases: local prototype for Studio, thorough testing with testing framework, then deploy to Testnet (Asimov/Bradbury) and build frontend with GenLayerJS." },
          { type: "list", items: ["Phase 1: Local prototype for GenLayer Studio", "Phase 2: Testing with genlayer-test", "Phase 3: GenLayerJS frontend plus Testnet deployment"] },
          { type: "callout", title: "Launch checklist", text: "Before you deploy to Testnet, finish testing for direct mode and Studio mode, and handle all consensus failures." },
        ],
      },
    ],
    questions: [
      { id: "nigeria-q01", prompt: "How we fit best describe GenLayer?", options: ["Decentralized file storage system", "AI-native adjudication layer for di agentic economy", "Layer 2 solution for Ethereum", "Centralized payment network"], correctOption: 1, explanation: "GenLayer na AI-native adjudication layer wey dem don design for di agentic economy." },
      { id: "nigeria-q02", prompt: "Wetin be di main problem wey GenLayer don solve?", options: ["Make blockchain handle subjective judgment-based decisions", "Make Bitcoin transactions faster", "Replace all smart contract platforms", "Create new programming language"], correctOption: 0, explanation: "Di core value of GenLayer na to enable on-chain decisions wey need judgment and reasoning." },
      { id: "nigeria-q03", prompt: "Wetin Intelligent Contracts fit do wey traditional smart contracts no fit do?", options: ["Store static files on-chain", "Only deterministic calculations", "Only run on Ethereum", "Access live web data and process AI outputs"], correctOption: 3, explanation: "Intelligent Contracts fit access internet and call LLMs — something traditional contracts no fit do." },
      { id: "nigeria-q04", prompt: "Which layer of blockchain GenLayer don land for?", options: ["Layer 0", "Layer 2", "Layer 1", "Layer 3"], correctOption: 2, explanation: "GenLayer na Layer 1 blockchain." },
      { id: "nigeria-q05", prompt: "Wetin be Optimistic Democracy?", options: ["Consensus mechanism wey use multiple validators to verify results", "Voting system only for token holders", "Way to delete incorrect transactions", "Social media governance tool"], correctOption: 0, explanation: "Optimistic Democracy na GenLayer consensus mechanism where multiple validators don dey vote independently." },
      { id: "nigeria-q06", prompt: "How much GEN you need to stake to be validator?", options: ["4,200 GEN", "42,000 GEN", "420 GEN", "420,000 GEN"], correctOption: 1, explanation: "You need to stake 42,000 GEN to become validator." },
      { id: "nigeria-q07", prompt: "Wetin Equivalence Principle don guarantee?", options: ["All validators go get equal rewards", "Every transaction get same fee", "Non-deterministic outputs dey validated consistently across validators", "Each transaction dey processed by only one validator"], correctOption: 2, explanation: "Equivalence Principle don allow non-deterministic outputs to be safely validated across all validators." },
      { id: "nigeria-q08", prompt: "Which language GenVM dey run natively?", options: ["Solidity", "Rust", "JavaScript", "Python"], correctOption: 3, explanation: "GenVM dey run Python natively, wey dey make Intelligent Contract development more intuitive." },
      { id: "nigeria-q09", prompt: "Wetin be di starting APY for GEN staking?", options: ["4%", "15%", "50%", "100%"], correctOption: 1, explanation: "Initial APY na 15%, e go drop small small to 4%." },
      { id: "nigeria-q10", prompt: "Wetin be GenLayer Studio?", options: ["Browser sandbox to test Intelligent Contracts locally", "Mobile app for token trading", "Developer social network", "Hardware wallet interface"], correctOption: 0, explanation: "GenLayer Studio na browser-based sandbox wey don dey simulate full validator network." },
      { id: "nigeria-q11", prompt: "Wetin genlayer init command don do?", options: ["Create new GEN wallet", "Delete all local contracts", "Submit transaction to testnet", "Download and launch GenLayer Studio"], correctOption: 3, explanation: "genlayer init don download components and launch GenLayer Studio locally." },
      { id: "nigeria-q12", prompt: "Which class must Intelligent Contract extend?", options: ["gl.Contract", "SmartContract", "BaseChain", "BlockchainApp"], correctOption: 0, explanation: "All Intelligent Contracts must extend gl.Contract class." },
      { id: "nigeria-q13", prompt: "Which data structure don replace Python dict for GenLayer storage?", options: ["HashMap", "OrderedDict", "TreeMap", "ArrayList"], correctOption: 2, explanation: "You must use TreeMap[K, V] instead of Python dict for persistent storage." },
      { id: "nigeria-q14", prompt: "Which decorator don mark read-only method?", options: ["@gl.public.write", "@gl.public.view", "@gl.private.read", "@gl.readonly.method"], correctOption: 1, explanation: "@gl.public.view don mark read-only methods wey no dey modify state." },
      { id: "nigeria-q15", prompt: "Wetin be di method to execute LLM prompt inside contract?", options: ["gl.web.fetch()", "gl.contract.ask()", "gl.ai.run()", "gl.nondet.exec_prompt()"], correctOption: 3, explanation: "gl.nondet.exec_prompt() na di standard method to call LLM inside Intelligent Contract." },
      { id: "nigeria-q16", prompt: "Wetin method dey fetch live web content?", options: ["gl.llm.browse()", "gl.http.get()", "gl.nondet.web.get()", "gl.fetch.url()"], correctOption: 2, explanation: "gl.nondet.web.get() don use to fetch web data directly inside contract." },
      { id: "nigeria-q17", prompt: "Wetin be di recommended first environment to deploy Intelligent Contract?", options: ["Localnet", "Ethereum Mainnet", "Bitcoin network", "Centralnet"], correctOption: 0, explanation: "Localnet na local development environment — di best starting point to test contracts." },
    ],
  }),

  // ─── RUSSIA ───────────────────────────────────────────────────────────────
  createRegionalTrack({
    slug: "russia",
    regionName: "Russia",
    nativeRegionName: "Россия",
    languageName: "Russian",
    nativeLanguageName: "Русский",
    locale: "ru-RU",
    title: "Курс GenLayer на русском",
    description: "Изучайте GenLayer на русском: AI-нативный блокчейн, Intelligent Contracts, консенсус и разработка DApp.",
    unityMessage: "Русскоязычное сообщество изучает GenLayer на родном языке и строит вместе с глобальной экосистемой.",
    certificateTitle: "Сертификат GenLayer Basics на русском",
    quizTitle: "Тест GenLayer на русском",
    lessons: [
      {
        slug: "what-is-genlayer", title: "Что такое GenLayer?", durationMinutes: 5,
        summary: "Узнайте, что такое GenLayer — AI-нативный уровень арбитража для агентной экономики.",
        objectives: ["Понять, что такое GenLayer", "Узнать его отличия от Bitcoin и Ethereum"],
        content: [
          { type: "paragraph", text: "GenLayer — это AI-нативный блокчейн, созданный для ситуаций, требующих суждения и рассуждений. Bitcoin обрабатывает транзакции, Ethereum выполняет код, GenLayer понимает смысл решений." },
          { type: "list", items: ["Позиция: уровень арбитража для агентной экономики", "Доверенная on-chain верификация субъективных вопросов", "AI-валидаторы достигают консенсуса"] },
          { type: "callout", title: "Простыми словами", text: "Когда ответ — не просто да или нет, а требует суждения, вступает в дело GenLayer." },
        ],
      },
      {
        slug: "problem-genlayer-solves", title: "Какую проблему решает GenLayer?", durationMinutes: 5,
        summary: "Поймите, почему традиционные блокчейны не справляются с субъективными решениями.",
        objectives: ["Знать ограничения существующих блокчейнов", "Понять уникальную ценность GenLayer"],
        content: [
          { type: "paragraph", text: "Bitcoin и Ethereum хороши для детерминированных задач, но не могут справляться с задачами, требующими суждения или AI-рассуждений. Оценка контента, споры, верификация этапов — для этого нужен GenLayer." },
          { type: "list", items: ["Традиционные контракты: только фиксированная логика", "GenLayer: обрабатывает субъективные и неоднозначные результаты", "Закрывает критический пробел в технологии блокчейн"] },
          { type: "callout", title: "Ключевое отличие", text: "Ethereum спрашивает: 'выполнился ли код?' GenLayer спрашивает: 'правильный ли результат?'" },
        ],
      },
      {
        slug: "intelligent-contracts", title: "Intelligent Contracts vs Смарт-контракты", durationMinutes: 5,
        summary: "Узнайте, какими дополнительными возможностями обладают Intelligent Contracts GenLayer.",
        objectives: ["Определить уникальные функции Intelligent Contracts", "Понять, почему используется Python"],
        content: [
          { type: "paragraph", text: "Традиционные смарт-контракты выполняют только фиксированную логику. Intelligent Contracts GenLayer могут обращаться к данным в реальном времени, вызывать LLM и написаны на Python — более интуитивно и мощно." },
          { type: "list", items: ["Прямой доступ к интернет-данным без Oracle", "Вызов LLM (например, GPT-4) для AI-рассуждений", "Написаны на Python — привычно и мощно"] },
          { type: "callout", title: "Аналогия", text: "Традиционный контракт — это калькулятор. Intelligent Contract — помощник, способный рассуждать." },
        ],
      },
      {
        slug: "blockchain-stack", title: "Место GenLayer в архитектуре блокчейна", durationMinutes: 5,
        summary: "GenLayer — это Layer 1, и вот как он работает вместе с Ethereum.",
        objectives: ["Понять слои блокчейна", "Знать, на каком уровне находится GenLayer"],
        content: [
          { type: "paragraph", text: "GenLayer — это блокчейн Layer 1, который интегрируется с Ethereum через роллапы типа ZKSync, управляя собственным AI-нативным консенсусом. Он не конкурирует с Ethereum — это новый уровень, специализирующийся на AI-арбитраже." },
          { type: "list", items: ["Bitcoin: консенсус по порядку транзакций", "Ethereum: консенсус по выполнению кода", "GenLayer: консенсус по смыслу решений"] },
          { type: "callout", title: "Позиция", text: "GenLayer дополняет Ethereum, а не конкурирует с ним." },
        ],
      },
      {
        slug: "optimistic-democracy", title: "Оптимистичная демократия", durationMinutes: 5,
        summary: "Узнайте, как GenLayer достигает консенсуса с помощью множества валидаторов.",
        objectives: ["Понять четыре фазы консенсуса", "Почему множество валидаторов надёжнее одного"],
        content: [
          { type: "paragraph", text: "Optimistic Democracy заставляет множество валидаторов независимо выполнять контракт и голосовать. Основано на теореме жюри Кондорсе: группа независимых судей с большей вероятностью придёт к правильному ответу." },
          { type: "list", items: ["4 фазы: Предложить → Подтвердить → Раскрыть → Принять", "Любой может обжаловать результат", "Финальный результат необратим"] },
          { type: "callout", title: "Ключевая идея", text: "Коллективное независимое суждение надёжнее единственного узла." },
        ],
      },
      {
        slug: "validators-staking", title: "Валидаторы и стейкинг", durationMinutes: 5,
        summary: "Роль валидаторов, стейкинг GEN и механизм вознаграждений.",
        objectives: ["Понять обязанности валидатора", "Знать, сколько GEN нужно для стейкинга"],
        content: [
          { type: "paragraph", text: "Валидаторы стейкают GEN, запускают ноды и участвуют в Optimistic Democracy, зарабатывая вознаграждения. Нет 42 000 GEN? Участвуйте как делегатор." },
          { type: "list", items: ["Стать валидатором: стейкнуть 42 000 GEN", "Делегатор: минимум 42 GEN для участия", "Валидаторы получают 10% операционную комиссию + награды за стейкинг"] },
          { type: "callout", title: "Два способа участия", text: "Большой стейк — будьте валидатором. Маленький стейк — делегируйте. Оба приносят доход." },
        ],
      },
      {
        slug: "equivalence-principle", title: "Принцип эквивалентности", durationMinutes: 5,
        summary: "Как GenLayer безопасно обрабатывает недетерминированные результаты, например, выводы AI.",
        objectives: ["Понять назначение принципа эквивалентности", "Знать два метода верификации"],
        content: [
          { type: "paragraph", text: "Разные валидаторы, выполняющие один и тот же AI-запрос, могут получать немного разные результаты. Принцип эквивалентности определяет, когда результаты считаются достаточно одинаковыми, делая недетерминизм управляемым в блокчейне." },
          { type: "list", items: ["strict_eq(): все валидаторы должны получить точно одинаковый результат", "prompt_non_comparative(): валидаторы оценивают, выполнен ли критерий", "Разработчик определяет, что означает 'эквивалентно'"] },
          { type: "callout", title: "Ключевой вывод", text: "AI каждый раз может отвечать чуть по-разному — принцип эквивалентности делает это безопасным в блокчейне." },
        ],
      },
      {
        slug: "genvm", title: "GenVM: среда выполнения", durationMinutes: 5,
        summary: "Как GenVM запускает Python в блокчейне и поддерживает интеграцию AI.",
        objectives: ["Отличия GenVM от EVM", "Техническая основа GenVM"],
        content: [
          { type: "paragraph", text: "GenVM — это среда выполнения Intelligent Contracts. Построена на WebAssembly, нативно запускает Python и напрямую взаимодействует с LLM и веб-данными — то, чего EVM не умеет." },
          { type: "list", items: ["На основе WebAssembly, быстрое выполнение", "Нативно запускает Python (не Solidity)", "Встроенная поддержка вызовов LLM и доступа в интернет"] },
          { type: "callout", title: "Принципиальное отличие", text: "EVM предназначена для детерминированного кода. GenVM работает с недетерминизмом — фундаментальная архитектурная инновация." },
        ],
      },
      {
        slug: "gen-token", title: "Токен GEN и экономика", durationMinutes: 5,
        summary: "Утилита токена GEN, структура наград за стейкинг и механизм обжалования.",
        objectives: ["Функции токена GEN", "Распределение вознаграждений"],
        content: [
          { type: "paragraph", text: "GEN — нативный токен сети для стейкинга, газа и управления. Начальный APY стейкинга — 15%, постепенно снижается до 4% для долгосрочной устойчивости." },
          { type: "list", items: ["Начальный APY 15%, постепенно снижается до 4%", "75% наград — всем стейкерам", "10% — валидаторам, 15% — разработчикам"] },
          { type: "callout", title: "Механизм обжалования", text: "Не согласны с результатом? Застейкайте GEN для обжалования, и более широкий набор валидаторов пересмотрит его." },
        ],
      },
      {
        slug: "genlayer-studio", title: "GenLayer Studio", durationMinutes: 5,
        summary: "Браузерная песочница для тестирования Intelligent Contracts без установки.",
        objectives: ["Что такое Studio", "Основные функции"],
        content: [
          { type: "paragraph", text: "GenLayer Studio — браузерная песочница без установки для тестирования Intelligent Contracts. Симулирует полную сеть валидаторов с логами в реальном времени и обратной связью по ошибкам." },
          { type: "list", items: ["Прямо в браузере, без установки", "Симуляция консенсуса с несколькими валидаторами", "Подробные логи и поддержка отладки"] },
          { type: "callout", title: "Начните сейчас", text: "Откройте studio.genlayer.com или выполните genlayer init, чтобы запустить Studio локально." },
        ],
      },
      {
        slug: "cli-sdks", title: "CLI и SDK", durationMinutes: 5,
        summary: "Инструменты разработчика: genlayer CLI, GenLayerJS и GenLayerPY.",
        objectives: ["Как установить CLI", "Случаи использования двух SDK"],
        content: [
          { type: "paragraph", text: "GenLayer предоставляет полный набор инструментов: CLI для быстрого старта, GenLayerJS для фронтенда DApp, GenLayerPY для Python-бэкенда." },
          { type: "list", items: ["npm install -g genlayer, затем genlayer init", "GenLayerJS: TypeScript, для фронтенда", "GenLayerPY: Python 3.12+, для бэкенда"] },
          { type: "callout", title: "Совет новичку", text: "Сначала запустите genlayer init, изучите примеры в Studio, затем начинайте писать код." },
        ],
      },
      {
        slug: "first-contract", title: "Ваш первый Intelligent Contract", durationMinutes: 5,
        summary: "Базовая структура Intelligent Contract: класс, инициализация и декораторы.",
        objectives: ["Понять базовую структуру контракта", "Как объявлять переменные состояния"],
        content: [
          { type: "paragraph", text: "Каждый Intelligent Contract — это Python-класс, унаследованный от gl.Contract. Переменные состояния объявляются в теле класса, методы помечаются декораторами для прав чтения или записи." },
          { type: "code", language: "python", code: "import gl\n\nclass Counter(gl.Contract):\n    count: gl.u256\n\n    def __init__(self):\n        self.count = 0\n\n    @gl.public.view\n    def get(self) -> int:\n        return self.count\n\n    @gl.public.write\n    def increment(self):\n        self.count += 1" },
          { type: "callout", title: "Запомните", text: "Все постоянные поля должны быть объявлены в теле класса с аннотацией типа. Их нельзя создавать динамически во время выполнения." },
        ],
      },
      {
        slug: "storage-types", title: "Хранилище и типы данных", durationMinutes: 5,
        summary: "Правила постоянного хранения и специальные типы данных в GenLayer.",
        objectives: ["Почему нельзя использовать dict и list напрямую", "Правильные типы-замены"],
        content: [
          { type: "paragraph", text: "В GenLayer строгие правила хранения. Обычные Python-словари dict и списки list не сохраняются. Нужно использовать TreeMap и DynArray, а также целочисленные типы фиксированного размера." },
          { type: "list", items: ["dict → TreeMap[K, V]", "list → DynArray[T]", "int → u256, i32 и другие фиксированные типы"] },
          { type: "callout", title: "Частая ошибка", text: "Поля, созданные динамически во время выполнения, не сохраняются. Объявляйте все постоянные поля в теле класса заранее." },
        ],
      },
      {
        slug: "read-write-methods", title: "Методы чтения и записи", durationMinutes: 5,
        summary: "Разница и использование декораторов @gl.public.view и @gl.public.write.",
        objectives: ["Разница между декораторами чтения и записи", "Когда использовать payable"],
        content: [
          { type: "paragraph", text: "@gl.public.view помечает методы только для чтения, не изменяющие состояние. @gl.public.write изменяет состояние. @gl.public.write.payable принимает переводы GEN." },
          { type: "list", items: ["@gl.public.view: только чтение, меньше газа", "@gl.public.write: изменяет on-chain состояние", "@gl.public.write.payable: принимает токены GEN"] },
          { type: "callout", title: "Хорошая практика", text: "Сначала тестируйте логику с методами только для чтения. Добавляйте логику записи только после подтверждения." },
        ],
      },
      {
        slug: "llm-integration", title: "Интеграция с LLM", durationMinutes: 5,
        summary: "Как вызывать LLM в контракте и принципы написания хороших промптов.",
        objectives: ["Использование gl.nondet.exec_prompt()", "Лучшие практики prompt engineering"],
        content: [
          { type: "paragraph", text: "gl.nondet.exec_prompt() — основной метод вызова LLM. Качество промпта критично — расплывчатые промпты дают непоследовательные результаты у валидаторов и консенсус не достигается." },
          { type: "list", items: ["Всегда запрашивайте ответ в JSON (response_format='json')", "Избегайте временных меток и динамических данных", "Сравнивайте выводы AI, а не сырые данные"] },
          { type: "callout", title: "Главная причина сбоев консенсуса", text: "Запрос нестабильных данных у LLM приводит к разным результатам у валидаторов. Всегда извлекайте стабильные поля." },
        ],
      },
      {
        slug: "web-data", title: "Доступ к веб-данным", durationMinutes: 5,
        summary: "Получение и верификация интернет-данных прямо в контракте без Oracle.",
        objectives: ["Использование gl.nondet.web.get()", "Особенности доступа к веб-данным"],
        content: [
          { type: "paragraph", text: "GenLayer позволяет контрактам напрямую обращаться в интернет без Oracle. gl.nondet.web.get(url) получает текст, gl.nondet.web.render(url) обрабатывает динамические страницы. Всё верифицируется через эквивалентность у валидаторов." },
          { type: "list", items: ["gl.nondet.web.get(url): сырой текстовый контент", "gl.nondet.web.render(url): JS-рендеренные страницы", "Извлекайте стабильные поля, избегайте динамического контента"] },
          { type: "callout", title: "Совет по надёжности", text: "Внешние сайты могут быть недоступны или менять структуру. Получайте данные только из надёжных источников и валидируйте перед сохранением." },
        ],
      },
      {
        slug: "deploy-dapp", title: "Сборка и деплой DApp", durationMinutes: 5,
        summary: "Полный цикл разработки DApp: от локального тестирования до деплоя в Testnet.",
        objectives: ["Трёхэтапный процесс деплоя", "Как подключить контракт к фронтенду"],
        content: [
          { type: "paragraph", text: "Разработка DApp в GenLayer проходит в 3 этапа: локальный прототип в Studio, полноценное тестирование с тестовым фреймворком, затем деплой в Testnet (Asimov/Bradbury) и фронтенд на GenLayerJS." },
          { type: "list", items: ["Этап 1: Локальный прототип в GenLayer Studio", "Этап 2: Тестирование с genlayer-test", "Этап 3: Фронтенд GenLayerJS + деплой в Testnet"] },
          { type: "callout", title: "Чеклист перед запуском", text: "Перед деплоем в Testnet завершите тесты в прямом режиме и режиме Studio и устраните все сбои консенсуса." },
        ],
      },
    ],
    questions: [
      { id: "russia-q01", prompt: "Как лучше всего описать GenLayer?", options: ["Децентрализованная система хранения файлов", "AI-нативный уровень арбитража для агентной экономики", "Решение Layer 2 для Ethereum", "Централизованная платёжная сеть"], correctOption: 1, explanation: "GenLayer — AI-нативный уровень арбитража, разработанный для агентной экономики." },
      { id: "russia-q02", prompt: "Какую главную проблему решает GenLayer?", options: ["Позволить блокчейну обрабатывать субъективные решения, требующие суждения", "Ускорить транзакции Bitcoin", "Заменить все платформы смарт-контрактов", "Создать новый язык программирования"], correctOption: 0, explanation: "Ключевая ценность GenLayer — возможность on-chain решений, требующих суждения и рассуждений." },
      { id: "russia-q03", prompt: "Что умеют Intelligent Contracts, чего не умеют традиционные смарт-контракты?", options: ["Хранить статические файлы on-chain", "Только детерминированные вычисления", "Работать только в Ethereum", "Получать данные из интернета и обрабатывать вывод AI"], correctOption: 3, explanation: "Intelligent Contracts могут обращаться к интернету и вызывать LLM — традиционные контракты этого не умеют." },
      { id: "russia-q04", prompt: "На каком уровне блокчейна находится GenLayer?", options: ["Layer 0", "Layer 2", "Layer 1", "Layer 3"], correctOption: 2, explanation: "GenLayer — блокчейн Layer 1." },
      { id: "russia-q05", prompt: "Что такое Optimistic Democracy?", options: ["Механизм консенсуса, использующий множество валидаторов для верификации результатов", "Система голосования только для держателей токенов", "Способ удаления неверных транзакций", "Инструмент управления в соцсетях"], correctOption: 0, explanation: "Optimistic Democracy — механизм консенсуса GenLayer, где несколько валидаторов голосуют независимо." },
      { id: "russia-q06", prompt: "Сколько GEN нужно застейкать, чтобы стать валидатором?", options: ["4 200 GEN", "42 000 GEN", "420 GEN", "420 000 GEN"], correctOption: 1, explanation: "Чтобы стать валидатором, нужно застейкать 42 000 GEN." },
      { id: "russia-q07", prompt: "Что гарантирует принцип эквивалентности?", options: ["Все валидаторы получают одинаковые вознаграждения", "Одинаковая комиссия за каждую транзакцию", "Недетерминированные выводы верифицируются согласованно у всех валидаторов", "Каждую транзакцию обрабатывает только один валидатор"], correctOption: 2, explanation: "Принцип эквивалентности позволяет безопасно верифицировать недетерминированные выводы у всех валидаторов." },
      { id: "russia-q08", prompt: "Какой язык нативно выполняет GenVM?", options: ["Solidity", "Rust", "JavaScript", "Python"], correctOption: 3, explanation: "GenVM нативно запускает Python, что делает разработку Intelligent Contracts более интуитивной." },
      { id: "russia-q09", prompt: "Каков начальный APY стейкинга GEN?", options: ["4%", "15%", "50%", "100%"], correctOption: 1, explanation: "Начальный APY — 15%, постепенно снижается до 4%." },
      { id: "russia-q10", prompt: "Что такое GenLayer Studio?", options: ["Браузерная песочница для локального тестирования Intelligent Contracts", "Мобильное приложение для торговли токенами", "Социальная сеть для разработчиков", "Интерфейс аппаратного кошелька"], correctOption: 0, explanation: "GenLayer Studio — браузерная песочница, симулирующая полную сеть валидаторов." },
      { id: "russia-q11", prompt: "Что делает команда genlayer init?", options: ["Создаёт новый кошелёк GEN", "Удаляет все локальные контракты", "Отправляет транзакцию в тестнет", "Загружает и запускает GenLayer Studio"], correctOption: 3, explanation: "genlayer init загружает компоненты и запускает GenLayer Studio локально." },
      { id: "russia-q12", prompt: "От какого класса должен наследоваться Intelligent Contract?", options: ["gl.Contract", "SmartContract", "BaseChain", "BlockchainApp"], correctOption: 0, explanation: "Все Intelligent Contracts должны наследоваться от класса gl.Contract." },
      { id: "russia-q13", prompt: "Какая структура данных заменяет Python dict в хранилище GenLayer?", options: ["HashMap", "OrderedDict", "TreeMap", "ArrayList"], correctOption: 2, explanation: "Вместо Python dict для постоянного хранения нужно использовать TreeMap[K, V]." },
      { id: "russia-q14", prompt: "Какой декоратор помечает метод только для чтения?", options: ["@gl.public.write", "@gl.public.view", "@gl.private.read", "@gl.readonly.method"], correctOption: 1, explanation: "@gl.public.view помечает методы только для чтения, не изменяющие состояние." },
      { id: "russia-q15", prompt: "Какой метод выполняет промпт LLM в контракте?", options: ["gl.web.fetch()", "gl.contract.ask()", "gl.ai.run()", "gl.nondet.exec_prompt()"], correctOption: 3, explanation: "gl.nondet.exec_prompt() — стандартный метод вызова LLM в Intelligent Contract." },
      { id: "russia-q16", prompt: "Какой метод получает веб-контент в реальном времени?", options: ["gl.llm.browse()", "gl.http.get()", "gl.nondet.web.get()", "gl.fetch.url()"], correctOption: 2, explanation: "gl.nondet.web.get() используется для прямого получения веб-данных в контракте." },
      { id: "russia-q17", prompt: "Какая первая среда рекомендуется для деплоя Intelligent Contract?", options: ["Localnet", "Ethereum Mainnet", "Сеть Bitcoin", "Centralnet"], correctOption: 0, explanation: "Localnet — локальная среда разработки, лучшая отправная точка для тестирования контрактов." },
    ],
  }),

  // ─── KOREA ────────────────────────────────────────────────────────────────
  createRegionalTrack({
    slug: "korea",
    regionName: "Korea",
    nativeRegionName: "한국",
    languageName: "Korean",
    nativeLanguageName: "한국어",
    locale: "ko-KR",
    title: "한국어 GenLayer 강좌",
    description: "한국어로 GenLayer 배우기: AI 네이티브 블록체인, Intelligent Contracts, 합의 메커니즘, DApp 개발.",
    unityMessage: "한국 커뮤니티가 모국어로 GenLayer를 배우고 글로벌 생태계와 함께 만들어갑니다.",
    certificateTitle: "GenLayer 한국어 기초 수료증",
    quizTitle: "GenLayer 한국어 퀴즈",
    lessons: [
      {
        slug: "what-is-genlayer", title: "GenLayer란 무엇인가요?", durationMinutes: 5,
        summary: "GenLayer의 핵심 정체성 — 에이전트 경제를 위한 AI 네이티브 중재 레이어를 알아봅니다.",
        objectives: ["GenLayer가 무엇인지 이해하기", "Bitcoin, Ethereum과의 차이점 알기"],
        content: [
          { type: "paragraph", text: "GenLayer는 판단과 추론이 필요한 상황을 위해 설계된 AI 네이티브 블록체인입니다. Bitcoin은 거래를 처리하고, Ethereum은 코드를 실행하며, GenLayer는 결정의 의미를 이해합니다." },
          { type: "list", items: ["위치: 에이전트 경제를 위한 중재 레이어", "주관적 질문에 대한 온체인 신뢰 검증", "AI 검증자들이 합의에 도달"] },
          { type: "callout", title: "간단히 말하면", text: "답이 단순한 예/아니오가 아니라 판단이 필요할 때 — 바로 그때 GenLayer가 필요합니다." },
        ],
      },
      {
        slug: "problem-genlayer-solves", title: "GenLayer는 어떤 문제를 해결하나요?", durationMinutes: 5,
        summary: "기존 블록체인이 주관적 결정을 처리하지 못하는 이유와 GenLayer의 가치를 이해합니다.",
        objectives: ["기존 블록체인의 한계 파악", "GenLayer의 고유한 가치 이해"],
        content: [
          { type: "paragraph", text: "Bitcoin과 Ethereum은 결정론적 작업에 강하지만 판단이나 AI 추론이 필요한 문제는 처리하지 못합니다. 콘텐츠 평가, 분쟁 중재, 마일스톤 검증 — 이런 것들이 GenLayer가 필요한 분야입니다." },
          { type: "list", items: ["전통 컨트랙트: 고정된 로직만 가능", "GenLayer: 주관적이고 모호한 결과도 처리", "블록체인 기술의 중요한 빈자리를 채움"] },
          { type: "callout", title: "핵심 차이", text: "Ethereum은 '코드가 실행됐나?'를 묻고, GenLayer는 '결과가 올바른가?'를 묻습니다." },
        ],
      },
      {
        slug: "intelligent-contracts", title: "Intelligent Contracts vs 스마트 컨트랙트", durationMinutes: 5,
        summary: "GenLayer의 Intelligent Contracts가 가진 추가 능력을 알아봅니다.",
        objectives: ["Intelligent Contracts의 고유 기능 파악", "Python을 사용하는 이유 이해"],
        content: [
          { type: "paragraph", text: "전통적인 스마트 컨트랙트는 고정된 로직만 실행합니다. GenLayer의 Intelligent Contracts는 실시간 웹 데이터에 접근하고, LLM을 호출하며, Python으로 작성됩니다 — 더 직관적이고 강력합니다." },
          { type: "list", items: ["Oracle 없이 직접 인터넷 데이터 접근", "LLM(예: GPT-4) 호출로 AI 추론 가능", "Python으로 작성 — 친숙하고 강력함"] },
          { type: "callout", title: "비유", text: "전통 컨트랙트는 계산기, Intelligent Contract는 추론할 수 있는 어시스턴트입니다." },
        ],
      },
      {
        slug: "blockchain-stack", title: "블록체인 스택에서 GenLayer의 위치", durationMinutes: 5,
        summary: "GenLayer가 Layer 1이며 Ethereum과 어떻게 협력하는지 이해합니다.",
        objectives: ["블록체인 레이어 이해", "GenLayer가 어느 레이어인지 알기"],
        content: [
          { type: "paragraph", text: "GenLayer는 ZKSync 같은 롤업을 통해 Ethereum과 통합되는 Layer 1 블록체인으로, 자체적인 AI 네이티브 합의를 관리합니다. Ethereum의 경쟁자가 아니라 AI 중재에 특화된 새로운 레이어입니다." },
          { type: "list", items: ["Bitcoin: 트랜잭션 순서에 대한 합의", "Ethereum: 코드 실행에 대한 합의", "GenLayer: 결정의 의미에 대한 합의"] },
          { type: "callout", title: "포지션", text: "GenLayer는 Ethereum을 보완하지, 경쟁하지 않습니다." },
        ],
      },
      {
        slug: "optimistic-democracy", title: "옵티미스틱 데모크라시", durationMinutes: 5,
        summary: "GenLayer가 여러 검증자를 통해 합의에 도달하는 방식을 배웁니다.",
        objectives: ["합의의 4단계 이해", "여러 검증자가 더 신뢰할 수 있는 이유"],
        content: [
          { type: "paragraph", text: "Optimistic Democracy는 여러 검증자가 독립적으로 컨트랙트를 실행하고 투표하게 합니다. 콩도르세의 배심원 정리에 기반: 독립적인 판단자들의 그룹이 올바른 답에 도달할 확률이 더 높습니다." },
          { type: "list", items: ["4단계: 제안 → 커밋 → 공개 → 수락", "누구든 결과에 이의 제기 가능", "최종 결과는 돌이킬 수 없음"] },
          { type: "callout", title: "핵심 아이디어", text: "집단적 독립 판단이 단일 노드보다 더 신뢰할 수 있습니다." },
        ],
      },
      {
        slug: "validators-staking", title: "검증자와 스테이킹", durationMinutes: 5,
        summary: "검증자의 역할, GEN 스테이킹 방법, 보상 구조를 이해합니다.",
        objectives: ["검증자의 책임 이해", "스테이킹에 필요한 GEN 수량 알기"],
        content: [
          { type: "paragraph", text: "검증자들은 GEN을 스테이킹하고 노드를 운영하며 Optimistic Democracy에 참여해 보상을 얻습니다. 42,000 GEN이 없다면? 위임자로 참여할 수 있습니다." },
          { type: "list", items: ["검증자 되기: 42,000 GEN 스테이킹", "위임자: 최소 42 GEN으로 참여 가능", "검증자는 10% 운영 수수료 + 스테이킹 보상 수령"] },
          { type: "callout", title: "두 가지 참여 방법", text: "큰 스테이킹: 검증자 되기. 작은 스테이킹: 위임하기. 둘 다 수익을 냅니다." },
        ],
      },
      {
        slug: "equivalence-principle", title: "동등성 원칙", durationMinutes: 5,
        summary: "GenLayer가 AI 출력 같은 비결정론적 결과를 안전하게 처리하는 방법을 배웁니다.",
        objectives: ["동등성 원칙의 역할 이해", "두 가지 검증 방법 알기"],
        content: [
          { type: "paragraph", text: "같은 AI 쿼리를 실행한 서로 다른 검증자들은 약간 다른 결과를 얻을 수 있습니다. 동등성 원칙은 결과가 '충분히 동일한' 시점을 정의해 블록체인에서 비결정론을 관리 가능하게 만듭니다." },
          { type: "list", items: ["strict_eq(): 모든 검증자가 정확히 같은 결과를 가져야 함", "prompt_non_comparative(): 검증자가 기준 충족 여부를 판단", "개발자가 '동등'의 의미를 정의"] },
          { type: "callout", title: "핵심 인사이트", text: "AI는 매번 약간 다른 답을 줄 수 있습니다 — 동등성 원칙이 블록체인에서 이를 안전하게 만듭니다." },
        ],
      },
      {
        slug: "genvm", title: "GenVM: 실행 환경", durationMinutes: 5,
        summary: "GenVM이 블록체인에서 Python을 실행하고 AI 통합을 지원하는 방법을 배웁니다.",
        objectives: ["GenVM과 EVM의 차이점", "GenVM의 기술적 기반"],
        content: [
          { type: "paragraph", text: "GenVM은 Intelligent Contracts의 실행 환경입니다. WebAssembly 기반으로 Python을 네이티브로 실행하고 LLM 및 웹 데이터와 직접 상호작용합니다 — EVM이 할 수 없는 것들입니다." },
          { type: "list", items: ["WebAssembly 기반, 빠른 실행", "Python 네이티브 실행 (Solidity 아님)", "LLM 호출 및 인터넷 접근 내장 지원"] },
          { type: "callout", title: "근본적인 차이", text: "EVM은 결정론적 코드용으로 설계됐고, GenVM은 비결정론을 처리합니다 — 근본적인 아키텍처 혁신입니다." },
        ],
      },
      {
        slug: "gen-token", title: "GEN 토큰과 경제 모델", durationMinutes: 5,
        summary: "GEN 토큰의 용도, 스테이킹 보상 구조, 이의 제기 메커니즘을 알아봅니다.",
        objectives: ["GEN 토큰의 기능", "보상 분배 구조"],
        content: [
          { type: "paragraph", text: "GEN은 스테이킹, 가스, 거버넌스에 사용되는 네트워크 네이티브 토큰입니다. 초기 스테이킹 APY는 15%로 시작해 장기 지속 가능성을 위해 점진적으로 4%까지 낮아집니다." },
          { type: "list", items: ["초기 APY 15%, 점진적으로 4%까지 감소", "보상의 75%는 모든 스테이커에게", "10%는 검증자에게, 15%는 개발자에게"] },
          { type: "callout", title: "이의 제기 메커니즘", text: "결과에 동의하지 않나요? GEN을 스테이킹해 이의를 제기하면 더 많은 검증자가 재평가합니다." },
        ],
      },
      {
        slug: "genlayer-studio", title: "GenLayer Studio", durationMinutes: 5,
        summary: "설치 없이 브라우저에서 Intelligent Contracts를 테스트하는 샌드박스입니다.",
        objectives: ["Studio가 무엇인지", "주요 기능"],
        content: [
          { type: "paragraph", text: "GenLayer Studio는 설치 없이 Intelligent Contracts를 테스트할 수 있는 브라우저 기반 샌드박스입니다. 실시간 로그와 오류 피드백으로 전체 검증자 네트워크를 시뮬레이션합니다." },
          { type: "list", items: ["브라우저에서 바로, 설치 불필요", "다중 검증자 합의 시뮬레이션", "상세 로그 및 디버깅 지원"] },
          { type: "callout", title: "지금 시작하기", text: "studio.genlayer.com을 방문하거나 genlayer init을 실행해 로컬 Studio를 시작하세요." },
        ],
      },
      {
        slug: "cli-sdks", title: "CLI와 SDK", durationMinutes: 5,
        summary: "개발자 도구: genlayer CLI, GenLayerJS, GenLayerPY를 알아봅니다.",
        objectives: ["CLI 설치 방법", "두 SDK의 사용 사례"],
        content: [
          { type: "paragraph", text: "GenLayer는 완전한 도구 체인을 제공합니다: 빠른 시작을 위한 CLI, 프론트엔드 DApp을 위한 GenLayerJS, Python 백엔드 통합을 위한 GenLayerPY." },
          { type: "list", items: ["npm install -g genlayer, 그 다음 genlayer init", "GenLayerJS: TypeScript, 프론트엔드 개발용", "GenLayerPY: Python 3.12+, 백엔드용"] },
          { type: "callout", title: "초보자 팁", text: "먼저 genlayer init을 실행하고 Studio에서 예제 컨트랙트를 탐색한 다음 코드를 작성하세요." },
        ],
      },
      {
        slug: "first-contract", title: "첫 번째 Intelligent Contract", durationMinutes: 5,
        summary: "Intelligent Contract의 기본 구조: 클래스, 초기화, 데코레이터를 알아봅니다.",
        objectives: ["컨트랙트의 기본 구조 이해", "상태 변수 선언 방법"],
        content: [
          { type: "paragraph", text: "모든 Intelligent Contract는 gl.Contract를 상속하는 Python 클래스입니다. 상태 변수는 클래스 본문에 선언되고, 메서드는 읽기/쓰기 권한을 나타내는 데코레이터로 표시됩니다." },
          { type: "code", language: "python", code: "import gl\n\nclass Counter(gl.Contract):\n    count: gl.u256\n\n    def __init__(self):\n        self.count = 0\n\n    @gl.public.view\n    def get(self) -> int:\n        return self.count\n\n    @gl.public.write\n    def increment(self):\n        self.count += 1" },
          { type: "callout", title: "기억하세요", text: "모든 영구 필드는 타입 어노테이션과 함께 클래스 본문에 선언해야 합니다. 런타임에 동적으로 생성할 수 없습니다." },
        ],
      },
      {
        slug: "storage-types", title: "스토리지와 데이터 타입", durationMinutes: 5,
        summary: "GenLayer의 영구 스토리지 규칙과 특수 데이터 타입을 알아봅니다.",
        objectives: ["dict와 list를 직접 사용할 수 없는 이유", "올바른 대체 타입"],
        content: [
          { type: "paragraph", text: "GenLayer는 엄격한 스토리지 규칙을 가집니다. 일반 Python dict와 list는 영구 저장되지 않습니다. TreeMap과 DynArray, 그리고 고정 크기 정수 타입을 사용해야 합니다." },
          { type: "list", items: ["dict → TreeMap[K, V]", "list → DynArray[T]", "int → u256, i32 등 고정 타입"] },
          { type: "callout", title: "흔한 실수", text: "런타임에 동적으로 생성된 필드는 저장되지 않습니다. 모든 영구 필드는 처음부터 클래스 본문에 선언하세요." },
        ],
      },
      {
        slug: "read-write-methods", title: "읽기와 쓰기 메서드", durationMinutes: 5,
        summary: "@gl.public.view와 @gl.public.write 데코레이터의 차이와 사용법을 배웁니다.",
        objectives: ["읽기/쓰기 데코레이터의 차이", "payable을 사용하는 경우"],
        content: [
          { type: "paragraph", text: "@gl.public.view는 상태를 변경하지 않는 읽기 전용 메서드를 표시합니다. @gl.public.write는 상태를 수정합니다. @gl.public.write.payable은 GEN 전송을 받습니다." },
          { type: "list", items: ["@gl.public.view: 읽기 전용, 낮은 가스 비용", "@gl.public.write: 온체인 상태 수정", "@gl.public.write.payable: GEN 토큰 수신"] },
          { type: "callout", title: "좋은 습관", text: "먼저 읽기 전용 메서드로 로직을 테스트하세요. 확인 후에만 쓰기 로직을 추가하세요." },
        ],
      },
      {
        slug: "llm-integration", title: "LLM 통합", durationMinutes: 5,
        summary: "컨트랙트에서 LLM을 호출하는 방법과 좋은 프롬프트 작성 원칙을 배웁니다.",
        objectives: ["gl.nondet.exec_prompt() 사용법", "프롬프트 엔지니어링 모범 사례"],
        content: [
          { type: "paragraph", text: "gl.nondet.exec_prompt()는 LLM을 호출하는 주요 메서드입니다. 프롬프트 품질이 매우 중요합니다 — 모호한 프롬프트는 검증자 간 불일치를 유발하고 합의 실패로 이어집니다." },
          { type: "list", items: ["항상 JSON 응답 요청 (response_format='json')", "타임스탬프나 동적 데이터 피하기", "원시 데이터가 아닌 AI가 도출한 결론 비교"] },
          { type: "callout", title: "합의 실패의 주요 원인", text: "LLM에 불안정한 데이터를 요청하면 검증자마다 결과가 달라집니다. 항상 안정적인 필드를 추출하세요." },
        ],
      },
      {
        slug: "web-data", title: "웹 데이터 접근", durationMinutes: 5,
        summary: "Oracle 없이 컨트랙트에서 직접 인터넷 데이터를 가져오고 검증하는 방법을 배웁니다.",
        objectives: ["gl.nondet.web.get() 사용법", "웹 데이터 접근 시 주의사항"],
        content: [
          { type: "paragraph", text: "GenLayer는 컨트랙트가 Oracle 없이 직접 인터넷에 접근할 수 있게 합니다. gl.nondet.web.get(url)은 텍스트를 가져오고, gl.nondet.web.render(url)은 동적 페이지를 처리합니다. 모든 데이터는 검증자 간 동등성 검증을 거칩니다." },
          { type: "list", items: ["gl.nondet.web.get(url): 원시 텍스트 콘텐츠", "gl.nondet.web.render(url): JS 렌더링 페이지", "안정적인 필드 추출, 동적 콘텐츠 피하기"] },
          { type: "callout", title: "신뢰성 팁", text: "외부 웹사이트는 다운되거나 구조가 바뀔 수 있습니다. 신뢰할 수 있는 소스에서만 데이터를 가져오고 저장 전에 검증하세요." },
        ],
      },
      {
        slug: "deploy-dapp", title: "DApp 빌드와 배포", durationMinutes: 5,
        summary: "로컬 테스트부터 Testnet 배포까지 전체 DApp 개발 흐름을 알아봅니다.",
        objectives: ["3단계 배포 프로세스", "컨트랙트를 프론트엔드에 연결하는 방법"],
        content: [
          { type: "paragraph", text: "GenLayer DApp 개발은 3단계로 진행됩니다: Studio에서 로컬 프로토타입, 테스트 프레임워크로 철저한 테스트, 그다음 Testnet(Asimov/Bradbury)에 배포하고 GenLayerJS로 프론트엔드 구축." },
          { type: "list", items: ["1단계: GenLayer Studio에서 로컬 프로토타입", "2단계: genlayer-test 프레임워크로 테스트", "3단계: GenLayerJS 프론트엔드 + Testnet 배포"] },
          { type: "callout", title: "출시 전 체크리스트", text: "Testnet 배포 전, 직접 모드와 Studio 모드에서 테스트를 완료하고 모든 합의 실패를 처리하세요." },
        ],
      },
    ],
    questions: [
      { id: "korea-q01", prompt: "GenLayer를 가장 잘 설명하는 것은?", options: ["분산 파일 저장 시스템", "에이전트 경제를 위한 AI 네이티브 중재 레이어", "Ethereum의 Layer 2 솔루션", "중앙화된 결제 네트워크"], correctOption: 1, explanation: "GenLayer는 에이전트 경제를 위해 설계된 AI 네이티브 중재 레이어입니다." },
      { id: "korea-q02", prompt: "GenLayer가 주로 해결하는 문제는 무엇인가요?", options: ["블록체인이 주관적인 판단 기반 결정을 처리하게 하기", "Bitcoin 거래 속도 높이기", "모든 스마트 컨트랙트 플랫폼 대체", "새로운 프로그래밍 언어 만들기"], correctOption: 0, explanation: "GenLayer의 핵심 가치는 판단과 추론이 필요한 온체인 결정을 가능하게 하는 것입니다." },
      { id: "korea-q03", prompt: "Intelligent Contracts가 전통적인 스마트 컨트랙트와 달리 할 수 있는 것은?", options: ["온체인에 정적 파일 저장", "결정론적 계산만 수행", "Ethereum에서만 실행", "실시간 웹 데이터 접근 및 AI 출력 처리"], correctOption: 3, explanation: "Intelligent Contracts는 인터넷에 접근하고 LLM을 호출할 수 있습니다 — 전통 컨트랙트는 할 수 없는 것들입니다." },
      { id: "korea-q04", prompt: "GenLayer는 블록체인 스택의 어느 레이어에 있나요?", options: ["Layer 0", "Layer 2", "Layer 1", "Layer 3"], correctOption: 2, explanation: "GenLayer는 Layer 1 블록체인입니다." },
      { id: "korea-q05", prompt: "Optimistic Democracy란 무엇인가요?", options: ["여러 검증자를 사용해 결과를 검증하는 합의 메커니즘", "토큰 보유자만을 위한 투표 시스템", "잘못된 트랜잭션을 삭제하는 방법", "소셜 미디어 거버넌스 도구"], correctOption: 0, explanation: "Optimistic Democracy는 여러 검증자가 독립적으로 투표하는 GenLayer의 합의 메커니즘입니다." },
      { id: "korea-q06", prompt: "검증자가 되려면 얼마의 GEN을 스테이킹해야 하나요?", options: ["4,200 GEN", "42,000 GEN", "420 GEN", "420,000 GEN"], correctOption: 1, explanation: "검증자가 되려면 42,000 GEN을 스테이킹해야 합니다." },
      { id: "korea-q07", prompt: "동등성 원칙이 보장하는 것은?", options: ["모든 검증자가 동일한 보상을 받음", "모든 트랜잭션의 수수료가 동일함", "비결정론적 출력이 검증자 전반에서 일관되게 검증됨", "각 트랜잭션이 하나의 검증자만 처리함"], correctOption: 2, explanation: "동등성 원칙은 비결정론적 출력이 모든 검증자에서 안전하게 검증될 수 있게 합니다." },
      { id: "korea-q08", prompt: "GenVM이 네이티브로 실행하는 언어는?", options: ["Solidity", "Rust", "JavaScript", "Python"], correctOption: 3, explanation: "GenVM은 Python을 네이티브로 실행해 Intelligent Contract 개발을 더 직관적으로 만듭니다." },
      { id: "korea-q09", prompt: "GEN 스테이킹의 초기 APY는 얼마인가요?", options: ["4%", "15%", "50%", "100%"], correctOption: 1, explanation: "초기 APY는 15%로, 점진적으로 4%까지 낮아집니다." },
      { id: "korea-q10", prompt: "GenLayer Studio란 무엇인가요?", options: ["Intelligent Contracts를 로컬에서 테스트하는 브라우저 샌드박스", "토큰 거래 모바일 앱", "개발자 소셜 네트워크", "하드웨어 지갑 인터페이스"], correctOption: 0, explanation: "GenLayer Studio는 전체 검증자 네트워크를 시뮬레이션하는 브라우저 기반 샌드박스입니다." },
      { id: "korea-q11", prompt: "genlayer init 명령이 하는 일은?", options: ["새 GEN 지갑 생성", "모든 로컬 컨트랙트 삭제", "테스트넷에 트랜잭션 제출", "GenLayer Studio 다운로드 및 실행"], correctOption: 3, explanation: "genlayer init은 필요한 구성 요소를 다운로드하고 로컬에서 GenLayer Studio를 실행합니다." },
      { id: "korea-q12", prompt: "Intelligent Contract가 상속해야 하는 클래스는?", options: ["gl.Contract", "SmartContract", "BaseChain", "BlockchainApp"], correctOption: 0, explanation: "모든 Intelligent Contracts는 gl.Contract 클래스를 상속해야 합니다." },
      { id: "korea-q13", prompt: "GenLayer 스토리지에서 Python dict를 대체하는 데이터 구조는?", options: ["HashMap", "OrderedDict", "TreeMap", "ArrayList"], correctOption: 2, explanation: "영구 스토리지를 위해 Python dict 대신 TreeMap[K, V]를 사용해야 합니다." },
      { id: "korea-q14", prompt: "읽기 전용 메서드를 표시하는 데코레이터는?", options: ["@gl.public.write", "@gl.public.view", "@gl.private.read", "@gl.readonly.method"], correctOption: 1, explanation: "@gl.public.view는 상태를 수정하지 않는 읽기 전용 메서드를 표시합니다." },
      { id: "korea-q15", prompt: "컨트랙트에서 LLM 프롬프트를 실행하는 메서드는?", options: ["gl.web.fetch()", "gl.contract.ask()", "gl.ai.run()", "gl.nondet.exec_prompt()"], correctOption: 3, explanation: "gl.nondet.exec_prompt()는 Intelligent Contract에서 LLM을 호출하는 표준 메서드입니다." },
      { id: "korea-q16", prompt: "실시간 웹 콘텐츠를 가져오는 메서드는?", options: ["gl.llm.browse()", "gl.http.get()", "gl.nondet.web.get()", "gl.fetch.url()"], correctOption: 2, explanation: "gl.nondet.web.get()은 컨트랙트에서 직접 웹 데이터를 가져오는 데 사용됩니다." },
      { id: "korea-q17", prompt: "Intelligent Contract 배포에 권장되는 첫 번째 환경은?", options: ["Localnet", "Ethereum Mainnet", "Bitcoin 네트워크", "Centralnet"], correctOption: 0, explanation: "Localnet은 로컬 개발 환경으로 컨트랙트 테스트의 최적 시작점입니다." },
    ],
  }),

  // ─── TURKEY ───────────────────────────────────────────────────────────────
  createRegionalTrack({
    slug: "turkey",
    regionName: "Turkey",
    nativeRegionName: "Türkiye",
    languageName: "Turkish",
    nativeLanguageName: "Türkçe",
    locale: "tr-TR",
    title: "Türkçe GenLayer Kursu",
    description: "GenLayer'i Türkçe öğren: AI-native blockchain, Intelligent Contracts, konsensüs ve DApp geliştirme.",
    unityMessage: "Türk topluluğu GenLayer'i kendi dilinde öğrenir ve küresel ekosistemle birlikte inşa eder.",
    certificateTitle: "GenLayer Türkçe Temel Sertifikası",
    quizTitle: "GenLayer Türkçe Quiz",
    lessons: [
      {
        slug: "what-is-genlayer", title: "GenLayer Nedir?", durationMinutes: 5,
        summary: "GenLayer'in temel kimliğini öğren — ajansal ekonomi için AI-native tahkim katmanı.",
        objectives: ["GenLayer'in ne olduğunu anlamak", "Bitcoin ve Ethereum'dan farkını öğrenmek"],
        content: [
          { type: "paragraph", text: "GenLayer, yargı ve akıl yürütme gerektiren durumlar için tasarlanmış AI-native bir blockchain'dir. Bitcoin işlemleri yönetir, Ethereum kod çalıştırır, GenLayer kararların anlamını kavrar." },
          { type: "list", items: ["Konum: ajansal ekonomi için tahkim katmanı", "Öznel sorular için zincir üstü güvenilir doğrulama", "AI doğrulayıcılar konsensüse ulaşır"] },
          { type: "callout", title: "Kısaca", text: "Cevap sadece evet ya da hayır değil, yargı gerektiriyorsa — GenLayer tam orada devreye girer." },
        ],
      },
      {
        slug: "problem-genlayer-solves", title: "GenLayer Hangi Sorunu Çözüyor?", durationMinutes: 5,
        summary: "Geleneksel blockchain'lerin öznel kararları neden işleyemediğini ve GenLayer'in değerini anla.",
        objectives: ["Mevcut blockchain'lerin sınırlamalarını tanımak", "GenLayer'in benzersiz değerini anlamak"],
        content: [
          { type: "paragraph", text: "Bitcoin ve Ethereum deterministik görevlerde iyidir ancak yargı veya AI akıl yürütmesi gerektiren sorunları çözemez. İçerik değerlendirme, anlaşmazlıklar, kilometre taşı doğrulama — bunlar için GenLayer gereklidir." },
          { type: "list", items: ["Geleneksel kontratlar: yalnızca sabit mantık", "GenLayer: öznel ve belirsiz sonuçları yönetir", "Blockchain teknolojisindeki kritik boşluğu doldurur"] },
          { type: "callout", title: "Temel fark", text: "Ethereum 'kod çalıştı mı?' diye sorar. GenLayer 'sonuç doğru mu?' diye sorar." },
        ],
      },
      {
        slug: "intelligent-contracts", title: "Intelligent Contracts vs Akıllı Kontratlar", durationMinutes: 5,
        summary: "GenLayer'in Intelligent Contracts'ının geleneksel akıllı kontratlardan fazlasını neler yapabildiğini öğren.",
        objectives: ["Intelligent Contracts'ın benzersiz özelliklerini belirlemek", "Python'un neden kullanıldığını anlamak"],
        content: [
          { type: "paragraph", text: "Geleneksel akıllı kontratlar yalnızca sabit mantık çalıştırır. GenLayer'in Intelligent Contracts'ı gerçek zamanlı web verilerine erişebilir, LLM'leri çağırabilir ve Python ile yazılır — daha sezgisel ve güçlü." },
          { type: "list", items: ["Oracle olmadan doğrudan internet verisi erişimi", "AI akıl yürütmesi için LLM (örn. GPT-4) çağırma", "Python ile yazılır — tanıdık ve güçlü"] },
          { type: "callout", title: "Benzetme", text: "Geleneksel kontrat bir hesap makinesidir. Intelligent Contract akıl yürütebilen bir asistandır." },
        ],
      },
      {
        slug: "blockchain-stack", title: "GenLayer'in Blockchain Mimarisindeki Yeri", durationMinutes: 5,
        summary: "GenLayer'in Layer 1 olduğunu ve Ethereum ile nasıl çalıştığını anla.",
        objectives: ["Blockchain katmanlarını anlamak", "GenLayer'in hangi katmanda olduğunu bilmek"],
        content: [
          { type: "paragraph", text: "GenLayer, ZKSync gibi rollup'lar aracılığıyla Ethereum ile entegre olan ve kendi AI-native konsensüsünü yöneten bir Layer 1 blockchain'dir. Ethereum'un rakibi değil, AI tahkimine odaklanan yeni bir katmandır." },
          { type: "list", items: ["Bitcoin: işlem sırası üzerinde konsensüs", "Ethereum: kod yürütme üzerinde konsensüs", "GenLayer: karar anlamı üzerinde konsensüs"] },
          { type: "callout", title: "Konum", text: "GenLayer, Ethereum ile rekabet etmez; onu tamamlar." },
        ],
      },
      {
        slug: "optimistic-democracy", title: "İyimser Demokrasi", durationMinutes: 5,
        summary: "GenLayer'in birden fazla doğrulayıcı kullanarak nasıl konsensüse ulaştığını öğren.",
        objectives: ["Konsensüsün dört aşamasını anlamak", "Birden fazla doğrulayıcının neden daha güvenilir olduğunu kavramak"],
        content: [
          { type: "paragraph", text: "Optimistic Democracy, birden fazla doğrulayıcının kontratı bağımsız olarak çalıştırıp oy kullanmasını sağlar. Condorcet Jüri Teoremine dayanır: bağımsız yargıçlar grubu doğru cevaba ulaşma olasılığı daha yüksektir." },
          { type: "list", items: ["4 aşama: Öner → Onayla → Aç → Kabul Et", "Herkes bir sonuca itiraz edebilir", "Nihai sonuç geri alınamaz"] },
          { type: "callout", title: "Temel fikir", text: "Kolektif bağımsız yargı, tek bir düğümden daha güvenilirdir." },
        ],
      },
      {
        slug: "validators-staking", title: "Doğrulayıcılar ve Staking", durationMinutes: 5,
        summary: "Doğrulayıcıların rolünü, GEN staking'i ve ödül mekanizmasını anla.",
        objectives: ["Doğrulayıcı sorumluluklarını anlamak", "Staking için ne kadar GEN gerektiğini bilmek"],
        content: [
          { type: "paragraph", text: "Doğrulayıcılar GEN stake eder, node çalıştırır ve ödül kazanmak için Optimistic Democracy'e katılır. 42.000 GEN'in yok mu? Delege olarak katılabilirsin." },
          { type: "list", items: ["Doğrulayıcı olmak için: 42.000 GEN stake et", "Delege: katılmak için minimum 42 GEN", "Doğrulayıcılar %10 işletim ücreti + staking ödülleri alır"] },
          { type: "callout", title: "İki katılım yolu", text: "Büyük stake: doğrulayıcı ol. Küçük stake: delege et. İkisi de kazandırır." },
        ],
      },
      {
        slug: "equivalence-principle", title: "Denklik İlkesi", durationMinutes: 5,
        summary: "GenLayer'in AI çıktıları gibi deterministik olmayan sonuçları nasıl güvenli şekilde yönettiğini öğren.",
        objectives: ["Denklik İlkesi'nin ne işe yaradığını anlamak", "İki doğrulama yöntemini öğrenmek"],
        content: [
          { type: "paragraph", text: "Aynı AI sorgusunu çalıştıran farklı doğrulayıcılar biraz farklı sonuçlar alabilir. Denklik İlkesi, sonuçların 'yeterince aynı' olduğu zamanı tanımlayarak blockchain'de deterministik olmayan sonuçları yönetilebilir kılar." },
          { type: "list", items: ["strict_eq(): tüm doğrulayıcılar tam aynı sonucu almalı", "prompt_non_comparative(): doğrulayıcılar kriterin karşılanıp karşılanmadığını değerlendirir", "Geliştirici 'denklik' anlamını tanımlar"] },
          { type: "callout", title: "Temel içgörü", text: "AI her seferinde biraz farklı yanıt verebilir — Denklik İlkesi bunu blockchain'de güvenli kılar." },
        ],
      },
      {
        slug: "genvm", title: "GenVM: Çalıştırma Ortamı", durationMinutes: 5,
        summary: "GenVM'nin blockchain'de Python çalıştırıp AI entegrasyonunu nasıl desteklediğini öğren.",
        objectives: ["GenVM ile EVM arasındaki farklar", "GenVM'nin teknik temeli"],
        content: [
          { type: "paragraph", text: "GenVM, Intelligent Contracts'ın çalıştırma ortamıdır. WebAssembly üzerine kurulu, Python'u yerel olarak çalıştırır ve LLM'ler ile web verileriyle doğrudan etkileşime girebilir — EVM'nin yapamadığı şeyler." },
          { type: "list", items: ["WebAssembly tabanlı, hızlı yürütme", "Python'u yerel olarak çalıştırır (Solidity değil)", "LLM çağrıları ve internet erişimi için yerleşik destek"] },
          { type: "callout", title: "Temel fark", text: "EVM deterministik kod için tasarlanmıştır. GenVM deterministik olmayanı yönetir — köklü bir mimari yenilik." },
        ],
      },
      {
        slug: "gen-token", title: "GEN Token ve Ekonomi", durationMinutes: 5,
        summary: "GEN token'ın kullanım alanlarını, staking ödüllerini ve itiraz mekanizmasını öğren.",
        objectives: ["GEN token'ın işlevleri", "Ödül dağılımı"],
        content: [
          { type: "paragraph", text: "GEN, staking, gas ve yönetim için kullanılan ağın yerel token'ıdır. Başlangıç staking APY'si %15 olup uzun vadeli sürdürülebilirlik için kademeli olarak %4'e düşer." },
          { type: "list", items: ["Başlangıç APY %15, kademeli olarak %4'e düşer", "Ödüllerin %75'i tüm staker'lara", "%10 doğrulayıcılara, %15 geliştiricilere"] },
          { type: "callout", title: "İtiraz mekanizması", text: "Bir sonuca katılmıyor musun? GEN stake ederek itiraz et, daha geniş bir doğrulayıcı kümesi yeniden değerlendirir." },
        ],
      },
      {
        slug: "genlayer-studio", title: "GenLayer Studio", durationMinutes: 5,
        summary: "Hiçbir şey yüklemeden tarayıcıda Intelligent Contracts test etmek için sandbox.",
        objectives: ["Studio nedir", "Temel özellikleri"],
        content: [
          { type: "paragraph", text: "GenLayer Studio, Intelligent Contracts test etmek için kurulum gerektirmeyen tarayıcı tabanlı bir sandbox'tır. Gerçek zamanlı loglar ve hata geribildirimiyle tam doğrulayıcı ağını simüle eder." },
          { type: "list", items: ["Doğrudan tarayıcıda, kurulum yok", "Çoklu doğrulayıcı konsensüsünü simüle eder", "Ayrıntılı loglar ve hata ayıklama desteği"] },
          { type: "callout", title: "Hemen başla", text: "studio.genlayer.com'u ziyaret et veya yerel Studio'yu başlatmak için genlayer init komutunu çalıştır." },
        ],
      },
      {
        slug: "cli-sdks", title: "CLI ve SDK'lar", durationMinutes: 5,
        summary: "Geliştirici araçları: genlayer CLI, GenLayerJS ve GenLayerPY.",
        objectives: ["CLI nasıl kurulur", "İki SDK'nın kullanım senaryoları"],
        content: [
          { type: "paragraph", text: "GenLayer eksiksiz bir araç zinciri sunar: hızlı başlangıç için CLI, frontend DApp'ler için GenLayerJS, Python backend entegrasyonu için GenLayerPY." },
          { type: "list", items: ["npm install -g genlayer, ardından genlayer init", "GenLayerJS: TypeScript, frontend geliştirme için", "GenLayerPY: Python 3.12+, backend için"] },
          { type: "callout", title: "Yeni başlayanlara ipucu", text: "Önce genlayer init çalıştır, Studio'daki örnek kontratları keşfet, sonra kod yazmaya başla." },
        ],
      },
      {
        slug: "first-contract", title: "İlk Intelligent Contract'ın", durationMinutes: 5,
        summary: "Intelligent Contract'ın temel yapısı: sınıf, başlatma ve dekoratörler.",
        objectives: ["Kontratın temel yapısını anlamak", "Durum değişkenleri nasıl tanımlanır"],
        content: [
          { type: "paragraph", text: "Her Intelligent Contract, gl.Contract'tan miras alan bir Python sınıfıdır. Durum değişkenleri sınıf gövdesinde tanımlanır ve metodlar okuma/yazma izinleri için dekoratörlerle işaretlenir." },
          { type: "code", language: "python", code: "import gl\n\nclass Counter(gl.Contract):\n    count: gl.u256\n\n    def __init__(self):\n        self.count = 0\n\n    @gl.public.view\n    def get(self) -> int:\n        return self.count\n\n    @gl.public.write\n    def increment(self):\n        self.count += 1" },
          { type: "callout", title: "Unutma", text: "Tüm kalıcı alanlar sınıf gövdesinde tür ek açıklamasıyla tanımlanmalıdır. Çalışma zamanında dinamik olarak oluşturulamazlar." },
        ],
      },
      {
        slug: "storage-types", title: "Depolama ve Veri Türleri", durationMinutes: 5,
        summary: "GenLayer'de kalıcı depolama kuralları ve özel veri türleri.",
        objectives: ["dict ve list'in neden doğrudan kullanılamadığı", "Doğru yedek türler"],
        content: [
          { type: "paragraph", text: "GenLayer'in katı depolama kuralları vardır. Normal Python dict ve list kalıcı olmaz. TreeMap ve DynArray ile sabit boyutlu tam sayı türleri kullanmalısın." },
          { type: "list", items: ["dict → TreeMap[K, V]", "list → DynArray[T]", "int → u256, i32 ve diğer sabit türler"] },
          { type: "callout", title: "Yaygın hata", text: "Çalışma zamanında dinamik oluşturulan alanlar kaydedilmez. Tüm kalıcı alanları baştan sınıf gövdesinde tanımla." },
        ],
      },
      {
        slug: "read-write-methods", title: "Okuma ve Yazma Metodları", durationMinutes: 5,
        summary: "@gl.public.view ve @gl.public.write dekoratörlerinin farkı ve kullanımı.",
        objectives: ["Okuma/yazma dekoratörlerinin farkı", "Payable ne zaman kullanılır"],
        content: [
          { type: "paragraph", text: "@gl.public.view durumu değiştirmeyen salt okunur metodları işaretler. @gl.public.write durumu değiştirir. @gl.public.write.payable GEN transferlerini kabul eder." },
          { type: "list", items: ["@gl.public.view: salt okunur, daha düşük gas maliyeti", "@gl.public.write: zincir üstü durumu değiştirir", "@gl.public.write.payable: GEN token'larını kabul eder"] },
          { type: "callout", title: "İyi uygulama", text: "Önce salt okunur metodlarla mantığı test et. Yalnızca onaylandıktan sonra yazma mantığı ekle." },
        ],
      },
      {
        slug: "llm-integration", title: "LLM Entegrasyonu", durationMinutes: 5,
        summary: "Kontratta LLM çağırma ve iyi prompt yazma ilkeleri.",
        objectives: ["gl.nondet.exec_prompt() kullanımı", "Prompt mühendisliği en iyi uygulamaları"],
        content: [
          { type: "paragraph", text: "gl.nondet.exec_prompt(), LLM çağırmanın ana metodudur. Prompt kalitesi kritiktir — belirsiz promptlar doğrulayıcılar arasında tutarsız sonuçlara yol açar ve konsensüs başarısız olur." },
          { type: "list", items: ["Her zaman JSON yanıtı iste (response_format='json')", "Zaman damgaları veya dinamik verilerden kaçın", "Ham veriyi değil, AI'ın türettiği sonuçları karşılaştır"] },
          { type: "callout", title: "Konsensüs başarısızlığının temel nedeni", text: "LLM'den kararsız veri istemek doğrulayıcılarda farklı sonuçlara yol açar. Her zaman kararlı alanlar çıkar." },
        ],
      },
      {
        slug: "web-data", title: "Web Verisi Erişimi", durationMinutes: 5,
        summary: "Oracle olmadan kontratta doğrudan internet verisi çekme ve doğrulama.",
        objectives: ["gl.nondet.web.get() kullanımı", "Web verisi erişiminin dikkat noktaları"],
        content: [
          { type: "paragraph", text: "GenLayer, kontratların Oracle olmadan doğrudan internete erişmesine izin verir. gl.nondet.web.get(url) metin çeker, gl.nondet.web.render(url) dinamik sayfaları yönetir. Her şey doğrulayıcılar arasında denklikle doğrulanır." },
          { type: "list", items: ["gl.nondet.web.get(url): ham metin içeriği", "gl.nondet.web.render(url): JS ile render edilen sayfalar", "Kararlı alanlar çıkar, dinamik içerikten kaçın"] },
          { type: "callout", title: "Güvenilirlik ipucu", text: "Dış web siteleri çökebilir veya yapısı değişebilir. Yalnızca güvenilir kaynaklardan veri çek ve kaydetmeden önce doğrula." },
        ],
      },
      {
        slug: "deploy-dapp", title: "DApp Oluşturma ve Dağıtma", durationMinutes: 5,
        summary: "Yerel testlerden Testnet dağıtımına kadar tam DApp geliştirme akışı.",
        objectives: ["3 aşamalı dağıtım süreci", "Kontratı frontend'e nasıl bağlarsın"],
        content: [
          { type: "paragraph", text: "GenLayer DApp geliştirme 3 aşamada gerçekleşir: Studio'da yerel prototip, test çerçevesiyle kapsamlı test, ardından Testnet'e (Asimov/Bradbury) dağıtım ve GenLayerJS ile frontend oluşturma." },
          { type: "list", items: ["Aşama 1: GenLayer Studio'da yerel prototip", "Aşama 2: genlayer-test ile test", "Aşama 3: GenLayerJS frontend + Testnet dağıtımı"] },
          { type: "callout", title: "Yayın öncesi kontrol listesi", text: "Testnet'e dağıtmadan önce doğrudan mod ve Studio modunda testleri tamamla ve tüm konsensüs başarısızlıklarını ele al." },
        ],
      },
    ],
    questions: [
      { id: "turkey-q01", prompt: "GenLayer'i en iyi hangi tanım açıklar?", options: ["Merkezi olmayan dosya depolama sistemi", "Ajansal ekonomi için AI-native tahkim katmanı", "Ethereum için Layer 2 çözümü", "Merkezi ödeme ağı"], correctOption: 1, explanation: "GenLayer, ajansal ekonomi için tasarlanmış AI-native tahkim katmanıdır." },
      { id: "turkey-q02", prompt: "GenLayer öncelikle hangi sorunu çözüyor?", options: ["Blockchain'in öznel yargı tabanlı kararları işlemesini sağlamak", "Bitcoin işlemlerini hızlandırmak", "Tüm akıllı kontrat platformlarını değiştirmek", "Yeni bir programlama dili oluşturmak"], correctOption: 0, explanation: "GenLayer'in temel değeri, yargı ve akıl yürütme gerektiren zincir üstü kararları mümkün kılmaktır." },
      { id: "turkey-q03", prompt: "Intelligent Contracts'ın geleneksel akıllı kontratların yapamadığı şey nedir?", options: ["Zincir üstü statik dosya depolama", "Yalnızca deterministik hesaplamalar", "Yalnızca Ethereum'da çalışma", "Canlı web verilerine erişim ve AI çıktılarını işleme"], correctOption: 3, explanation: "Intelligent Contracts, internete erişebilir ve LLM çağırabilir — geleneksel kontratların yapamadığı şeyler." },
      { id: "turkey-q04", prompt: "GenLayer blockchain yığınının hangi katmanındadır?", options: ["Layer 0", "Layer 2", "Layer 1", "Layer 3"], correctOption: 2, explanation: "GenLayer bir Layer 1 blockchain'dir." },
      { id: "turkey-q05", prompt: "Optimistic Democracy nedir?", options: ["Sonuçları doğrulamak için birden fazla doğrulayıcı kullanan konsensüs mekanizması", "Yalnızca token sahipleri için oylama sistemi", "Yanlış işlemleri silme yöntemi", "Sosyal medya yönetim aracı"], correctOption: 0, explanation: "Optimistic Democracy, birden fazla doğrulayıcının bağımsız olarak oy kullandığı GenLayer'in konsensüs mekanizmasıdır." },
      { id: "turkey-q06", prompt: "Doğrulayıcı olmak için ne kadar GEN stake etmek gerekir?", options: ["4.200 GEN", "42.000 GEN", "420 GEN", "420.000 GEN"], correctOption: 1, explanation: "Doğrulayıcı olmak için 42.000 GEN stake etmek gerekir." },
      { id: "turkey-q07", prompt: "Denklik İlkesi neyi garanti eder?", options: ["Tüm doğrulayıcıların eşit ödül alması", "Her işlemin aynı ücreti ödemesi", "Deterministik olmayan çıktıların tüm doğrulayıcılarda tutarlı doğrulanması", "Her işlemin yalnızca bir doğrulayıcı tarafından işlenmesi"], correctOption: 2, explanation: "Denklik İlkesi, deterministik olmayan çıktıların tüm doğrulayıcılarda güvenli şekilde doğrulanmasını sağlar." },
      { id: "turkey-q08", prompt: "GenVM hangi dili yerel olarak çalıştırır?", options: ["Solidity", "Rust", "JavaScript", "Python"], correctOption: 3, explanation: "GenVM, Python'u yerel olarak çalıştırarak Intelligent Contract geliştirmeyi daha sezgisel kılar." },
      { id: "turkey-q09", prompt: "GEN staking'in başlangıç APY'si nedir?", options: ["%4", "%15", "%50", "%100"], correctOption: 1, explanation: "Başlangıç APY'si %15 olup kademeli olarak %4'e düşer." },
      { id: "turkey-q10", prompt: "GenLayer Studio nedir?", options: ["Intelligent Contracts'ı yerel olarak test etmek için tarayıcı sandbox'ı", "Token alım satımı için mobil uygulama", "Geliştirici sosyal ağı", "Donanım cüzdanı arayüzü"], correctOption: 0, explanation: "GenLayer Studio, tam doğrulayıcı ağını simüle eden tarayıcı tabanlı bir sandbox'tır." },
      { id: "turkey-q11", prompt: "genlayer init komutu ne yapar?", options: ["Yeni GEN cüzdanı oluşturur", "Tüm yerel kontratları siler", "Testnet'e işlem gönderir", "GenLayer Studio'yu indirir ve başlatır"], correctOption: 3, explanation: "genlayer init, bileşenleri indirir ve yerel olarak GenLayer Studio'yu başlatır." },
      { id: "turkey-q12", prompt: "Intelligent Contract hangi sınıfı genişletmelidir?", options: ["gl.Contract", "SmartContract", "BaseChain", "BlockchainApp"], correctOption: 0, explanation: "Tüm Intelligent Contracts, gl.Contract sınıfını genişletmelidir." },
      { id: "turkey-q13", prompt: "GenLayer depolamasında Python dict'in yerini hangi veri yapısı alır?", options: ["HashMap", "OrderedDict", "TreeMap", "ArrayList"], correctOption: 2, explanation: "Kalıcı depolama için Python dict yerine TreeMap[K, V] kullanılmalıdır." },
      { id: "turkey-q14", prompt: "Salt okunur metodları hangi dekoratör işaretler?", options: ["@gl.public.write", "@gl.public.view", "@gl.private.read", "@gl.readonly.method"], correctOption: 1, explanation: "@gl.public.view, durumu değiştirmeyen salt okunur metodları işaretler." },
      { id: "turkey-q15", prompt: "Kontratta LLM promptunu çalıştırmak için hangi metod kullanılır?", options: ["gl.web.fetch()", "gl.contract.ask()", "gl.ai.run()", "gl.nondet.exec_prompt()"], correctOption: 3, explanation: "gl.nondet.exec_prompt(), Intelligent Contract'ta LLM çağırmak için standart metoddur." },
      { id: "turkey-q16", prompt: "Canlı web içeriği çekmek için hangi metod kullanılır?", options: ["gl.llm.browse()", "gl.http.get()", "gl.nondet.web.get()", "gl.fetch.url()"], correctOption: 2, explanation: "gl.nondet.web.get(), kontratta doğrudan web verisi çekmek için kullanılır." },
      { id: "turkey-q17", prompt: "Intelligent Contract dağıtmak için önerilen ilk ortam hangisidir?", options: ["Localnet", "Ethereum Mainnet", "Bitcoin ağı", "Centralnet"], correctOption: 0, explanation: "Localnet, yerel geliştirme ortamıdır — kontratları test etmek için en iyi başlangıç noktasıdır." },
    ],
  }),

  // ─── UKRAINE ──────────────────────────────────────────────────────────────
  createRegionalTrack({
    slug: "ukraine",
    regionName: "Ukraine",
    nativeRegionName: "Україна",
    languageName: "Ukrainian",
    nativeLanguageName: "Українська",
    locale: "uk-UA",
    title: "Курс GenLayer українською",
    description: "Вивчайте GenLayer українською: AI-нативний блокчейн, Intelligent Contracts, консенсус та розробка DApp.",
    unityMessage: "Українська спільнота вивчає GenLayer рідною мовою та будує разом із глобальною екосистемою.",
    certificateTitle: "Сертифікат GenLayer Basics українською",
    quizTitle: "Тест GenLayer українською",
    lessons: [
      {
        slug: "what-is-genlayer", title: "Що таке GenLayer?", durationMinutes: 5,
        summary: "Дізнайтеся про основну ідентичність GenLayer — AI-нативний рівень арбітражу для агентної економіки.",
        objectives: ["Зрозуміти, що таке GenLayer", "Дізнатися про відмінності від Bitcoin та Ethereum"],
        content: [
          { type: "paragraph", text: "GenLayer — це AI-нативний блокчейн, створений для ситуацій, що потребують судження та міркувань. Bitcoin обробляє транзакції, Ethereum виконує код, GenLayer розуміє сенс рішень." },
          { type: "list", items: ["Позиція: рівень арбітражу для агентної економіки", "Довірена on-chain верифікація суб'єктивних питань", "AI-валідатори досягають консенсусу"] },
          { type: "callout", title: "Простими словами", text: "Коли відповідь — не просто так чи ні, а потребує судження — саме тут GenLayer і потрібен." },
        ],
      },
      {
        slug: "problem-genlayer-solves", title: "Яку проблему вирішує GenLayer?", durationMinutes: 5,
        summary: "Зрозумійте, чому традиційні блокчейни не справляються з суб'єктивними рішеннями.",
        objectives: ["Знати обмеження існуючих блокчейнів", "Розуміти унікальну цінність GenLayer"],
        content: [
          { type: "paragraph", text: "Bitcoin та Ethereum добре справляються з детермінованими завданнями, але не можуть обробляти проблеми, що потребують судження або AI-міркувань. Оцінка контенту, суперечки, верифікація етапів — для цього потрібен GenLayer." },
          { type: "list", items: ["Традиційні контракти: лише фіксована логіка", "GenLayer: обробляє суб'єктивні та неоднозначні результати", "Заповнює критичну прогалину в технології блокчейн"] },
          { type: "callout", title: "Ключова відмінність", text: "Ethereum запитує: 'чи виконався код?' GenLayer запитує: 'чи правильний результат?'" },
        ],
      },
      {
        slug: "intelligent-contracts", title: "Intelligent Contracts проти смарт-контрактів", durationMinutes: 5,
        summary: "Дізнайтеся, якими додатковими можливостями мають Intelligent Contracts GenLayer.",
        objectives: ["Визначити унікальні функції Intelligent Contracts", "Зрозуміти, чому використовується Python"],
        content: [
          { type: "paragraph", text: "Традиційні смарт-контракти виконують лише фіксовану логіку. Intelligent Contracts GenLayer можуть отримувати дані з мережі в реальному часі, викликати LLM та написані на Python — більш інтуїтивно та потужно." },
          { type: "list", items: ["Прямий доступ до інтернет-даних без Oracle", "Виклики LLM (наприклад, GPT-4) для AI-міркувань", "Написані на Python — знайомо та потужно"] },
          { type: "callout", title: "Аналогія", text: "Традиційний контракт — це калькулятор. Intelligent Contract — асистент, здатний міркувати." },
        ],
      },
      {
        slug: "blockchain-stack", title: "Місце GenLayer в архітектурі блокчейну", durationMinutes: 5,
        summary: "GenLayer — це Layer 1, і ось як він працює разом з Ethereum.",
        objectives: ["Розуміти рівні блокчейну", "Знати, на якому рівні знаходиться GenLayer"],
        content: [
          { type: "paragraph", text: "GenLayer — це блокчейн Layer 1, який інтегрується з Ethereum через ролапи на кшталт ZKSync, керуючи власним AI-нативним консенсусом. Він не конкурує з Ethereum — це новий рівень, що спеціалізується на AI-арбітражі." },
          { type: "list", items: ["Bitcoin: консенсус щодо порядку транзакцій", "Ethereum: консенсус щодо виконання коду", "GenLayer: консенсус щодо сенсу рішень"] },
          { type: "callout", title: "Позиція", text: "GenLayer доповнює Ethereum, а не конкурує з ним." },
        ],
      },
      {
        slug: "optimistic-democracy", title: "Оптимістична демократія", durationMinutes: 5,
        summary: "Дізнайтеся, як GenLayer досягає консенсусу за допомогою кількох валідаторів.",
        objectives: ["Зрозуміти чотири фази консенсусу", "Чому кілька валідаторів надійніше за один"],
        content: [
          { type: "paragraph", text: "Optimistic Democracy змушує кількох валідаторів незалежно виконувати контракт і голосувати. Ґрунтується на теоремі Кондорсе: група незалежних суддів з більшою ймовірністю дійде до правильної відповіді." },
          { type: "list", items: ["4 фази: Запропонувати → Підтвердити → Розкрити → Прийняти", "Будь-хто може оскаржити результат", "Кінцевий результат незворотній"] },
          { type: "callout", title: "Ключова ідея", text: "Колективне незалежне судження надійніше за один вузол." },
        ],
      },
      {
        slug: "validators-staking", title: "Валідатори та стейкінг", durationMinutes: 5,
        summary: "Роль валідаторів, стейкінг GEN та механізм винагород.",
        objectives: ["Зрозуміти обов'язки валідатора", "Знати, скільки GEN потрібно для стейкінгу"],
        content: [
          { type: "paragraph", text: "Валідатори стейкають GEN, запускають вузли та беруть участь в Optimistic Democracy, заробляючи винагороди. Немає 42 000 GEN? Беріть участь як делегатор." },
          { type: "list", items: ["Стати валідатором: застейкати 42 000 GEN", "Делегатор: мінімум 42 GEN для участі", "Валідатори отримують 10% операційну комісію + нагороди за стейкінг"] },
          { type: "callout", title: "Два способи участі", text: "Великий стейк — будьте валідатором. Малий стейк — делегуйте. Обидва приносять дохід." },
        ],
      },
      {
        slug: "equivalence-principle", title: "Принцип еквівалентності", durationMinutes: 5,
        summary: "Як GenLayer безпечно обробляє недетерміновані результати, наприклад виводи AI.",
        objectives: ["Зрозуміти призначення принципу еквівалентності", "Знати два методи верифікації"],
        content: [
          { type: "paragraph", text: "Різні валідатори, що виконують однаковий AI-запит, можуть отримати дещо відмінні результати. Принцип еквівалентності визначає, коли результати є 'достатньо однаковими', роблячи недетермінізм керованим у блокчейні." },
          { type: "list", items: ["strict_eq(): всі валідатори мають отримати точно однаковий результат", "prompt_non_comparative(): валідатори оцінюють, чи виконано критерій", "Розробник визначає, що означає 'еквівалентно'"] },
          { type: "callout", title: "Ключовий висновок", text: "AI щоразу може давати трохи різні відповіді — принцип еквівалентності робить це безпечним у блокчейні." },
        ],
      },
      {
        slug: "genvm", title: "GenVM: середовище виконання", durationMinutes: 5,
        summary: "Як GenVM запускає Python у блокчейні та підтримує інтеграцію AI.",
        objectives: ["Відмінності GenVM від EVM", "Технічна основа GenVM"],
        content: [
          { type: "paragraph", text: "GenVM — це середовище виконання Intelligent Contracts. Побудоване на WebAssembly, нативно запускає Python та безпосередньо взаємодіє з LLM і веб-даними — те, чого EVM не вміє." },
          { type: "list", items: ["На основі WebAssembly, швидке виконання", "Нативно запускає Python (не Solidity)", "Вбудована підтримка викликів LLM та доступу до інтернету"] },
          { type: "callout", title: "Принципова відмінність", text: "EVM призначена для детермінованого коду. GenVM обробляє недетермінізм — фундаментальна архітектурна інновація." },
        ],
      },
      {
        slug: "gen-token", title: "Токен GEN та економіка", durationMinutes: 5,
        summary: "Утиліта токена GEN, структура нагород за стейкінг та механізм оскарження.",
        objectives: ["Функції токена GEN", "Розподіл винагород"],
        content: [
          { type: "paragraph", text: "GEN — нативний токен мережі для стейкінгу, газу та управління. Початковий APY стейкінгу — 15%, поступово знижується до 4% для довгострокової стійкості." },
          { type: "list", items: ["Початковий APY 15%, поступово знижується до 4%", "75% нагород — всім стейкерам", "10% — валідаторам, 15% — розробникам"] },
          { type: "callout", title: "Механізм оскарження", text: "Не згодні з результатом? Застейкайте GEN для оскарження, і ширший набір валідаторів переоцінить його." },
        ],
      },
      {
        slug: "genlayer-studio", title: "GenLayer Studio", durationMinutes: 5,
        summary: "Браузерна пісочниця для тестування Intelligent Contracts без встановлення.",
        objectives: ["Що таке Studio", "Основні функції"],
        content: [
          { type: "paragraph", text: "GenLayer Studio — браузерний пісочниця без встановлення для тестування Intelligent Contracts. Симулює повну мережу валідаторів із логами в реальному часі та зворотним зв'язком щодо помилок." },
          { type: "list", items: ["Прямо в браузері, без встановлення", "Симуляція консенсусу з кількома валідаторами", "Детальні логи та підтримка відладки"] },
          { type: "callout", title: "Почніть зараз", text: "Відвідайте studio.genlayer.com або виконайте genlayer init, щоб запустити Studio локально." },
        ],
      },
      {
        slug: "cli-sdks", title: "CLI та SDK", durationMinutes: 5,
        summary: "Інструменти розробника: genlayer CLI, GenLayerJS та GenLayerPY.",
        objectives: ["Як встановити CLI", "Випадки використання двох SDK"],
        content: [
          { type: "paragraph", text: "GenLayer надає повний набір інструментів: CLI для швидкого старту, GenLayerJS для фронтенду DApp, GenLayerPY для Python-бекенду." },
          { type: "list", items: ["npm install -g genlayer, потім genlayer init", "GenLayerJS: TypeScript, для фронтенду", "GenLayerPY: Python 3.12+, для бекенду"] },
          { type: "callout", title: "Порада новачку", text: "Спочатку запустіть genlayer init, вивчіть приклади в Studio, потім починайте писати код." },
        ],
      },
      {
        slug: "first-contract", title: "Ваш перший Intelligent Contract", durationMinutes: 5,
        summary: "Базова структура Intelligent Contract: клас, ініціалізація та декоратори.",
        objectives: ["Зрозуміти базову структуру контракту", "Як оголошувати змінні стану"],
        content: [
          { type: "paragraph", text: "Кожен Intelligent Contract — це Python-клас, успадкований від gl.Contract. Змінні стану оголошуються в тілі класу, методи позначаються декораторами для прав читання або запису." },
          { type: "code", language: "python", code: "import gl\n\nclass Counter(gl.Contract):\n    count: gl.u256\n\n    def __init__(self):\n        self.count = 0\n\n    @gl.public.view\n    def get(self) -> int:\n        return self.count\n\n    @gl.public.write\n    def increment(self):\n        self.count += 1" },
          { type: "callout", title: "Запам'ятайте", text: "Усі постійні поля мають бути оголошені в тілі класу з анотацією типу. Їх не можна створювати динамічно під час виконання." },
        ],
      },
      {
        slug: "storage-types", title: "Сховище та типи даних", durationMinutes: 5,
        summary: "Правила постійного зберігання та спеціальні типи даних у GenLayer.",
        objectives: ["Чому не можна використовувати dict і list безпосередньо", "Правильні типи-замінники"],
        content: [
          { type: "paragraph", text: "У GenLayer суворі правила зберігання. Звичайні Python-словники dict та списки list не зберігаються. Потрібно використовувати TreeMap і DynArray, а також цілочисельні типи фіксованого розміру." },
          { type: "list", items: ["dict → TreeMap[K, V]", "list → DynArray[T]", "int → u256, i32 та інші фіксовані типи"] },
          { type: "callout", title: "Поширена помилка", text: "Поля, створені динамічно під час виконання, не зберігаються. Оголошуйте всі постійні поля в тілі класу заздалегідь." },
        ],
      },
      {
        slug: "read-write-methods", title: "Методи читання та запису", durationMinutes: 5,
        summary: "Різниця та використання декораторів @gl.public.view і @gl.public.write.",
        objectives: ["Різниця між декораторами читання та запису", "Коли використовувати payable"],
        content: [
          { type: "paragraph", text: "@gl.public.view позначає методи лише для читання, що не змінюють стан. @gl.public.write змінює стан. @gl.public.write.payable приймає переводи GEN." },
          { type: "list", items: ["@gl.public.view: лише читання, менше газу", "@gl.public.write: змінює on-chain стан", "@gl.public.write.payable: приймає токени GEN"] },
          { type: "callout", title: "Хороша практика", text: "Спочатку тестуйте логіку з методами лише для читання. Додавайте логіку запису лише після підтвердження." },
        ],
      },
      {
        slug: "llm-integration", title: "Інтеграція з LLM", durationMinutes: 5,
        summary: "Як викликати LLM у контракті та принципи написання гарних промптів.",
        objectives: ["Використання gl.nondet.exec_prompt()", "Найкращі практики prompt engineering"],
        content: [
          { type: "paragraph", text: "gl.nondet.exec_prompt() — основний метод виклику LLM. Якість промпту критична — розмиті промпти дають непослідовні результати у валідаторів, і консенсус не досягається." },
          { type: "list", items: ["Завжди запитуйте відповідь у JSON (response_format='json')", "Уникайте часових міток та динамічних даних", "Порівнюйте висновки AI, а не сирі дані"] },
          { type: "callout", title: "Головна причина збоїв консенсусу", text: "Запит нестабільних даних у LLM призводить до різних результатів у валідаторів. Завжди витягуйте стабільні поля." },
        ],
      },
      {
        slug: "web-data", title: "Доступ до веб-даних", durationMinutes: 5,
        summary: "Отримання та верифікація інтернет-даних прямо в контракті без Oracle.",
        objectives: ["Використання gl.nondet.web.get()", "Особливості доступу до веб-даних"],
        content: [
          { type: "paragraph", text: "GenLayer дозволяє контрактам напряму звертатися до інтернету без Oracle. gl.nondet.web.get(url) отримує текст, gl.nondet.web.render(url) обробляє динамічні сторінки. Все верифікується через еквівалентність у валідаторів." },
          { type: "list", items: ["gl.nondet.web.get(url): сирий текстовий контент", "gl.nondet.web.render(url): JS-рендеровані сторінки", "Витягуйте стабільні поля, уникайте динамічного контенту"] },
          { type: "callout", title: "Порада щодо надійності", text: "Зовнішні сайти можуть бути недоступні або змінити структуру. Отримуйте дані лише з надійних джерел і валідуйте перед збереженням." },
        ],
      },
      {
        slug: "deploy-dapp", title: "Збірка та розгортання DApp", durationMinutes: 5,
        summary: "Повний цикл розробки DApp: від локального тестування до розгортання в Testnet.",
        objectives: ["Триетапний процес розгортання", "Як підключити контракт до фронтенду"],
        content: [
          { type: "paragraph", text: "Розробка DApp у GenLayer відбувається в 3 етапи: локальний прототип у Studio, ретельне тестування з тестовим фреймворком, потім розгортання в Testnet (Asimov/Bradbury) та фронтенд на GenLayerJS." },
          { type: "list", items: ["Етап 1: Локальний прототип у GenLayer Studio", "Етап 2: Тестування з genlayer-test", "Етап 3: Фронтенд GenLayerJS + розгортання в Testnet"] },
          { type: "callout", title: "Чекліст перед запуском", text: "Перед розгортанням у Testnet завершіть тести в прямому режимі та режимі Studio і усуньте всі збої консенсусу." },
        ],
      },
    ],
    questions: [
      { id: "ukraine-q01", prompt: "Як найкраще описати GenLayer?", options: ["Децентралізована система зберігання файлів", "AI-нативний рівень арбітражу для агентної економіки", "Рішення Layer 2 для Ethereum", "Централізована платіжна мережа"], correctOption: 1, explanation: "GenLayer — AI-нативний рівень арбітражу, розроблений для агентної економіки." },
      { id: "ukraine-q02", prompt: "Яку головну проблему вирішує GenLayer?", options: ["Дозволити блокчейну обробляти суб'єктивні рішення, що потребують судження", "Прискорити транзакції Bitcoin", "Замінити всі платформи смарт-контрактів", "Створити нову мову програмування"], correctOption: 0, explanation: "Ключова цінність GenLayer — можливість ухвалення on-chain рішень, що потребують судження та міркувань." },
      { id: "ukraine-q03", prompt: "Що вміють Intelligent Contracts, чого не вміють традиційні смарт-контракти?", options: ["Зберігати статичні файли онлайн", "Лише детерміновані обчислення", "Працювати тільки в Ethereum", "Отримувати живі веб-дані та обробляти виводи AI"], correctOption: 3, explanation: "Intelligent Contracts можуть звертатися до інтернету та викликати LLM — традиційні контракти цього не вміють." },
      { id: "ukraine-q04", prompt: "На якому рівні блокчейну знаходиться GenLayer?", options: ["Layer 0", "Layer 2", "Layer 1", "Layer 3"], correctOption: 2, explanation: "GenLayer — блокчейн Layer 1." },
      { id: "ukraine-q05", prompt: "Що таке Optimistic Democracy?", options: ["Механізм консенсусу, що використовує кілька валідаторів для верифікації результатів", "Система голосування лише для власників токенів", "Спосіб видалення неправильних транзакцій", "Інструмент управління в соцмережах"], correctOption: 0, explanation: "Optimistic Democracy — механізм консенсусу GenLayer, де кілька валідаторів голосують незалежно." },
      { id: "ukraine-q06", prompt: "Скільки GEN потрібно застейкати, щоб стати валідатором?", options: ["4 200 GEN", "42 000 GEN", "420 GEN", "420 000 GEN"], correctOption: 1, explanation: "Щоб стати валідатором, потрібно застейкати 42 000 GEN." },
      { id: "ukraine-q07", prompt: "Що гарантує принцип еквівалентності?", options: ["Всі валідатори отримують однакові винагороди", "Однакова комісія за кожну транзакцію", "Недетерміновані виводи верифікуються узгоджено у всіх валідаторів", "Кожну транзакцію обробляє лише один валідатор"], correctOption: 2, explanation: "Принцип еквівалентності дозволяє безпечно верифікувати недетерміновані виводи у всіх валідаторів." },
      { id: "ukraine-q08", prompt: "Яку мову нативно виконує GenVM?", options: ["Solidity", "Rust", "JavaScript", "Python"], correctOption: 3, explanation: "GenVM нативно запускає Python, що робить розробку Intelligent Contracts більш інтуїтивною." },
      { id: "ukraine-q09", prompt: "Який початковий APY стейкінгу GEN?", options: ["4%", "15%", "50%", "100%"], correctOption: 1, explanation: "Початковий APY — 15%, поступово знижується до 4%." },
      { id: "ukraine-q10", prompt: "Що таке GenLayer Studio?", options: ["Браузерна пісочниця для локального тестування Intelligent Contracts", "Мобільний додаток для торгівлі токенами", "Соціальна мережа для розробників", "Інтерфейс апаратного гаманця"], correctOption: 0, explanation: "GenLayer Studio — браузерний пісочниця, що симулює повну мережу валідаторів." },
      { id: "ukraine-q11", prompt: "Що робить команда genlayer init?", options: ["Створює новий гаманець GEN", "Видаляє всі локальні контракти", "Надсилає транзакцію в тестнет", "Завантажує та запускає GenLayer Studio"], correctOption: 3, explanation: "genlayer init завантажує компоненти та запускає GenLayer Studio локально." },
      { id: "ukraine-q12", prompt: "Від якого класу повинен успадковуватися Intelligent Contract?", options: ["gl.Contract", "SmartContract", "BaseChain", "BlockchainApp"], correctOption: 0, explanation: "Всі Intelligent Contracts повинні успадковуватися від класу gl.Contract." },
      { id: "ukraine-q13", prompt: "Яка структура даних замінює Python dict у сховищі GenLayer?", options: ["HashMap", "OrderedDict", "TreeMap", "ArrayList"], correctOption: 2, explanation: "Для постійного зберігання замість Python dict потрібно використовувати TreeMap[K, V]." },
      { id: "ukraine-q14", prompt: "Який декоратор позначає метод лише для читання?", options: ["@gl.public.write", "@gl.public.view", "@gl.private.read", "@gl.readonly.method"], correctOption: 1, explanation: "@gl.public.view позначає методи лише для читання, що не змінюють стан." },
      { id: "ukraine-q15", prompt: "Який метод виконує промпт LLM у контракті?", options: ["gl.web.fetch()", "gl.contract.ask()", "gl.ai.run()", "gl.nondet.exec_prompt()"], correctOption: 3, explanation: "gl.nondet.exec_prompt() — стандартний метод виклику LLM в Intelligent Contract." },
      { id: "ukraine-q16", prompt: "Який метод отримує веб-контент у реальному часі?", options: ["gl.llm.browse()", "gl.http.get()", "gl.nondet.web.get()", "gl.fetch.url()"], correctOption: 2, explanation: "gl.nondet.web.get() використовується для прямого отримання веб-даних у контракті." },
      { id: "ukraine-q17", prompt: "Яке перше середовище рекомендується для розгортання Intelligent Contract?", options: ["Localnet", "Ethereum Mainnet", "Мережа Bitcoin", "Centralnet"], correctOption: 0, explanation: "Localnet — локальне середовище розробки, найкраща відправна точка для тестування контрактів." },
    ],
  }),

  // ─── VIETNAM ──────────────────────────────────────────────────────────────
  createRegionalTrack({
    slug: "vietnam",
    regionName: "Vietnam",
    nativeRegionName: "Việt Nam",
    languageName: "Vietnamese",
    nativeLanguageName: "Tiếng Việt",
    locale: "vi-VN",
    title: "Khóa học GenLayer Tiếng Việt",
    description: "Học GenLayer bằng tiếng Việt: blockchain AI-native, Intelligent Contracts, cơ chế đồng thuận và phát triển DApp.",
    unityMessage: "Cộng đồng Việt Nam học GenLayer bằng ngôn ngữ của mình và cùng xây dựng hệ sinh thái toàn cầu.",
    certificateTitle: "Chứng chỉ GenLayer Cơ bản Tiếng Việt",
    quizTitle: "Bài kiểm tra GenLayer Tiếng Việt",
    lessons: [
      {
        slug: "what-is-genlayer", title: "GenLayer là gì?", durationMinutes: 5,
        summary: "Tìm hiểu bản sắc cốt lõi của GenLayer — lớp phân xử AI-native cho nền kinh tế tác nhân.",
        objectives: ["Hiểu GenLayer là gì", "Biết sự khác biệt với Bitcoin và Ethereum"],
        content: [
          { type: "paragraph", text: "GenLayer là một blockchain AI-native được thiết kế cho các tình huống đòi hỏi phán đoán và suy luận. Bitcoin xử lý giao dịch, Ethereum thực thi code, GenLayer hiểu ý nghĩa của các quyết định." },
          { type: "list", items: ["Vị trí: lớp phân xử cho nền kinh tế tác nhân", "Xác minh on-chain đáng tin cậy cho các câu hỏi chủ quan", "Các validator AI đạt được sự đồng thuận"] },
          { type: "callout", title: "Nói đơn giản", text: "Khi câu trả lời không chỉ là có hay không mà cần phán đoán — đó là lúc GenLayer phát huy tác dụng." },
        ],
      },
      {
        slug: "problem-genlayer-solves", title: "GenLayer giải quyết vấn đề gì?", durationMinutes: 5,
        summary: "Hiểu tại sao blockchain truyền thống không thể xử lý các quyết định chủ quan.",
        objectives: ["Nhận biết giới hạn của blockchain hiện tại", "Hiểu giá trị độc đáo của GenLayer"],
        content: [
          { type: "paragraph", text: "Bitcoin và Ethereum giỏi các tác vụ xác định, nhưng không thể xử lý các vấn đề cần phán đoán hay suy luận AI. Đánh giá nội dung, giải quyết tranh chấp, xác minh cột mốc — đó là những gì GenLayer làm được." },
          { type: "list", items: ["Hợp đồng truyền thống: chỉ logic cố định", "GenLayer: xử lý kết quả chủ quan và mơ hồ", "Lấp đầy khoảng trống quan trọng trong công nghệ blockchain"] },
          { type: "callout", title: "Điểm khác biệt then chốt", text: "Ethereum hỏi 'code có chạy không?' GenLayer hỏi 'kết quả có đúng không?'" },
        ],
      },
      {
        slug: "intelligent-contracts", title: "Intelligent Contracts vs Hợp đồng thông minh", durationMinutes: 5,
        summary: "Khám phá những năng lực bổ sung mà Intelligent Contracts của GenLayer có.",
        objectives: ["Xác định các tính năng độc đáo của Intelligent Contracts", "Hiểu tại sao dùng Python"],
        content: [
          { type: "paragraph", text: "Hợp đồng thông minh truyền thống chỉ thực thi logic cố định. Intelligent Contracts của GenLayer có thể truy cập dữ liệu web theo thời gian thực, gọi LLM và được viết bằng Python — trực quan và mạnh mẽ hơn." },
          { type: "list", items: ["Truy cập dữ liệu internet trực tiếp không cần Oracle", "Gọi LLM (như GPT-4) để thực hiện suy luận AI", "Viết bằng Python — quen thuộc và mạnh mẽ"] },
          { type: "callout", title: "Ví dụ so sánh", text: "Hợp đồng truyền thống là máy tính. Intelligent Contract là trợ lý có khả năng suy luận." },
        ],
      },
      {
        slug: "blockchain-stack", title: "Vị trí của GenLayer trong kiến trúc blockchain", durationMinutes: 5,
        summary: "GenLayer là Layer 1 và cách nó hoạt động cùng Ethereum.",
        objectives: ["Hiểu các lớp blockchain", "Biết GenLayer thuộc lớp nào"],
        content: [
          { type: "paragraph", text: "GenLayer là blockchain Layer 1 tích hợp với Ethereum qua các rollup như ZKSync, đồng thời tự quản lý cơ chế đồng thuận AI-native. Nó không cạnh tranh với Ethereum mà là một lớp mới chuyên về phân xử AI." },
          { type: "list", items: ["Bitcoin: đồng thuận về thứ tự giao dịch", "Ethereum: đồng thuận về thực thi code", "GenLayer: đồng thuận về ý nghĩa quyết định"] },
          { type: "callout", title: "Vị thế", text: "GenLayer bổ sung cho Ethereum, không cạnh tranh với nó." },
        ],
      },
      {
        slug: "optimistic-democracy", title: "Dân chủ Lạc quan", durationMinutes: 5,
        summary: "Tìm hiểu cách GenLayer đạt đồng thuận bằng nhiều validator.",
        objectives: ["Hiểu bốn giai đoạn đồng thuận", "Tại sao nhiều validator đáng tin cậy hơn"],
        content: [
          { type: "paragraph", text: "Optimistic Democracy yêu cầu nhiều validator thực thi hợp đồng độc lập và bỏ phiếu. Dựa trên Định lý Bồi thẩm đoàn Condorcet: một nhóm phán xét độc lập có xác suất đạt kết quả đúng cao hơn." },
          { type: "list", items: ["4 giai đoạn: Đề xuất → Cam kết → Tiết lộ → Chấp nhận", "Bất kỳ ai cũng có thể kháng cáo kết quả", "Kết quả cuối cùng không thể đảo ngược"] },
          { type: "callout", title: "Ý tưởng cốt lõi", text: "Phán đoán tập thể độc lập đáng tin cậy hơn một nút đơn lẻ." },
        ],
      },
      {
        slug: "validators-staking", title: "Validator và Staking", durationMinutes: 5,
        summary: "Vai trò của validator, cách stake GEN và cơ chế phần thưởng.",
        objectives: ["Hiểu trách nhiệm của validator", "Biết cần bao nhiêu GEN để stake"],
        content: [
          { type: "paragraph", text: "Validator stake GEN, vận hành node và tham gia Optimistic Democracy để kiếm phần thưởng. Không có 42.000 GEN? Bạn có thể tham gia với tư cách delegator." },
          { type: "list", items: ["Trở thành validator: stake 42.000 GEN", "Delegator: tối thiểu 42 GEN để tham gia", "Validator nhận 10% phí vận hành + phần thưởng staking"] },
          { type: "callout", title: "Hai cách tham gia", text: "Stake lớn: trở thành validator. Stake nhỏ: ủy quyền. Cả hai đều sinh lời." },
        ],
      },
      {
        slug: "equivalence-principle", title: "Nguyên tắc Tương đương", durationMinutes: 5,
        summary: "GenLayer xử lý an toàn các kết quả không xác định như đầu ra AI như thế nào.",
        objectives: ["Hiểu mục đích của Nguyên tắc Tương đương", "Biết hai phương pháp xác minh"],
        content: [
          { type: "paragraph", text: "Các validator khác nhau chạy cùng một truy vấn AI có thể nhận kết quả hơi khác nhau. Nguyên tắc Tương đương xác định khi nào kết quả 'đủ giống nhau', giúp tính không xác định có thể quản lý được trên blockchain." },
          { type: "list", items: ["strict_eq(): tất cả validator phải có kết quả giống hệt nhau", "prompt_non_comparative(): validator đánh giá xem tiêu chí có được đáp ứng không", "Nhà phát triển định nghĩa thế nào là 'tương đương'"] },
          { type: "callout", title: "Điểm mấu chốt", text: "AI có thể trả lời hơi khác nhau mỗi lần — Nguyên tắc Tương đương làm cho điều này an toàn trên blockchain." },
        ],
      },
      {
        slug: "genvm", title: "GenVM: Môi trường thực thi", durationMinutes: 5,
        summary: "GenVM chạy Python trên blockchain và hỗ trợ tích hợp AI như thế nào.",
        objectives: ["Sự khác biệt giữa GenVM và EVM", "Nền tảng kỹ thuật của GenVM"],
        content: [
          { type: "paragraph", text: "GenVM là môi trường thực thi của Intelligent Contracts. Được xây dựng trên WebAssembly, chạy Python theo cách gốc và có thể tương tác trực tiếp với LLM và dữ liệu web — điều EVM không làm được." },
          { type: "list", items: ["Dựa trên WebAssembly, thực thi nhanh", "Chạy Python theo cách gốc (không phải Solidity)", "Hỗ trợ sẵn có cho gọi LLM và truy cập internet"] },
          { type: "callout", title: "Sự khác biệt căn bản", text: "EVM được thiết kế cho code xác định. GenVM xử lý tính không xác định — đây là đổi mới kiến trúc cơ bản." },
        ],
      },
      {
        slug: "gen-token", title: "Token GEN và Kinh tế", durationMinutes: 5,
        summary: "Tìm hiểu về tiện ích của token GEN, cơ cấu phần thưởng staking và cơ chế kháng cáo.",
        objectives: ["Chức năng của token GEN", "Phân phối phần thưởng"],
        content: [
          { type: "paragraph", text: "GEN là token gốc của mạng, dùng cho staking, gas và quản trị. APY staking ban đầu là 15%, giảm dần xuống 4% để đảm bảo bền vững lâu dài." },
          { type: "list", items: ["APY ban đầu 15%, giảm dần xuống 4%", "75% phần thưởng cho tất cả staker", "10% cho validator, 15% cho nhà phát triển"] },
          { type: "callout", title: "Cơ chế kháng cáo", text: "Không đồng ý với kết quả? Stake GEN để kháng cáo và một nhóm validator lớn hơn sẽ đánh giá lại." },
        ],
      },
      {
        slug: "genlayer-studio", title: "GenLayer Studio", durationMinutes: 5,
        summary: "Sandbox trên trình duyệt để kiểm tra Intelligent Contracts mà không cần cài đặt.",
        objectives: ["Studio là gì", "Các tính năng chính"],
        content: [
          { type: "paragraph", text: "GenLayer Studio là sandbox trên trình duyệt không cần cài đặt để kiểm tra Intelligent Contracts. Mô phỏng toàn bộ mạng validator với log thời gian thực và phản hồi lỗi." },
          { type: "list", items: ["Trực tiếp trên trình duyệt, không cần cài đặt", "Mô phỏng đồng thuận đa validator", "Log chi tiết và hỗ trợ debug"] },
          { type: "callout", title: "Bắt đầu ngay", text: "Truy cập studio.genlayer.com hoặc chạy genlayer init để khởi động Studio trên máy tính của bạn." },
        ],
      },
      {
        slug: "cli-sdks", title: "CLI và SDK", durationMinutes: 5,
        summary: "Công cụ dành cho nhà phát triển: genlayer CLI, GenLayerJS và GenLayerPY.",
        objectives: ["Cách cài đặt CLI", "Trường hợp sử dụng của hai SDK"],
        content: [
          { type: "paragraph", text: "GenLayer cung cấp bộ công cụ đầy đủ: CLI để khởi động nhanh, GenLayerJS cho DApp frontend, GenLayerPY cho tích hợp backend Python." },
          { type: "list", items: ["npm install -g genlayer, sau đó genlayer init", "GenLayerJS: TypeScript, dành cho phát triển frontend", "GenLayerPY: Python 3.12+, dành cho backend"] },
          { type: "callout", title: "Mẹo cho người mới", text: "Trước tiên chạy genlayer init, khám phá các hợp đồng mẫu trong Studio, sau đó bắt đầu viết code." },
        ],
      },
      {
        slug: "first-contract", title: "Intelligent Contract đầu tiên của bạn", durationMinutes: 5,
        summary: "Cấu trúc cơ bản của Intelligent Contract: class, khởi tạo và decorator.",
        objectives: ["Hiểu cấu trúc cơ bản của hợp đồng", "Cách khai báo biến trạng thái"],
        content: [
          { type: "paragraph", text: "Mỗi Intelligent Contract là một class Python kế thừa từ gl.Contract. Biến trạng thái được khai báo trong thân class, các phương thức được gắn decorator để chỉ định quyền đọc hoặc ghi." },
          { type: "code", language: "python", code: "import gl\n\nclass Counter(gl.Contract):\n    count: gl.u256\n\n    def __init__(self):\n        self.count = 0\n\n    @gl.public.view\n    def get(self) -> int:\n        return self.count\n\n    @gl.public.write\n    def increment(self):\n        self.count += 1" },
          { type: "callout", title: "Ghi nhớ", text: "Tất cả các trường liên tục phải được khai báo trong thân class với chú thích kiểu. Không thể tạo động chúng trong thời gian chạy." },
        ],
      },
      {
        slug: "storage-types", title: "Lưu trữ và Kiểu dữ liệu", durationMinutes: 5,
        summary: "Quy tắc lưu trữ liên tục và các kiểu dữ liệu đặc biệt trong GenLayer.",
        objectives: ["Tại sao không thể dùng dict và list trực tiếp", "Các kiểu thay thế đúng"],
        content: [
          { type: "paragraph", text: "GenLayer có quy tắc lưu trữ nghiêm ngặt. Dict và list Python thông thường sẽ không được lưu trữ liên tục. Bạn phải dùng TreeMap và DynArray cùng với các kiểu số nguyên kích thước cố định." },
          { type: "list", items: ["dict → TreeMap[K, V]", "list → DynArray[T]", "int → u256, i32 và các kiểu cố định khác"] },
          { type: "callout", title: "Lỗi phổ biến", text: "Các trường tạo động trong thời gian chạy sẽ không được lưu. Hãy khai báo tất cả trường liên tục trong thân class từ đầu." },
        ],
      },
      {
        slug: "read-write-methods", title: "Phương thức Đọc và Ghi", durationMinutes: 5,
        summary: "Sự khác biệt và cách dùng decorator @gl.public.view và @gl.public.write.",
        objectives: ["Sự khác biệt giữa decorator đọc và ghi", "Khi nào dùng payable"],
        content: [
          { type: "paragraph", text: "@gl.public.view đánh dấu các phương thức chỉ đọc không thay đổi trạng thái. @gl.public.write thay đổi trạng thái. @gl.public.write.payable nhận chuyển khoản GEN." },
          { type: "list", items: ["@gl.public.view: chỉ đọc, chi phí gas thấp hơn", "@gl.public.write: thay đổi trạng thái on-chain", "@gl.public.write.payable: nhận token GEN"] },
          { type: "callout", title: "Thực hành tốt", text: "Trước tiên kiểm tra logic với các phương thức chỉ đọc. Chỉ thêm logic ghi sau khi đã xác nhận đúng." },
        ],
      },
      {
        slug: "llm-integration", title: "Tích hợp LLM", durationMinutes: 5,
        summary: "Cách gọi LLM trong hợp đồng và các nguyên tắc viết prompt tốt.",
        objectives: ["Dùng gl.nondet.exec_prompt()", "Các thực hành tốt nhất về prompt engineering"],
        content: [
          { type: "paragraph", text: "gl.nondet.exec_prompt() là phương thức chính để gọi LLM. Chất lượng prompt rất quan trọng — prompt mơ hồ tạo ra kết quả không nhất quán giữa các validator và đồng thuận thất bại." },
          { type: "list", items: ["Luôn yêu cầu phản hồi JSON (response_format='json')", "Tránh timestamp hoặc dữ liệu động", "So sánh kết luận do AI rút ra, không phải dữ liệu thô"] },
          { type: "callout", title: "Nguyên nhân chính gây thất bại đồng thuận", text: "Yêu cầu LLM trả về dữ liệu không ổn định khiến các validator nhận kết quả khác nhau. Luôn trích xuất các trường ổn định." },
        ],
      },
      {
        slug: "web-data", title: "Truy cập Dữ liệu Web", durationMinutes: 5,
        summary: "Lấy và xác minh dữ liệu internet trực tiếp trong hợp đồng mà không cần Oracle.",
        objectives: ["Dùng gl.nondet.web.get()", "Các lưu ý khi truy cập dữ liệu web"],
        content: [
          { type: "paragraph", text: "GenLayer cho phép hợp đồng truy cập internet trực tiếp mà không cần Oracle. gl.nondet.web.get(url) lấy text, gl.nondet.web.render(url) xử lý các trang động. Tất cả được xác minh bằng tính tương đương giữa các validator." },
          { type: "list", items: ["gl.nondet.web.get(url): nội dung văn bản thô", "gl.nondet.web.render(url): trang được render bằng JS", "Trích xuất các trường ổn định, tránh nội dung động"] },
          { type: "callout", title: "Mẹo về độ tin cậy", text: "Các trang web bên ngoài có thể bị down hoặc thay đổi cấu trúc. Chỉ lấy dữ liệu từ các nguồn đáng tin cậy và xác thực trước khi lưu." },
        ],
      },
      {
        slug: "deploy-dapp", title: "Xây dựng và Triển khai DApp", durationMinutes: 5,
        summary: "Quy trình phát triển DApp đầy đủ từ kiểm tra cục bộ đến triển khai Testnet.",
        objectives: ["Quy trình triển khai 3 giai đoạn", "Cách kết nối hợp đồng với frontend"],
        content: [
          { type: "paragraph", text: "Phát triển DApp trên GenLayer qua 3 giai đoạn: tạo nguyên mẫu cục bộ trong Studio, kiểm tra kỹ lưỡng với framework testing, sau đó triển khai lên Testnet (Asimov/Bradbury) và xây dựng frontend với GenLayerJS." },
          { type: "list", items: ["Giai đoạn 1: Nguyên mẫu cục bộ trong GenLayer Studio", "Giai đoạn 2: Kiểm tra với genlayer-test", "Giai đoạn 3: Frontend GenLayerJS + triển khai Testnet"] },
          { type: "callout", title: "Danh sách kiểm tra trước khi ra mắt", text: "Trước khi triển khai lên Testnet, hoàn thành kiểm tra ở chế độ trực tiếp và Studio, xử lý tất cả các lỗi đồng thuận." },
        ],
      },
    ],
    questions: [
      { id: "vietnam-q01", prompt: "Mô tả nào chính xác nhất về GenLayer?", options: ["Hệ thống lưu trữ tệp phi tập trung", "Lớp phân xử AI-native cho nền kinh tế tác nhân", "Giải pháp Layer 2 cho Ethereum", "Mạng thanh toán tập trung"], correctOption: 1, explanation: "GenLayer là lớp phân xử AI-native được thiết kế cho nền kinh tế tác nhân." },
      { id: "vietnam-q02", prompt: "GenLayer chủ yếu giải quyết vấn đề gì?", options: ["Cho phép blockchain xử lý các quyết định chủ quan dựa trên phán đoán", "Tăng tốc giao dịch Bitcoin", "Thay thế tất cả nền tảng hợp đồng thông minh", "Tạo ngôn ngữ lập trình mới"], correctOption: 0, explanation: "Giá trị cốt lõi của GenLayer là cho phép các quyết định on-chain đòi hỏi phán đoán và suy luận." },
      { id: "vietnam-q03", prompt: "Intelligent Contracts có thể làm gì mà hợp đồng thông minh truyền thống không thể?", options: ["Lưu trữ tệp tĩnh on-chain", "Chỉ các tính toán xác định", "Chỉ chạy trên Ethereum", "Truy cập dữ liệu web trực tiếp và xử lý đầu ra AI"], correctOption: 3, explanation: "Intelligent Contracts có thể truy cập internet và gọi LLM — điều mà hợp đồng truyền thống không làm được." },
      { id: "vietnam-q04", prompt: "GenLayer thuộc lớp nào trong kiến trúc blockchain?", options: ["Layer 0", "Layer 2", "Layer 1", "Layer 3"], correctOption: 2, explanation: "GenLayer là blockchain Layer 1." },
      { id: "vietnam-q05", prompt: "Optimistic Democracy là gì?", options: ["Cơ chế đồng thuận dùng nhiều validator để xác minh kết quả", "Hệ thống bỏ phiếu chỉ dành cho người nắm giữ token", "Cách xóa các giao dịch sai", "Công cụ quản trị mạng xã hội"], correctOption: 0, explanation: "Optimistic Democracy là cơ chế đồng thuận của GenLayer nơi nhiều validator bỏ phiếu độc lập." },
      { id: "vietnam-q06", prompt: "Cần stake bao nhiêu GEN để trở thành validator?", options: ["4.200 GEN", "42.000 GEN", "420 GEN", "420.000 GEN"], correctOption: 1, explanation: "Cần stake 42.000 GEN để trở thành validator." },
      { id: "vietnam-q07", prompt: "Nguyên tắc Tương đương đảm bảo điều gì?", options: ["Tất cả validator nhận phần thưởng bằng nhau", "Mọi giao dịch có cùng phí", "Đầu ra không xác định được xác minh nhất quán trên tất cả validator", "Mỗi giao dịch chỉ được xử lý bởi một validator"], correctOption: 2, explanation: "Nguyên tắc Tương đương cho phép các đầu ra không xác định được xác minh an toàn trên tất cả validator." },
      { id: "vietnam-q08", prompt: "GenVM chạy ngôn ngữ nào theo cách gốc?", options: ["Solidity", "Rust", "JavaScript", "Python"], correctOption: 3, explanation: "GenVM chạy Python theo cách gốc, giúp phát triển Intelligent Contract trực quan hơn." },
      { id: "vietnam-q09", prompt: "APY staking GEN ban đầu là bao nhiêu?", options: ["4%", "15%", "50%", "100%"], correctOption: 1, explanation: "APY ban đầu là 15%, giảm dần xuống 4%." },
      { id: "vietnam-q10", prompt: "GenLayer Studio là gì?", options: ["Sandbox trên trình duyệt để kiểm tra Intelligent Contracts cục bộ", "Ứng dụng di động giao dịch token", "Mạng xã hội dành cho nhà phát triển", "Giao diện ví phần cứng"], correctOption: 0, explanation: "GenLayer Studio là sandbox trên trình duyệt mô phỏng toàn bộ mạng validator." },
      { id: "vietnam-q11", prompt: "Lệnh genlayer init làm gì?", options: ["Tạo ví GEN mới", "Xóa tất cả hợp đồng cục bộ", "Gửi giao dịch lên testnet", "Tải xuống và khởi động GenLayer Studio"], correctOption: 3, explanation: "genlayer init tải xuống các thành phần và khởi động GenLayer Studio cục bộ." },
      { id: "vietnam-q12", prompt: "Intelligent Contract phải kế thừa class nào?", options: ["gl.Contract", "SmartContract", "BaseChain", "BlockchainApp"], correctOption: 0, explanation: "Tất cả Intelligent Contracts phải kế thừa class gl.Contract." },
      { id: "vietnam-q13", prompt: "Cấu trúc dữ liệu nào thay thế dict Python trong lưu trữ GenLayer?", options: ["HashMap", "OrderedDict", "TreeMap", "ArrayList"], correctOption: 2, explanation: "Phải dùng TreeMap[K, V] thay cho dict Python để lưu trữ liên tục." },
      { id: "vietnam-q14", prompt: "Decorator nào đánh dấu phương thức chỉ đọc?", options: ["@gl.public.write", "@gl.public.view", "@gl.private.read", "@gl.readonly.method"], correctOption: 1, explanation: "@gl.public.view đánh dấu các phương thức chỉ đọc không thay đổi trạng thái." },
      { id: "vietnam-q15", prompt: "Phương thức nào thực thi prompt LLM trong hợp đồng?", options: ["gl.web.fetch()", "gl.contract.ask()", "gl.ai.run()", "gl.nondet.exec_prompt()"], correctOption: 3, explanation: "gl.nondet.exec_prompt() là phương thức chuẩn để gọi LLM trong Intelligent Contract." },
      { id: "vietnam-q16", prompt: "Phương thức nào lấy nội dung web theo thời gian thực?", options: ["gl.llm.browse()", "gl.http.get()", "gl.nondet.web.get()", "gl.fetch.url()"], correctOption: 2, explanation: "gl.nondet.web.get() được dùng để lấy dữ liệu web trực tiếp trong hợp đồng." },
      { id: "vietnam-q17", prompt: "Môi trường đầu tiên được khuyến nghị để triển khai Intelligent Contract là gì?", options: ["Localnet", "Ethereum Mainnet", "Mạng Bitcoin", "Centralnet"], correctOption: 0, explanation: "Localnet là môi trường phát triển cục bộ — điểm khởi đầu tốt nhất để kiểm tra hợp đồng." },
    ],
  }),

];

export function getRegionalTrack(slug: string): RegionalTrack | undefined {
  return regionalTracks.find((t) => t.slug === slug);
}

export function isRegionSlug(slug: string): slug is RegionalTrack["slug"] {
  return regionalTracks.some((t) => t.slug === slug);
}

