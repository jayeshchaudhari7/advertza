/**
 * Admin Inquiries Page
 * 
 * Displays lead inquiries submitted from service page "Get Free Audit" forms.
 * Each inquiry has a `source` field showing which service page it came from.
 * 
 * Features:
 *  - Table view with name, email, phone, budget, source page, date
 *  - Filter dropdown by source page (e.g. "Google Ads Management")
 *  - Delete functionality
 *  - Graceful offline handling
 */

import { useState, useEffect } from "react";
import { Trash2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { inquiriesApi, Inquiry } from "@/services/api";

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sourceFilter, setSourceFilter] = useState("all");
  const [offline, setOffline] = useState(false);

  /** Fetch inquiries from the API, filtered by source if selected */
  const fetchInquiries = async () => {
    try {
      const { inquiries: data } = await inquiriesApi.getAll(sourceFilter);
      setInquiries(data);
      setOffline(false);
    } catch {
      setInquiries([]);
      setOffline(true);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch whenever the source filter changes
  useEffect(() => { fetchInquiries(); }, [sourceFilter]);

  /** Delete an inquiry and update local state */
  const deleteInquiry = async (id: string) => {
    try {
      await inquiriesApi.delete(id);
      setInquiries(inquiries.filter(i => i._id !== id));
      toast({ title: "Inquiry deleted" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  // Build unique source list for the filter dropdown
  const sources = [...new Set(inquiries.map(i => i.source).filter(Boolean))];

  if (loading) {
    return <div className="flex items-center justify-center h-48"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with source filter */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inquiries</h1>
          <p className="text-muted-foreground mt-1">
            Lead inquiries from service & industry pages
            {offline && <Badge variant="outline" className="ml-2 text-orange-500 border-orange-300">Offline</Badge>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
          >
            <option value="all">All Sources</option>
            {sources.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Inquiries table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {inquiries.length} Inquir{inquiries.length === 1 ? "y" : "ies"}
            {sourceFilter !== "all" && <span className="text-muted-foreground font-normal"> from {sourceFilter}</span>}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Phone</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Budget</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Source Page</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {inquiries.map(inq => (
                  <tr key={inq._id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{inq.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{inq.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{inq.phone || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{inq.budget || "—"}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">{inq.source || "Unknown"}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(inq.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm" onClick={() => deleteInquiry(inq._id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {inquiries.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No inquiries yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInquiries;
