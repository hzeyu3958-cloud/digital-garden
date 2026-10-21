/*
 * 全站内容配置
 * ------------------------------------------------------------------
 * 整站的文案、链接、经历都在这一个文件里，改这里即可，不用动组件。
 * 数组留空时，对应板块会自动隐藏（见 pages/Home.tsx）。
 * 带「示例」字样的字段请替换成你自己的内容。
 */
import {
  BookOpen,
  CalendarCheck,
  Code2,
  FileText,
  FolderOpen,
  Github,
  Laptop,
  Link2,
  Mail,
  MapPin,
  MessageCircle,
  NotebookPen,
  PenLine,
  Scale,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ---------- 主题色（与 index.css 中的植物学配色一致） ---------- */
const emerald = "oklch(0.596 0.145 163.225)";
const forest = "oklch(0.432 0.120 163.225)";
const gold = "oklch(0.700 0.130 85)";

/* ---------- 类型 ---------- */
export interface Highlight {
  icon: LucideIcon;
  value: string;
  label: string;
  detail: string;
  accent: string;
}

export interface LinkItem {
  title: string;
  desc?: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export interface LinkGroup {
  group: string;
  caption?: string;
  items: LinkItem[];
}

export interface SkillCategory {
  category: string;
  color: string;
  skills: { name: string; level: number }[];
}

export interface EducationItem {
  school: string;
  degree: string;
  period: string;
  note?: string;
}

export interface ProjectItem {
  title: string;
  desc: string;
  tags: string[];
  icon: LucideIcon;
  accent: string;
  highlight: string;
}

export interface AigcItem {
  title: string;
  desc: string;
  type: string;
  icon: LucideIcon;
  tool: string;
}

export interface PlanItem {
  title: string;
  desc: string;
  result: string;
  icon: LucideIcon;
  year: string;
}

export interface NewsItem {
  title: string;
  publication: string;
  date: string;
  type: string;
  excerpt: string;
  featured: boolean;
}

export interface WorkItem {
  company: string;
  role: string;
  period: string;
  works: { title: string; desc: string }[];
}

export interface LiteraryItem {
  title: string;
  type: string;
  publication: string;
  award: string | null;
  excerpt: string;
  featured: boolean;
}

/* ---------- 站点信息 ---------- */
export const site = {
  meta: {
    siteName: "Digital Garden",
    title: "你的名字 · 数字花园",
    description: "法学本科在读，南昌求职。一个把简历、作品与所有入口放在一起的个人站点。",
  },

  profile: {
    name: "你的名字",
    nameEn: "YOUR NAME",
    badge: "法学本科 · 大二在读",
    tagline: "在法条与代码之间，做可被验证的事。",
    location: "南昌 · 求职中",
    email: "you@example.com",
    /** 把照片放到 client/public/images/profile.jpg 即可自动生效 */
    photo: "/images/profile.jpg",
    intro:
      "法学本科大二，关注民商事争议解决与合规。习惯把复杂材料拆成可检索、可复用的结构，也在用 AI 工具提升检索与写作效率。",
    footerNote: "法学的数字花园，记录阅读、写作与实践的每一步。",
  },

  /** 首屏三张亮点卡 */
  highlights: [
    {
      icon: Scale,
      value: "法学本科",
      label: "大二在读",
      detail: "民法 · 刑法 · 诉讼法 系统训练",
      accent: emerald,
    },
    {
      icon: MapPin,
      value: "南昌",
      label: "求职方向",
      detail: "律所实习 · 法务助理 · 合规",
      accent: gold,
    },
    {
      icon: Laptop,
      value: "远程协作",
      label: "可长期配合",
      detail: "检索 · 文书 · 材料整理与交付",
      accent: forest,
    },
  ] as Highlight[],

  /** 首屏技能标签 */
  tags: [
    "法律检索",
    "合同审查",
    "文书写作",
    "案例梳理",
    "Office / WPS",
    "飞书",
    "AI 工具",
    "英语 CET-6",
  ],

  /** 首屏按钮 */
  cta: {
    primary: { label: "查看全部链接", href: "#links" },
    secondary: { label: "写信给我", href: "mailto:you@example.com" },
  },

  /** 链接聚合区（Linktree 的替代品） */
  links: [
    {
      group: "求职与简历",
      caption: "HR 与招聘方最常点开的三项",
      items: [
        {
          title: "简历 PDF",
          desc: "文件放到 client/public/resume.pdf 即可",
          href: "#",
          icon: FileText,
          badge: "PDF",
        },
        {
          title: "作品与写作",
          desc: "法律文书、读书笔记与课程作业",
          href: "#",
          icon: FolderOpen,
        },
        {
          title: "一段式自我介绍",
          desc: "300 字版本，方便复制粘贴",
          href: "#",
          icon: PenLine,
        },
      ],
    },
    {
      group: "内容平台",
      caption: "长期更新的地方",
      items: [
        {
          title: "公众号",
          desc: "法律学习与工具分享",
          href: "#",
          icon: BookOpen,
        },
        {
          title: "小红书",
          desc: "学习记录与生活切片",
          href: "#",
          icon: NotebookPen,
        },
        {
          title: "知乎",
          desc: "问答与长文",
          href: "#",
          icon: MessageCircle,
        },
      ],
    },
    {
      group: "代码与项目",
      caption: "自己动手做的东西",
      items: [
        {
          title: "GitHub",
          desc: "@1014688797-hue",
          href: "https://github.com/1014688797-hue",
          icon: Github,
        },
        {
          title: "本站源码",
          desc: "portfolio-site 仓库",
          href: "https://github.com/1014688797-hue/portfolio-site",
          icon: Code2,
        },
        {
          title: "旧版链接页",
          desc: "Linktree 存档（待填）",
          href: "#",
          icon: Link2,
        },
      ],
    },
    {
      group: "联系我",
      caption: "最快找到我的方式",
      items: [
        {
          title: "邮箱",
          desc: "you@example.com",
          href: "mailto:you@example.com",
          icon: Mail,
        },
        {
          title: "微信",
          desc: "加好友请备注来意",
          href: "#",
          icon: MessageCircle,
        },
        {
          title: "预约沟通",
          desc: "腾讯会议 / 飞书均可",
          href: "#",
          icon: CalendarCheck,
        },
      ],
    },
  ] as LinkGroup[],

  /** 技能图谱 */
  skills: [
    {
      category: "法律核心",
      color: emerald,
      skills: [
        { name: "法律检索", level: 88 },
        { name: "合同审查", level: 80 },
        { name: "法律文书", level: 85 },
        { name: "案例梳理", level: 82 },
        { name: "证据整理", level: 78 },
      ],
    },
    {
      category: "工具与效率",
      color: forest,
      skills: [
        { name: "Word / WPS", level: 92 },
        { name: "飞书文档", level: 88 },
        { name: "PDF 与排版", level: 85 },
        { name: "Excel 数据整理", level: 80 },
        { name: "AI 工具（检索 / 写作）", level: 86 },
      ],
    },
    {
      category: "语言与表达",
      color: gold,
      skills: [
        { name: "中文写作", level: 90 },
        { name: "英语阅读", level: 78 },
        { name: "口头表达", level: 76 },
        { name: "沟通协作", level: 82 },
      ],
    },
  ] as SkillCategory[],

  /** 教育背景 */
  education: [
    {
      school: "你的大学",
      degree: "法学 · 本科",
      period: "2024 — 2028",
      note: "大二在读（示例，请替换）",
    },
  ] as EducationItem[],

  /** 语言能力 */
  languages: [
    { label: "英语", value: "CET-6（分数待填）" },
    { label: "普通话", value: "二级甲等（待填）" },
  ],

  /* ---------- 以下板块默认为空，填了内容才会出现在页面上 ---------- */

  /** 项目与比赛：填 1 条以上，“项目”板块就会自动出现 */
  projects: [] as ProjectItem[],

  /** AI / 工具类作品 */
  aigc: [] as AigcItem[],

  /** 策划与方案 */
  plans: [] as PlanItem[],

  /** 内容与写作 */
  news: [] as NewsItem[],

  /** 工作与实习 */
  work: [] as WorkItem[],

  /** 文学作品 */
  literary: [] as LiteraryItem[],
};

export type Site = typeof site;
