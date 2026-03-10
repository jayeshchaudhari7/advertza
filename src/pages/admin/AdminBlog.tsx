import { useState } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useBlogStore, SharedBlogPost } from "@/hooks/useBlogStore";

const categories = ["Google Ads", "Meta Ads", "TikTok Ads", "E-commerce", "Analytics", "Email Marketing"];

/** Format ISO date string or display date to readable format */
const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
};

const AdminBlog = () => {
  const { posts, addPost, updatePost, deletePost, loading, error, refetch } = useBlogStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<SharedBlogPost | null>(null);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [published, setPublished] = useState(false);

  const resetForm = () => {
    setTitle(""); setSlug(""); setExcerpt(""); setContent(""); setCategory(""); setPublished(false);
    setEditingPost(null);
  };

  const openCreate = () => { resetForm(); setDialogOpen(true); };

  const openEdit = (post: SharedBlogPost) => {
    setEditingPost(post);
    setTitle(post.title); setSlug(post.slug); setExcerpt(post.excerpt);
    setContent(post.content); setCategory(post.category); setPublished(post.published);
    setDialogOpen(true);
  };

  const estimateReadTime = (text: string) => {
    const words = text.split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / 200))} min read`;
  };

  const handleSave = async () => {
    if (!title || !slug || !category) {
      toast({ title: "Missing fields", description: "Title, slug, and category are required.", variant: "destructive" });
      return;
    }

    setSaving(true);
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    try {
      if (editingPost) {
        await updatePost(editingPost._id, { title, slug, excerpt, content, category, published, readTime: estimateReadTime(content) });
        toast({ title: "Post updated" });
      } else {
        await addPost({ title, slug, excerpt, content, category, published, date: today, readTime: estimateReadTime(content) });
        toast({ title: "Post created" });
      }
      setDialogOpen(false);
      resetForm();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Something went wrong. Is the backend running?", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost(id);
      toast({ title: "Post deleted" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to delete post", variant: "destructive" });
    }
  };

  const togglePublish = async (id: string) => {
    const post = posts.find(p => p._id === id);
    if (post) {
      try {
        await updatePost(id, { published: !post.published });
        toast({ title: post.published ? "Post unpublished" : "Post published" });
      } catch (err: any) {
        toast({ title: "Error", description: err.message || "Failed to toggle publish status", variant: "destructive" });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blog Posts</h1>
          <p className="text-muted-foreground mt-1">Create and manage blog articles</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refetch}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />New Post</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPost ? "Edit Post" : "Create New Post"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input value={title} onChange={e => { setTitle(e.target.value); if (!editingPost) setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")); }} placeholder="Post title" />
                  </div>
                  <div className="space-y-2">
                    <Label>Slug</Label>
                    <Input value={slug} onChange={e => setSlug(e.target.value)} placeholder="post-url-slug" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 flex items-end">
                    <Button variant={published ? "default" : "outline"} onClick={() => setPublished(!published)} className="w-full">
                      {published ? <><Eye className="h-4 w-4 mr-2" />Published</> : <><EyeOff className="h-4 w-4 mr-2" />Draft</>}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Excerpt</Label>
                  <Textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Short description..." rows={2} />
                </div>
                <div className="space-y-2">
                  <Label>Content</Label>
                  <p className="text-xs text-muted-foreground">Use ## at the start of a line for headings. Each paragraph on a new line.</p>
                  <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your article content here..." rows={10} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : editingPost ? "Update" : "Create"}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive">{error}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Make sure your backend is running on the correct port and MongoDB is connected.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={refetch}>Retry</Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Posts ({posts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {posts.length === 0 && !error ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-2">No blog posts yet.</p>
              <p className="text-sm text-muted-foreground">Click "New Post" to create your first article.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map(post => (
                  <TableRow key={post._id}>
                    <TableCell className="font-medium text-foreground">{post.title}</TableCell>
                    <TableCell><Badge variant="secondary">{post.category}</Badge></TableCell>
                    <TableCell>
                      <Badge variant={post.published ? "default" : "outline"} className="cursor-pointer" onClick={() => togglePublish(post._id)}>
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(post.date || post.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(post)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(post._id)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBlog;
