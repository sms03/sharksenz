import { Link } from "react-router-dom";
import { FadeIn } from "@/components/ui/motion";
import { LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export function HeroSection() {
  const { user } = useAuth();

  return (
    <FadeIn>
      <section className="mb-12">
        <div className="rounded-xl bg-gradient-to-r from-shark-500 to-shark-700 px-6 py-12 text-white md:px-12">
          <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Welcome to SharkSenz
          </h1>
          <p className="mb-6 max-w-2xl text-shark-100 md:text-lg">
            Master the language of business and investment through interactive learning
            modules and practical tools inspired by Shark Tank.
          </p>
          <div className="flex flex-wrap gap-4">
            {user ? (
              <>
                <Link
                  to="/learning"
                  className="rounded-lg bg-white px-4 py-2 font-medium text-shark-700 shadow-sm transition-colors hover:bg-shark-50"
                >
                  Start Learning
                </Link>
                <Link
                  to="/profile"
                  className="rounded-lg bg-shark-600/30 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-shark-600/50"
                >
                  View Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="flex items-center rounded-lg bg-white px-4 py-2 font-medium text-shark-700 shadow-sm transition-colors hover:bg-shark-50"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
                <Link
                  to="/auth"
                  className="flex items-center rounded-lg bg-shark-600/30 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-shark-600/50"
                  state={{ isLogin: false }}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
