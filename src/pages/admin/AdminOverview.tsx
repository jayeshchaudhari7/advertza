/**
 * Admin Overview / Dashboard
 * 
 * Displays aggregate stats from /api/analytics/overview:
 *  - Total blog posts
 *  - Total bookings (with pending count)
 *  - Total inquiries (from service pages)
 *  - Backend connection status
 * 
 * Falls back to mock data when the backend is unavailable.
 */

import { useState, useEffect } from "react";
import { FileText, Calendar, ClipboardList, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { analyticsApi, AnalyticsOverview } from "@/services/api";

/** Mock stats shown when the backend API is unreachable */
const mockStats: AnalyticsOverview = {
  totalPosts: 6,
  totalBookings: 24,
  pendingBookings: 8,
  totalInquiries: 12,
};

const AdminOverview = () => {
  const [stats, setStats] = useState<AnalyticsOverview>(mockStats);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    analyticsApi.getOverview()
      .then(data => { setStats(data); setOffline(false); })
      .catch(() => { setOffline(true); });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back to Advertza admin panel
          {offline && <Badge variant="outline" className="ml-2 text-orange-500 border-orange-300">Offline mode — connect backend to see live data</Badge>}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Blog posts count */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Blog Posts</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalPosts}</div>
            <p className="text-xs text-muted-foreground mt-1">Published articles</p>
          </CardContent>
        </Card>

        {/* Bookings count — from Home/Contact consultation form */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-orange-500 font-medium">{stats.pendingBookings} pending</span>
            </p>
          </CardContent>
        </Card>

        {/* Inquiries count — from service page forms */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inquiries</CardTitle>
            <ClipboardList className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalInquiries}</div>
            <p className="text-xs text-muted-foreground mt-1">From service pages</p>
          </CardContent>
        </Card>

        {/* Backend connection status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
            <AlertCircle className={`h-4 w-4 ${offline ? "text-orange-500" : "text-green-500"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${offline ? "text-orange-500" : "text-green-500"}`}>
              {offline ? "Offline" : "Active"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {offline ? "Backend not connected" : "All systems running"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
