"use client";

import { useState } from "react";
import { UploadWorkspace } from "./upload-workspace";

export default function Home() {
  const [page, setPage] = useState<"upload" | "instagram" | "processing" | "results" | "settings">("upload");
  return <UploadWorkspace page={page} setPage={(nextPage) => {
    if (nextPage !== "upload") window.location.href = `/${nextPage}`;
    else setPage(nextPage);
  }} />;
}
