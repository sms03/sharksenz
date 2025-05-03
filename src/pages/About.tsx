import MainLayout from "@/layouts/MainLayout";
import { FadeIn, FadeInStagger } from "@/components/ui/motion";
import { BarChart3, Users, Book, GraduationCap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function About() {
  const teamMembers = [
    {
      name: "Shivam M. Salunkhe",
      role: "Founder & CEO",
      bio: "Business Enthusiast",
      avatar: "/me.png",
    },
  ];

  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">About SharkSenz</h1>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground md:text-xl">
            We're on a mission to make financial education accessible and engaging for everyone
          </p>
        </div>

        <FadeInStagger>
          <div className="mb-16">
            <FadeIn>
              <div className="overflow-hidden rounded-xl bg-gradient-to-br from-shark-900 to-shark-700 p-8 text-white md:p-12">
                <div className="grid gap-6 md:grid-cols-2 md:gap-12">
                  <div>
                    <h2 className="mb-4 text-2xl font-bold md:text-3xl">Our Mission</h2>
                    <p className="text-shark-100">
                      SharkSenz was founded with a clear vision: to demystify business and financial concepts 
                      for aspiring entrepreneurs. We believe that understanding the language of business 
                      shouldn't be a barrier to success.
                    </p>
                  </div>
                  <div>
                    <h2 className="mb-4 text-2xl font-bold md:text-3xl">Our Approach</h2>
                    <p className="text-shark-100">
                      Through interactive learning modules, practical tools, and examples drawn from 
                      real-world situations, we make business concepts accessible and applicable. We're 
                      inspired by the clarity and decisiveness seen in forums like Shark Tank.
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          <div className="mb-16">
            <h2 className="mb-8 text-center text-3xl font-bold">What Sets Us Apart</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <FadeIn>
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-shark-100 text-shark-700">
                    <Book className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Practical Knowledge</h3>
                  <p className="text-muted-foreground">
                    We focus on real-world applications, not just theory. Every concept is explained 
                    with practical examples and use cases.
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-shark-100 text-shark-700">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Interactive Tools</h3>
                  <p className="text-muted-foreground">
                    Our calculators and visualizations help you apply concepts directly to your 
                    business ideas and see the results immediately.
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-shark-100 text-shark-700">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Structured Learning</h3>
                  <p className="text-muted-foreground">
                    Our curriculum builds knowledge progressively, from fundamentals to advanced 
                    concepts, keeping you engaged throughout your journey.
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="mb-8 text-center text-3xl font-bold">Meet Our Team</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((member, index) => (
                <FadeIn key={member.name} delay={index * 0.1}>
                  <div className="overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-shark-500">{member.role}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{member.bio}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          <FadeIn>
            <div className="rounded-lg border bg-muted/30 p-8 text-center">
              <h2 className="mb-4 text-2xl font-bold">Ready to start your journey?</h2>
              <p className="mb-6 text-muted-foreground">
                Join thousands of entrepreneurs who are mastering business concepts with SharkSenz
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg">
                  <Link to="/learning">
                    Start Learning
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </FadeIn>
        </FadeInStagger>
      </div>
    </MainLayout>
  );
}
