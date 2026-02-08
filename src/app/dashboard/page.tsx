import { Suspense } from "react";
import Dashboard from "./Dashboard";
import { Button } from "@/components/ui/button";
import { AirplayIcon } from "lucide-react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <div>
        <Dashboard />
        <Button className="z-10 fixed bottom-4 right-2">
          <AirplayIcon className="hover:rotate-90 z-20" />
        </Button>
      </div>
    </Suspense>
  );
}
