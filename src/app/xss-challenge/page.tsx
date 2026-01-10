import { Suspense } from "react";
import { XssSimulation } from "@/components/ctf/XssSimulation";

export default function XssChallengePage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Suspense fallback={<div>Loading...</div>}>
        <XssSimulation />
      </Suspense>
    </div>
  );
}
