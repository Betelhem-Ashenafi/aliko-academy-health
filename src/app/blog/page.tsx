import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const blogPosts = [
  {
    id: "how-to-prepare-for-cna-classes",
    title: "How to Prepare for Your CNA Classes: What to Expect",
    excerpt:
      "Starting CNA training can feel overwhelming. Here's everything you need to know about what to expect during your first weeks, from classroom instruction to hands-on lab skills practice.",
    category: "Training Advice",
    date: "March 10, 2026",
    readTime: "5 min read",
  },
  {
    id: "cna-interview-preparation-guide",
    title: "CNA Interview Preparation: Top Questions & How to Answer Them",
    excerpt:
      "Landing your first CNA job starts with acing the interview. Learn the most common CNA interview questions and proven strategies to present yourself as the ideal candidate.",
    category: "Career Tips",
    date: "March 5, 2026",
    readTime: "7 min read",
  },
  {
    id: "career-paths-after-cna-certification",
    title: "5 Career Paths You Can Pursue After CNA Certification",
    excerpt:
      "A CNA certification is more than a job — it's a launchpad for your healthcare career. Discover the many career paths available to certified nursing assistants.",
    category: "Career Guidance",
    date: "February 28, 2026",
    readTime: "6 min read",
  },
  {
    id: "understanding-washington-cna-requirements",
    title: "Understanding Washington State CNA Requirements in 2026",
    excerpt:
      "Stay up to date with Washington State's CNA certification requirements, including training hours, exam details, background checks, and license renewal processes.",
    category: "Certification",
    date: "February 20, 2026",
    readTime: "4 min read",
  },
  {
    id: "benefits-of-healthcare-career",
    title: "Why a Healthcare Career Is One of the Best Choices You Can Make",
    excerpt:
      "Job security, competitive pay, flexible schedules, and the chance to make a real difference — discover why healthcare careers continue to be among the most rewarding in the job market.",
    category: "Career Guidance",
    date: "February 15, 2026",
    readTime: "5 min read",
  },
  {
    id: "what-to-expect-during-clinical-rotations",
    title: "What to Expect During Your CNA Clinical Rotations",
    excerpt:
      "Clinical rotations are where classroom learning meets real-world patient care. Here's what to expect, how to prepare, and tips for making the most of your clinical experience.",
    category: "Training Advice",
    date: "February 10, 2026",
    readTime: "6 min read",
  },
];

export default function BlogPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-card to-accent/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

        <div className="container-academy relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-1 w-12 bg-accent rounded-full" />
            <span className="text-sm font-medium text-accent">
              Insights & Advice
            </span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-primary">Blog</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
            Expert advice, career tips, and training insights to help you
            succeed in your healthcare career journey.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container-academy">
          {/* Featured Post */}
          <div className="mb-12">
            <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 lg:p-8">
                <Badge className="bg-white/20 text-white border-white/30 mb-4">
                  Featured Article
                </Badge>
                <h2 className="text-2xl lg:text-3xl font-bold mb-3">
                  {blogPosts[0].title}
                </h2>
                <p className="text-primary-foreground/80 mb-4 max-w-2xl">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-primary-foreground/70">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {blogPosts[0].date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {blogPosts[0].readTime}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Blog Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(1).map((post) => (
              <Card
                key={post.id}
                className="group flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader className="pb-3">
                  <Badge
                    variant="outline"
                    className="w-fit mb-2 text-xs border-primary/30 text-primary"
                  >
                    {post.category}
                  </Badge>
                  <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readTime}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 relative text-center bg-gradient-to-br from-primary/10 via-card to-accent/10 rounded-2xl p-8 lg:p-12 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            <div className="relative">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                Ready to Start Your Healthcare Career?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Don&apos;t just read about it — take the first step. Explore our
                programs and apply today.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="shadow-lg">
                  <Link href="/programs">
                    View Programs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/apply">Apply Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
