import type { CommunitySpotlight, Course, Lesson, WeeklySummary } from "./types";

const foundationsLessons: Lesson[] = [
  {
    slug: "what-is-genlayer",
    title: "What is GenLayer?",
    durationMinutes: 12,
    summary: "A practical introduction to GenLayer, AI validators, and trustless decision-making.",
    objectives: [
      "Describe GenLayer as an AI-native Layer 1.",
      "Explain why subjective decisions matter on-chain.",
      "Identify what makes Intelligent Contracts different from ordinary smart contracts.",
    ],
    content: [
      { type: "heading", text: "The short version" },
      { type: "paragraph", text: "GenLayer is a blockchain designed for applications where the answer is not always a simple deterministic calculation. Instead of only asking whether a transaction follows fixed rules, GenLayer can help contracts reason over richer context." },
      { type: "paragraph", text: "That matters for education, reputation, moderation, prediction, evaluation, and other workflows where the real world is messy. GenLayer School uses that idea as its teaching base: learn the concepts, practice the builder workflow, and eventually issue credentials through Intelligent Contracts." },
      { type: "heading", text: "Why this matters" },
      { type: "list", items: [
        "Traditional smart contracts are strong at deterministic rules.",
        "Many useful internet workflows need context and judgment.",
        "GenLayer brings AI-powered validation into the contract execution model.",
      ] },
      { type: "callout", title: "Community lens", text: "For learners, the important question is not only how GenLayer works, but what it makes possible for communities that need trust, shared records, and transparent decisions." },
    ],
  },
  {
    slug: "intelligent-contracts",
    title: "Intelligent Contracts in Python",
    durationMinutes: 18,
    summary: "Learn the basic structure of a GenLayer Intelligent Contract and where Python fits.",
    objectives: [
      "Recognize the shape of a Python Intelligent Contract.",
      "Understand public read and write methods.",
      "Connect contract methods to learning and certificate flows.",
    ],
    content: [
      { type: "heading", text: "Contracts that can reason" },
      { type: "paragraph", text: "Intelligent Contracts are written in Python. A contract can expose public methods for reading state, writing state, and coordinating application logic." },
      { type: "paragraph", text: "For GenLayer School, this means a certificate contract can eventually verify eligibility, issue an achievement, and give learners a public record of completion without placing private learner data directly on-chain." },
      { type: "code", language: "python", code: "from genlayer import *\n\nclass CertificateIssuer(gl.Contract):\n    owner: Address\n\n    def __init__(self):\n        self.owner = gl.message.sender_address\n\n    @gl.public.view\n    def issuer(self) -> Address:\n        return self.owner" },
      { type: "callout", title: "Builder habit", text: "Start with the smallest useful contract. Model the product behavior first, then add on-chain actions where they create real value." },
    ],
  },
  {
    slug: "optimistic-democracy",
    title: "Optimistic Democracy",
    durationMinutes: 15,
    summary: "A beginner-friendly look at how GenLayer reaches consensus over subjective outputs.",
    objectives: [
      "Explain subjective validation in plain language.",
      "Describe why multiple validators matter.",
      "Recognize when a product should use AI-native contract logic.",
    ],
    content: [
      { type: "heading", text: "A way to validate judgment" },
      { type: "paragraph", text: "Some outputs cannot be checked with a simple equation. A quiz answer, a moderation decision, a grant review, or a learning credential may require judgment." },
      { type: "paragraph", text: "Optimistic Democracy is GenLayer's approach to reaching agreement over these kinds of outputs. The exact mechanics can get deep, but the beginner idea is simple: subjective decisions can be validated through a structured network process instead of one centralized authority." },
      { type: "list", items: [
        "Use deterministic logic when the answer is mechanical.",
        "Use AI-native validation when context and reasoning matter.",
        "Keep private data off-chain and publish only what needs public verification.",
      ] },
    ],
  },
];

const builderLessons: Lesson[] = [
  {
    slug: "first-contract",
    title: "Your First Intelligent Contract",
    durationMinutes: 24,
    summary: "Build a simple contract shape using the GenLayer Python contract model.",
    objectives: [
      "Set up the basic class shape.",
      "Separate read methods from write methods.",
      "Plan a certificate issuer contract safely.",
    ],
    content: [
      { type: "heading", text: "Start small" },
      { type: "paragraph", text: "A first contract should be intentionally small. In GenLayer School, the first useful contract is a certificate issuer that tracks whether a learner has received a credential." },
      { type: "code", language: "python", code: "@gl.public.view\ndef has_certificate(self, learner_id: str) -> bool:\n    return self.issued.get(learner_id, False)\n\n@gl.public.write\ndef issue_certificate(self, learner_id: str):\n    assert gl.message.sender_address == self.owner\n    self.issued[learner_id] = True" },
      { type: "callout", title: "Safety note", text: "The product should calculate eligibility off-chain first. The contract should receive only the minimum information needed for public certification." },
    ],
  },
  {
    slug: "frontend-integration",
    title: "Frontend Integration with GenLayerJS",
    durationMinutes: 22,
    summary: "Map user actions to contract reads, writes, and transaction states.",
    objectives: [
      "Understand why contract calls need a wrapper.",
      "Plan wallet connection states.",
      "Map certificate minting to UI feedback.",
    ],
    content: [
      { type: "heading", text: "Keep contract calls out of components" },
      { type: "paragraph", text: "The frontend should not scatter contract calls across every button and page. GenLayer School uses a shared SDK package so contract reads, writes, errors, and transaction states can be handled consistently." },
      { type: "code", language: "ts", code: "export async function mintCertificate(input: MintCertificateInput) {\n  // Later: call GenLayerJS with the configured certificate contract.\n  return { status: 'planned', certificateSlug: input.certificateSlug };\n}" },
      { type: "list", items: [
        "Show when a wallet is disconnected.",
        "Show when a transaction is pending.",
        "Show the certificate and explorer link after success.",
      ] },
    ],
  },
];

export const courses: Course[] = [
  {
    slug: "genlayer-foundations",
    title: "GenLayer Foundations",
    level: "Beginner",
    description: "Understand GenLayer as an AI-native blockchain and learn why Intelligent Contracts unlock subjective on-chain decisions.",
    outcomes: [
      "Explain what makes GenLayer different from traditional smart contract platforms.",
      "Describe Optimistic Democracy at a high level.",
      "Identify practical use cases for Intelligent Contracts.",
    ],
    lessons: foundationsLessons,
    quiz: {
      slug: "genlayer-foundations-checkpoint",
      title: "GenLayer Foundations Checkpoint",
      passPercent: 70,
      questions: [
        {
          id: "foundations-q1",
          prompt: "What is the main developer language for GenLayer Intelligent Contracts?",
          options: ["Python", "Solidity", "Cairo", "Move"],
          correctOption: 0,
          explanation: "GenLayer Intelligent Contracts are authored in Python using the GenLayer contract model.",
        },
        {
          id: "foundations-q2",
          prompt: "Why is GenLayer useful for education credentials and grading?",
          options: ["It only stores static files", "It can support subjective, context-aware verification", "It replaces all databases", "It requires no validation"],
          correctOption: 1,
          explanation: "GenLayer's AI-native validation model is a strong fit for subjective evaluation and credential logic.",
        },
        {
          id: "foundations-q3",
          prompt: "What should GenLayer School keep off-chain first?",
          options: ["Sensitive learner data", "Public certificate hashes only", "Contract source code only", "Explorer links only"],
          correctOption: 0,
          explanation: "Sensitive learner data belongs off-chain, with certificates and achievements selectively mirrored on-chain.",
        },
      ],
    },
  },
  {
    slug: "builder-track",
    title: "Builder Track",
    level: "Intermediate",
    description: "Move from concepts to implementation with contract templates, GenLayerJS wrappers, and testnet workflows.",
    outcomes: [
      "Read and write basic Intelligent Contract methods.",
      "Plan a GenLayerJS integration from the frontend.",
      "Prepare a certificate or achievement contract flow.",
    ],
    lessons: builderLessons,
    quiz: {
      slug: "builder-track-checkpoint",
      title: "Builder Track Checkpoint",
      passPercent: 70,
      questions: [
        {
          id: "builder-q1",
          prompt: "Why should the frontend use a shared GenLayer SDK wrapper?",
          options: ["To avoid any contracts", "To centralize wallet, contract, and transaction behavior", "To remove TypeScript", "To store passwords"],
          correctOption: 1,
          explanation: "A wrapper keeps GenLayer interaction consistent and easier to test across the app.",
        },
        {
          id: "builder-q2",
          prompt: "What is the safest first certificate implementation path?",
          options: ["Mint everything immediately", "Model eligibility first, then connect minting", "Ignore completion state", "Store private data on-chain"],
          correctOption: 1,
          explanation: "Eligibility should be modeled and tested before connecting on-chain minting.",
        },
      ],
    },
  },
];

export const communitySpotlights: CommunitySpotlight[] = [
  {
    slug: "may-2026-community-spotlight",
    month: "May 2026",
    title: "Community Builders Opening the GenLayer Classroom",
    featuredBuilder: "GenLayer community educators",
    featuredProject: "GenLayer School",
    highlights: [
      {
        title: "Builder learning loops",
        description: "Spotlight practical walkthroughs, shared notes, and examples that help new developers understand Intelligent Contracts.",
      },
      {
        title: "Project watchlist",
        description: "Track experiments using AI-native contracts, web-aware verification, and subjective grading flows.",
      },
      {
        title: "Community wins",
        description: "Capture public launches, tutorials, talks, and demos from the GenLayer ecosystem.",
      },
    ],
    content: [
      { type: "heading", text: "Why spotlight the community?" },
      { type: "paragraph", text: "A healthy ecosystem needs more than documentation. It needs visible builders, recurring rituals, project memory, and a place where newcomers can see what is happening right now." },
      { type: "paragraph", text: "The monthly spotlight is GenLayer School's place to preserve that momentum: who is teaching, who is building, what shipped, what people should study, and which community wins deserve a permanent note." },
      { type: "callout", title: "Editorial direction", text: "Spotlights should be useful, not hype-only. Each issue should give readers links, lessons, and names they can follow." },
    ],
  },
];

export const weeklySummaries: WeeklySummary[] = [
  {
    slug: "week-1-gen-fren-prep",
    weekOf: "2026-05-04",
    title: "Gen-Fren Weekly Prep: Intelligent Contracts Basics",
    summary: "This week focuses on the core idea behind GenLayer: Python contracts that can reason over subjective inputs with AI-powered validators.",
    keyConcepts: [
      "Intelligent Contracts are written in Python.",
      "Public methods are exposed with GenLayer decorators.",
      "GenLayer is designed for subjective decisions and web-aware contract logic.",
    ],
    links: [
      {
        title: "GenLayer Docs",
        description: "Start with the developer documentation for Intelligent Contracts and GenLayerJS.",
        url: "https://docs.genlayer.com/",
      },
      {
        title: "GenLayer Studio",
        description: "Use Studio to explore and test contract ideas in the browser.",
        url: "https://studio.genlayer.com/contracts",
      },
    ],
    content: [
      { type: "heading", text: "This week's focus" },
      { type: "paragraph", text: "For Gen-Fren quiz prep, start with the vocabulary. Know what GenLayer is, what Intelligent Contracts are, and why Python matters." },
      { type: "list", items: [
        "GenLayer is an AI-native L1.",
        "Intelligent Contracts use Python.",
        "Subjective validation is the key mental model.",
      ] },
      { type: "callout", title: "Prep habit", text: "After reading the summary, answer the quiz without checking notes. Then read the explanations for any missed question." },
    ],
    quiz: {
      slug: "week-1-gen-fren-prep-quiz",
      title: "Week 1 Gen-Fren Prep Quiz",
      passPercent: 70,
      questions: [
        {
          id: "q1",
          prompt: "What language are GenLayer Intelligent Contracts written in?",
          options: ["Solidity", "Python", "Rust", "Move"],
          correctOption: 1,
          explanation: "GenLayer Intelligent Contracts are Python classes that use the GenLayer contract model.",
        },
        {
          id: "q2",
          prompt: "What kind of decisions is GenLayer especially designed to support?",
          options: ["Only deterministic arithmetic", "Subjective and context-aware decisions", "Static token transfers only", "Database migrations"],
          correctOption: 1,
          explanation: "GenLayer brings AI-powered validation to subjective, context-rich contract execution.",
        },
      ],
    },
  },
];

export function getCourse(slug: string) {
  return courses.find((course) => course.slug === slug) ?? null;
}

export function getLesson(courseSlug: string, lessonSlug: string) {
  const course = getCourse(courseSlug);
  const lesson = course?.lessons.find((item) => item.slug === lessonSlug) ?? null;
  return course && lesson ? { course, lesson } : null;
}

export function getWeeklySummary(slug: string) {
  return weeklySummaries.find((summary) => summary.slug === slug) ?? null;
}

export function getCommunitySpotlight(slug: string) {
  return communitySpotlights.find((spotlight) => spotlight.slug === slug) ?? null;
}
