"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Building2, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

type Partner = {
  id: string; name: string; category: string; organization_type: string | null;
  region: string | null; description: string | null; programs: string[];
  hiring_roles: string | null; logo_url: string | null; website_url: string | null;
  is_active: boolean; display_order: number; created_at: string;
};

const categoryOptions = [
  { value: "clinical", label: "Clinical Partner" },
  { value: "career", label: "Career Partner" },
  { value: "sponsor", label: "Sponsor" },
];

const categoryColors: Record<string, string> = {
  clinical: "bg-primary/10 text-primary",
  career: "bg-accent/10 text-accent",
  sponsor: "bg-yellow-100 text-yellow-800",
};

const emptyForm = {
  name: "", category: "clinical" as string, organization_type: "",
  region: "", description: "", programs: [] as string[], hiring_roles: "",
  logo_url: null as string | null, website_url: "", is_active: true, display_order: 0,
};

export default function AdminPartnersPage() {
  const [items, setItems] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [programInput, setProgramInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const { toast } = useToast();

  const fetchData = async () => {
    const { data } = await supabase.from("partners").select("*").order("category").order("display_order");
    setItems((data as Partner[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setProgramInput(""); setDialogOpen(true); };
  const openEdit = (p: Partner) => {
    setEditing(p);
    setForm({
      name: p.name, category: p.category, organization_type: p.organization_type ?? "",
      region: p.region ?? "", description: p.description ?? "", programs: p.programs ?? [],
      hiring_roles: p.hiring_roles ?? "", logo_url: p.logo_url, website_url: p.website_url ?? "",
      is_active: p.is_active, display_order: p.display_order,
    });
    setProgramInput((p.programs ?? []).join(", "));
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const filePath = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const { error } = await supabase.storage.from("partner-logos").upload(filePath, file);
    if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("partner-logos").getPublicUrl(filePath);
    setForm({ ...form, logo_url: urlData.publicUrl });
    setUploading(false);
    toast({ title: "Image uploaded" });
  };

  const handleSave = async () => {
    if (!form.name) { toast({ title: "Name is required", variant: "destructive" }); return; }
    const programs = programInput.split(",").map((s) => s.trim()).filter(Boolean);
    const payload = { ...form, category: form.category as any, organization_type: form.organization_type || null, region: form.region || null, description: form.description || null, programs, hiring_roles: form.hiring_roles || null, website_url: form.website_url || null };
    if (editing) {
      const { error } = await supabase.from("partners").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("partners").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }
    toast({ title: editing ? "Updated" : "Created" });
    setDialogOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this partner?")) return;
    await supabase.from("partners").delete().eq("id", id);
    toast({ title: "Deleted" });
    fetchData();
  };

  const filtered = filterCategory === "all" ? items : items.filter((p) => p.category === filterCategory);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Building2 className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold font-academy">Partners Management</h1>
          <Badge variant="secondary">{items.length} total</Badge>
        </div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Add Partner</Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[{ value: "all", label: "All" }, ...categoryOptions].map((opt) => (
          <Button key={opt.value} variant={filterCategory === opt.value ? "default" : "outline"} size="sm" onClick={() => setFilterCategory(opt.value)}>
            {opt.label}{opt.value !== "all" && <Badge variant="secondary" className="ml-2 text-[10px]">{items.filter((p) => p.category === opt.value).length}</Badge>}
          </Button>
        ))}
      </div>

      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No partners yet</TableCell></TableRow>
            ) : filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  {p.logo_url ? (
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden border">
                      <Image src={p.logo_url} alt={p.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center border border-dashed">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{p.name}</div>
                  {p.organization_type && <div className="text-xs text-muted-foreground">{p.organization_type}</div>}
                </TableCell>
                <TableCell><Badge className={categoryColors[p.category] ?? ""}>{p.category.charAt(0).toUpperCase() + p.category.slice(1)}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.region ?? "—"}</TableCell>
                <TableCell>{p.is_active ? "✓" : "✗"}</TableCell>
                <TableCell>{p.display_order}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Partner" : "New Partner"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Logo / Image</Label>
              <div className="flex items-center gap-4">
                {form.logo_url ? (
                  <div className="relative">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                      <Image src={form.logo_url} alt="Logo" fill className="object-cover" />
                    </div>
                    <button onClick={() => setForm({ ...form, logo_url: null })} className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-md"><X className="h-3 w-3" /></button>
                  </div>
                ) : (
                  <label className="w-20 h-20 rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                    <Upload className="h-5 w-5 text-muted-foreground" /><span className="text-[10px] text-muted-foreground mt-1">Upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                )}
                {uploading && <span className="text-sm text-muted-foreground animate-pulse">Uploading...</span>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label className="text-xs uppercase font-semibold text-muted-foreground">Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-1"><Label className="text-xs uppercase font-semibold text-muted-foreground">Category *</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{categoryOptions.map((o) => (<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label className="text-xs uppercase font-semibold text-muted-foreground">Org Type</Label><Input value={form.organization_type} onChange={(e) => setForm({ ...form, organization_type: e.target.value })} placeholder="e.g. Hospital" /></div>
              <div className="space-y-1"><Label className="text-xs uppercase font-semibold text-muted-foreground">Region</Label><Input value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} placeholder="e.g. WA" /></div>
            </div>
            <div className="space-y-1"><Label className="text-xs uppercase font-semibold text-muted-foreground">Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
            <div className="space-y-1"><Label className="text-xs uppercase font-semibold text-muted-foreground">Programs</Label><Input value={programInput} onChange={(e) => setProgramInput(e.target.value)} placeholder="Comma separated list" /></div>
            <div className="space-y-1"><Label className="text-xs uppercase font-semibold text-muted-foreground">Hiring Roles</Label><Input value={form.hiring_roles} onChange={(e) => setForm({ ...form, hiring_roles: e.target.value })} placeholder="e.g. CNA, PCT" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label className="text-xs uppercase font-semibold text-muted-foreground">Website</Label><Input value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} placeholder="https://..." /></div>
              <div className="space-y-1"><Label className="text-xs uppercase font-semibold text-muted-foreground">Order</Label><Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} /></div>
            </div>
            <div className="flex items-center gap-2 pt-2"><Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} /><Label className="font-medium">Active</Label></div>
            <Button onClick={handleSave} className="w-full font-bold" disabled={uploading}>{editing ? "Update Partner" : "Create Partner"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
