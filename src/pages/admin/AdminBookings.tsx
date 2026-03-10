/**
 * Admin Bookings Page
 * 
 * Displays consultation bookings submitted from the ConsultationForm
 * (used on Homepage hero & Contact page → /api/bookings).
 * 
 * Features:
 *  - Table view with name, contact, date/time, status
 *  - Filter by status (pending / confirmed / cancelled)
 *  - Confirm or cancel pending bookings
 *  - Falls back to mock data when backend is unavailable
 */

import { useState, useEffect } from "react";
import { Check, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { bookingsApi, Booking } from "@/services/api";

/** Mock data shown when the backend API is unreachable */
const mockBookings: Booking[] = [
  { _id: "1", name: "John Doe", email: "john@example.com", phone: "+1234567890", date: "2024-02-15", time: "10:00 AM", timezone: "IST", status: "pending", createdAt: "2024-02-10" },
  { _id: "2", name: "Sarah Smith", email: "sarah@example.com", phone: "+1987654321", date: "2024-02-16", time: "2:00 PM", timezone: "GMT", status: "confirmed", createdAt: "2024-02-09" },
  { _id: "3", name: "Mike Johnson", email: "mike@example.com", phone: "+1122334455", date: "2024-02-17", time: "11:00 AM", timezone: "IST", status: "cancelled", createdAt: "2024-02-08" },
];

/** Status badge colour mapping */
const statusColors: Record<string, string> = {
  pending: "bg-orange-100 text-orange-700 border-orange-200",
  confirmed: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  /** Fetch bookings from the API; fall back to mock data on failure */
  const fetchBookings = async () => {
    try {
      const { bookings: data } = await bookingsApi.getAll();
      setBookings(data);
      setOffline(false);
    } catch {
      console.warn("Bookings API unavailable, using mock data");
      setBookings(mockBookings);
      setOffline(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  /** Apply client-side status filter */
  const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter);

  /** Update a booking's status (confirm / cancel) */
  const updateStatus = async (id: string, status: Booking["status"]) => {
    try {
      if (offline) {
        // Optimistic update in offline mode
        setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
      } else {
        await bookingsApi.updateStatus(id, status);
        await fetchBookings();
      }
      toast({ title: `Booking ${status}` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-48"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with status filter */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Consultation Bookings</h1>
          <p className="text-muted-foreground mt-1">
            Manage consultation requests from Home & Contact page
            {offline && <Badge variant="outline" className="ml-2 text-orange-500 border-orange-300">Offline mode</Badge>}
          </p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ({bookings.length})</SelectItem>
            <SelectItem value="pending">Pending ({bookings.filter(b => b.status === "pending").length})</SelectItem>
            <SelectItem value="confirmed">Confirmed ({bookings.filter(b => b.status === "confirmed").length})</SelectItem>
            <SelectItem value="cancelled">Cancelled ({bookings.filter(b => b.status === "cancelled").length})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookings table */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Bookings ({filtered.length})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(booking => (
                <TableRow key={booking._id}>
                  <TableCell>
                    <div className="font-medium text-foreground">{booking.name}</div>
                    <div className="text-xs text-muted-foreground">Booked {booking.createdAt}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{booking.email}</div>
                    <div className="text-xs text-muted-foreground">{booking.phone}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{booking.date}</div>
                    <div className="text-xs text-muted-foreground">{booking.time} ({booking.timezone})</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[booking.status]}>
                      {booking.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {booking.status === "pending" && (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => updateStatus(booking._id, "confirmed")} className="text-green-600 hover:text-green-700">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => updateStatus(booking._id, "cancelled")} className="text-destructive hover:text-destructive">
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBookings;
