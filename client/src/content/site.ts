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

export interface EducationItem {
  school: string;
  degree: string;
  period: string;
  note?: string;
}

/* ---------- 花园分区（identity / moments / experiences / about） ---------- */
export interface CapsuleItem {
  label: string;
  sub?: string;
}

export interface MomentItem {
  /** 想放照片就填路径；留空则渲染纯文字卡（你不想要照片，默认就走这条） */
  src?: string;
  caption: string;
  /** 卡面上的大字短句 */
  line?: string;
  /** 小字注脚 */
  note?: string;
}

export interface ExperienceItem {
  period: string;
  role: string;
  place: string;
  desc: string;
}

export interface ArchiveCard {
  no: string;
  cn: string;
  en: string;
  desc: string;
  href: string;
}

export interface FloatingCard {
  cn: string;
  en: string;
  href: string;
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
    /** 首屏背景：换成你自己的场景图，改这一行即可（建议 1680×960 横图） */
    cover: "/images/garden-hero.jpg",
    /** 开场电影门的场景图 */
    introCover: "/images/garden-intro.jpg",
    /**
     * 参考站的背景是循环短视频。这两项留空时，组件用「静帧 + 多层动画」模拟运动；
     * 把你自己的视频放进 client/public/videos/ 后填上路径，会自动切换成真视频，例如
     * coverVideo: "/videos/hero.mp4"（建议 ≤8s、无音轨、1080p、码率 3Mbps 以下）。
     */
    coverVideo: "",
    introVideo: "",
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

  /* ---------- 以下四个分区与参考站同构 ---------- */

  /** 01 身份：掉落成堆的胶囊标签（参考站为 13 个奖项） */
  identity: {
    kicker: "01 / IDENTITY",
    title: "身份与凭证",
    lead: "先说我是什么，再说我做过什么。",
    capsules: [
      { label: "法学本科", sub: "2024 级·大二" },
      { label: "南昌", sub: "求职城市" },
      { label: "律所实习", sub: "目标方向" },
      { label: "法务助理", sub: "目标方向" },
      { label: "合规", sub: "目标方向" },
      { label: "法律检索", sub: "核心技能" },
      { label: "合同审查", sub: "核心技能" },
      { label: "法律文书", sub: "核心技能" },
      { label: "案例梳理", sub: "核心技能" },
      { label: "AI 工具", sub: "效率加成" },
      { label: "飞书 / Office", sub: "效率加成" },
      { label: "英语 CET-6", sub: "分数待填" },
      { label: "远程协作", sub: "可长期配合" },
    ] as CapsuleItem[],
  },

  /** 02 流影：两条相向而行、永不回滚的照片流 */
  moments: {
    kicker: "02 / MOMENTS",
    title: "此刻志",
    lead: "不摆照片，把正在做的事排成两列：一列向左走，一列向右走。",
    /** 以下全为示例文案，换成你自己的「此刻」即可，卡面会自动重排 */
    items: [
      { caption: "在读", line: "《民法典合同编》", note: "逐条做笔记，整理典型判例" },
      { caption: "在写", line: "检索报告", note: "把同类案件的要旨拉成一张表" },
      { caption: "在算", line: "法律检索工具", note: "用 AI 把法条结构化、可检索" },
      { caption: "在跑", line: "晨跑 5 公里", note: "昌东江畔，六点半" },
      { caption: "在听", line: "庭审旁听录音", note: "记争议焦点与举证节奏" },
      { caption: "在读", line: "《控告与叙述》", note: "叙事如何影响事实认定" },
      { caption: "在做", line: "简历与作品集", note: "把散落的材料归成一个站" },
      { caption: "在学", line: "英文法律文书", note: "IRAC 结构反复写" },
    ] as MomentItem[],
  },

  /** 03 经历：粒子星雾里的时间线 */
  experiences: {
    kicker: "03 / EXPERIENCES",
    title: "经历",
    lead: "时间线上每一步都要能被人验证。",
    items: [
      {
        period: "2024 — 至今",
        role: "法学 · 本科在读",
        place: "你的大学（待填）",
        desc: "民法、刑法、诉讼法系统训练；主修成绩与奖学金待填。",
      },
      {
        period: "待填",
        role: "实习 / 项目",
        place: "律所或法院（待填）",
        desc: "写清你参与过的案件类型、你负责的那一段、可量化结果。",
      },
      {
        period: "待填",
        role: "志愿服务 / 社团",
        place: "法律援助、模拟法庭等",
        desc: "把服务人次、工时、产出文档数量写成数字。",
      },
    ] as ExperienceItem[],
  },

  /** 04 关于 */
  about: {
    kicker: "04 / ABOUT",
    title: "关于这座花园",
    paragraphs: [
      "这个站点把简历、作品、社交入口收在一起：不用截图，不用来回发文件，一个链接说清楚我。",
      "花园的意思是：只长自己的东西。每一条经历、每一张图都对应得上原始材料，可回访、可核对。",
      "求职方向：南昌的律所实习、企业法务助理与合规岗；也接受长期远程协作。",
    ],
  },

  /** 0 档案入口：立在花园里的磨砂玻璃卡（参考站 “Choose an Archive”） */
  archives: {
    title: "Choose an Archive",
    sub: "选择一个档案入口",
    cards: [
      {
        no: "01",
        cn: "简历与求职",
        en: "RESUME & JOB HUNT",
        desc: "一页简历、可下载 PDF、求职方向与联系方式。",
        href: "#links",
      },
      {
        no: "02",
        cn: "内容与写作",
        en: "CONTENT & WRITING",
        desc: "读书笔记、案例梳理与法律写作练习。",
        href: "#links",
      },
      {
        no: "03",
        cn: "联系与协作",
        en: "CONTACT & COLLAB",
        desc: "邮箱、微信与预约沟通，最快找到我的方式。",
        href: "#contact",
      },
    ] as ArchiveCard[],
    floating: [
      { cn: "GitHub", en: "CODE", href: "https://github.com/hzeyu3958-cloud/digital-garden" },
      { cn: "小红书", en: "NOTES", href: "#" },
      { cn: "公众号", en: "ARTICLES", href: "#" },
    ] as FloatingCard[],
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
};

export type Site = typeof site;
