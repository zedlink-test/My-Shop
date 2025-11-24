import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const fragrances = [
    {
        id: 1,
        name: "Royal Oud",
        image: "https://fimgs.net/mdimg/perfume/social.10886.jpg"
    },
    {
        id: 2,
        name: "Midnight Rose",
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2000&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "Golden Amber",
        image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=2000&auto=format&fit=crop"
    },
    {
        id: 4,
        name: "Ocean Breeze",
        image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=2000&auto=format&fit=crop"
    },
    {
        id: 5,
        name: "Velvet Musk",
        image: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=2000&auto=format&fit=crop"
    },
    {
        id: 6,
        name: "Spiced Wood",
        image: "https://noseparis.com/media/nose/media/MFK_slider_desktop.png"
    },
    {
        id: 7,
        name: "Pure Jasmine",
        image: "https://fimgs.net/mdimg/perfume/social.64947.jpg"
    }
];

export const HeroCarousel: React.FC = () => {
    const { t } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % fragrances.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % fragrances.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + fragrances.length) % fragrances.length);
    };

    return (
        <div className="relative w-full h-[80vh] overflow-hidden bg-[#24010e]">
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-transparent to-[#24010e]" />

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0"
                >
                    <img
                        src={fragrances[currentIndex].image}
                        alt={fragrances[currentIndex].name}
                        className="w-full h-full object-cover opacity-60"
                    />
                </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
                <motion.h1
                    key={`title-${currentIndex}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg"
                >
                    {t('heroTitle')}
                </motion.h1>
                <motion.p
                    key={`subtitle-${currentIndex}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl md:text-2xl text-[#a16e02] font-medium mb-8"
                >
                    {t('heroSubtitle')}
                </motion.p>
                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                    className="btn-primary text-lg px-10 py-4 pointer-events-auto"
                    onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                >
                    {t('shopNow')}
                </motion.button>
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-8 h-8" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all"
                aria-label="Next slide"
            >
                <ChevronRight className="w-8 h-8" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
                {fragrances.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? 'bg-[#a16e02] w-8' : 'bg-white/50 hover:bg-white/80'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};
