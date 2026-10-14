import React, { useState } from 'react';
import { ShoppingBag, Eye, Star, CheckCircle, AlertTriangle, Shield } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setIsCheckoutOpen, setSelectedProduct } = useStore();
  const [quantity, setQuantity] = useState(1);

  const price = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setIsCheckoutOpen(true);
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
  };

  return (
    <div className="bg-white rounded-2xl border border-emerald-100/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group hover:border-emerald-300">
      {/* Product Image Section */}
      <div className="relative aspect-square overflow-hidden bg-emerald-50/40 p-4">
        <img
          src={product.images?.[0] || '/src/assets/images/double_root_coffee_1791963357040.jpg'}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 cursor-pointer"
          onClick={() => setSelectedProduct(product)}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-900 text-amber-300 shadow-xs border border-amber-400/30">
            {product.category}
          </span>
          {hasDiscount && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-600 text-white shadow-xs">
              SALE
            </span>
          )}
        </div>

        {/* Quick View Button */}
        <button
          onClick={() => setSelectedProduct(product)}
          className="absolute bottom-3 right-3 p-2.5 rounded-xl bg-white/90 hover:bg-white text-emerald-900 shadow-md backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
          title="Quick View Details"
        >
          <Eye className="w-4 h-4 text-emerald-800" />
        </button>
      </div>

      {/* Product Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating || 5) ? 'fill-amber-400' : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 font-medium">
              ({product.reviewCount || 20}+ verified reviews)
            </span>
          </div>

          {/* Title & Subtitle */}
          <h3
            onClick={() => setSelectedProduct(product)}
            className="text-lg font-serif font-black text-gray-900 group-hover:text-emerald-800 transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>
          <p className="text-xs text-emerald-700 font-semibold mb-2">
            {product.packageInfo}
          </p>
          <p className="text-xs text-gray-600 line-clamp-2 mb-4 leading-relaxed">
            {product.subtitle}
          </p>

          {/* Stock Availability indicator */}
          <div className="flex items-center gap-1.5 text-xs mb-3">
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1 text-red-600 font-bold">
                <AlertTriangle className="w-3.5 h-3.5" /> Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center gap-1 text-amber-600 font-bold">
                <AlertTriangle className="w-3.5 h-3.5" /> Only {product.stock} units left!
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> {product.stock} available in Uganda warehouse
              </span>
            )}
          </div>
        </div>

        {/* Price & Action Area */}
        <div className="pt-3 border-t border-gray-100 space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                Price (UGX)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-black text-emerald-950 font-serif">
                  UGX {price.toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-gray-400 line-through">
                    UGX {product.price.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 font-bold text-sm transition-colors"
                disabled={isOutOfStock}
              >
                -
              </button>
              <span className="px-2.5 py-1 text-xs font-bold text-gray-800 bg-white">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 font-bold text-sm transition-colors"
                disabled={isOutOfStock || quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                isOutOfStock
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-emerald-700" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                isOutOfStock
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-md shadow-emerald-700/20 active:scale-95'
              }`}
            >
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
