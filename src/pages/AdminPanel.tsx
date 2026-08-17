import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
// ToastAction removed: we use simple toasts for confirm actions
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus, LogOut, Loader2, Upload, Edit } from 'lucide-react';
import { supabase, uploadFile } from '@/lib/supabaseClient';

interface Product {
  id: string;
  name: string;
  short_description: string;
  full_description: string;
  price_cents: number;
  image_url: string;
  created_at?: string | null;
}

const AdminPanel = () => {
  const { isAdmin, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editSelectedFile, setEditSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState<'overview' | 'products'>('overview');
  const [newProduct, setNewProduct] = useState({
    name: '',
    short_description: '',
    full_description: '',
    price_cents: 0,
    image_url: '',
  });

  // 🟢 Fetch products from Supabase
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/login');
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('cworth_products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({ title: 'Error fetching products', description: error.message });
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [authLoading, isAdmin, navigate, toast]);

  // 🟣 Add new product (from modal)
  const handleAddProduct = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setUploading(true);

    try {
      let imageUrl = newProduct.image_url;

      // Upload file if selected
      if (selectedFile) {
        imageUrl = await uploadFile(selectedFile);
      }

      const payload = {
        name: newProduct.name,
        short_description: newProduct.short_description,
        full_description: newProduct.full_description,
        price_cents: Number(newProduct.price_cents),
        image_url: imageUrl,
      };

      const { data, error } = await supabase
        .from('cworth_products')
        .insert([payload])
        .select();

      if (error) {
        toast({ title: 'Failed to add product', description: error.message });
      } else {
        toast({ title: 'Product added successfully!' });
        setProducts((prev) => [data![0], ...prev]);
        setIsAddOpen(false);
        setNewProduct({ name: '', short_description: '', full_description: '', price_cents: 0, image_url: '' });
        setSelectedFile(null);
      }
    } catch (error: any) {
      toast({ title: 'Upload failed', description: error.message });
    } finally {
      setUploading(false);
    }
  };

  // 🔴 Delete product (confirm then delete)
  const handleDelete = async (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    const ok = window.confirm(`Delete "${product.name}"? This action cannot be undone.`);
    if (!ok) return;

    const { error } = await supabase.from('cworth_products').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error deleting product', description: error.message });
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast({ title: 'Product deleted' });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (authLoading) return null;
  if (!isAdmin) return null;

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.short_description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SkeletonCard = () => (
    <div className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-muted rounded" />
        <div className="space-y-2">
          <div className="w-40 h-4 bg-muted rounded" />
          <div className="w-24 h-4 bg-muted rounded" />
        </div>
      </div>
      <div className="w-8 h-8 bg-muted rounded" />
    </div>
  );

  // Open edit modal with selected product
  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setEditSelectedFile(null);
    setIsEditOpen(true);
  };

  const handleSaveEdit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!editingProduct) return;
    setUploading(true);

    try {
      let imageUrl = editingProduct.image_url;
      if (editSelectedFile) {
        imageUrl = await uploadFile(editSelectedFile);
      }

      const payload = {
        name: editingProduct.name,
        short_description: editingProduct.short_description,
        full_description: editingProduct.full_description,
        price_cents: Number(editingProduct.price_cents),
        image_url: imageUrl,
      };

      const { data, error } = await supabase
        .from('cworth_products')
        .update(payload)
        .eq('id', editingProduct.id)
        .select();

      if (error) {
        toast({ title: 'Failed to update', description: error.message });
      } else {
        // replace in local state
        setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? data![0] : p)));
        setIsEditOpen(false);
        setEditingProduct(null);
        setEditSelectedFile(null);
        toast({ title: 'Product updated' });
      }
    } catch (err: any) {
      toast({ title: 'Update failed', description: err.message || String(err) });
    } finally {
      setUploading(false);
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background relative text-xs md:text-sm leading-tight">
      {/* Universal Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsSidebarOpen(!isSidebarOpen);
                setIsCollapsed(!isCollapsed);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="font-semibold">Cworth Solar Energy Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 bg-card border-r border-border transform transition-all duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 ${isCollapsed ? 'w-16' : 'w-64'}`}
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">CE</span>
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <h2 className="font-semibold truncate">Cworth Solar Energy</h2>
                <p className="text-xs text-muted-foreground">Admin Panel</p>
              </div>
            )}
          </div>
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => {
                  setActiveSection('overview');
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${activeSection === 'overview'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-muted-foreground hover:bg-muted/50'
                  }`}
                title="Overview"
              >
                <span className="w-5 h-5">📊</span>
                {!isCollapsed && <span>Overview</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveSection('products');
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${activeSection === 'products'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-muted-foreground hover:bg-muted/50'
                  }`}
                title="Products"
              >
                <span className="w-5 h-5">📦</span>
                {!isCollapsed && <span>Products</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main
        className={`transition-all duration-200 ease-in-out ${isCollapsed ? 'md:ml-16' : 'md:ml-64'
          } mt-16 pb-6`}
      >
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold mb-1">
              {activeSection === 'overview' ? 'Dashboard' : 'Products'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {activeSection === 'overview'
                ? "Here's what's happening with your product listings today."
                : 'Manage your product listings'}
            </p>
          </div>
          <div className="p-6">
            {activeSection === 'overview' ? (
              // Overview Dashboard
              <div>
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg mb-6">
                  <h2 className="text-2xl font-bold mb-2">Welcome back, Admin!</h2>
                  <p className="text-blue-100">Here's what's happening with your product listings today.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {/* Total Products */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-xl">📦</span>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{products.length}</p>
                          <p className="text-xs text-muted-foreground">Total Products</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Total Value */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-2">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-xl">💰</span>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">
                            ₦{new Intl.NumberFormat('en-NG').format(
                              products.reduce((sum, p) => sum + (p.price_cents || 0), 0)
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">Total Value</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>



                  {/* Added This Month */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-2">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-xl">📅</span>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">
                            {products.filter(p => {
                              const date = new Date();
                              const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                              return new Date(p.created_at as any) >= firstDay;
                            }).length}
                          </p>
                          <p className="text-xs text-muted-foreground">Added This Month</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Products */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {products.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">No products yet</p>
                    ) : (
                      <div className="space-y-4">
                        {products.slice(0, 3).map((product) => (
                          <div key={product.id} className="flex items-center gap-4 p-3 hover:bg-muted/50 rounded">
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{product.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                ₦{new Intl.NumberFormat('en-NG').format(product.price_cents)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              // Products Management Section
              <div>

                {/* Products Section */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">

                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-blue-500 hover:bg-blue-600">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Product
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add new product</DialogTitle>
                          <DialogDescription>Fill in product details and upload an image.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddProduct} className="space-y-4 mb-2">
                          <div className="space-y-2">
                            <Label htmlFor="name">Product Name</Label>
                            <Input
                              id="name"
                              value={newProduct.name}
                              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="shortDesc">Short Description</Label>
                            <Input
                              id="shortDesc"
                              value={newProduct.short_description}
                              onChange={(e) => setNewProduct({ ...newProduct, short_description: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="fullDesc">Full Description</Label>
                            <Textarea
                              id="fullDesc"
                              value={newProduct.full_description}
                              onChange={(e) => setNewProduct({ ...newProduct, full_description: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="price">Price (₦)</Label>
                            <Input
                              id="price"
                              type="number"
                              value={newProduct.price_cents as any}
                              onChange={(e) => setNewProduct({ ...newProduct, price_cents: Number(e.target.value) })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="image">Product Image</Label>
                            <Input
                              id="image"
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setSelectedFile(file);
                                  const previewUrl = URL.createObjectURL(file);
                                  setNewProduct({ ...newProduct, image_url: previewUrl });
                                }
                              }}
                            />
                            {selectedFile && (
                              <div className="mt-2">
                                <img src={newProduct.image_url} alt="Preview" className="w-24 h-24 object-cover rounded border" />
                                <p className="text-sm text-muted-foreground mt-1">{selectedFile.name}</p>
                              </div>
                            )}
                          </div>
                          <DialogFooter>
                            <div className="flex gap-2">
                              <Button type="submit" disabled={uploading}>
                                {uploading ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Uploading...
                                  </>
                                ) : (
                                  <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Add Product
                                  </>
                                )}
                              </Button>
                              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} disabled={uploading}>Cancel</Button>
                            </div>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Search Bar */}
                  <div className="mb-4">
                    <Input
                      placeholder="Search products..."
                      className="max-w-md"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Products Grid/List */}
                <Card>
                  <CardContent className="p-0">
                    {loading ? (
                      <div className="p-6 space-y-4">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                      </div>
                    ) : filteredProducts.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="text-6xl mb-4">📦</div>
                        <p className="text-xl font-medium text-muted-foreground mb-2">
                          No products found.
                        </p>
                        <p className="text-sm text-muted-foreground mb-6">
                          {searchTerm ? 'Try adjusting your search criteria.' : 'Start building your solar product catalog by adding your first product.'}
                        </p>
                        {!searchTerm && (
                          <Button onClick={() => setIsAddOpen(true)} size="lg">
                            <Plus className="mr-2 h-5 w-5" /> Add Your First Product
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="divide-y divide-border">
                        {filteredProducts.map((product) => (
                          <div key={product.id} className="flex flex-col sm:flex-row gap-4 p-4 hover:bg-muted/50 transition-colors">
                            <div className="w-full sm:w-32 h-32 flex-shrink-0">
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h3 className="font-medium text-lg mb-1 line-clamp-1">{product.name}</h3>
                                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                    {product.short_description}
                                  </p>
                                  <div className="font-bold text-lg text-primary mb-2 sm:mb-0">
                                    ₦{new Intl.NumberFormat('en-NG').format(product.price_cents)}
                                  </div>
                                </div>
                                <div className="flex gap-2 sm:flex-col">
                                  <Button size="sm" variant="outline" className="flex-1 sm:flex-none" onClick={() => openEdit(product)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </Button>
                                  <Button size="sm" variant="outline" className="flex-1 sm:flex-none text-red-500 hover:text-red-600" onClick={() => handleDelete(product.id)}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                {/* Edit product modal */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                  <DialogContent className="w-full max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit product</DialogTitle>
                      <DialogDescription>Modify product details and save changes.</DialogDescription>
                    </DialogHeader>
                    {editingProduct && (
                      <div className="max-h-[70vh] overflow-auto">
                        <form onSubmit={handleSaveEdit} className="space-y-4 mb-2">
                          <div className="space-y-2">
                            <Label htmlFor="edit-name">Product Name</Label>
                            <Input id="edit-name" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-short">Short Description</Label>
                            <Input id="edit-short" value={editingProduct.short_description} onChange={(e) => setEditingProduct({ ...editingProduct, short_description: e.target.value })} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-full">Full Description</Label>
                            <Textarea id="edit-full" value={editingProduct.full_description} onChange={(e) => setEditingProduct({ ...editingProduct, full_description: e.target.value })} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-price">Price (₦)</Label>
                            <Input id="edit-price" type="number" value={editingProduct.price_cents as any} onChange={(e) => setEditingProduct({ ...editingProduct, price_cents: Number(e.target.value) })} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-image">Product Image</Label>
                            <Input id="edit-image" type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { setEditSelectedFile(file); const preview = URL.createObjectURL(file); setEditingProduct({ ...editingProduct, image_url: preview }); } }} />
                            <div className="mt-2">
                              <img src={editingProduct.image_url} alt={editingProduct.name} className="w-24 h-24 object-cover rounded border" />
                            </div>
                          </div>
                          <DialogFooter>
                            <div className="flex gap-2">
                              <Button type="submit" disabled={uploading}>{uploading ? 'Saving...' : 'Save changes'}</Button>
                              <Button type="button" variant="outline" onClick={() => { setIsEditOpen(false); setEditingProduct(null); setEditSelectedFile(null); }}>Cancel</Button>
                            </div>
                          </DialogFooter>
                        </form>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
