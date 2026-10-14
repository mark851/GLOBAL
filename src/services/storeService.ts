import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
  Product,
  Order,
  PaymentRecord,
  InventoryMovement,
  Coupon,
  Review,
  StoreSettings,
} from '../types';

// Default initial products matching verified packaging and specifications
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'double-root-coffee',
    name: 'Double Root Coffee (100% Arabica)',
    subtitle: 'Strong Roots • Bold Coffee • Real Results',
    description:
      'Double Root Coffee is a premier revitalizing formulation combining 100% premium Arabica coffee beans with potent botanical root extracts (Maca Root, Tongkat Ali, and Ginseng). Engineered to energize your body, awaken your senses, and support daily stamina with natural botanicals.',
    price: 175000,
    salePrice: 155000,
    stock: 45,
    sku: 'GGE-DRC-01',
    category: "Men's Wellness",
    images: ['/src/assets/images/double_root_coffee_1791963357040.jpg'],
    featured: true,
    status: 'published',
    directions:
      'Mix 1 sachet or 2 scoops with 150ml to 200ml of hot water. Stir thoroughly and enjoy in the morning or early afternoon to awaken your day.',
    ingredients:
      '100% Premium Arabica Coffee, Maca Root Extract (Lepidium meyenii), Tongkat Ali Root Extract, Ashwagandha Root, Panax Ginseng Extract.',
    packageInfo: '250g Luxury Pouch | 100% Arabica | Tamper-Evident Seal',
    manufacturer: 'Go Global Edge Labs, Manufactured under strict GMP Quality Standards',
    rating: 4.9,
    reviewCount: 46,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'slimfit-gluco-burn',
    name: 'GoGlobal Edge SlimFit Gluco-Burn Formula',
    subtitle: 'Converts Excess Fat • Moderates Appetite • 60 Vegan Capsules',
    description:
      'GoGlobal Edge SlimFit Gluco-Burn Formula is the premier targeted dietary supplement with standardized herbal extracts designed to help convert excess fat into usable energy, moderate healthy appetite, boost metabolism, and promote balanced body wellness with zero synthetic fillers.',
    price: 140000,
    salePrice: 125000,
    stock: 60,
    sku: 'GGE-SLM-02',
    category: 'Metabolic Wellness',
    images: ['/src/assets/images/goglobal_slimfit_bottle_1791963373264.jpg'],
    featured: true,
    status: 'published',
    directions:
      'Take 1 vegan capsule twice daily with water, approximately 20 to 30 minutes before your two main meals. Complement with adequate hydration.',
    ingredients:
      'Standardized Garcinia Cambogia Extract, Green Tea Extract (EGCG 50%), Berberine HCl, Chromium Picolinate, Ceylon Cinnamon Bark, Vegan Cellulose Capsule.',
    packageInfo: '60 Vegan Capsules | 30-Day Supply | Certified Plant-Based',
    manufacturer: 'Go Global Edge Labs, Manufactured under GMP Quality Standards',
    rating: 4.8,
    reviewCount: 52,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_SETTINGS: StoreSettings = {
  id: 'store_config',
  businessName: 'Go Global Edge',
  contactEmail: 'maserekasandra66@gmail.com',
  phone: '+256774406640',
  whatsapp: '+256707658107',
  currency: 'UGX',
  timeZone: 'Africa/Kampala',
  deliveryKampala: 10000,
  deliveryWakiso: 15000,
  deliveryUpcountry: 25000,
  freeDeliveryThreshold: 300000,
  heroTitle: 'WELCOME TO GO GLOBAL EDGE',
  heroSubtitle:
    'Discover Our Wellness Product Collection — Pure, Science-Backed Formulations for Men’s Vitality & Metabolic Balance',
  announcement: 'Fast Delivery Across Uganda • Verified Quality Assured • WhatsApp Orders Active',
  missionStatement:
    'At Go Global Edge, our mission is to empower communities across Uganda and East Africa with authentic, ethically formulated wellness supplements. We reject misleading medical claims and champion transparent, verified nutritional products that inspire vitality and active living.',
  sandboxMode: true,
  adminSecurityKey: 'EDGE2026',
  updatedAt: new Date().toISOString(),
};

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coupon-welcome10',
    code: 'WELCOME10',
    discountType: 'percent',
    discountValue: 10,
    minOrderAmount: 100000,
    maxUses: 500,
    usedCount: 24,
    isActive: true,
    expiresAt: '2027-12-31',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'coupon-edgeship',
    code: 'EDGESHIP',
    discountType: 'fixed',
    discountValue: 15000,
    minOrderAmount: 200000,
    maxUses: 200,
    usedCount: 15,
    isActive: true,
    expiresAt: '2027-12-31',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'revicell-mens-wellness',
    customerName: 'Robert K.',
    rating: 5,
    title: 'Remarkable energy and consistent stamina',
    comment:
      'I have been taking Revicell for two months. The daily vitality difference is noticeable during long work days in Kampala. Genuine packaging and arrived in 24 hours.',
    verifiedPurchase: true,
    status: 'approved',
    createdAt: '2026-09-15T10:00:00Z',
  },
  {
    id: 'rev-2',
    productId: 'revicell-mens-wellness',
    customerName: 'David M.',
    rating: 5,
    title: 'Top notch packaging and prompt delivery',
    comment:
      'Very clean presentation, high grade bottle and tamper-proof seal. The customer care on WhatsApp was very helpful with delivery to Entebbe.',
    verifiedPurchase: true,
    status: 'approved',
    createdAt: '2026-09-28T14:30:00Z',
  },
  {
    id: 'rev-3',
    productId: 'slimfit-gluco-burn',
    customerName: 'Sarah N.',
    rating: 5,
    title: 'Great accompaniment to my morning workouts',
    comment:
      'Taking 1 capsule before meals has helped me stay mindful and energised. Really pleased with the vegan capsules and lack of jittery feelings.',
    verifiedPurchase: true,
    status: 'approved',
    createdAt: '2026-10-02T09:15:00Z',
  },
  {
    id: 'rev-4',
    productId: 'slimfit-gluco-burn',
    customerName: 'Grace A.',
    rating: 4,
    title: 'Authentic product and fast Jinja dispatch',
    comment:
      'Order arrived neatly packed via courier. The ingredients are transparently stated on the bottle.',
    verifiedPurchase: true,
    status: 'approved',
    createdAt: '2026-10-08T16:20:00Z',
  },
];

// Helper to seed initial store data if collections are empty
// Helper to seed initial store data once upon initial deployment
export async function seedInitialStoreData() {
  try {
    const settingsSnap = await getDoc(doc(db, 'settings', 'store_config'));
    const isAlreadySeeded = settingsSnap.exists() && settingsSnap.data()?.isSeeded;

    // Seed initial products ONLY on brand new unseeded databases
    if (!isAlreadySeeded) {
      const productsSnap = await getDocs(collection(db, 'products'));
      if (productsSnap.empty) {
        for (const prod of INITIAL_PRODUCTS) {
          await setDoc(doc(db, 'products', prod.id), prod);
        }
      }
    }

    // Check settings
    if (!settingsSnap.exists()) {
      await setDoc(doc(db, 'settings', 'store_config'), {
        ...INITIAL_SETTINGS,
        isSeeded: true,
        deletedProductIds: [],
      });
    } else {
      const data = settingsSnap.data();
      const updates: Record<string, any> = {};
      if (!data.isSeeded) updates.isSeeded = true;
      if (!data.adminSecurityKey) updates.adminSecurityKey = 'EDGE2026';
      if (data.whatsapp !== '+256707658107') updates.whatsapp = '+256707658107';
      if (data.phone !== '+256774406640') updates.phone = '+256774406640';
      if (data.contactEmail !== 'maserekasandra66@gmail.com') {
        updates.contactEmail = 'maserekasandra66@gmail.com';
      }
      if (Object.keys(updates).length > 0) {
        updates.updatedAt = new Date().toISOString();
        await updateDoc(doc(db, 'settings', 'store_config'), updates);
      }
    }

    // Check coupons
    const couponsSnap = await getDocs(collection(db, 'coupons'));
    if (couponsSnap.empty) {
      for (const c of INITIAL_COUPONS) {
        await setDoc(doc(db, 'coupons', c.id), c);
      }
    }

    // Check reviews
    const reviewsSnap = await getDocs(collection(db, 'reviews'));
    if (reviewsSnap.empty) {
      for (const r of INITIAL_REVIEWS) {
        await setDoc(doc(db, 'reviews', r.id), r);
      }
    }
  } catch (error) {
    console.warn('Initial seeding handled gracefully:', error);
  }
}

// Product API
export async function fetchProducts(): Promise<Product[]> {
  const path = 'products';
  try {
    const snap = await getDocs(collection(db, path));
    const products: Product[] = [];
    snap.forEach((d) => products.push(d.data() as Product));
    return products;
  } catch (error) {
    console.warn('Error reading products:', error);
    return [];
  }
}

export async function saveProduct(product: Product): Promise<void> {
  const path = `products/${product.id}`;
  try {
    await setDoc(doc(db, 'products', product.id), {
      ...product,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  const path = `products/${productId}`;
  try {
    await deleteDoc(doc(db, 'products', productId));

    // Also persist deletion in store settings tracking to prevent resurrection
    try {
      const settingsRef = doc(db, 'settings', 'store_config');
      const settingsSnap = await getDoc(settingsRef);
      if (settingsSnap.exists()) {
        const data = settingsSnap.data();
        const deletedIds: string[] = Array.isArray(data.deletedProductIds)
          ? data.deletedProductIds
          : [];
        if (!deletedIds.includes(productId)) {
          await updateDoc(settingsRef, {
            deletedProductIds: [...deletedIds, productId],
            updatedAt: new Date().toISOString(),
          });
        }
      }
    } catch (e) {
      console.warn('Could not record deleted product ID:', e);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Orders API
export async function fetchOrders(): Promise<Order[]> {
  const path = 'orders';
  try {
    const q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(100));
    const snap = await getDocs(q);
    const orders: Order[] = [];
    snap.forEach((d) => orders.push(d.data() as Order));
    return orders;
  } catch (error) {
    // If index or query fails, try basic collection read
    try {
      const snap = await getDocs(collection(db, path));
      const orders: Order[] = [];
      snap.forEach((d) => orders.push(d.data() as Order));
      return orders.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (e) {
      console.warn('Fallback empty orders list:', e);
      return [];
    }
  }
}

export async function createOrder(order: Order): Promise<void> {
  const path = `orders/${order.id}`;
  try {
    await setDoc(doc(db, 'orders', order.id), order);

    // Also record inventory movement and payment record
    for (const item of order.items) {
      const moveId = `mov-${Date.now()}-${item.productId}`;
      await setDoc(doc(db, 'inventoryMovements', moveId), {
        id: moveId,
        productId: item.productId,
        productName: item.name,
        type: 'sale',
        quantity: -item.quantity,
        previousStock: 0,
        newStock: 0,
        reason: `Order #${order.orderNumber}`,
        createdBy: order.customerName,
        createdAt: new Date().toISOString(),
      });
    }

    const payId = `pay-${order.id}`;
    await setDoc(doc(db, 'payments', payId), {
      id: payId,
      transactionRef: order.transactionRef,
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      amount: order.totalAmount,
      currency: order.currency,
      method: order.paymentMethod,
      status: order.paymentStatus,
      provider:
        order.paymentMethod === 'mtn_mobile_money'
          ? 'MTN MoMo Uganda'
          : order.paymentMethod === 'airtel_money'
            ? 'Airtel Money Uganda'
            : order.paymentMethod === 'bank_card'
              ? 'Flutterwave / Card'
              : 'Cash on Delivery',
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateOrderStatus(
  orderId: string,
  orderStatus: Order['orderStatus'],
  paymentStatus?: Order['paymentStatus']
): Promise<void> {
  const path = `orders/${orderId}`;
  try {
    const updateData: Partial<Order> = {
      orderStatus,
      updatedAt: new Date().toISOString(),
    };
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }
    await updateDoc(doc(db, 'orders', orderId), updateData);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// Payments API
export async function fetchPayments(): Promise<PaymentRecord[]> {
  const path = 'payments';
  try {
    const snap = await getDocs(collection(db, path));
    const payments: PaymentRecord[] = [];
    snap.forEach((d) => payments.push(d.data() as PaymentRecord));
    return payments.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.warn('Fetch payments fallback:', error);
    return [];
  }
}

// Inventory Movements API
export async function fetchInventoryMovements(): Promise<InventoryMovement[]> {
  const path = 'inventoryMovements';
  try {
    const snap = await getDocs(collection(db, path));
    const movements: InventoryMovement[] = [];
    snap.forEach((d) => movements.push(d.data() as InventoryMovement));
    return movements.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.warn('Inventory movements fallback:', error);
    return [];
  }
}

export async function recordInventoryAdjustment(
  movement: Omit<InventoryMovement, 'id' | 'createdAt'>
): Promise<void> {
  const moveId = `mov-${Date.now()}`;
  const path = `inventoryMovements/${moveId}`;
  try {
    await setDoc(doc(db, 'inventoryMovements', moveId), {
      ...movement,
      id: moveId,
      createdAt: new Date().toISOString(),
    });
    // Update product stock
    await updateDoc(doc(db, 'products', movement.productId), {
      stock: movement.newStock,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Settings API
export async function fetchSettings(): Promise<StoreSettings> {
  const path = 'settings/store_config';
  try {
    const snap = await getDoc(doc(db, 'settings', 'store_config'));
    if (snap.exists()) {
      return snap.data() as StoreSettings;
    }
    return INITIAL_SETTINGS;
  } catch (error) {
    console.warn('Settings fallback:', error);
    return INITIAL_SETTINGS;
  }
}

export async function saveSettings(settings: StoreSettings): Promise<void> {
  const path = 'settings/store_config';
  try {
    await setDoc(doc(db, 'settings', 'store_config'), {
      ...settings,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Coupons API
export async function fetchCoupons(): Promise<Coupon[]> {
  const path = 'coupons';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) return INITIAL_COUPONS;
    const coupons: Coupon[] = [];
    snap.forEach((d) => coupons.push(d.data() as Coupon));
    return coupons;
  } catch (error) {
    return INITIAL_COUPONS;
  }
}

export async function saveCoupon(coupon: Coupon): Promise<void> {
  const path = `coupons/${coupon.id}`;
  try {
    await setDoc(doc(db, 'coupons', coupon.id), coupon);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteCoupon(couponId: string): Promise<void> {
  const path = `coupons/${couponId}`;
  try {
    await deleteDoc(doc(db, 'coupons', couponId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Reviews API
export async function fetchReviews(): Promise<Review[]> {
  const path = 'reviews';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) return INITIAL_REVIEWS;
    const reviews: Review[] = [];
    snap.forEach((d) => reviews.push(d.data() as Review));
    return reviews.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    return INITIAL_REVIEWS;
  }
}

export async function createReview(review: Review): Promise<void> {
  const path = `reviews/${review.id}`;
  try {
    await setDoc(doc(db, 'reviews', review.id), review);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateReviewStatus(
  reviewId: string,
  status: Review['status']
): Promise<void> {
  const path = `reviews/${reviewId}`;
  try {
    await updateDoc(doc(db, 'reviews', reviewId), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteReview(reviewId: string): Promise<void> {
  const path = `reviews/${reviewId}`;
  try {
    await deleteDoc(doc(db, 'reviews', reviewId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Categories API
export const INITIAL_CATEGORIES = [
  {
    id: 'cat-mens-wellness',
    name: "Men's Wellness",
    description: 'Vitality, stamina, and performance supplements formulated specifically for men.',
    slug: 'mens-wellness',
  },
  {
    id: 'cat-metabolic-wellness',
    name: 'Metabolic Wellness',
    description: 'Targeted botanical supplements for balanced metabolic energy and nutritional vitality.',
    slug: 'metabolic-wellness',
  },
  {
    id: 'cat-botanical-extracts',
    name: 'Botanical Extracts',
    description: 'Pure, standardized herbal and plant-based formulas free from synthetic additives.',
    slug: 'botanical-extracts',
  },
  {
    id: 'cat-daily-vitality',
    name: 'Daily Vitality',
    description: 'Everyday nutritional essentials, trace minerals, and multi-vitamin complexes.',
    slug: 'daily-vitality',
  },
];

export async function fetchCategories(): Promise<typeof INITIAL_CATEGORIES> {
  const path = 'categories';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) return INITIAL_CATEGORIES;
    const cats: typeof INITIAL_CATEGORIES = [];
    snap.forEach((d) => cats.push(d.data() as any));
    return cats;
  } catch (e) {
    return INITIAL_CATEGORIES;
  }
}

export async function saveCategory(category: (typeof INITIAL_CATEGORIES)[0]): Promise<void> {
  const path = `categories/${category.id}`;
  try {
    await setDoc(doc(db, 'categories', category.id), category);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const path = `categories/${categoryId}`;
  try {
    await deleteDoc(doc(db, 'categories', categoryId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

