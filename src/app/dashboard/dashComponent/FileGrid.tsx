"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  ReactNode,
  KeyboardEvent,
} from "react";
import {
  MoreVertical,
  FileText,
  Folder,
  Download,
  Pencil,
  Trash2,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FileNode {
  id: string;
  name: string;
  mimeType: string;
  size?: string | number;
  children?: FileNode[];
}

interface FileGridProps {
  viewMode: "grid" | "list";
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

/** Modal Overlay Component */
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-lg shadow-lg overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Close modal"
          onClick={onClose}
          className="
            absolute top-3 right-3
            text-red-600 hover:text-red-800
            bg-white rounded-full
            w-8 h-8 flex items-center justify-center
            shadow-md
            focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2
            transition-colors
            font-bold text-xl
          "
        >
          ✕
        </button>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

/** Formats bytes to human-readable string */
const formatFileSize = (bytes?: string | number): string => {
  if (bytes === undefined || bytes === null) return "--";
  const num = typeof bytes === "string" ? parseInt(bytes, 10) : bytes;

  if (num < 1024) return `${num} B`;
  if (num < 1024 ** 2) return `${(num / 1024).toFixed(1)} KB`;
  if (num < 1024 ** 3) return `${(num / 1024 ** 2).toFixed(1)} MB`;
  return `${(num / 1024 ** 3).toFixed(1)} GB`;
};

/** Pink Loading Spinner Component */
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center h-full p-8">
    <svg
      className="animate-spin -ml-1 mr-3 h-10 w-10 text-primary"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Loading spinner"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
    <h2 className="mt-4 text-3xl font-extrabold text-primary">
      Loading files...
    </h2>
  </div>
);

/** Empty state UI */
interface EmptyStateProps {
  message: string;
  showBack?: boolean;
  onBack?: () => void;
}
const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  showBack,
  onBack,
}) => (
  <div className="flex flex-col items-center justify-center h-full p-8 gap-6">
    <h2 className="text-4xl font-extrabold text-center text-primary">
      {message}
    </h2>
    {showBack && onBack && (
      <Button
        size="sm"
        variant="outline"
        onClick={onBack}
        aria-label="Go back to previous folder"
        className="flex items-center"
      >
        <ArrowLeft className="w-5 h-5 mr-2 text-primary" /> <span className="text-primary">Go Back</span>
      </Button>
    )}
  </div>
);

/** Dropdown actions menu */
const FileActionsMenu: React.FC<{ item: FileNode }> = ({ item }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Actions for ${item.name}`}
      >
        <MoreVertical className="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-36">
      <DropdownMenuItem onSelect={() => alert(`Edit ${item.name}`)}>
        <Pencil className="w-4 h-4 mr-2" /> Edit
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={() => alert(`Download ${item.name}`)}>
        <Download className="w-4 h-4 mr-2" /> Download
      </DropdownMenuItem>
      <DropdownMenuItem
        className="text-red-600 hover:text-red-700"
        onSelect={() => alert(`Delete ${item.name}`)}
      >
        <Trash2 className="w-4 h-4 mr-2" /> Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

/** Main FileGrid Component */
export const FileGrid: React.FC<FileGridProps> = ({ viewMode }) => {
  const [tree, setTree] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [navigationStack, setNavigationStack] = useState<FileNode[][]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewFileId, setPreviewFileId] = useState<string | null>(null);

  /** Fetch root files once on mount */
  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://storer-backend.onrender.com/api/google/files");
        const data = await res.json();
        if (Array.isArray(data.tree)) {
          setTree(data.tree);
          setNavigationStack([data.tree]);
        }
      } catch (error) {
        console.error("Failed to fetch files:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  /** Current folder content (last in stack) */
  const currentItems = useMemo(
    () =>
      navigationStack.length ? navigationStack[navigationStack.length - 1] : [],
    [navigationStack]
  );

  /** Select an item */
  const handleSelect = useCallback((item: FileNode) => {
    setSelectedId(item.id);
  }, []);

  /** Open folder or preview file */
  const handleOpen = useCallback((item: FileNode) => {
    if (
      item.mimeType === "application/vnd.google-apps.folder" &&
      item.children
    ) {
      setNavigationStack((prev) => [...prev, item.children || []]);
      setSelectedId(null);
    } else {
      setPreviewFileId(item.id);
    }
  }, []);

  /** Navigate back up one folder */
  const goBack = useCallback(() => {
    setNavigationStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
    setSelectedId(null);
  }, []);

  /** Keyboard accessibility handler for Enter/Space */
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, item: FileNode) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpen(item);
    }
  };

  // Loading takes highest priority
  if (loading) {
    return <LoadingSpinner />;
  }

  // Then empty state check
  if (currentItems.length === 0) {
    if (navigationStack.length === 1) {
      // Root folder empty
      return <EmptyState message="Files Not Found" />;
    } else {
      // Subfolder empty + back button
      return (
        <EmptyState
          message="No files in this folder"
          showBack
          onBack={goBack}
        />
      );
    }
  }

  /** Render list view */
  if (viewMode === "list") {
    return (
      <>
        <div className="flex flex-col w-full h-full border rounded-md overflow-hidden">
          <header className="sticky top-0 z-10 flex items-center gap-2 p-2 bg-muted border-b min-h-[40px]">
            {navigationStack.length > 1 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={goBack}
                aria-label="Go back to previous folder"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            )}
          </header>

          <div className="grid grid-cols-12 gap-2 p-2 font-medium text-sm bg-muted border-b">
            <div className="col-span-5">Name</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-3">Size</div>
            <div className="col-span-2 text-right pr-4">Actions</div>
          </div>

          <div className="overflow-y-auto flex-1">
            {currentItems.map((item) => {
              const isSelected = selectedId === item.id;
              const isFolder =
                item.mimeType === "application/vnd.google-apps.folder";

              return (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  aria-selected={isSelected}
                  onClick={() => handleSelect(item)}
                  onDoubleClick={() => handleOpen(item)}
                  onKeyDown={(e) => handleKeyDown(e, item)}
                  className={`grid grid-cols-12 items-center gap-2 p-3 border-t cursor-pointer hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    isSelected ? "bg-blue-100" : ""
                  }`}
                >
                  <div className="col-span-5 flex items-center gap-2 truncate">
                    {isFolder ? (
                      <Folder className="w-4 h-4" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                    <span className="truncate">{item.name}</span>
                  </div>
                  <div className="col-span-2">
                    {isFolder ? "Folder" : "File"}
                  </div>
                  <div className="col-span-3">{formatFileSize(item.size)}</div>
                  <div className="col-span-2 flex justify-end">
                    {<FileActionsMenu item={item} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Modal isOpen={!!previewFileId} onClose={() => setPreviewFileId(null)}>
          {previewFileId && (
            <iframe
              src={`https://drive.google.com/file/d/${previewFileId}/preview`}
              title="File Preview"
              className="w-full h-[80vh]"
              allow="autoplay; encrypted-media"
              frameBorder={0}
            />
          )}
        </Modal>
      </>
    );
  }

  /** Render grid view */
  return (
    <>
      <div className="mb-2 min-h-[36px]">
        {navigationStack.length > 1 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={goBack}
            aria-label="Go back to previous folder"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {currentItems.map((item) => {
          const isSelected = selectedId === item.id;
          const isFolder =
            item.mimeType === "application/vnd.google-apps.folder";

          return (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              aria-selected={isSelected}
              aria-label={`${item.name} ${isFolder ? "Folder" : "File"}`}
              onClick={() => handleSelect(item)}
              onDoubleClick={() => handleOpen(item)}
              onKeyDown={(e) => handleKeyDown(e, item)}
              className={`relative flex flex-col items-center justify-center gap-3 p-4 border rounded-lg cursor-pointer bg-muted/20 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                isSelected ? "ring-2 ring-blue-400" : ""
              }`}
            >
              <div className="absolute top-2 right-2">
                {<FileActionsMenu item={item} />}
              </div>
              {isFolder ? (
                <Folder className="w-8 h-8" />
              ) : (
                <FileText className="w-8 h-8" />
              )}
              <div className="w-full text-sm font-medium text-center truncate">
                {item.name}
              </div>
              {item.size && (
                <div className="text-xs text-muted-foreground">
                  {formatFileSize(item.size)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Modal isOpen={!!previewFileId} onClose={() => setPreviewFileId(null)}>
        {previewFileId && (
          <iframe
            src={`https://drive.google.com/file/d/${previewFileId}/preview`}
            title="File Preview"
            className="w-full h-[80vh]"
            allow="autoplay; encrypted-media"
            frameBorder={0}
          />
        )}
      </Modal>
    </>
  );
};
