
import { Link } from "react-router-dom";
import { SlideUpInView } from "@/components/ui/motion";

export function PitchSimulatorBanner() {
  return (
    <SlideUpInView delay={0.1}>
      <section>
        <div className="rounded-xl border bg-card p-6 md:p-8">
          <div className="mb-6 text-center">
            <h2 className="mb-2 text-2xl font-bold">Ready to pitch like a pro?</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Practice your pitch, get feedback, and refine your presentation skills
              with our interactive Pitch Simulator.
            </p>
          </div>
          <div className="flex justify-center">
            <Link
              to="/pitch-simulator"
              className="rounded-lg bg-shark-500 px-6 py-3 font-medium text-white shadow-sm transition-colors hover:bg-shark-600"
            >
              Try the Pitch Simulator
            </Link>
          </div>
        </div>
      </section>
    </SlideUpInView>
  );
}
