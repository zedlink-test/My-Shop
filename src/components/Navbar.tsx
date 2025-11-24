
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';

export const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { cart } = useShop();
    const { t } = useLanguage();

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <video
                            src="https://cdn-icons-mp4.flaticon.com/512/19018/19018325.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-10 h-10 animate-logo-move rounded-full"
                        />
                        <span className="text-2xl font-bold text-[#24010e] tracking-wider uppercase">
                            {t('logoText')}
                        </span>
                    </Link>

                    <div className="hidden md:flex gap-12 items-center">
                        <Link to="/" className="text-gray-700 hover:text-primary transition">{t('home')}</Link>
                        <Link to="/products" className="text-gray-700 hover:text-primary transition">{t('products')}</Link>
                        <Link to="/contact" className="text-gray-700 hover:text-primary transition">{t('contact')}</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />
                        <Link to="/cart" className="relative text-gray-700 hover:text-primary transition">
                            <ShoppingCart className="w-6 h-6" />
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {cart.length}
                                </span>
                            )}
                        </Link>
                        <Link to="/admin" className="text-gray-700 hover:text-primary transition">
                            <User className="w-6 h-6" />
                        </Link>

                        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-700">
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">{t('home')}</Link>
                        <Link to="/products" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">{t('products')}</Link>
                        <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">{t('contact')}</Link>
                    </div>
                </div>
            )}
        </nav>
    );
};
