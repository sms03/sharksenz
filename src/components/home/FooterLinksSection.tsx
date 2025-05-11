
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SlideUpInView } from "@/components/ui/motion";

export function FooterLinksSection() {
  return (
    <SlideUpInView delay={0.2}>
      <section className="mt-12">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-card p-6 text-center shadow-sm">
            <h3 className="font-subheading-playfair mb-2 text-xl font-semibold">About Us</h3>
            <p className="font-body-merriweather mb-4 text-muted-foreground">
              Learn about our mission to make financial education accessible to everyone
            </p>
            <Button asChild variant="outline" className="font-body-merriweather">
              <Link to="/about">About SharkSenz</Link>
            </Button>
          </div>
          <div className="rounded-xl border bg-card p-6 text-center shadow-sm">
            <h3 className="font-subheading-playfair mb-2 text-xl font-semibold">Contact Us</h3>
            <p className="font-body-merriweather mb-4 text-muted-foreground">
              Have questions or feedback? We'd love to hear from you
            </p>
            <Button asChild variant="outline" className="font-body-merriweather">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </SlideUpInView>
  );
}
