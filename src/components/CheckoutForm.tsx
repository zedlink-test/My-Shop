import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useShop } from '../context/ShopContext';
import { wilayas } from '../data/wilayas';
import { sendOrderToTelegram } from '../utils/telegram';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface CheckoutInputs {
    fullName: string;
    phone: string;
    address: string;
    wilayaId: string;
    commune: string;
}

export const CheckoutForm: React.FC = () => {
    const { cart, addOrder } = useShop();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutInputs>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const selectedWilayaId = watch('wilayaId');
    const [deliveryFee, setDeliveryFee] = useState(0);

    useEffect(() => {
        const wilaya = wilayas.find(w => w.id === Number(selectedWilayaId));
        setDeliveryFee(wilaya ? wilaya.deliveryPrice : 0);
    }, [selectedWilayaId]);

    const subtotal = cart.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
    const total = subtotal + deliveryFee;

    const onSubmit = async (data: CheckoutInputs) => {
        setIsSubmitting(true);
        try {
            const wilayaName = wilayas.find(w => w.id === Number(data.wilayaId))?.name || '';

            const order = {
                id: crypto.randomUUID(),
                customer: {
                    fullName: data.fullName,
                    phone: data.phone,
                    address: data.address,
                    wilaya: wilayaName,
                    commune: data.commune
                },
                items: [...cart],
                total,
                deliveryFee,
                status: 'pending' as const,
                date: new Date().toISOString()
            };

            // Send to Telegram (don't block if it fails)
            try {
                await sendOrderToTelegram(order);
            } catch (err) {
                console.error("Telegram notification failed:", err);
            }

            // Save order and clear cart
            await addOrder(order);

            navigate('/success');
        } catch (error) {
            console.error("Checkout error:", error);
            alert("There was an error processing your order. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cart.length === 0) {
        return <div className="text-center py-10">Your cart is empty.</div>;
    }

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold mb-6">Shipping Details</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            {...register('fullName', { required: 'Full name is required' })}
                            className="input-field"
                            placeholder="John Doe"
                        />
                        {errors.fullName && <span className="text-red-500 text-sm">{errors.fullName.message}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                            {...register('phone', { required: 'Phone is required' })}
                            className="input-field"
                            placeholder="0550..."
                        />
                        {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <textarea
                            {...register('address', { required: 'Address is required' })}
                            className="input-field min-h-[80px]"
                            placeholder="Street address..."
                        />
                        {errors.address && <span className="text-red-500 text-sm">{errors.address.message}</span>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Wilaya</label>
                            <select
                                {...register('wilayaId', { required: 'Select a wilaya' })}
                                className="input-field"
                            >
                                <option value="">Select Wilaya</option>
                                {wilayas.map(w => (
                                    <option key={w.id} value={w.id}>{w.id} - {w.name}</option>
                                ))}
                            </select>
                            {errors.wilayaId && <span className="text-red-500 text-sm">{errors.wilayaId.message}</span>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Commune</label>
                            <input
                                {...register('commune', { required: 'Commune is required' })}
                                className="input-field"
                                placeholder="Commune"
                            />
                            {errors.commune && <span className="text-red-500 text-sm">{errors.commune.message}</span>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-primary mt-6 flex justify-center items-center"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : 'Confirm Order'}
                    </button>
                </form>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl h-fit">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                    {cart.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <span className="text-gray-500 text-sm">x{item.quantity}</span>
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    {item.selectedSize && <p className="text-xs text-gray-500">Size: {item.selectedSize}</p>}
                                </div>
                            </div>
                            <span className="font-medium">{item.finalPrice * item.quantity} DZD</span>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>{subtotal} DZD</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Delivery</span>
                        <span>{deliveryFee} DZD</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold mt-4">
                        <span>Total</span>
                        <span>{total} DZD</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
