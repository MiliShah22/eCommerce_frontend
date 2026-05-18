import type { Product, Vendor, Order } from '@/types'

export const VENDORS: Record<string, Vendor[]> = {
  food: [
    { id: 'v1', name: 'Spice Garden', emoji: '🍛', tags: ['Indian', 'Biryani', 'Curries'], rating: 4.8, deliveryTime: '25–35 min', isOpen: true, minOrder: 149, color: 'rgba(255,107,53,0.15)', service: 'food' },
    { id: 'v2', name: 'Pizza Palace', emoji: '🍕', tags: ['Italian', 'Pizza', 'Pasta'], rating: 4.5, deliveryTime: '30–40 min', isOpen: true, minOrder: 199, color: 'rgba(255,200,50,0.15)', service: 'food' },
    { id: 'v3', name: 'Burger Barn', emoji: '🍔', tags: ['American', 'Burgers', 'Fries'], rating: 4.3, deliveryTime: '20–30 min', isOpen: true, minOrder: 129, color: 'rgba(255,140,50,0.15)', service: 'food' },
    { id: 'v4', name: 'Dragon Wok', emoji: '🍜', tags: ['Chinese', 'Noodles', 'Dim Sum'], rating: 4.6, deliveryTime: '35–45 min', isOpen: false, minOrder: 179, color: 'rgba(200,50,50,0.15)', service: 'food' },
  ],
  grocery: [
    { id: 'v5', name: 'Fresh Farms', emoji: '🥬', tags: ['Organic', 'Vegetables', 'Fruits'], rating: 4.7, deliveryTime: '60–90 min', isOpen: true, minOrder: 299, color: 'rgba(0,200,150,0.15)', service: 'grocery' },
    { id: 'v6', name: 'Daily Needs', emoji: '🛒', tags: ['Dairy', 'Packaged', 'Snacks'], rating: 4.4, deliveryTime: '45–60 min', isOpen: true, minOrder: 199, color: 'rgba(0,150,200,0.15)', service: 'grocery' },
  ],
  laundry: [
    { id: 'v7', name: 'CleanPro Laundry', emoji: '🧺', tags: ['Express', 'Premium Quality'], rating: 4.9, deliveryTime: '24–48 hrs', isOpen: true, minOrder: 0, color: 'rgba(124,111,255,0.15)', service: 'laundry' },
    { id: 'v8', name: 'SparkleFresh', emoji: '✨', tags: ['Eco-friendly', 'Budget'], rating: 4.6, deliveryTime: '48–72 hrs', isOpen: true, minOrder: 0, color: 'rgba(180,111,255,0.15)', service: 'laundry' },
  ],
  clothing: [
    { id: 'v9', name: 'Urban Threads', emoji: '👗', tags: ['Casual', 'Western', 'Trending'], rating: 4.5, deliveryTime: '2–5 days', isOpen: true, minOrder: 0, color: 'rgba(255,77,158,0.15)', service: 'clothing' },
    { id: 'v10', name: 'Desi Wardrobe', emoji: '🥻', tags: ['Ethnic', 'Kurtas', 'Sarees'], rating: 4.7, deliveryTime: '3–7 days', isOpen: true, minOrder: 0, color: 'rgba(255,150,50,0.15)', service: 'clothing' },
  ],
}

export const PRODUCTS: Record<string, Product[]> = {
  food: [
    { id: 'p1', name: 'Chicken Biryani', vendor: 'Spice Garden', vendorId: 'v1', price: 249, originalPrice: 299, emoji: '🍛', badge: 'bestseller', rating: 4.8, reviews: 312, category: 'Biryani', service: 'food', isVeg: false, description: 'Fragrant basmati rice slow-cooked with tender chicken pieces, whole spices, and saffron. Served with raita and mirchi ka salan.', inStock: true },
    { id: 'p2', name: 'Paneer Tikka Masala', vendor: 'Spice Garden', vendorId: 'v1', price: 199, emoji: '🧆', badge: 'veg', rating: 4.6, reviews: 189, category: 'Curries', service: 'food', isVeg: true, description: 'Soft paneer cubes in a rich, creamy tomato-based gravy with aromatic spices.', inStock: true },
    { id: 'p3', name: 'Margherita Pizza', vendor: 'Pizza Palace', vendorId: 'v2', price: 349, originalPrice: 399, emoji: '🍕', badge: undefined, rating: 4.5, reviews: 245, category: 'Pizza', service: 'food', isVeg: true, description: 'Classic Neapolitan pizza with San Marzano tomato sauce, fresh mozzarella, and basil on a thin crust.', inStock: true },
    { id: 'p4', name: 'Double Smash Burger', vendor: 'Burger Barn', vendorId: 'v3', price: 289, emoji: '🍔', rating: 4.4, reviews: 178, category: 'Burgers', service: 'food', isVeg: false, description: 'Two smashed beef patties with American cheese, pickles, onions, and our signature sauce.', inStock: true },
    { id: 'p5', name: 'Veg Spring Rolls', vendor: 'Dragon Wok', vendorId: 'v4', price: 159, emoji: '🥢', badge: 'veg', rating: 4.3, reviews: 95, category: 'Starters', service: 'food', isVeg: true, description: 'Crispy rolls stuffed with shredded vegetables, glass noodles, and sesame-flavored filling.', inStock: true },
    { id: 'p6', name: 'Masala Dosa', vendor: 'Spice Garden', vendorId: 'v1', price: 129, originalPrice: 149, emoji: '🫓', badge: 'veg', rating: 4.7, reviews: 421, category: 'South Indian', service: 'food', isVeg: true, description: 'Crispy golden dosa filled with spiced potato masala. Served with coconut chutney and sambar.', inStock: true },
    { id: 'p7', name: 'Chicken Wings', vendor: 'Burger Barn', vendorId: 'v3', price: 249, emoji: '🍗', rating: 4.5, reviews: 203, category: 'Starters', service: 'food', isVeg: false, description: 'Crispy fried chicken wings tossed in smoky BBQ sauce. Served with ranch dip.', inStock: true },
    { id: 'p8', name: 'Pasta Arrabbiata', vendor: 'Pizza Palace', vendorId: 'v2', price: 299, emoji: '🍝', rating: 4.4, reviews: 134, category: 'Pasta', service: 'food', isVeg: true, description: 'Penne pasta in a spicy tomato sauce with garlic, red chilies, and fresh parsley.', inStock: true },
  ],
  grocery: [
    { id: 'g1', name: 'Organic Tomatoes', vendor: 'Fresh Farms', vendorId: 'v5', price: 49, emoji: '🍅', badge: 'organic', rating: 4.6, reviews: 88, category: 'Vegetables', service: 'grocery', unit: '500g', description: 'Farm-fresh organic tomatoes, hand-picked and naturally ripened without pesticides.', inStock: true },
    { id: 'g2', name: 'Fresh Spinach', vendor: 'Fresh Farms', vendorId: 'v5', price: 35, emoji: '🥬', badge: 'organic', rating: 4.8, reviews: 145, category: 'Vegetables', service: 'grocery', unit: '250g', description: 'Tender baby spinach leaves, washed and ready to use in salads, smoothies, or cooking.', inStock: true },
    { id: 'g3', name: 'Whole Milk 1L', vendor: 'Daily Needs', vendorId: 'v6', price: 68, emoji: '🥛', rating: 4.5, reviews: 210, category: 'Dairy', service: 'grocery', unit: '1 L', description: 'Farm-fresh full-cream milk from grass-fed cows. Pasteurized and homogenized.', inStock: true },
    { id: 'g4', name: 'Basmati Rice 5kg', vendor: 'Fresh Farms', vendorId: 'v5', price: 399, originalPrice: 449, emoji: '🌾', rating: 4.7, reviews: 302, category: 'Grains', service: 'grocery', unit: '5 kg', description: 'Premium aged basmati rice with long grains, perfect for biryanis and pulaos.', inStock: true },
    { id: 'g5', name: 'Alphonso Mangoes', vendor: 'Fresh Farms', vendorId: 'v5', price: 299, originalPrice: 350, emoji: '🥭', badge: 'seasonal', rating: 4.9, reviews: 517, category: 'Fruits', service: 'grocery', unit: '6 pcs', description: 'Authentic Ratnagiri Alphonso mangoes – the king of mangoes. Sweet, aromatic, and saffron-hued.', inStock: true },
    { id: 'g6', name: 'Greek Yogurt', vendor: 'Daily Needs', vendorId: 'v6', price: 89, emoji: '🫙', rating: 4.4, reviews: 134, category: 'Dairy', service: 'grocery', unit: '400g', description: 'Thick, creamy Greek-style yogurt made from strained full-fat milk. High in protein.', inStock: true },
    { id: 'g7', name: 'Brown Eggs', vendor: 'Daily Needs', vendorId: 'v6', price: 89, emoji: '🥚', rating: 4.6, reviews: 278, category: 'Dairy', service: 'grocery', unit: '12 pcs', description: 'Free-range brown eggs from cage-free hens. Rich in nutrients and flavor.', inStock: true },
    { id: 'g8', name: 'Avocados', vendor: 'Fresh Farms', vendorId: 'v5', price: 149, originalPrice: 179, emoji: '🥑', badge: 'trending', rating: 4.5, reviews: 199, category: 'Fruits', service: 'grocery', unit: '3 pcs', description: 'Perfectly ripe Hass avocados, creamy and buttery – ideal for toast, salads, or guacamole.', inStock: true },
  ],
  laundry: [
    { id: 'l1', name: 'Wash & Fold', vendor: 'CleanPro Laundry', vendorId: 'v7', price: 59, emoji: '👔', badge: 'popular', rating: 4.9, reviews: 428, category: 'Basic', service: 'laundry', unit: 'per kg', description: 'Professional wash, dry, and fold service. Clothes returned fresh, clean, and neatly folded within 24 hours.', inStock: true },
    { id: 'l2', name: 'Steam Iron', vendor: 'CleanPro Laundry', vendorId: 'v7', price: 25, emoji: '🪄', rating: 4.8, reviews: 356, category: 'Ironing', service: 'laundry', unit: 'per piece', description: 'Professional steam ironing for crisp, wrinkle-free garments that look freshly pressed all day.', inStock: true },
    { id: 'l3', name: 'Dry Cleaning', vendor: 'CleanPro Laundry', vendorId: 'v7', price: 149, originalPrice: 199, emoji: '🥼', badge: 'premium', rating: 4.9, reviews: 203, category: 'Dry Clean', service: 'laundry', unit: 'per piece', description: 'Expert dry cleaning for suits, formal wear, silk garments, and other delicate fabrics.', inStock: true },
    { id: 'l4', name: 'Wash + Iron Combo', vendor: 'SparkleFresh', vendorId: 'v8', price: 79, originalPrice: 99, emoji: '✨', badge: 'combo', rating: 4.6, reviews: 187, category: 'Combo', service: 'laundry', unit: 'per kg', description: 'Best value combo: full wash, dry, and professional steam ironing. Perfect for everyday laundry.', inStock: true },
    { id: 'l5', name: 'Sneaker Cleaning', vendor: 'SparkleFresh', vendorId: 'v8', price: 249, originalPrice: 299, emoji: '👟', badge: 'trending', rating: 4.7, reviews: 92, category: 'Specialty', service: 'laundry', unit: 'per pair', description: 'Deep clean and restoration service for all types of sneakers. Removes stains, odors, and restores color.', inStock: true },
    { id: 'l6', name: 'Sofa / Carpet Clean', vendor: 'CleanPro Laundry', vendorId: 'v7', price: 799, originalPrice: 999, emoji: '🛋️', rating: 4.8, reviews: 47, category: 'Home', service: 'laundry', unit: 'per piece', description: 'Professional cleaning for sofas, carpets, and curtains using industrial-grade equipment.', inStock: true },
  ],
  clothing: [
    { id: 'c1', name: 'Linen Blend Kurta', vendor: 'Desi Wardrobe', vendorId: 'v10', price: 899, originalPrice: 1299, emoji: '👘', badge: 'sale', rating: 4.7, reviews: 234, category: 'Ethnic', service: 'clothing', colors: ['Beige', 'Navy', 'White'], sizes: ['S', 'M', 'L', 'XL', 'XXL'], description: 'Premium linen-cotton blend kurta with subtle texture. Features mandarin collar and side slits.', inStock: true },
    { id: 'c2', name: 'Slim Fit Chinos', vendor: 'Urban Threads', vendorId: 'v9', price: 1299, emoji: '👖', badge: 'new', rating: 4.5, reviews: 178, category: 'Bottoms', service: 'clothing', colors: ['Khaki', 'Black', 'Olive'], sizes: ['28', '30', '32', '34', '36'], description: 'Slim-fit stretch chinos with four-way flex fabric. Perfect for office and casual wear.', inStock: true },
    { id: 'c3', name: 'Floral Maxi Dress', vendor: 'Urban Threads', vendorId: 'v9', price: 1599, originalPrice: 1999, emoji: '👗', badge: 'sale', rating: 4.8, reviews: 312, category: 'Dresses', service: 'clothing', colors: ['Pink', 'Blue'], sizes: ['XS', 'S', 'M', 'L', 'XL'], description: 'Flowing maxi dress in a vibrant floral print on soft georgette fabric. Perfect for summer evenings.', inStock: true },
    { id: 'c4', name: 'Classic Polo Tee', vendor: 'Urban Threads', vendorId: 'v9', price: 599, emoji: '👕', rating: 4.4, reviews: 445, category: 'Tops', service: 'clothing', colors: ['White', 'Navy', 'Grey'], sizes: ['S', 'M', 'L', 'XL', 'XXL'], description: 'Premium piqué cotton polo with a comfortable fit. Ribbed collar and placket with two-button closure.', inStock: true },
    { id: 'c5', name: 'Bandhani Saree', vendor: 'Desi Wardrobe', vendorId: 'v10', price: 2499, originalPrice: 3499, emoji: '🥻', badge: 'sale', rating: 4.9, reviews: 189, category: 'Ethnic', service: 'clothing', colors: ['Red', 'Blue', 'Green'], description: 'Authentic Gujarati Bandhani saree with intricate tie-dye patterns on pure georgette.', inStock: true },
    { id: 'c6', name: 'Streetwear Hoodie', vendor: 'Urban Threads', vendorId: 'v9', price: 1799, emoji: '🧥', badge: 'new', rating: 4.6, reviews: 267, category: 'Outerwear', service: 'clothing', colors: ['Black', 'White', 'Charcoal'], sizes: ['S', 'M', 'L', 'XL'], description: 'Heavyweight French terry hoodie with kangaroo pocket and relaxed fit. A wardrobe staple.', inStock: true },
    { id: 'c7', name: 'Silk Blend Dupatta', vendor: 'Desi Wardrobe', vendorId: 'v10', price: 549, originalPrice: 699, emoji: '🧣', badge: 'sale', rating: 4.6, reviews: 143, category: 'Accessories', service: 'clothing', colors: ['Gold', 'Pink', 'Green', 'Purple'], description: 'Hand-woven silk-blend dupatta with zari border and traditional motifs.', inStock: true },
    { id: 'c8', name: 'Cargo Jogger Pants', vendor: 'Urban Threads', vendorId: 'v9', price: 1099, emoji: '👖', badge: 'new', rating: 4.3, reviews: 98, category: 'Bottoms', service: 'clothing', colors: ['Olive', 'Black', 'Beige'], sizes: ['S', 'M', 'L', 'XL'], description: 'Trendy cargo joggers with multiple pockets, elastic waist, and tapered fit.', inStock: true },
  ],
}

export const ORDERS: Order[] = [
  { id: 'ORD-2024-001', service: 'food', vendor: 'Spice Garden', emoji: '🍛', items: ['Chicken Biryani ×2', 'Paneer Tikka Masala ×1'], total: 697, status: 'delivered', date: 'Today, 1:30 PM', trackingCode: 'SW-ABC123', address: '42 Alkapuri Society, Vadodara', paymentMethod: 'Razorpay UPI' },
  { id: 'ORD-2024-002', service: 'grocery', vendor: 'Fresh Farms', emoji: '🥬', items: ['Organic Tomatoes', 'Fresh Spinach', 'Alphonso Mangoes'], total: 383, status: 'preparing', date: 'Today, 11:00 AM', trackingCode: 'SW-DEF456', address: '42 Alkapuri Society, Vadodara', paymentMethod: 'Stripe Card' },
  { id: 'ORD-2024-003', service: 'laundry', vendor: 'CleanPro Laundry', emoji: '🧺', items: ['Wash & Fold 3kg', 'Dry Clean ×2'], total: 475, status: 'confirmed', date: 'Yesterday, 9:00 AM', trackingCode: 'SW-GHI789', address: '42 Alkapuri Society, Vadodara', paymentMethod: 'COD' },
  { id: 'ORD-2024-004', service: 'clothing', vendor: 'Urban Threads', emoji: '👗', items: ['Floral Maxi Dress', 'Slim Fit Chinos'], total: 2898, status: 'pending', date: '2 days ago', trackingCode: 'SW-JKL012', address: '42 Alkapuri Society, Vadodara', paymentMethod: 'Razorpay UPI' },
  { id: 'ORD-2024-005', service: 'food', vendor: 'Burger Barn', emoji: '🍔', items: ['Double Smash Burger ×2', 'Chicken Wings ×1'], total: 827, status: 'delivered', date: '3 days ago', trackingCode: 'SW-MNO345', address: '42 Alkapuri Society, Vadodara', paymentMethod: 'Stripe Card' },
]

export const ALL_PRODUCTS = Object.values(PRODUCTS).flat()

export const SERVICE_CONFIG = {
  food: { label: 'Food Delivery', emoji: '🍛', color: '#ff6b35', bgColor: 'rgba(255,107,53,0.12)', description: 'Hot meals from top restaurants in 30 mins', stat: '240+ restaurants' },
  grocery: { label: 'Grocery', emoji: '🛒', color: '#00c896', bgColor: 'rgba(0,200,150,0.12)', description: 'Fresh produce & daily essentials delivered', stat: '5,000+ products' },
  laundry: { label: 'Laundry', emoji: '🧺', color: '#7c6fff', bgColor: 'rgba(124,111,255,0.12)', description: 'Wash, iron, dry-clean with free pickup', stat: 'From ₹25/piece' },
  clothing: { label: 'Fashion', emoji: '👗', color: '#ff4d9e', bgColor: 'rgba(255,77,158,0.12)', description: 'Ethnic & western styles delivered to you', stat: '10,000+ styles' },
}
