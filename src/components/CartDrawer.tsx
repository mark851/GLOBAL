import React, { useState } from 'react';
import {
  X,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Tag,
  Truck,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDeliveryFee,
    cartDiscount,
    cartTotal,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    deliveryDistrict,
    setDeliveryDistrict,
    setIsCheckoutOpen,
    settings,
  } = useStore();

  const [couponCodeInput, setCouponCodeInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    const ok = applyCoupon(couponCodeInput);
    if (ok) setCouponCodeInput('');
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const freeDeliveryRemaining = Math.max(0, settings.freeDeliveryThreshold - cartSubtotal);
  const freeDeliveryPercent = Math.min(
    100,
    Math.round((cartSubtotal / settings.freeDeliveryThreshold) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="px-6 py-5 bg-emerald-950 text-white flex items-center justify-between border-b border-emerald-900">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-serif font-black tracking-tight">Your Shopping Cart</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          <div className="bg-emerald-50 px-6 py-3 border-b border-emerald-100">
            <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
              <span className="flex items-center gap-1.5 text-emerald-950">
                <Truck className="w-4 h-4 text-emerald-700" />
                {freeDeliveryRemaining <= 0 ? (
                  <span className="text-emerald-700">Congratulations! You unlocked Free Delivery!</span>
                ) : (
                  <span>
                    Add <strong className="text-emerald-800">UGX {freeDeliveryRemaining.toLocaleString()}</strong> for Free Delivery!
                  </span>
                )}
              </span>
              <span className="text-emerald-800">{freeDeliveryPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-emerald-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${freeDeliveryPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 opacity-40" />
                </div>
                <h3 className="font-serif font-bold text-gray-800 text-lg">Your cart is empty</h3>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Explore our verified men's vitality and botanical metabolic support products.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-3 px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-colors"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemPrice = item.product.salePrice || item.product.price;
                return (
                  <div
                    key={item.product.id}
                    className="flex gap-3.5 p-3 rounded-2xl bg-gray-50 border border-gray-100 items-center justify-between"
                  >
                    <div className="w-16 h-16 rounded-xl bg-white p-1 border border-gray-200 shrink-0 overflow-hidden flex items-center justify-center">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="font-serif font-bold text-xs text-gray-900 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 truncate">
                        {item.product.packageInfo}
                      </p>
                      <div className="text-xs font-black text-emerald-950 mt-1">
                        UGX {(itemPrice * item.quantity).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white text-xs">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 hover:bg-gray-100 font-bold text-gray-700"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 hover:bg-gray-100 font-bold text-gray-700"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Delivery District Selector */}
            {cart.length > 0 && (
              <div className="pt-2">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Select Delivery Location in Uganda:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'Kampala', label: 'Kampala City', fee: settings.deliveryKampala },
                    { id: 'Wakiso', label: 'Wakiso / Entebbe', fee: settings.deliveryWakiso },
                    { id: 'Upcountry', label: 'Upcountry / Other', fee: settings.deliveryUpcountry },
                  ].map((dist) => (
                    <button
                      key={dist.id}
                      onClick={() => setDeliveryDistrict(dist.id)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        deliveryDistrict === dist.id
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold">{dist.label}</div>
                      <div className="text-[10px] text-gray-500">
                        {cartSubtotal >= settings.freeDeliveryThreshold ? 'FREE' : `UGX ${dist.fee.toLocaleString()}`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Coupon Promo Code Box */}
            {cart.length > 0 && (
              <div className="pt-2">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Tag className="w-3.5 h-3.5 text-amber-600" />
                      <span>Coupon: {appliedCoupon.code}</span>
                      <span className="text-[10px] font-normal text-amber-700">
                        (-UGX {cartDiscount.toLocaleString()})
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-red-600 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code (e.g. WELCOME10)"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs uppercase"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-red-600 mt-1">{couponError}</p>}
              </div>
            )}
          </div>

          {/* Footer Totals & Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-6 bg-gray-50 border-t border-gray-200 space-y-3">
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold text-gray-900">UGX {cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery ({deliveryDistrict}):</span>
                  <span className="font-bold text-gray-900">
                    {cartDeliveryFee === 0 ? 'FREE' : `UGX ${cartDeliveryFee.toLocaleString()}`}
                  </span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount:</span>
                    <span>-UGX {cartDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-200 text-sm font-black text-emerald-950 font-serif">
                  <span>Total Amount (UGX):</span>
                  <span>UGX {cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleProceedCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/25 active:scale-98 transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 font-medium pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Protected by MTN MoMo, Airtel & Card Verification</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
