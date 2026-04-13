import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Rocket, Clock, BookOpen } from "lucide-react";

const courses = [
  { id: 1, title: "WhatsApp AI Setup", desc: "Deploy a 24/7 AI sales assistant on WhatsApp Business in under 30 minutes.", lessons: 8, duration: "2h 15m", level: "Beginner", color: "bg-success/10" },
  { id: 2, title: "Inventory Automation", desc: "Sync your POS inventory across Shopee, Tokopedia, and TikTok Shop automatically.", lessons: 6, duration: "1h 45m", level: "Intermediate", color: "bg-info/10" },
  { id: 3, title: "AI Lead Qualification", desc: "Train your AI to qualify leads and route hot prospects to your sales team.", lessons: 5, duration: "1h 30m", level: "Intermediate", color: "bg-warning/10" },
  { id: 4, title: "Smart Order Processing", desc: "Automate order confirmations, payment checks, and shipping notifications.", lessons: 7, duration: "2h", level: "Beginner", color: "bg-primary/10" },
  { id: 5, title: "Customer Feedback AI", desc: "Collect, categorize, and respond to customer feedback at scale with AI.", lessons: 4, duration: "1h", level: "Beginner", color: "bg-destructive/10" },
  { id: 6, title: "Multi-Channel Campaigns", desc: "Launch coordinated marketing blasts across all your connected channels.", lessons: 9, duration: "3h", level: "Advanced", color: "bg-accent" },
];

const lessonContent = [
  "Introduction & Prerequisites",
  "Setting Up Your API Connection",
  "Configuring AI Response Templates",
  "Training on Your Product Catalog",
  "Testing & Quality Assurance",
  "Going Live & Monitoring",
  "Advanced Customization",
  "Scaling & Optimization",
];

export default function Academy() {
  const [selected, setSelected] = useState<number | null>(null);
  const course = courses.find((c) => c.id === selected);

  if (course) {
    return (
      <div className="space-y-6 animate-fade-in">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to courses
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="aspect-video rounded-xl bg-muted flex items-center justify-center border">
              <div className="text-center space-y-2">
                <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Play className="h-7 w-7 text-primary ml-1" />
                </div>
                <p className="text-sm text-muted-foreground">Video Player — {course.title}</p>
              </div>
            </div>
            <h1 className="text-xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground text-sm">{course.desc}</p>
            <Button size="lg" className="gap-2">
              <Rocket className="h-4 w-4" /> Deploy this AI Template
            </Button>
          </div>
          <Card>
            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold text-sm">Lessons</h3>
              {lessonContent.slice(0, course.lessons).map((l, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/60 cursor-pointer transition-colors">
                  <span className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm">{l}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Academy</h1>
        <p className="text-muted-foreground text-sm mt-1">Learn, then deploy. Every course connects directly to an AI template.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((c) => (
          <Card key={c.id} className="cursor-pointer hover:shadow-md transition-shadow group" onClick={() => setSelected(c.id)}>
            <CardContent className="p-5 space-y-3">
              <div className={`h-32 rounded-lg ${c.color} flex items-center justify-center`}>
                <BookOpen className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <Badge variant="secondary" className="text-[10px]">{c.level}</Badge>
              <h3 className="font-semibold group-hover:text-primary transition-colors">{c.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{c.desc}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {c.lessons} lessons</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {c.duration}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
