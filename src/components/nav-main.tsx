"use client";

import {
  IconCirclePlusFilled,
  IconFolderPlus,
  IconFilePlus,
  IconFile,
  IconFileZip,
  IconPhoto,
  IconVideo,
} from "@tabler/icons-react";

import { Paperclip } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useRef, useState } from "react";

// My Components
import { UploadModal } from "./myComponents/UploadModal";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ElementType;
  }[];
}) {
  const fileInputRefs = {
    image: useRef<HTMLInputElement | null>(null),
    video: useRef<HTMLInputElement | null>(null),
    document: useRef<HTMLInputElement | null>(null),
    zip: useRef<HTMLInputElement | null>(null),
    any: useRef<HTMLInputElement | null>(null),
  };

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleTriggerUpload = (type: keyof typeof fileInputRefs) => {
    fileInputRefs[type].current?.click();
  };

  const handleFileUpload = (
    type: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log(`[${type.toUpperCase()}] Files selected:`, files);
      // your upload logic here
      setSelectedFile(files[0]);
      setShowUploadModal(true);
    }
  };

  return (
    <>
      <UploadModal
        open={showUploadModal}
        file={selectedFile}
        onClose={() => {
          setShowUploadModal(false);
          setSelectedFile(null);
        }}
      />

      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              {/* Quick Create Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    tooltip="Quick Create"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                  >
                    <IconCirclePlusFilled className="w-4 h-4" />
                    <span>Quick Create</span>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="bottom"
                  align="start"
                  className="w-40"
                >
                  <DropdownMenuItem
                    onClick={() => console.log("Create Folder")}
                  >
                    <IconFolderPlus className="mr-2 h-4 w-4" />
                    New Folder
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log("Upload File")}>
                    <IconFilePlus className="mr-2 h-4 w-4" />
                    Upload File
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* File Upload Dropdown on Paperclip */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    className="size-8 group-data-[collapsible=icon]:opacity-0"
                    variant="outline"
                  >
                    <Paperclip className="w-4 h-4" />
                    <span className="sr-only">Upload</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => handleTriggerUpload("image")}
                  >
                    <IconPhoto className="mr-2 h-4 w-4 text-pink-500" />
                    Upload Image
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleTriggerUpload("video")}
                  >
                    <IconVideo className="mr-2 h-4 w-4 text-indigo-500" />
                    Upload Video
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleTriggerUpload("document")}
                  >
                    <IconFile className="mr-2 h-4 w-4 text-emerald-600" />
                    Upload Document
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleTriggerUpload("zip")}>
                    <IconFileZip className="mr-2 h-4 w-4 text-yellow-600" />
                    Upload Zip
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleTriggerUpload("any")}>
                    <Paperclip className="mr-2 h-4 w-4 text-gray-600" />
                    Any File
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Hidden Inputs */}
              <input
                ref={fileInputRefs.image}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload("image", e)}
              />
              <input
                ref={fileInputRefs.video}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => handleFileUpload("video", e)}
              />
              <input
                ref={fileInputRefs.document}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={(e) => handleFileUpload("document", e)}
              />
              <input
                ref={fileInputRefs.zip}
                type="file"
                accept=".zip,.rar"
                className="hidden"
                onChange={(e) => handleFileUpload("zip", e)}
              />
              <input
                ref={fileInputRefs.any}
                type="file"
                className="hidden"
                onChange={(e) => handleFileUpload("any", e)}
                multiple
              />
            </SidebarMenuItem>
          </SidebarMenu>

          {/* Main Navigation Items */}
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
