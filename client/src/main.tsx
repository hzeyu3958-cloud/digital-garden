import { createRoot } from "react-dom/client";
import App from "./App";
/*
 * 字体自托管：只引 latin 子集，中文走系统字族
 * （思源宋体/苹方/微软雅黑自带，不必下载几 MB 的 Noto SC）
 */
import "@fontsource/dm-serif-display/latin-400.css";
import "@fontsource/dm-serif-display/latin-400-italic.css";
import "@fontsource/source-sans-3/latin-300.css";
import "@fontsource/source-sans-3/latin-400.css";
import "@fontsource/source-sans-3/latin-500.css";
import "@fontsource/source-sans-3/latin-600.css";
import "@fontsource/source-sans-3/latin-700.css";
import "@fontsource/source-sans-3/latin-400-italic.css";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-600.css";
import "@fontsource/cormorant-garamond/latin-italic.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
