import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { HeroCarousel } from '../components/HeroCarousel';
import { useLanguage } from '../context/LanguageContext';

export const Home: React.FC = () => {
    const { products, loading } = useShop();
    const { t } = useLanguage();
    const featuredProducts = products.slice(0, 4);

    if (loading) {
        return <div className="flex justify-center items-center min-h-[50vh]">Loading products...</div>;
    }

    return (
        <div className="space-y-8 md:space-y-16 pb-16">
            {/* Hero Section */}
            <HeroCarousel />

            {/* Featured Products */}
            <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold mb-2 text-[#24010e]">{t('featuredProducts')}</h2>
                        <p className="text-[#a16e02]">{t('heroSubtitle')}</p>
                    </div>
                    <Link to="/products" className="text-[#24010e] font-medium hover:text-[#a16e02] transition-colors">
                        {t('viewAll')}
                    </Link>
                </div>

                {featuredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
                        <p className="text-gray-500">No products available yet. Check back soon!</p>
                    </div>
                )}
            </section>

            {/* Features Banner */}
            <section className="bg-[#24010e] text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm">
                        <h3 className="text-xl font-bold mb-2 text-[#a16e02]">{t('premiumQuality')}</h3>
                        <p className="text-gray-300">{t('premiumQualityDesc')}</p>
                    </div>
                    <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm">
                        <h3 className="text-xl font-bold mb-2 text-[#a16e02]">{t('fastDelivery')}</h3>
                        <p className="text-gray-300">{t('fastDeliveryDesc')}</p>
                    </div>
                    <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm">
                        <h3 className="text-xl font-bold mb-2 text-[#a16e02]">{t('securePayment')}</h3>
                        <p className="text-gray-300">{t('securePaymentDesc')}</p>
                    </div>
                </div>
            </section>
        </div>
    );
};
