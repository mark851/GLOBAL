import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Send,
} from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addToCart, setIsCheckoutOpen, reviews, addCustomerReview } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'info' | 'directions' | 'ingredients' | 'reviews'>('info');

  // Review form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const price = product.salePrice || product.price;
  const productReviews = reviews.filter((r) => r.productId === product.id && r.status === 'approved');

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onClose();
    setIsCheckoutOpen(true);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;
    setReviewSubmitting(true);
    try {
      await addCustomerReview(
        product.id,
        reviewRating,
        reviewTitle || 'Verified Experience',
        reviewComment,
        reviewName
      );
      setReviewName('');
      setReviewTitle('');
      setReviewComment('');
      setActiveTab('reviews');
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-emerald-100 my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Close */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-emerald-950 text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span className="text-xs uppercase font-bold tracking-wider text-amber-300">
              Verified Product Information • Restore Boby Cells
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[80vh] overflow-y-auto">
          {/* Image & Quick Specs (5 cols) */}
          <div className="md:col-span-5 bg-emerald-50/50 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-emerald-100">
            <div>
              <div className="aspect-square bg-white rounded-2xl p-4 shadow-sm border border-emerald-100 flex items-center justify-center overflow-hidden mb-4">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Verified Product Spec Card */}
              <div className="space-y-2 bg-white rounded-xl p-4 border border-emerald-100 text-xs text-gray-700">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="font-semibold text-gray-500">Category:</span>
                  <span className="font-bold text-emerald-900">{product.category}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="font-semibold text-gray-500">Package:</span>
                  <span className="font-bold text-gray-800">{product.packageInfo}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="font-semibold text-gray-500">SKU Code:</span>
                  <span className="font-mono text-gray-800">{product.sku}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-semibold text-gray-500">Stock Status:</span>
                  <span className="font-bold text-emerald-700">
                    {product.stock > 0 ? `${product.stock} units available` : 'Out of stock'}
                  </span>
                </div>
              </div>
            </div>

            {/* Uganda Fast Shipping Notice */}
            <div className="mt-4 p-3 rounded-xl bg-emerald-100/60 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Same-day dispatch in Kampala. 24–48h courier nationwide.</span>
            </div>
          </div>

          {/* Details & Actions (7 cols) */}
          <div className="md:col-span-7 p-6 flex flex-col justify-between space-y-6">
            <div>
              {/* Product Title & Rating */}
              <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
                <span className="text-xs text-gray-500 font-bold ml-1">
                  {product.rating} ({productReviews.length} reviews)
                </span>
              </div>

              <h2 className="text-2xl font-serif font-black text-gray-900 leading-tight">
                {product.name}
              </h2>
              <p className="text-xs text-emerald-700 font-semibold mt-1">
                {product.subtitle}
              </p>

              {/* Price Banner */}
              <div className="my-4 p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                    Total Price (UGX)
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-emerald-950 font-serif">
                      UGX {price.toLocaleString()}
                    </span>
                    {product.salePrice && product.salePrice < product.price && (
                      <span className="text-sm text-gray-400 line-through">
                        UGX {product.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-200">
                  Tax Inclusive
                </span>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-gray-200 text-xs font-bold gap-4 mb-4">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`pb-2.5 border-b-2 transition-all ${
                    activeTab === 'info'
                      ? 'border-emerald-700 text-emerald-900 font-black'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Description & Info
                </button>
                <button
                  onClick={() => setActiveTab('directions')}
                  className={`pb-2.5 border-b-2 transition-all ${
                    activeTab === 'directions'
                      ? 'border-emerald-700 text-emerald-900 font-black'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Directions for Use
                </button>
                <button
                  onClick={() => setActiveTab('ingredients')}
                  className={`pb-2.5 border-b-2 transition-all ${
                    activeTab === 'ingredients'
                      ? 'border-emerald-700 text-emerald-900 font-black'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Verified Ingredients
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2.5 border-b-2 transition-all ${
                    activeTab === 'reviews'
                      ? 'border-emerald-700 text-emerald-900 font-black'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Reviews ({productReviews.length})
                </button>
              </div>

              {/* Tab Content */}
              <div className="text-xs text-gray-700 space-y-3 leading-relaxed min-h-[140px]">
                {activeTab === 'info' && (
                  <div>
                    <p className="mb-3">{product.description}</p>
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-amber-950">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Verified Health Notice:</span>
                      </div>
                      <p className="text-[11px] leading-normal text-amber-900">
                        This dietary supplement supports overall vitality and healthy metabolic function.
                        It is NOT intended to diagnose, treat, cure, or prevent cancer, diabetes, infertility,
                        or any serious disease. Consult your healthcare professional.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'directions' && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-2.5 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                      <FileText className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-emerald-950 block mb-0.5">Packaging Directions:</strong>
                        <p>{product.directions}</p>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                      <strong className="text-gray-900 block">Storage:</strong>
                      <p>Store in a cool, dry place below 25°C. Keep out of direct sunlight and reach of children.</p>
                    </div>
                  </div>
                )}

                {activeTab === 'ingredients' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <strong className="text-emerald-950 block mb-1">Active Botanical & Mineral Complex:</strong>
                      <p className="font-mono text-gray-800 text-[11px] leading-relaxed">{product.ingredients}</p>
                    </div>
                    <div className="text-gray-600 text-[11px]">
                      <strong>Manufacturer:</strong> {product.manufacturer}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {/* Reviews List */}
                    <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                      {productReviews.length === 0 ? (
                        <p className="text-gray-400 italic">No reviews yet. Be the first to share your experience!</p>
                      ) : (
                        productReviews.map((rev) => (
                          <div key={rev.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-gray-900">{rev.customerName}</span>
                              <div className="flex text-amber-400">
                                {[...Array(rev.rating)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-amber-400" />
                                ))}
                              </div>
                            </div>
                            <p className="font-semibold text-gray-800 text-[11px] mb-0.5">{rev.title}</p>
                            <p className="text-gray-600 text-[11px]">{rev.comment}</p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Write Review Form */}
                    <form onSubmit={handleReviewSubmit} className="pt-3 border-t border-gray-100 space-y-2">
                      <span className="font-bold text-gray-800 block text-[11px]">Add Verified Review:</span>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Your Name (e.g. Samuel K.)"
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs"
                          required
                        />
                        <select
                          value={reviewRating}
                          onChange={(e) => setReviewRating(Number(e.target.value))}
                          className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs"
                        >
                          <option value={5}>★★★★★ (5 Stars)</option>
                          <option value={4}>★★★★☆ (4 Stars)</option>
                          <option value={3}>★★★☆☆ (3 Stars)</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        placeholder="Review Headline"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs"
                      />
                      <textarea
                        rows={2}
                        placeholder="Your genuine experience with the product..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs resize-none"
                        required
                      />
                      <button
                        type="submit"
                        disabled={reviewSubmitting}
                        className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-700"
                      >
                        <Send className="w-3 h-3" />
                        <span>Submit Review</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Stepper & Actions */}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-gray-50">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-gray-700 hover:bg-gray-200 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-black text-gray-900 bg-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-3 py-1.5 text-gray-700 hover:bg-gray-200 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-300 transition-all"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-700" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white shadow-lg shadow-emerald-700/20 active:scale-95 transition-all"
                >
                  <span>Proceed to Checkout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
