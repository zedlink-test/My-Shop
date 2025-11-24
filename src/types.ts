export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    sizes?: { size: string; price: number }[];
}

export interface CartItem extends Product {
    selectedSize?: string;
    quantity: number;
    finalPrice: number;
}

export interface Order {
    id: string;
    customer: {
        fullName: string;
        phone: string;
        address: string;
        wilaya: string;
        commune: string;
    };
    items: CartItem[];
    total: number;
    deliveryFee: number;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
    date: string;
}

export interface Wilaya {
    id: number;
    name: string;
    deliveryPrice: number;
}
