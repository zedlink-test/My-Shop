# E-commerce Web App Implementation Plan

## Goal
Create a modern, responsive e-commerce app with:
- **Public Store**: Product browsing, cart, checkout with Wilaya-based delivery calculation.
- **Admin Dashboard**: Secure (email/password) area to manage products and orders.
- **Integration**: Send orders to Telegram Bot.

## Architecture
- **Frontend**: React + Vite
- **Styling**: Tailwind CSS + Framer Motion.
- **State Management**: React Context.
- **Persistence**: LocalStorage.
- **Routing**: React Router DOM.

## Components
- **Public**: Navbar, Hero, ProductList, Cart, Checkout.
- **Admin**: Login, Dashboard, ProductManager.

## Steps
1.  **Config**: Tailwind, PostCSS.
2.  **Context**: ShopContext, AuthContext.
3.  **Data**: Wilayas list.
4.  **UI**: Components & Pages.
5.  **Logic**: Checkout & Telegram.
