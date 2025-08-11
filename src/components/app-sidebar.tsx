"use client";

import * as React from "react";
import axios from "axios";
import {
  IconCamera,
  IconDashboard,
  IconFileAi,
  IconFileDescription,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconSearch,
  IconSettings,
  IconTrash,
  IconUsers,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Bot, ScrollText, Server } from "lucide-react";
import { StorageUsageBar } from "./myComponents/StorageUsageBar";
import { Button } from "./ui/button";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "My Files",
      url: "#",
      icon: IconFolder,
    },
    {
      title: "Shared with Me",
      url: "#",
      icon: IconUsers,
    },
    {
      title: "Trash",
      url: "#",
      icon: IconTrash,
    },
    {
      title: "Ai Assistant",
      url: "#",
      icon: Bot,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        { title: "Active Proposals", url: "#" },
        { title: "Archived", url: "#" },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        { title: "Active Proposals", url: "#" },
        { title: "Archived", url: "#" },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        { title: "Active Proposals", url: "#" },
        { title: "Archived", url: "#" },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Vault",
      url: "#",
      icon: Server,
    },
    {
      name: "Access logs",
      url: "#",
      icon: ScrollText,
    },
  ],
};

interface StorageGD {
  limit: number;
  usage: number;
  usageInDrive: number;
  usageInDriveTrash: number;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isLinked, setIsLinked] = React.useState(false);
  const [storage, setStorage] = React.useState<StorageGD | null>(null);

  const handleCheckStorage = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/google/storage"
      );
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    const linked = localStorage.getItem("googleDriveLinked");
    setIsLinked(linked === "true");
  });

  React.useEffect(() => {
    const fetchStorage = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/google/storage"
        );

        console.log(response.data.formattedQuota);
        setStorage(response.data.formattedQuota);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStorage();
  }, []);

  const handleLinkGoogleAccount = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/auth/google");
      const { url } = response.data; // Your server should return { url: googleAuthUrl }
      window.location.href = url; // Redirect the user’s browser to the Google consent screen
    } catch (error) {
      console.error("Failed to start Google OAuth:", error);
    }
  };
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">STORER HULL</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <StorageUsageBar provider={"Googel Drive"} usedGB={storage?.usage} totalGB={storage?.limit} />

        {isLinked ? (
          <Button disabled>✅ Linked</Button>
        ) : (
          <Button onClick={handleLinkGoogleAccount}>Link Google Account</Button>
        )}

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
