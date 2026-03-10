import { useState } from "react";
import { CalendarIcon, Clock, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { bookingsApi } from "@/services/api";

const timeSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

const budgetOptions = [
  { value: "<1500", label: "Less than £1,500 / ₹1.5L" },
  { value: "1500-5000", label: "£1,500–5,000 / ₹1.5–5L" },
  { value: "5000-15000", label: "£5,000–15,000 / ₹5–15L" },
  { value: "15000+", label: "£15,000+ / ₹15L+" },
];

const queryTypes = [
  { value: "google-ads", label: "Google Ads" },
  { value: "meta-ads", label: "Meta Ads" },
  { value: "tiktok-ads", label: "TikTok Ads" },
  { value: "amazon-ads", label: "Amazon Ads" },
  { value: "shopify", label: "Shopify" },
  { value: "email-marketing", label: "Email Marketing" },
  { value: "seo-analytics", label: "SEO / Analytics" },
  { value: "other", label: "Other" },
];

/**
 * Reusable Consultation Booking Form
 * 
 * Used on: Homepage hero, Contact page
 * Submits to /api/bookings — visible in Admin > Bookings
 */
const ConsultationForm = ({ className }: { className?: string }) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [timezone, setTimezone] = useState("IST");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [budget, setBudget] = useState("");
  const [queryType, setQueryType] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) {
      toast({ title: "Please select a date and time", variant: "destructive" });
      return;
    }
    if (!name.trim() || !email.trim()) {
      toast({ title: "Name and email are required", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      await bookingsApi.create({
        name,
        email,
        phone,
        date: format(date, "yyyy-MM-dd"),
        time,
        timezone,
      });
      toast({
        title: "Consultation Booked!",
        description: `Scheduled for ${format(date, "PPP")} at ${time} (${timezone}).`,
      });
      // Reset form
      setDate(undefined);
      setTime("");
      setName("");
      setEmail("");
      setPhone("");
      setBudget("");
      setQueryType("");
    } catch (err: any) {
      toast({
        title: "Booking failed",
        description: err.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary";

  return (
    <div className={cn("rounded-2xl border border-border bg-background p-6 shadow-lg md:p-8", className)}>
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <CalendarIcon className="h-5 w-5 text-primary" />
        </div>
        <h2 className="mb-1 text-xl font-extrabold text-foreground md:text-2xl">Schedule a Free Consultation</h2>
        <p className="text-sm text-muted-foreground">Pick a date and time that works best for you.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Date & Timezone */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Preferred Date *</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Timezone</label>
            <select value={timezone} onChange={e => setTimezone(e.target.value)} className={inputClass}>
              <option value="IST">IST (India)</option>
              <option value="GMT">GMT (UK)</option>
              <option value="EST">EST (US East)</option>
              <option value="PST">PST (US West)</option>
            </select>
          </div>
        </div>

        {/* Time Slots */}
        <div>
          <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
            <Clock className="h-4 w-4" /> Preferred Time *
          </label>
          <div className="grid grid-cols-4 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setTime(slot)}
                className={cn(
                  "rounded-lg border px-2 py-2.5 text-xs font-medium transition-all",
                  time === slot
                    ? "border-primary bg-primary text-primary-foreground shadow-gold"
                    : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-secondary"
                )}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Name & Email */}
        <div className="grid gap-4 sm:grid-cols-2">
          <input required value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder="Name" />
          <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} placeholder="Email" />
        </div>

        {/* Phone & Budget */}
        <div className="grid gap-4 sm:grid-cols-2">
          <input value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} placeholder="Phone" />
          <select value={budget} onChange={e => setBudget(e.target.value)} className={inputClass}>
            <option value="">Budget</option>
            {budgetOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Query Type */}
        <select value={queryType} onChange={e => setQueryType(e.target.value)} className={inputClass}>
          <option value="">Query Type</option>
          {queryTypes.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-gold px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-gold transition-all hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarIcon className="h-4 w-4" />}
          {submitting ? "Booking..." : "Book Consultation"}
        </button>
      </form>
    </div>
  );
};

export default ConsultationForm;
