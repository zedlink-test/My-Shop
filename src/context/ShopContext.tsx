import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order } from '../types';
import { supabase } from '../lib/supabase';

interface ShopContextType {
    products: Product[];
    cart: CartItem[];
    loading: boolean;
    addToCart: (product: Product, size?: string) => void;
    removeFromCart: (productId: string, size?: string) => void;
    updateQuantity: (productId: string, size: string | undefined, quantity: number) => void;
    clearCart: () => void;
    addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
    addOrder: (order: Order) => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch Products
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*');

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product: Product, size?: string) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id && item.selectedSize === size);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id && item.selectedSize === size
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            const price = size && product.sizes
                ? product.sizes.find(s => s.size === size)?.price || product.price
                : product.price;

            return [...prev, { ...product, selectedSize: size, quantity: 1, finalPrice: price }];
        });
    };

    const removeFromCart = (productId: string, size?: string) => {
        setCart(prev => prev.filter(item => !(item.id === productId && item.selectedSize === size)));
    };

    const updateQuantity = (productId: string, size: string | undefined, quantity: number) => {
        if (quantity < 1) return;
        setCart(prev => prev.map(item =>
            item.id === productId && item.selectedSize === size
                ? { ...item, quantity }
                : item
        ));
    };

    const clearCart = () => setCart([]);

    const addProduct = async (product: Omit<Product, 'id'>) => {
        const { error } = await supabase.from('products').insert([product]);
        if (error) console.error("Error adding product:", error);
        else fetchProducts();
    };

    const deleteProduct = async (id: string) => {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) console.error("Error deleting product:", error);
        else fetchProducts();
    };

    const updateProduct = async (id: string, updates: Partial<Product>) => {
        const { error } = await supabase.from('products').update(updates).eq('id', id);
        if (error) console.error("Error updating product:", error);
        else fetchProducts();
    };

    const addOrder = async (order: Order) => {
        const { error } = await supabase.from('orders').insert([order]);
        if (error) console.error("Error adding order:", error);
        else clearCart();
    };

    return (
        <ShopContext.Provider value={{
            products,
            cart,
            loading,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            addProduct,
            deleteProduct,
            updateProduct,
            addOrder
        }}>
            {children}
        </ShopContext.Provider>
    );
};

export const useShop = () => {
    const context = useContext(ShopContext);
    if (!context) throw new Error('useShop must be used within a ShopProvider');
    return context;
};
