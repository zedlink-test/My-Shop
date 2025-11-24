import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export const Success: React.FC = () => {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
            <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-gray-500 mb-8 max-w-md">
                Thank you for your purchase. We have received your order and will contact you shortly for confirmation.
            </p>
            <Link to="/" className="btn-primary">
                Back to Home
            </Link>
        </div>
    );
};
