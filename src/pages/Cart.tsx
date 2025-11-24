import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Trash2, ArrowRight } from 'lucide-react';

export const Cart: React.FC = () => {
    const { cart, removeFromCart, updateQuantity } = useShop();
    const navigate = useNavigate();

    const total = cart.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);

    if (cart.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <Link to="/products" className="text-primary hover:underline">Continue Shopping</Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            <div className="grid md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-6">
                    {cart.map((item, idx) => (
                        <div key={`${item.id}-${item.selectedSize}-${idx}`} className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm">
                            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold">{item.name}</h3>
                                    {item.selectedSize && <p className="text-sm text-gray-500">Size: {item.selectedSize}</p>}
                                    <div className="flex items-center space-x-2 mt-2">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="font-medium w-8 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold">{item.finalPrice * item.quantity} DZD</span>
                                    <button
                                        onClick={() => removeFromCart(item.id, item.selectedSize)}
                                        className="text-red-500 hover:text-red-700 p-2"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-gray-50 p-6 rounded-xl h-fit">
                    <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                    <div className="flex justify-between mb-4">
                        <span>Subtotal</span>
                        <span className="font-bold">{total} DZD</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-6">Shipping calculated at checkout</p>

                    <button
                        onClick={() => navigate('/checkout')}
                        className="w-full btn-primary flex justify-center items-center"
                    >
                        Proceed to Checkout <ArrowRight className="ml-2 w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};
