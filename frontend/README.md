# SwiftServe – Next.js Frontend

Multi-service eCommerce super app built with Next.js 14, Zustand, and Tailwind CSS.

## 🚀 Quick Start

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Home – service selector + featured products
│   ├── food/               # Food delivery service
│   ├── grocery/            # Grocery delivery service
│   ├── laundry/            # Laundry scheduling service
│   ├── clothing/           # Fashion & clothing service
│   ├── product/[id]/       # Product detail page
│   ├── orders/             # Order history list
│   ├── orders/[id]/        # Order detail + live tracking
│   ├── checkout/           # 3-step checkout flow
│   ├── wishlist/           # Saved items
│   ├── search/             # Cross-service search with filters
│   ├── notifications/      # Notification center
│   ├── payment/            # Payment success/failure page
│   ├── profile/            # User profile + settings
│   ├── vendor/             # Vendor management panel
│   ├── vendor/products/new # Add new product form
│   ├── admin/              # Admin dashboard & management
│   └── auth/               # Login / Register
│
├── components/
│   ├── layout/             # Sidebar, Topbar (with search + notifications)
│   ├── cart/               # CartPanel (slide-in drawer)
│   ├── product/            # ProductCard
│   ├── service/            # ServicePage (shared across food/grocery/clothing)
│   ├── shared/             # ServiceHero, VendorCard, SectionHeader
│   ├── tracking/           # OrderTracker (live simulation)
│   └── notifications/      # NotificationBell (dropdown)
│
├── store/                  # Zustand state management
│   ├── cartStore.ts        # Cart items, qty, totals — persisted
│   ├── wishlistStore.ts    # Wishlist product IDs — persisted
│   ├── notificationStore.ts # In-app notifications — persisted
│   └── authStore.ts        # User auth state — persisted
│
├── data/                   # Static mock data (replaces with API)
├── types/                  # TypeScript interfaces
└── lib/                    # Utility functions (cn, formatPrice, etc.)
```

## 🧩 Modules Built

| Module | Route | Features |
|--------|-------|---------|
| **Home** | `/` | Hero, 4 service cards, featured products, recent orders |
| **Food** | `/food` | Restaurants, categories, veg filter, sort, add to cart |
| **Grocery** | `/grocery` | Products by category, organic filter, cart |
| **Laundry** | `/laundry` | Service selector, scheduling form, vendor picker |
| **Clothing** | `/clothing` | Products with color/size variants, filters |
| **Product Detail** | `/product/[id]` | Images, variants, reviews, qty, wishlist, add to cart |
| **Search** | `/search` | Cross-service search, price filter, sort, veg toggle |
| **Cart** | Slide panel | Live qty update, totals, checkout CTA |
| **Checkout** | `/checkout` | 3 steps: cart → address → payment → confirmation |
| **Orders** | `/orders` | List with status filter tabs |
| **Order Detail** | `/orders/[id]` | Live tracker, refund, review, share |
| **Wishlist** | `/wishlist` | Grouped by service, clear all |
| **Notifications** | `/notifications` | Grouped by date, mark read, delete |
| **Profile** | `/profile` | Orders, addresses, settings, password, logout |
| **Vendor Panel** | `/vendor` | Orders, products table, earnings chart, settings |
| **Add Product** | `/vendor/products/new` | Full product form with variants, tags, images |
| **Admin Panel** | `/admin` | Dashboard, bar chart, users, vendors, orders, reports |
| **Auth** | `/auth` | Login, register, Google OAuth, demo role switcher |
| **Payment** | `/payment` | Success/failed/pending status page |

## 🗄️ State Management (Zustand + persist)

- **Cart**: add, remove, update qty, clear — survives refresh
- **Wishlist**: toggle, persisted per user
- **Notifications**: unread count, mark read/all, delete
- **Auth**: login, logout, updateProfile, role-based UI

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router, SSR + SSG)
- **Styling**: Tailwind CSS with custom design tokens
- **State**: Zustand with persist middleware
- **Fonts**: Syne (headings) + DM Sans (body)
- **Icons**: Lucide React
- **Toasts**: react-hot-toast
- **TypeScript**: Full type coverage
