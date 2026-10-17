"use client";

import { ChangeEvent, DragEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight, BookOpen, Check, ChevronDown, CircleHelp, Clapperboard, Copy, Film,
  Gamepad2, ImagePlus, Library, Link2, LoaderCircle, Menu, Music2, Play, Plus, Search,
  Instagram, Settings, Sparkles, Trash2, Upload, WandSparkles, X, Zap,
} from "lucide-react";

type Page = "upload" | "instagram" | "processing" | "results" | "settings";
type Theme = "light" | "dark";
type MediaType = "Film" | "TV Series" | "Game" | "Book" | "Manga" | "Anime" | "Album";
type FileItem = { id: string; file: File; url: string };
type Result = { id: number; title: string; subtitle: string; type: MediaType; confidence: number; platform: string; color: string; art: string; status: "matched" | "review" };

const demoResults: Result[] = [
  { id: 1, title: "Dune: Part Two", subtitle: "2024 · Denis Villeneuve", type: "Film", confidence: 98, platform: "Letterboxd", color: "#d7a264", art: "linear-gradient(145deg,#c98b52,#2c2b27 68%,#171817)" , status: "matched" },
  { id: 2, title: "The Bear", subtitle: "2022 · Christopher Storer", type: "TV Series", confidence: 96, platform: "Serializd", color: "#f07058", art: "linear-gradient(145deg,#e8775c,#652c2e 55%,#171819)", status: "matched" },
  { id: 3, title: "Hades", subtitle: "2020 · Supergiant Games", type: "Game", confidence: 94, platform: "Backloggd", color: "#ad6fdd", art: "linear-gradient(145deg,#d05b4d,#502c73 60%,#171819)", status: "matched" },
  { id: 4, title: "Tomorrow, and Tomorrow, and Tomorrow", subtitle: "2022 · Gabrielle Zevin", type: "Book", confidence: 91, platform: "LibraryThing", color: "#e9b864", art: "linear-gradient(145deg,#2c7384,#d2a55e 54%,#2a2728)", status: "review" },
  { id: 5, title: "Frieren: Beyond Journey's End", subtitle: "2023 · Kanehito Yamada", type: "Anime", confidence: 89, platform: "AniList", color: "#7ecbc4", art: "linear-gradient(145deg,#9acfc3,#5d8292 48%,#2b3548)", status: "matched" },
];

const supportedTrackers = [
  { name: "Letterboxd", src: "/assets/letterboxd.png", mark: "L", className: "tracker-letterboxd" },
  { name: "Serializd", src: "/assets/serializd.png", mark: "S", className: "tracker-serializd" },
  { name: "Backloggd", src: "/assets/backloggd.png", mark: "B", className: "tracker-backloggd" },
  { name: "LibraryThing", src: "/assets/librarything.png", mark: "LT", className: "tracker-librarything" },
  { name: "AniList", src: "/assets/anilist.png", mark: "A", className: "tracker-anilist" },
  { name: "Rate Your Music", src: "/assets/rateyourmusic.png", mark: "RYM", className: "tracker-rym" },
];

const navItems: { id: Page; label: string; icon: typeof Upload }[] = [
  { id: "upload", label: "New trace", icon: Plus }, { id: "instagram", label: "Instagram link", icon: Instagram }, { id: "results", label: "Your traces", icon: Library }, { id: "settings", label: "Settings", icon: Settings },
];

function MediaIcon({ type, size = 16 }: { type: MediaType; size?: number }) {
  const Icon = type === "Film" ? Film : type === "TV Series" || type === "Anime" ? Clapperboard : type === "Game" ? Gamepad2 : type === "Album" ? Music2 : BookOpen;
  return <Icon size={size} strokeWidth={1.8} />;
}

export function UploadWorkspace({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [filter, setFilter] = useState<MediaType | "All">("All");
  const [results, setResults] = useState(demoResults);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => typeof document !== "undefined" && document.documentElement.dataset.theme === "dark" ? "dark" : "light");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("mediatrace-theme");
    const nextTheme: Theme = savedTheme === "dark" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  const changeTheme = (nextTheme: Theme) => {
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("mediatrace-theme", nextTheme);
  };

  const filteredResults = useMemo(() => filter === "All" ? results : results.filter((result) => result.type === filter), [filter, results]);

  const addFiles = (incoming: FileList | File[]) => {
    const accepted = Array.from(incoming).filter((file) => ["image/png", "image/jpeg", "image/webp"].includes(file.type));
    setFiles((current) => [...current, ...accepted.map((file) => ({ id: `${file.name}-${file.lastModified}`, file, url: URL.createObjectURL(file) }))]);
  };
  const onInput = (event: ChangeEvent<HTMLInputElement>) => { if (event.target.files) addFiles(event.target.files); };
  const onDrop = (event: DragEvent<HTMLDivElement>) => { event.preventDefault(); setDragging(false); addFiles(event.dataTransfer.files); };
  const removeFile = (id: string) => setFiles((current) => current.filter((file) => file.id !== id));
  const startTrace = () => { setPage("processing"); setProcessing(true); setTimeout(() => { setProcessing(false); setPage("results"); }, 1500); };
  const loadDemo = () => { setFiles([]); setPage("results"); };
  const copyAll = async () => { await navigator.clipboard?.writeText(results.map((result) => `${result.title} — ${result.platform}`).join("\n")); setCopied(true); setTimeout(() => setCopied(false), 1800); };

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Sparkles size={16} /></div><span>mediatrace</span></div>
      <div className="side-label">Workspace</div>
      <nav>{navItems.map(({ id, label, icon: Icon }) => <button key={id} className={`nav-item ${page === id ? "active" : ""}`} onClick={() => setPage(id)}><Icon size={18} /><span>{label}</span>{id === "results" && <span className="nav-count">{results.length}</span>}</button>)}</nav>
      <div className="side-bottom"><div className="privacy-note"><div className="privacy-icon"><Zap size={14} /></div><div><strong>Local-first by design</strong><p>Your images stay in this session.</p></div></div><button className="nav-item"><CircleHelp size={18} /><span>How it works</span></button></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><button className="mobile-menu"><Menu size={20} /></button><div className="breadcrumb"><span>Workspace</span><span>/</span><strong>{page === "upload" ? "New trace" : page === "instagram" ? "Instagram link" : page === "results" ? "Your traces" : page[0].toUpperCase() + page.slice(1)}</strong></div><div className="top-actions"><span className="status-dot"><i /> All systems operational</span><button className="icon-button"><Search size={18} /></button></div></header>
      {page === "upload" && <section className="page-wrap upload-page"><div className="eyebrow"><span className="eyebrow-line" /> IMAGE TO INSIGHT</div><div className="hero-heading"><div><h1>Find what you’ve been <em>meaning</em> to watch.</h1><p>Drop in a screenshot. We’ll identify the films, shows, games, books, and albums hiding inside.</p></div><div className="hero-orb"><div className="orb-inner"><Sparkles size={26} /></div></div></div>
        <div className={`dropzone ${dragging ? "dragging" : ""}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop}><div className="upload-icon"><Upload size={22} /></div><h2>Drop your screenshots here</h2><p>or <label htmlFor="file-upload">browse files<input id="file-upload" type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={onInput} /></label> from your device</p><span className="upload-hint">PNG, JPG, or WEBP · up to 10MB each</span></div>
        {files.length > 0 && <div className="file-strip">{files.map((item) => <div className="file-thumb" key={item.id}><img src={item.url} alt={item.file.name} /><button onClick={() => removeFile(item.id)}><X size={13} /></button></div>)}<button className="add-more" onClick={() => document.getElementById("file-upload")?.click()}><Plus size={17} /><span>Add more</span></button></div>}
        <div className="upload-footer"><div className="microcopy"><WandSparkles size={15} /><span>Best results with screenshots that show titles or cover art.</span></div><div className="upload-actions"><button className="text-button" onClick={loadDemo}>Try a sample <ArrowUpRight size={15} /></button><button className="primary-button" disabled={files.length === 0} onClick={startTrace}><Sparkles size={17} /> Trace {files.length > 0 ? `${files.length} image${files.length > 1 ? "s" : ""}` : "images"}</button></div></div>
        <div className="category-row"><span>Recognizes</span>{(["Film", "TV Series", "Game", "Book", "Manga", "Anime", "Album"] as MediaType[]).map((type) => <div key={type} className="category-pill"><MediaIcon type={type} /> {type}</div>)}</div>
      </section>}
      {page === "instagram" && <InstagramPage onTrace={() => setPage("processing")} />}
      {page === "processing" && <Processing processing={processing} files={files} />}
      {page === "results" && <Results results={filteredResults} filter={filter} setFilter={setFilter} copyAll={copyAll} copied={copied} onRemove={(id) => setResults((items) => items.filter((item) => item.id !== id))} />}
      {page === "settings" && <SettingsPage theme={theme} setTheme={changeTheme} />}
    </main>
  </div>;
}

function InstagramPage({ onTrace }: { onTrace: () => void }) {
  const [url, setUrl] = useState("");
  const [touched, setTouched] = useState(false);
  const isInstagramUrl = /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[A-Za-z0-9_-]+\/?(?:\?.*)?$/.test(url.trim());
  const submit = () => { setTouched(true); if (isInstagramUrl) onTrace(); };

  return <section className="page-wrap instagram-page"><div className="eyebrow"><span className="eyebrow-line" /> LINK TO INSIGHT</div><div className="hero-heading"><div><h1>Trace a post, <em>without</em> the download.</h1><p>Paste an Instagram post or reel link and MediaTrace will move through the same recognition flow without saving any images or videos.</p></div><div className="hero-orb instagram-orb"><div className="orb-inner"><Instagram size={26} /></div></div></div>
    <div className="link-card"><label htmlFor="instagram-url">Instagram post link</label><div className={`link-input-wrap ${touched && !isInstagramUrl ? "invalid" : ""}`}><Instagram size={18} /><input id="instagram-url" value={url} onChange={(event) => { setUrl(event.target.value); setTouched(false); }} onKeyDown={(event) => { if (event.key === "Enter") submit(); }} placeholder="https://www.instagram.com/p/..." inputMode="url" /><button className="primary-button" onClick={submit} disabled={!url.trim()}>Continue <ArrowUpRight size={16} /></button></div>{touched && !isInstagramUrl && <p className="field-error">Enter a valid Instagram post, reel, or video link.</p>}<div className="link-card-footer"><span><Zap size={14} /> URL only · no media download</span><span>Works with public links</span></div></div>
    <div className="privacy-grid"><div className="privacy-feature"><div className="privacy-feature-icon"><Link2 size={17} /></div><div><strong>Link in, trace out</strong><p>The URL is used as the starting point for the trace flow.</p></div></div><div className="privacy-feature"><div className="privacy-feature-icon"><Zap size={17} /></div><div><strong>Media stays untouched</strong><p>No image or video is downloaded to this browser session.</p></div></div></div>
    <div className="instagram-note"><Instagram size={15} /><span>Frontend preview: continuing will show the same processing and results screens as an uploaded screenshot.</span></div>
  </section>;
}

function Processing({ processing, files }: { processing: boolean; files: FileItem[] }) {
  const steps = ["Reading image content", "Identifying media", "Matching tracker entries"];
  return <section className="page-wrap processing-page"><div className="eyebrow"><span className="eyebrow-line" /> PROCESSING</div><div className="processing-header"><div><h1>Following the trail<span className="accent-dot">.</span></h1><p>MediaTrace is looking for recognizable titles and matching tracker entries.</p></div><div className="scan-orb"><div /><span>AI</span></div></div><div className="progress-card"><div className="progress-top"><span>Batch trace</span><strong>{processing ? "In progress" : "Complete"}</strong></div><div className="progress-track"><div className="progress-fill" /></div><div className="step-list">{steps.map((step, index) => <div className={`process-step ${!processing || index < 2 ? "done" : index === 2 ? "current" : ""}`} key={step}><span className="step-icon">{!processing || index < 2 ? <Check size={14} /> : <LoaderCircle size={14} className="spin" />}</span><span>{step}</span>{index === 0 && files.length > 0 && <small>{files.length} image{files.length > 1 ? "s" : ""}</small>}</div>)}</div></div><div className="processing-tip"><Sparkles size={16} /><span>We preserve uncertainty — anything we can’t confidently match will be flagged for your review.</span></div></section>;
}

function Results({ results, filter, setFilter, copyAll, copied, onRemove }: { results: Result[]; filter: MediaType | "All"; setFilter: (f: MediaType | "All") => void; copyAll: () => void; copied: boolean; onRemove: (id: number) => void }) {
  const filters: (MediaType | "All")[] = ["All", "Film", "TV Series", "Game", "Book", "Manga", "Anime"];
  return <section className="page-wrap results-page"><div className="results-header"><div><div className="eyebrow"><span className="eyebrow-line" /> YOUR TRACE</div><h1>Here’s what we found<span className="accent-dot">.</span></h1><p>5 items recognized · 4 matches confirmed · 1 needs a quick look</p></div><div className="result-actions"><button className="secondary-button" onClick={copyAll}>{copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copied" : "Copy list"}</button><button className="primary-button" onClick={() => window.location.reload()}><Plus size={17} /> New trace</button></div></div><div className="filter-bar"><div className="filter-group">{filters.map((item) => <button key={item} className={filter === item ? "selected" : ""} onClick={() => setFilter(item)}>{item}{item === "All" && <span>5</span>}</button>)}</div><button className="filter-sort"><span>Sort: Confidence</span><ChevronDown size={15} /></button></div><div className="results-list">{results.map((result, index) => <ResultCard key={result.id} result={result} index={index} onRemove={onRemove} />)}</div>{results.length === 0 && <div className="empty-state"><Search size={24} /><h3>No results in this category</h3><p>Try another filter to see your recognized media.</p></div>}<div className="results-note"><Link2 size={14} /><span>Links open the matching entry on each platform. Unresolved matches will use a platform search.</span></div></section>;
}

function ResultCard({ result, index, onRemove }: { result: Result; index: number; onRemove: (id: number) => void }) {
  return <article className="result-card" style={{ "--delay": `${index * 70}ms` } as React.CSSProperties}><div className="result-art" style={{ background: result.art }}><div className="art-symbol"><MediaIcon type={result.type} size={30} /></div><span className="art-label">{result.type}</span></div><div className="result-info"><div className="result-title-row"><div><h3>{result.title}</h3><p>{result.subtitle}</p></div><button className="remove-result" onClick={() => onRemove(result.id)} aria-label={`Remove ${result.title}`}><Trash2 size={16} /></button></div><div className="result-meta"><span className="type-tag" style={{ color: result.color, backgroundColor: `${result.color}18` }}><MediaIcon type={result.type} size={13} /> {result.type}</span><span className="confidence"><span className="confidence-bar"><i style={{ width: `${result.confidence}%` }} /></span>{result.confidence}% match</span></div></div><div className="result-link"><span>Matched on</span><strong>{result.platform}</strong><button aria-label={`Open ${result.platform}`}><ArrowUpRight size={17} /></button></div>{result.status === "review" && <span className="review-badge"><span /> Review</span>}</article>;
}

function SettingsPage({ theme, setTheme }: { theme: Theme; setTheme: (theme: Theme) => void }) { return <section className="page-wrap settings-page"><div className="eyebrow"><span className="eyebrow-line" /> PREFERENCES</div><h1>Workspace settings<span className="accent-dot">.</span></h1><p className="settings-lede">A few quiet controls for how MediaTrace works in this browser.</p><div className="settings-card"><div className="setting-row"><div><strong>Appearance</strong><p>Switch between a calm light workspace and a focused dark workspace.</p></div><button className={`toggle-button ${theme === "dark" ? "active" : ""}`} onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-pressed={theme === "dark"}><span /> <b>{theme === "dark" ? "Dark mode" : "Light mode"}</b></button></div><div className="setting-row"><div><strong>Local-only processing</strong><p>Keep uploaded images in this browser session and discard them when the tab closes.</p></div><div className="toggle on"><span /></div></div><div className="setting-row"><div><strong>Show confidence scores</strong><p>Display the model’s estimated confidence beside each recognized item.</p></div><div className="toggle on"><span /></div></div><div className="setting-row"><div><strong>Preferred link behavior</strong><p>Open tracker matches in a new browser tab.</p></div><button className="select-button">New tab <ChevronDown size={15} /></button></div></div><div className="settings-card tracker-card"><div className="tracker-card-heading"><div className="setting-icon"><Library size={18} /></div><div><strong>Supported trackers</strong><p>Open recognized titles in the tracker you already use.</p></div></div><div className="tracker-grid">{supportedTrackers.map((tracker) => <div className="tracker-item" key={tracker.name}><span className={`tracker-logo ${tracker.className}`} aria-hidden="true"><img src={tracker.src} alt="" /></span><span>{tracker.name}</span></div>)}</div></div></section> }
