import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { products, addToCart } = useShop();
    const navigate = useNavigate();

    const product = products.find(p => p.id === id);
    const [selectedSize, setSelectedSize] = useState<string>('');

    if (!product) {
        return <div className="text-center py-20">Product not found</div>;
    }

    const currentPrice = selectedSize && product.sizes
        ? product.sizes.find(s => s.size === selectedSize)?.price || product.price
        : product.price;

    const handleAddToCart = () => {
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            alert('Please select a size');
            return;
        }
        addToCart(product, selectedSize);
        navigate('/cart');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-black mb-8">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>

            <div className="grid md:grid-cols-2 gap-12">
                <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>

                <div>
                    <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                    <p className="text-3xl font-bold text-primary mb-6">{currentPrice} DZD</p>

                    <p className="text-gray-600 mb-8 leading-relaxed">
                        {product.description}
                    </p>

                    {product.sizes && product.sizes.length > 0 && (
                        <div className="mb-8">
                            <h3 className="font-medium mb-3">Select Size</h3>
                            <div className="flex flex-wrap gap-3">
                                {product.sizes.map(s => (
                                    <button
                                        key={s.size}
                                        onClick={() => setSelectedSize(s.size)}
                                        className={`px-4 py-2 rounded-lg border transition-all ${selectedSize === s.size
                                                ? 'border-black bg-black text-white'
                                                : 'border-gray-200 hover:border-black'
                                            }`}
                                    >
                                        {s.size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleAddToCart}
                        className="w-full md:w-auto px-8 py-4 bg-primary text-white rounded-full font-bold hover:bg-gray-800 transition-all flex items-center justify-center"
                    >
                        <ShoppingBag className="mr-2 w-5 h-5" /> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};
