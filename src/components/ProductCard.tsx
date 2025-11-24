import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { ShoppingBag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { t } = useLanguage();

    return (
        <div className="glass-card overflow-hidden group hover:-translate-y-2 transition-all duration-300">
            <div className="relative aspect-[4/5] overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#24010e]/60 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-0 right-0 px-4">
                    <Link
                        to={`/product/${product.id}`}
                        className="w-full btn-primary py-2 text-sm flex items-center justify-center gap-2"
                    >
                        <ShoppingBag className="w-4 h-4" /> {t('viewDetails')}
                    </Link>
                </div>
            </div>

            <div className="p-5 text-center">
                <h3 className="font-bold text-lg text-[#24010e] mb-1">{product.name}</h3>
                <p className="text-[#a16e02] font-medium">{product.price} DZD</p>
            </div>
        </div>
    );
};
