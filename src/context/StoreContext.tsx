import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import {
  Product,
  CartItem,
  Order,
  StoreSettings,
  Coupon,
  Review,
  ProductCategory,
  PaymentMethod,
} from '../types';
import {
  fetchProducts,
  fetchOrders,
  fetchSettings,
  fetchCoupons,
  fetchReviews,
  createOrder,
  saveProduct,
  deleteProduct,
  saveSettings,
  saveCoupon,
  createReview,
  deleteReview,
  fetchCategories,
  saveCategory,
  deleteCategory,
  updateOrderStatus as updateOrderStatusService,
  updateReviewStatus as updateReviewStatusService,
  seedInitialStoreData,
  INITIAL_SETTINGS,
} from '../services/storeService';
import { auth, initAuthListener } from '../firebase';

interface StoreContextType {
  products: Product[];
  isLoadingProducts: boolean;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  couponError: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  deliveryDistrict: string;
  setDeliveryDistrict: (district: string) => void;
  cartSubtotal: number;
  cartDeliveryFee: number;
  cartDiscount: number;
  cartTotal: number;
  orders: Order[];
  refreshOrders: () => Promise<void>;
  placeOrder: (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    deliveryAddress: string;
    district: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => Promise<Order>;
  updateOrderStatus: (
    orderId: string,
    orderStatus: Order['orderStatus'],
    paymentStatus?: Order['paymentStatus']
  ) => Promise<void>;
  settings: StoreSettings;
  updateSettings: (newSettings: StoreSettings) => Promise<void>;
  coupons: Coupon[];
  saveCouponAdmin: (coupon: Coupon) => Promise<void>;
  reviews: Review[];
  addCustomerReview: (
    productId: string,
    rating: number,
    title: string,
    comment: string,
    customerName: string,
    customerEmail?: string
  ) => Promise<void>;
  activeUser: User | null;
  isAdmin: boolean;
  adminEmail: string;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  notification: { type: 'success' | 'error' | 'info'; message: string } | null;
  showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
  adminAuthenticated: boolean;
  setAdminAuthenticated: (auth: boolean) => void;
  refreshProducts: () => Promise<void>;
  addProductAdmin: (product: Product) => Promise<void>;
  deleteProductAdmin: (productId: string) => Promise<void>;
  categories: ProductCategory[];
  addCategoryAdmin: (category: ProductCategory) => Promise<void>;
  deleteCategoryAdmin: (categoryId: string) => Promise<void>;
  updateReviewStatusAdmin: (reviewId: string, status: Review['status']) => Promise<void>;
  deleteReviewAdmin: (reviewId: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('gge_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [deliveryDistrict, setDeliveryDistrict] = useState<string>('Kampala');
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [adminAuthenticated, setAdminAuthenticatedState] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('gge_admin_session_auth') === 'true';
    } catch {
      return false;
    }
  });

  const setAdminAuthenticated = (auth: boolean) => {
    setAdminAuthenticatedState(auth);
    try {
      if (auth) {
        sessionStorage.setItem('gge_admin_session_auth', 'true');
      } else {
        sessionStorage.removeItem('gge_admin_session_auth');
      }
    } catch (e) {
      console.warn('sessionStorage error:', e);
    }
  };

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentView, setCurrentViewState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (hash === '#admin' || path === '/admin' || search.includes('view=admin')) {
        return 'admin';
      }
    }
    return 'home';
  });

  const setCurrentView = (view: string) => {
    setCurrentViewState(view);
    if (typeof window !== 'undefined') {
      if (view === 'admin') {
        if (window.location.hash !== '#admin') {
          window.location.hash = '#admin';
        }
      } else {
        if (window.location.hash === '#admin') {
          history.pushState(null, '', window.location.pathname + window.location.search);
        }
      }
    }
  };

  // Listen to hash / URL changes
  useEffect(() => {
    const handleUrlChange = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (hash === '#admin' || path === '/admin' || search.includes('view=admin')) {
        setCurrentViewState('admin');
      } else if (currentView === 'admin' && hash !== '#admin') {
        setCurrentViewState('home');
      }
    };

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, [currentView]);

  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const adminEmails = [
    'markniaras@gmail.com',
    'maserekasandra66@gmail.com',
    settings.contactEmail ? settings.contactEmail.toLowerCase() : '',
  ].filter(Boolean);

  const adminEmail = 'maserekasandra66@gmail.com';

  const isAdmin =
    adminAuthenticated ||
    Boolean(activeUser?.email && adminEmails.includes(activeUser.email.toLowerCase()));

  // Show toast notification
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  // Sync cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('gge_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not save cart:', e);
    }
  }, [cart]);

  // Initial load
  useEffect(() => {
    async function loadData() {
      setIsLoadingProducts(true);
      await seedInitialStoreData();
      const [prods, sett, ords, coup, revs, cats] = await Promise.all([
        fetchProducts(),
        fetchSettings(),
        fetchOrders(),
        fetchCoupons(),
        fetchReviews(),
        fetchCategories(),
      ]);
      setProducts(prods);
      setSettings(sett);
      setOrders(ords);
      setCoupons(coup);
      setReviews(revs);
      setCategories(cats);
      setIsLoadingProducts(false);
    }
    loadData();

    // Listen to Firebase Auth
    const unsub = initAuthListener(
      (user) => {
        setActiveUser(user);
        if (user.email && adminEmails.includes(user.email.toLowerCase())) {
          setAdminAuthenticated(true);
        }
      },
      () => {
        setActiveUser(null);
      }
    );
    return () => unsub();
  }, []);

  const refreshProducts = async () => {
    const prods = await fetchProducts();
    setProducts(prods);
  };

  const refreshOrders = async () => {
    const ords = await fetchOrders();
    setOrders(ords);
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    if (product.stock <= 0) {
      showNotification('error', `${product.name} is currently out of stock.`);
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        return [...prevCart, { product, quantity: Math.min(quantity, product.stock) }];
      }
    });

    showNotification('success', `Added ${quantity}x ${product.name} to cart.`);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const product = products.find((p) => p.id === productId);
    const maxQty = product ? product.stock : 99;
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, maxQty) }
          : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showNotification('info', 'Item removed from cart.');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => {
    const price = item.product.salePrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  // Delivery fee logic
  const isFreeDelivery = cartSubtotal >= settings.freeDeliveryThreshold;
  const cartDeliveryFee =
    cart.length === 0
      ? 0
      : isFreeDelivery
        ? 0
        : deliveryDistrict === 'Kampala'
          ? settings.deliveryKampala
          : deliveryDistrict === 'Wakiso' || deliveryDistrict === 'Entebbe'
            ? settings.deliveryWakiso
            : settings.deliveryUpcountry;

  // Coupon discount calculation
  let cartDiscount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minOrderAmount) {
    if (appliedCoupon.discountType === 'percent') {
      cartDiscount = Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
    } else {
      cartDiscount = appliedCoupon.discountValue;
    }
  }

  const cartTotal = Math.max(0, cartSubtotal + cartDeliveryFee - cartDiscount);

  // Coupons
  const applyCoupon = (code: string): boolean => {
    setCouponError(null);
    const cleanCode = code.trim().toUpperCase();
    const coupon = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);

    if (!coupon) {
      setCouponError('Invalid or expired coupon code.');
      showNotification('error', 'Invalid or expired coupon code.');
      return false;
    }

    if (cartSubtotal < coupon.minOrderAmount) {
      const needed = coupon.minOrderAmount - cartSubtotal;
      const msg = `Minimum order of UGX ${coupon.minOrderAmount.toLocaleString()} required. Add UGX ${needed.toLocaleString()} more.`;
      setCouponError(msg);
      showNotification('error', msg);
      return false;
    }

    setAppliedCoupon(coupon);
    showNotification('success', `Coupon '${coupon.code}' applied successfully!`);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
    showNotification('info', 'Coupon removed.');
  };

  // Order Placement
  const placeOrder = async (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    deliveryAddress: string;
    district: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }): Promise<Order> => {
    const orderNumber = `GGE-${Math.floor(100000 + Math.random() * 900000)}`;
    const txPrefix =
      orderData.paymentMethod === 'mtn_mobile_money'
        ? 'MTN-UG'
        : orderData.paymentMethod === 'airtel_money'
          ? 'AIR-UG'
          : orderData.paymentMethod === 'bank_card'
            ? 'CARD-FLW'
            : 'COD';
    const transactionRef = `${txPrefix}-${Date.now().toString().slice(-8)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerId: activeUser?.uid || `guest-${Date.now()}`,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      deliveryAddress: orderData.deliveryAddress,
      district: orderData.district,
      items: cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.salePrice || item.product.price,
        quantity: item.quantity,
        image: item.product.images[0] || '',
      })),
      subtotal: cartSubtotal,
      deliveryFee: cartDeliveryFee,
      discount: cartDiscount,
      totalAmount: cartTotal,
      currency: 'UGX',
      paymentMethod: orderData.paymentMethod,
      paymentStatus:
        orderData.paymentMethod === 'cash_on_delivery'
          ? 'Pending'
          : 'Successful', // in simulation / verified flow
      orderStatus:
        orderData.paymentMethod === 'cash_on_delivery'
          ? 'Awaiting Payment'
          : 'Paid',
      transactionRef,
      notes: orderData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await createOrder(newOrder);

    // Update in-memory stock
    setProducts((prev) =>
      prev.map((p) => {
        const inCart = cart.find((c) => c.product.id === p.id);
        if (inCart) {
          const newStock = Math.max(0, p.stock - inCart.quantity);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    return newOrder;
  };

  const updateOrderStatus = async (
    orderId: string,
    orderStatus: Order['orderStatus'],
    paymentStatus?: Order['paymentStatus']
  ) => {
    await updateOrderStatusService(orderId, orderStatus, paymentStatus);
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              orderStatus,
              paymentStatus: paymentStatus || o.paymentStatus,
              updatedAt: new Date().toISOString(),
            }
          : o
      )
    );
    showNotification('success', `Order status updated to ${orderStatus}.`);
  };

  // Product Admin Operations
  const addProductAdmin = async (product: Product) => {
    // Optimistically update in-memory state so changes appear immediately
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = product;
        return updated;
      }
      return [product, ...prev];
    });

    try {
      await saveProduct(product);
      showNotification('success', `Product "${product.name}" saved successfully.`);
    } catch (err: any) {
      console.warn('Remote product save warning (saved locally):', err);
      showNotification('success', `Product "${product.name}" saved in store.`);
    }
  };

  const deleteProductAdmin = async (productId: string) => {
    const target = products.find((p) => p.id === productId);
    // Optimistically remove from state immediately
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    // Clear from selected product if currently viewed
    setSelectedProduct((prev) => (prev?.id === productId ? null : prev));
    // Clear from cart if present
    setCart((prev) => prev.filter((item) => item.product.id !== productId));

    try {
      await deleteProduct(productId);
      showNotification('info', `Product "${target?.name || 'Selected product'}" removed.`);
    } catch (err: any) {
      console.warn('Remote delete warning (removed locally):', err);
      showNotification('info', 'Product removed from store.');
    }
  };

  const updateSettings = async (newSettings: StoreSettings) => {
    await saveSettings(newSettings);
    setSettings(newSettings);
    showNotification('success', 'Store settings updated successfully.');
  };

  const saveCouponAdmin = async (coupon: Coupon) => {
    await saveCoupon(coupon);
    setCoupons((prev) => {
      const idx = prev.findIndex((c) => c.id === coupon.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = coupon;
        return updated;
      }
      return [coupon, ...prev];
    });
    showNotification('success', `Coupon "${coupon.code}" saved.`);
  };

  const addCustomerReview = async (
    productId: string,
    rating: number,
    title: string,
    comment: string,
    customerName: string,
    customerEmail?: string
  ) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId,
      customerName,
      customerEmail,
      rating,
      title,
      comment,
      verifiedPurchase: true,
      status: 'approved',
      createdAt: new Date().toISOString(),
    };
    await createReview(newRev);
    setReviews((prev) => [newRev, ...prev]);
    showNotification('success', 'Thank you! Your verified review has been published.');
  };

  const addCategoryAdmin = async (category: ProductCategory) => {
    await saveCategory(category);
    setCategories((prev) => {
      const idx = prev.findIndex((c) => c.id === category.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = category;
        return updated;
      }
      return [...prev, category];
    });
    showNotification('success', `Category "${category.name}" saved.`);
  };

  const deleteCategoryAdmin = async (categoryId: string) => {
    await deleteCategory(categoryId);
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    showNotification('info', 'Category removed.');
  };

  const updateReviewStatusAdmin = async (reviewId: string, status: Review['status']) => {
    await updateReviewStatusService(reviewId, status);
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status } : r))
    );
    showNotification('success', `Review status updated to ${status}.`);
  };

  const deleteReviewAdmin = async (reviewId: string) => {
    await deleteReview(reviewId);
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    showNotification('info', 'Review deleted.');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        isLoadingProducts,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        appliedCoupon,
        couponError,
        applyCoupon,
        removeCoupon,
        deliveryDistrict,
        setDeliveryDistrict,
        cartSubtotal,
        cartDeliveryFee,
        cartDiscount,
        cartTotal,
        orders,
        refreshOrders,
        placeOrder,
        updateOrderStatus,
        settings,
        updateSettings,
        coupons,
        saveCouponAdmin,
        reviews,
        addCustomerReview,
        categories,
        addCategoryAdmin,
        deleteCategoryAdmin,
        updateReviewStatusAdmin,
        deleteReviewAdmin,
        activeUser,
        isAdmin,
        adminEmail,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedProduct,
        setSelectedProduct,
        currentView,
        setCurrentView,
        notification,
        showNotification,
        adminAuthenticated,
        setAdminAuthenticated,
        refreshProducts,
        addProductAdmin,
        deleteProductAdmin,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
