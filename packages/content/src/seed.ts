import type { CommunitySpotlight, Course, WeeklySummary } from "./types";

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
    lessons: [
      {
        slug: "what-is-genlayer",
        title: "What is GenLayer?",
        durationMinutes: 12,
        summary: "A practical introduction to GenLayer, AI validators, and trustless decision-making.",
      },
      {
        slug: "intelligent-contracts",
        title: "Intelligent Contracts in Python",
        durationMinutes: 18,
        summary: "Learn the basic structure of a GenLayer Intelligent Contract and where Python fits.",
      },
      {
        slug: "optimistic-democracy",
        title: "Optimistic Democracy",
        durationMinutes: 15,
        summary: "A beginner-friendly look at how GenLayer reaches consensus over subjective outputs.",
      },
    ],
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
    lessons: [
      {
        slug: "first-contract",
        title: "Your First Intelligent Contract",
        durationMinutes: 24,
        summary: "Build a simple contract shape using the GenLayer Python contract model.",
      },
      {
        slug: "frontend-integration",
        title: "Frontend Integration with GenLayerJS",
        durationMinutes: 22,
        summary: "Map user actions to contract reads, writes, and transaction states.",
      },
    ],
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
    quiz: [
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
];
