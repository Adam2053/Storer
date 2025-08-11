"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { FileGrid } from "./dashComponent/FileGrid";
import { Toolbar } from "./dashComponent/Toolbar";
import { SearchBar } from "./dashComponent/SearchBar";
import { UploadDropzone } from "./dashComponent/UploadDropzone";
import { FilterSortBar } from "./dashComponent/FilterSortBar";
import { DropOverlay } from "./dashComponent/DropOverlay";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

type FileItem = {
  id: string;
  name: string;
  type: string;
  size: string;
};

const filesData: FileItem[] = [
  { id: "1", name: "Resume.pdf", type: "pdf", size: "120KB" },
  { id: "2", name: "ProjectProposal.docx", type: "docx", size: "300KB" },
  { id: "3", name: "Photos.zip", type: "zip", size: "2MB" },
  { id: "4", name: "ArkiveDesign.fig", type: "figma", size: "1.2MB" },
  { id: "5", name: "ArkiveReviewDoc.docx", type: "docx", size: "2.2MB" },
  { id: "6", name: "HelloHI.docx", type: "docx", size: "2.2MB" },
];

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [dragActive, setDragActive] = useState(false);
  const dragCounter = useRef(0);

  const searchParams = useSearchParams();
  const router = useRouter();

  const handleFileUpload = (files: File[]) => {
    setUploadedFiles((prev) => [...prev, ...files]);
    console.log("Uploaded files:", files);
  };

  const allFiles = filesData; // Later, merge with uploadedFiles if needed

  const filteredItems = allFiles.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setDragActive(false);
  }, []);

  useEffect(() => {
    const linked = searchParams.get("googleLinked");

    if (linked === "true") {
      localStorage.setItem("googleDriveLinked", "true");

      const cleanUrl = window.location.pathname;
      router.replace(cleanUrl);
    }
  }, [searchParams, router]);

  useEffect(() => {
    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDrop);
    window.addEventListener("dragover", (e) => e.preventDefault());

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
    };
  }, [handleDragEnter, handleDragLeave, handleDrop]);

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset className="flex flex-col flex-1">
          <SiteHeader />

          {/* MAIN CONTENT WRAPPER */}
          <div className="flex flex-col flex-1 p-4 gap-4 overflow-hidden">
            <Toolbar
              onNewFolder={() => {
                console.log("Create new folder");
                // Your logic to create a new folder (e.g., set modal open, add item, etc.)
              }}
              onNewFile={() => {
                console.log("Create new file");
                // Your logic to create a new file
              }}
              onUpload={(files) => {
                console.log("Uploaded files:", files);
                // Your logic to handle uploaded files
              }}
            />

            <SearchBar query={searchQuery} onChange={setSearchQuery} />
            <FilterSortBar
              viewMode={viewMode}
              onViewChange={setViewMode}
              onSearchChange={setSearchQuery}
              onSortChange={(sortBy) => {
                console.log("Sorting by:", sortBy);
              }}
              onFilterChange={(filter) => {
                console.log("Filtering by:", filter);
              }}
            />
            {/* <UploadDropzone onFilesUploaded={handleFileUpload} /> */}

            {/* SCROLLABLE FILE GRID */}
            <div className="flex-1 overflow-y-auto rounded-md border border-muted p-2">
              <FileGrid items={filteredItems} viewMode={viewMode} />
            </div>
          </div>
        </SidebarInset>
        <DropOverlay visible={dragActive} />
      </SidebarProvider>
    </div>
  );
};

export default Dashboard;
