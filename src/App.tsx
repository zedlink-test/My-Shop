import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Success } from './pages/Success';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <>{children}</> : <Navigate to="/admin" />;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow bg-gray-50">
                {children}
            </main>
            <Footer />
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <LanguageProvider>
                <ShopProvider>
                    <Router>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Layout><Home /></Layout>} />
                            <Route path="/products" element={<Layout><Products /></Layout>} />
                            <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
                            <Route path="/cart" element={<Layout><Cart /></Layout>} />
                            <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
                            <Route path="/success" element={<Layout><Success /></Layout>} />
                            <Route path="/contact" element={<Layout><div className="text-center py-20">Contact Page Placeholder</div></Layout>} />

                            {/* Admin Routes */}
                            <Route path="/admin" element={<AdminLogin />} />
                            <Route path="/admin/dashboard" element={
                                <ProtectedRoute>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            } />
                        </Routes>
                    </Router>
                </ShopProvider>
            </LanguageProvider>
        </AuthProvider>
    );
}

export default App;
