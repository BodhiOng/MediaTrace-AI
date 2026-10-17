import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MediaTrace — Find your next obsession",
  description: "Turn screenshots into organized media lists.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem("mediatrace-theme");document.documentElement.dataset.theme=t==="dark"?"dark":"light";}catch(e){}})()` }} /></head><body>{children}</body></html>;
}
