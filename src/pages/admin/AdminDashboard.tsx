import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Package, ShoppingBag, LogOut, Home, Edit } from 'lucide-react';
import { Product, Order } from '../../types';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../lib/supabase';

export const AdminDashboard: React.FC = () => {
    const { products, addProduct, deleteProduct, updateProduct, loading } = useShop();
    const [orders, setOrders] = useState<Order[]>([]);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'products' | 'orders'>('orders');
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Fetch Orders
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('date', { ascending: false });

        if (error) console.error("Error fetching orders:", error);
        else setOrders(data || []);
    };

    const updateOrderStatus = async (id: string, status: Order['status']) => {
        try {
            await supabase.from('orders').update({ status }).eq('id', id);
            fetchOrders();
        } catch (error) {
            console.error("Error updating order status: ", error);
        }
    };

    const deleteOrder = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                await supabase.from('orders').delete().eq('id', id);
                fetchOrders();
            } catch (error) {
                console.error("Error deleting order:", error);
            }
        }
    };

    // New Product Form State
    const [newProduct, setNewProduct] = useState<Partial<Product>>({
        name: '', description: '', price: 0, category: '', image: '', sizes: []
    });
    const [sizeInput, setSizeInput] = useState({ size: '', price: 0 });

    const handleLogout = () => {
        logout();
        navigate('/admin');
    };

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProduct.name || !newProduct.price) return;

        try {
            const productData = {
                name: newProduct.name!,
                description: newProduct.description || '',
                price: Number(newProduct.price),
                category: newProduct.category || 'General',
                image: newProduct.image || 'https://via.placeholder.com/300',
                sizes: newProduct.sizes
            };

            if (editingProduct) {
                await updateProduct(editingProduct.id, productData);
            } else {
                await addProduct(productData as Product);
            }

            setShowAddProduct(false);
            setEditingProduct(null);
            setNewProduct({ name: '', description: '', price: 0, category: '', image: '', sizes: [] });
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Failed to save product. Please try again.");
        }
    };

    const startEdit = (product: Product) => {
        setEditingProduct(product);
        setNewProduct(product);
        setShowAddProduct(true);
    };

    const addSize = () => {
        if (sizeInput.size && sizeInput.price) {
            setNewProduct(prev => ({
                ...prev,
                sizes: [...(prev.sizes || []), { size: sizeInput.size, price: Number(sizeInput.price) }]
            }));
            setSizeInput({ size: '', price: 0 });
        }
    };

    const handleTestConnection = async () => {
        alert("Starting Supabase connection test...");
        console.log("Starting connection test...");

        try {
            // 1. Check Internet
            try {
                await fetch('https://www.google.com/favicon.ico', { mode: 'no-cors' });
                console.log("Internet check passed");
            } catch (e) {
                throw new Error("NO_INTERNET");
            }

            // 2. Check Supabase Connection
            const { data, error } = await supabase.from('products').select('count', { count: 'exact', head: true });

            if (error) throw error;

            console.log("Supabase connection successful");
            alert("✅ Database Connection Verified! Read access is working.");
        } catch (error: any) {
            console.error("Connection Test Failed:", error);
            let msg = "❌ Connection Failed.\n";
            if (error.message === "NO_INTERNET") {
                msg += "Reason: NO INTERNET. Your device is offline.";
            } else {
                msg += `Error: ${error.message}`;
            }
            alert(msg);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm px-4 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">{t('adminDashboard')}</h1>
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    {/* <button
                        onClick={handleTestConnection}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200"
                    >
                        Test Database
                    </button> */}
                    <LanguageSwitcher />
                    <Link to="/" className="text-gray-600 hover:text-primary flex items-center">
                        <Home className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
                        {t('goToHome')}
                    </Link>
                    <button onClick={handleLogout} className="flex items-center text-red-500 hover:text-red-700">
                        <LogOut className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" /> {t('logout')}
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center ${activeTab === 'orders' ? 'bg-black text-white' : 'bg-white text-gray-600'}`}
                    >
                        <ShoppingBag className="mr-2 w-5 h-5" /> {t('orders')} ({orders.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center ${activeTab === 'products' ? 'bg-black text-white' : 'bg-white text-gray-600'}`}
                    >
                        <Package className="mr-2 w-5 h-5" /> {t('products')} ({products.length})
                    </button>
                </div>

                {activeTab === 'orders' ? (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm">
                                <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                                    <div className="mb-4 md:mb-0">
                                        <h3 className="font-bold text-lg">Order #{order.id.slice(0, 8)}</h3>
                                        <p className="text-gray-500 text-sm">{new Date(order.date).toLocaleString()}</p>
                                        <div className="mt-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                {order.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-left md:text-right">
                                        <p className="font-bold text-xl">{order.total} DZD</p>
                                        <p className="text-sm text-gray-500">Delivery: {order.deliveryFee} DZD</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 border-t pt-4">
                                    <div>
                                        <h4 className="font-medium mb-2">Customer</h4>
                                        <p>{order.customer.fullName}</p>
                                        <p>{order.customer.phone}</p>
                                        <p>{order.customer.address}</p>
                                        <p>{order.customer.commune}, {order.customer.wilaya}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">Items</h4>
                                        <ul className="space-y-1">
                                            {order.items.map((item, idx) => (
                                                <li key={idx} className="text-sm">
                                                    {item.quantity}x {item.name} ({item.selectedSize || 'Std'}) - {item.finalPrice} DZD
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-end space-x-2">
                                    <button
                                        onClick={() => deleteOrder(order.id)}
                                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200 flex items-center"
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                                    </button>
                                    {order.status === 'pending' && (
                                        <button
                                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                                        >
                                            Confirm Order
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {orders.length === 0 && <div className="text-center py-10 text-gray-500">No orders yet</div>}
                    </div>
                ) : (
                    <div>
                        <div className="flex justify-end mb-6">
                            <button
                                onClick={() => setShowAddProduct(!showAddProduct)}
                                className="btn-primary flex items-center"
                            >
                                <Plus className="mr-2 w-5 h-5" /> Add Product
                            </button>
                        </div>

                        {showAddProduct && (
                            <div className="bg-white p-6 rounded-xl shadow-sm mb-8 animate-in fade-in slide-in-from-top-4">
                                <h3 className="font-bold text-lg mb-4">{editingProduct ? 'Edit Product' : 'New Product'}</h3>
                                <form onSubmit={handleSaveProduct} className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <input
                                            placeholder="Product Name"
                                            className="input-field"
                                            value={newProduct.name}
                                            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                        />
                                        <input
                                            placeholder="Base Price"
                                            type="number"
                                            className="input-field"
                                            value={newProduct.price || ''}
                                            onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                                        />
                                    </div>
                                    <textarea
                                        placeholder="Description"
                                        className="input-field"
                                        value={newProduct.description}
                                        onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                    />
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">{t('imageURL')}</label>
                                        <div className="flex flex-col space-y-2">
                                            <input
                                                placeholder="https://example.com/image.jpg"
                                                className="input-field"
                                                value={newProduct.image}
                                                onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                                            />
                                            {newProduct.image && (
                                                <img src={newProduct.image} alt="Preview" className="w-full h-48 object-cover rounded-lg mt-2" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="border p-4 rounded-lg">
                                        <h4 className="font-medium mb-2">Sizes (Optional)</h4>
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                placeholder="Size (e.g. XL)"
                                                className="input-field"
                                                value={sizeInput.size}
                                                onChange={e => setSizeInput({ ...sizeInput, size: e.target.value })}
                                            />
                                            <input
                                                placeholder="Price"
                                                type="number"
                                                className="input-field"
                                                value={sizeInput.price || ''}
                                                onChange={e => setSizeInput({ ...sizeInput, price: Number(e.target.value) })}
                                            />
                                            <button type="button" onClick={addSize} className="px-4 bg-gray-200 rounded-lg">Add</button>
                                        </div>
                                        <div className="flex gap-2 flex-wrap">
                                            {newProduct.sizes?.map((s, idx) => (
                                                <span key={idx} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                                                    {s.size}: {s.price} DZD
                                                    <button
                                                        type="button"
                                                        onClick={() => setNewProduct(prev => ({
                                                            ...prev,
                                                            sizes: prev.sizes?.filter((_, i) => i !== idx)
                                                        }))}
                                                        className="ml-2 text-red-500 hover:text-red-700 font-bold"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <button type="submit" className="btn-primary w-full">
                                        {editingProduct ? 'Update Product' : 'Save Product'}
                                    </button>
                                </form>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map(product => (
                                <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm flex gap-4">
                                    <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-lg" />
                                    <div className="flex-1">
                                        <h4 className="font-bold">{product.name}</h4>
                                        <p className="text-sm text-gray-500">{product.price} DZD</p>
                                        <div className="flex space-x-2 mt-2">
                                            <button
                                                onClick={() => startEdit(product)}
                                                className="text-blue-500 text-sm flex items-center hover:underline"
                                            >
                                                <Edit className="w-4 h-4 mr-1" /> Edit
                                            </button>
                                            <button
                                                onClick={() => deleteProduct(product.id)}
                                                className="text-red-500 text-sm flex items-center hover:underline"
                                            >
                                                <Trash2 className="w-4 h-4 mr-1" /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {activeTab === 'products' && loading && (
                    <div className="text-center py-10">Loading products...</div>
                )}
            </div>
        </div>
    );
};
