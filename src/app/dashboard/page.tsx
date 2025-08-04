
import AiInput from "@/components/ui/ai-input";
import Dashboard from "./Dashboard";
import { Button } from "@/components/ui/button";
import { AirplayIcon } from "lucide-react";

export default function Page() {
  return (
    <div>
      <Dashboard />
      <Button className="z-10 fixed bottom-4 right-2 ">
        <AirplayIcon 
          className="hover:rotate-90 z-20"
        />
      </Button>
      {/* <div className="fixed bottom-0 right-0 w-full z-10">
        <AiInput />
      </div> */}
    </div>
  );
}
