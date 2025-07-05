import { ArrowRight, Award, Briefcase, FileCheck, Globe, Heart, Users } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

const AboutUs = () => {
  const teamRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animation for story section
    if (storyRef.current) {
      gsap.from(".story-content", {
        opacity: 0,
        y: 30,
        duration: 0.7,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: storyRef.current,
          start: "top 75%"
        }
      });
    }

    // Animation for team section
    if (teamRef.current) {
      gsap.from(".team-member", {
        opacity: 0,
        y: 40,
        stagger: 0.15,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: teamRef.current,
          start: "top 75%"
        }
      });
    }

    // Animation for values section
    if (valuesRef.current) {
      gsap.from(".value-card", {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.5,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: valuesRef.current,
          start: "top 80%"
        }
      });
    }
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">About SharkSenz</h1>
          <p className="text-xl text-gray-700 mb-8">
            Empowering startup founders with the knowledge and tools they need to build successful ventures
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/pricing"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium inline-flex items-center transition-colors"
            >
              View Our Pricing <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="bg-white border border-blue-200 hover:border-blue-300 text-blue-700 px-6 py-3 rounded-full font-medium inline-flex items-center transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section ref={storyRef} className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center story-content">Our Story</h2>
          <div className="space-y-4 text-gray-700">
            <p className="text-lg story-content">
              SharkSenz democratizes startup education by providing founders with the knowledge and tools previously available only through expensive programs or privileged networks.
            </p>
            <p className="text-lg story-content">
              Founded in 2023, our platform has helped 1,000+ founders turn ideas into successful ventures through practical, actionable resources spanning idea validation to scaling.
            </p>
          </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section ref={valuesRef} className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm value-card">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Heart className="text-blue-600" />
              </div>
              <h3 className="font-bold text-xl mb-3">Founders First</h3>
              <p className="text-gray-700">
                Everything we do is designed with the founder's needs in mind. We believe in empowering entrepreneurs and putting their success at the center of our mission.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm value-card">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <FileCheck className="text-blue-600" />
              </div>
              <h3 className="font-bold text-xl mb-3">Practical Knowledge</h3>
              <p className="text-gray-700">
                We focus on actionable insights rather than theoretical concepts. Every piece of content is designed to be applied immediately to real business challenges.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm value-card">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Globe className="text-blue-600" />
              </div>
              <h3 className="font-bold text-xl mb-3">Global Perspective</h3>
              <p className="text-gray-700">
                Innovation happens everywhere. We embrace diverse perspectives and ensure our resources are relevant to founders from all backgrounds and regions.
              </p>
            </div>
          </div>
        </div>
      </section>      {/* Team Section */}
      <section ref={teamRef} className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center team-member transform transition-transform duration-300 hover:scale-105">
              <div className="mx-auto mb-4 h-40 w-40 rounded-full overflow-hidden shadow-lg border-2 border-blue-100 hover:border-blue-300 transition-colors">
                <img src="/assets/team/profile.jpg" alt="Shivam M. Salunkhe" className="w-full h-full object-cover" onError={(e) => {
                  e.currentTarget.src = "/assets/team/profile.jpg"; // Fallback image
                }} />
              </div>
              <h3 className="font-bold text-xl mb-1">Shivam M. Salunkhe</h3>
              <p className="text-blue-600 mb-2">CEO & Co-Founder</p>
              <p className="text-gray-600 text-sm">Former VC and 3x startup founder with exits to Google and Meta</p>
              <div className="flex justify-center mt-3 space-x-3">
                <a href="https://linkedin.com/in/sms03" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="https://x.com/SMSxShivam" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
              </div>
            </div>

            {/*}
            <div className="text-center team-member transform transition-transform duration-300 hover:scale-105">
              <div className="mx-auto mb-4 h-40 w-40 rounded-full overflow-hidden shadow-lg border-2 border-blue-100 hover:border-blue-300 transition-colors">
                <img src="/assets/team/michael-chen.jpg" alt="Michael Chen" className="w-full h-full object-cover" onError={(e) => {
                  e.currentTarget.src = "https://i.pravatar.cc/300?img=11";
                }} />
              </div>
              <h3 className="font-bold text-xl mb-1">Michael Chen</h3>
              <p className="text-blue-600 mb-2">CTO & Co-Founder</p>
              <p className="text-gray-600 text-sm">20+ years in tech leadership at startups and Fortune 500 companies</p>
              <div className="flex justify-center mt-3 space-x-3">
                <a href="https://linkedin.com" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="https://github.com" className="text-gray-400 hover:text-gray-800 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                </a>
              </div>
            </div>
            
            <div className="text-center team-member transform transition-transform duration-300 hover:scale-105">
              <div className="mx-auto mb-4 h-40 w-40 rounded-full overflow-hidden shadow-lg border-2 border-blue-100 hover:border-blue-300 transition-colors">
                <img src="/assets/team/aisha-patel.jpg" alt="Aisha Patel" className="w-full h-full object-cover" onError={(e) => {
                  e.currentTarget.src = "https://i.pravatar.cc/300?img=5";
                }} />
              </div>
              <h3 className="font-bold text-xl mb-1">Aisha Patel</h3>
              <p className="text-blue-600 mb-2">Head of Education</p>
              <p className="text-gray-600 text-sm">Previously led startup programs at Y Combinator and Stanford</p>
              <div className="flex justify-center mt-3 space-x-3">
                <a href="https://linkedin.com" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="https://twitter.com" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
              </div>
            </div>
            
            <div className="text-center team-member transform transition-transform duration-300 hover:scale-105">
              <div className="mx-auto mb-4 h-40 w-40 rounded-full overflow-hidden shadow-lg border-2 border-blue-100 hover:border-blue-300 transition-colors">
                <img src="/assets/team/david-okafor.jpg" alt="David Okafor" className="w-full h-full object-cover" onError={(e) => {
                  e.currentTarget.src = "https://i.pravatar.cc/300?img=8";
                }} />
              </div>
              <h3 className="font-bold text-xl mb-1">David Okafor</h3>
              <p className="text-blue-600 mb-2">Head of Community</p>
              <p className="text-gray-600 text-sm">Community builder who scaled multiple startup ecosystems in Africa</p>
              <div className="flex justify-center mt-3 space-x-3">
                <a href="https://linkedin.com" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="https://instagram.com" className="text-gray-400 hover:text-pink-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
                </a>
              </div>
            </div>*/}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">1000+</div>
              <div className="text-blue-100">Startup Founders</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Learning Modules</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">20+</div>
              <div className="text-blue-100">Countries</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">92%</div>
              <div className="text-blue-100">Success Rate</div>
            </div>
          </div>
        </div>
      </section>      {/* Partners Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">Our Partners</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            We collaborate with leading organizations to bring the best resources to our founder community.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center">
            {/* Partner logos with fallbacks */}
            <div className="partner-logo transform transition-transform duration-300 hover:scale-110">
              <img 
                src="/assets/partners/techstars.png" 
                alt="Techstars" 
                className="h-12 w-auto mx-auto grayscale hover:grayscale-0 transition-all duration-300"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAxMjAgNDAiPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iNDAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSI2MCIgeT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzc3NyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+VGVjaHN0YXJzPC90ZXh0Pjwvc3ZnPg==";
                }}
              />
            </div>
            <div className="partner-logo transform transition-transform duration-300 hover:scale-110">
              <img 
                src="/assets/partners/ycombinator.png" 
                alt="Y Combinator" 
                className="h-12 w-auto mx-auto grayscale hover:grayscale-0 transition-all duration-300"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAxMjAgNDAiPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iNDAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSI2MCIgeT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzc3NyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+WSBDb21iaW5hdG9yPC90ZXh0Pjwvc3ZnPg==";
                }}
              />
            </div>
            <div className="partner-logo transform transition-transform duration-300 hover:scale-110">
              <img 
                src="/assets/partners/aws.png" 
                alt="AWS" 
                className="h-12 w-auto mx-auto grayscale hover:grayscale-0 transition-all duration-300"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAxMjAgNDAiPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iNDAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSI2MCIgeT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzc3NyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+QVdTPC90ZXh0Pjwvc3ZnPg==";
                }}
              />
            </div>
            <div className="partner-logo transform transition-transform duration-300 hover:scale-110">
              <img 
                src="/assets/partners/google.png" 
                alt="Google for Startups" 
                className="h-12 w-auto mx-auto grayscale hover:grayscale-0 transition-all duration-300"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAxMjAgNDAiPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iNDAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSI2MCIgeT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzc3NyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+R29vZ2xlIGZvciBTdGFydHVwczwvdGV4dD48L3N2Zz4=";
                }}
              />
            </div>
            <div className="partner-logo transform transition-transform duration-300 hover:scale-110">
              <img 
                src="/assets/partners/hubspot.png" 
                alt="HubSpot" 
                className="h-12 w-auto mx-auto grayscale hover:grayscale-0 transition-all duration-300"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAxMjAgNDAiPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iNDAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSI2MCIgeT0iMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzc3NyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+SHViU3BvdDwvdGV4dD48L3N2Zz4=";
                }}
              />
            </div>
          </div>
          <div className="text-center mt-12">
            <Link to="/contact" className="text-blue-600 hover:text-blue-800 inline-flex items-center font-medium">
              Become a partner <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Start Your Founder Journey Today</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Join thousands of founders who are building successful startups with SharkSenz
          </p>
          <Link
            to="/auth"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium inline-flex items-center transition-colors"
          >
            Sign Up Now <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
