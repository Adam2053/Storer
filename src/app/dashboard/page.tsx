import AiInput from "@/components/ui/ai-input";
import Dashboard from "./Dashboard";

export default function Page() {
  return (
    <div>
      <Dashboard />
      <div className="sticky bottom-0 right-0 w-full z-10">
        <AiInput />
      </div>
    </div>
  );
}
