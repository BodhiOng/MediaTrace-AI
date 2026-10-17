"use client";

import { useEffect, useState } from "react";
import { UploadWorkspace } from "./upload-workspace";

export function RouteWorkspace({ page }: { page: "processing" | "results" | "settings" | "instagram" }) {
  const [currentPage, setCurrentPage] = useState(page);

  useEffect(() => {
    if (page !== "processing") return;
    const timer = window.setTimeout(() => setCurrentPage("results"), 1500);
    return () => window.clearTimeout(timer);
  }, [page]);

  return <UploadWorkspace page={currentPage} setPage={(nextPage) => {
    if (nextPage === "upload") window.location.href = "/";
    else if (nextPage === "instagram") window.location.href = "/instagram";
    else if (nextPage !== currentPage) window.location.href = `/${nextPage}`;
    else setCurrentPage(nextPage);
  }} />;
}
