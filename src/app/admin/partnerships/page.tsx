"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Trash2, Handshake, Mail, Phone, Calendar, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type PartnershipInquiry = {
  id: string; organization_name: string; contact_name: string; email: string;
  phone: string | null; organization_type: string; partnership_type: string;
  message: string | null; status: string; admin_notes: string | null;
  created_at: string; updated_at: string;
};

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  in_discussion: "bg-purple-100 text-purple-800",
  approved: "bg-green-100 text-green-800",
  declined: "bg-red-100 text-red-800",
};

const statusOptions = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "in_discussion", label: "In Discussion" },
  { value: "approved", label: "Approved" },
  { value: "declined", label: "Declined" },
];

export default function AdminPartnershipsPage() {
  const [items, setItems] = useState<PartnershipInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<PartnershipInquiry | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    const { data } = await supabase.from("partnership_inquiries").select("*").order("created_at", { ascending: false });
    setItems((data as PartnershipInquiry[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openDetail = (item: PartnershipInquiry) => { setSelected(item); setAdminNotes(item.admin_notes ?? ""); setDialogOpen(true); };

  const handleStatusChange = async (newStatus: string) => {
    if (!selected) return;
    setUpdatingStatus(true);
    const { error } = await supabase.from("partnership_inquiries").update({ status: newStatus as any, admin_notes: adminNotes || null }).eq("id", selected.id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    else { toast({ title: "Status updated" }); setSelected({ ...selected, status: newStatus, admin_notes: adminNotes }); fetchData(); }
    setUpdatingStatus(false);
  };

  const handleSaveNotes = async () => {
    if (!selected) return;
    const { error } = await supabase.from("partnership_inquiries").update({ admin_notes: adminNotes || null }).eq("id", selected.id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    else { toast({ title: "Notes saved" }); fetchData(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    await supabase.from("partnership_inquiries").delete().eq("id", id);
    toast({ title: "Deleted" });
    setDialogOpen(false);
    fetchData();
  };

  const formatType = (val: string) => val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Handshake className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold font-academy">Partnership Inquiries</h1>
        </div>
        <Badge variant="secondary">{items.length} total</Badge>
      </div>

      <div className="bg-card rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organization</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Interest</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>
            ) : items.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No inquiries yet</TableCell></TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.organization_name}</TableCell>
                  <TableCell><div>{item.contact_name}</div><div className="text-xs text-muted-foreground">{item.email}</div></TableCell>
                  <TableCell className="text-sm">{formatType(item.organization_type)}</TableCell>
                  <TableCell className="text-sm">{formatType(item.partnership_type)}</TableCell>
                  <TableCell><Badge className={statusColors[item.status] ?? ""}>{formatType(item.status)}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{format(new Date(item.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openDetail(item)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Partnership Inquiry Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-6 pt-2">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div className="col-span-2 border-b pb-2 mb-1"><p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Organization</p><p className="font-semibold text-lg">{selected.organization_name}</p></div>
                <div><p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-1"><Building2 className="w-3 h-3" /> Type</p><p className="text-sm font-medium">{formatType(selected.organization_type)}</p></div>
                <div><p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-1"><Handshake className="w-3 h-3" /> Interest</p><p className="text-sm font-medium">{formatType(selected.partnership_type)}</p></div>
                <div><p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-1">Contact</p><p className="text-sm font-medium">{selected.contact_name}</p></div>
                <div><p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-1"><Mail className="w-3 h-3" /> Email</p><p className="text-sm font-medium truncate">{selected.email}</p></div>
                {selected.phone && <div><p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</p><p className="text-sm font-medium">{selected.phone}</p></div>}
                <div><p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-1"><Calendar className="w-3 h-3" /> Date</p><p className="text-sm font-medium">{format(new Date(selected.created_at), "MMM d, yyyy")}</p></div>
              </div>

              {selected.message && (
                <div><p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider mb-1">Message</p>
                  <div className="text-sm bg-muted/50 p-4 rounded-lg border whitespace-pre-wrap leading-relaxed">{selected.message}</div>
                </div>
              )}

              <div className="space-y-3 border-t pt-4">
                <div className="space-y-1"><Label className="text-xs font-semibold">Current Status</Label>
                  <Select value={selected.status} onValueChange={handleStatusChange} disabled={updatingStatus}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{statusOptions.map((s) => (<SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1"><Label className="text-xs font-semibold">Admin Notes</Label>
                  <Textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} rows={3} placeholder="Internal follow-up notes..." className="resize-none" />
                  <div className="flex justify-end"><Button size="sm" variant="secondary" onClick={handleSaveNotes}>Save Notes</Button></div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
