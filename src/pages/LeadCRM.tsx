import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Phone } from "lucide-react";

type Lead = { name: string; initials: string; source: string; value: string; time: string };

const columns: { title: string; color: string; leads: Lead[] }[] = [
  {
    title: "New Lead",
    color: "bg-info",
    leads: [
      { name: "Budi Santoso", initials: "BS", source: "WhatsApp", value: "Rp 2.5M", time: "10 min ago" },
      { name: "Sari Dewi", initials: "SD", source: "Shopee Chat", value: "Rp 890K", time: "25 min ago" },
      { name: "Rizki Pratama", initials: "RP", source: "TikTok", value: "Rp 1.2M", time: "1h ago" },
    ],
  },
  {
    title: "Qualified by AI",
    color: "bg-primary",
    leads: [
      { name: "Maya Putri", initials: "MP", source: "WhatsApp", value: "Rp 5.8M", time: "2h ago" },
      { name: "Hendra Wijaya", initials: "HW", source: "Website", value: "Rp 3.2M", time: "3h ago" },
    ],
  },
  {
    title: "In Discussion",
    color: "bg-warning",
    leads: [
      { name: "Tommy Liem", initials: "TL", source: "WhatsApp", value: "Rp 12M", time: "Yesterday" },
      { name: "Fitri Handayani", initials: "FH", source: "Tokopedia", value: "Rp 4.5M", time: "Yesterday" },
      { name: "Agus Setiawan", initials: "AS", source: "Walk-in", value: "Rp 8.3M", time: "2 days ago" },
    ],
  },
  {
    title: "Closed",
    color: "bg-success",
    leads: [
      { name: "Lina Marlina", initials: "LM", source: "WhatsApp", value: "Rp 6.1M", time: "3 days ago" },
      { name: "Dedi Kurniawan", initials: "DK", source: "Shopee", value: "Rp 2.9M", time: "4 days ago" },
    ],
  },
];

export default function LeadCRM() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Lead CRM</h1>
        <p className="text-muted-foreground text-sm mt-1">AI-captured leads across all your channels.</p>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <div key={col.title} className="kanban-column flex-shrink-0 w-[300px]">
            <div className="flex items-center gap-2 mb-3">
              <span className={`h-2.5 w-2.5 rounded-full ${col.color}`} />
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <Badge variant="secondary" className="ml-auto text-[10px]">{col.leads.length}</Badge>
            </div>
            <div className="space-y-2.5">
              {col.leads.map((lead) => (
                <Card key={lead.name} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-3.5 space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">{lead.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">{lead.name}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{lead.source}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-primary">{lead.value}</span>
                      <span className="text-[10px] text-muted-foreground">{lead.time}</span>
                    </div>
                    <div className="flex gap-1.5">
                      <button className="flex-1 flex items-center justify-center gap-1 text-[11px] py-1.5 rounded-md bg-muted hover:bg-muted/80 transition-colors">
                        <MessageSquare className="h-3 w-3" /> Chat
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1 text-[11px] py-1.5 rounded-md bg-muted hover:bg-muted/80 transition-colors">
                        <Phone className="h-3 w-3" /> Call
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
