
import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useResponsive } from "@/hooks/use-mobile";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { FadeIn } from "@/components/ui/motion";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { isMobile, isTablet } = useResponsive();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setLoading(false);
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="mb-1.5 sm:mb-2 text-2xl xs:text-3xl font-bold md:text-4xl">Contact Us</h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
          <FadeIn>
            <Card>
              <CardHeader className="pb-2 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">Send Us a Message</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent className="h-auto sm:h-[400px]">
                <form onSubmit={handleSubmit} className="grid gap-3 sm:gap-4">
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="name" className="text-xs sm:text-sm">Name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-9 sm:h-10 text-xs sm:text-sm"
                    />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="email" className="text-xs sm:text-sm">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-9 sm:h-10 text-xs sm:text-sm"
                    />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="subject" className="text-xs sm:text-sm">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="What is this regarding?"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      className="h-9 sm:h-10 text-xs sm:text-sm"
                    />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="message" className="text-xs sm:text-sm">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Your message"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="h-[90px] sm:h-[120px] text-xs sm:text-sm"
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full h-9 sm:h-10 text-xs sm:text-sm" 
                  onClick={handleSubmit} 
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Message"}
                  <Send className="ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </CardFooter>
            </Card>
          </FadeIn>

          <FadeIn delay={0.1}>
            <Card>
              <CardHeader className="pb-2 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">Contact Information</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Here's how you can reach us directly or find our office.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border bg-card p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 text-shark-500" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="mt-2 text-sm text-muted-foreground">For support:</p>
                      <a href="mailto:support@sharksenz.com" className="text-shark-600 hover:underline">
                        support@sharksenz.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-card p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 text-shark-500" />
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-sm text-muted-foreground">Main office:</p>
                      <a href="tel:+15551234567" className="text-shark-600 hover:underline">
                        (555) 123-4567
                      </a>
                      <p className="mt-2 text-sm text-muted-foreground">Support line:</p>
                      <a href="tel:+15557891234" className="text-shark-600 hover:underline">
                        (555) 789-1234
                      </a>
                    </div>
                  </div>
                </div>

                {/* 
                <div className="rounded-lg border bg-card p-4 shadow-sm">
                          <div className="flex items-start gap-3">
                          <MapPin className="mt-0.5 h-5 w-5 text-shark-500" />
                          <div>
                            <h3 className="font-medium">Address</h3>
                            <p className="text-sm text-muted-foreground">
                            123 Business Avenue<br />
                            Suite 500<br />
                            San Francisco, CA 94105
                            </p>
                          </div>
                          </div>
                        </div>
                */}

                <div className="rounded-lg border bg-card p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-5 w-5 text-shark-500" />
                    <div>
                      <h3 className="font-medium">Business Hours</h3>
                      <p className="text-sm text-muted-foreground">Monday - Friday:</p>
                      <p className="text-shark-600">9:00 AM - 6:00 PM PST</p>
                      <p className="mt-2 text-sm text-muted-foreground">Saturday - Sunday:</p>
                      <p className="text-shark-600">Closed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </MainLayout>
  );
}
