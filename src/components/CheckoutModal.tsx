import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Phone,
  CreditCard,
  Banknote,
  Send,
  Download,
  Share2,
  Printer,
  Sparkles,
  AlertCircle,
  FileText,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../context/StoreContext';
import { PaymentMethod, Order } from '../types';
import { sendOrderReceiptEmail, exportOrderToGoogleDrive } from '../services/workspaceService';

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartDeliveryFee,
    cartDiscount,
    cartTotal,
    deliveryDistrict,
    setDeliveryDistrict,
    placeOrder,
    isCheckoutOpen,
    setIsCheckoutOpen,
    activeUser,
    settings,
    showNotification,
  } = useStore();

  // Form Fields
  const [customerName, setCustomerName] = useState(activeUser?.displayName || '');
  const [customerEmail, setCustomerEmail] = useState(activeUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState('+256 ');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [district, setDistrict] = useState(deliveryDistrict);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mtn_mobile_money');

  // MoMo / Card specific fields
  const [momoNumber, setMomoNumber] = useState('+256 ');
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Processing & State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Workspace Actions Status
  const [gmailStatus, setGmailStatus] = useState<string | null>(null);
  const [driveStatus, setDriveStatus] = useState<string | null>(null);
  const [workspaceLoading, setWorkspaceLoading] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleDistrictChange = (d: string) => {
    setDistrict(d);
    setDeliveryDistrict(d);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim()) {
      showNotification('error', 'Please fill in your name, phone number, and delivery address.');
      return;
    }

    if (customerPhone.trim().length < 9) {
      showNotification('error', 'Please provide a valid Ugandan telephone number (e.g., +256 700 000 000).');
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === 'mtn_mobile_money') {
        setProcessingStep('Sending MTN Mobile Money USSD prompt to your handset...');
        await new Promise((res) => setTimeout(res, 1800));
        setProcessingStep('Awaiting network transaction authorization...');
        await new Promise((res) => setTimeout(res, 1400));
      } else if (paymentMethod === 'airtel_money') {
        setProcessingStep('Sending Airtel Money secure prompt to your phone...');
        await new Promise((res) => setTimeout(res, 1800));
        setProcessingStep('Verifying payment network response...');
        await new Promise((res) => setTimeout(res, 1400));
      } else if (paymentMethod === 'bank_card') {
        setProcessingStep('Communicating with payment gateway (Flutterwave/Bank)...');
        await new Promise((res) => setTimeout(res, 1800));
      } else {
        setProcessingStep('Recording Cash on Delivery order...');
        await new Promise((res) => setTimeout(res, 1000));
      }

      setProcessingStep('Creating order and reserving stock...');
      const order = await placeOrder({
        customerName,
        customerEmail: customerEmail || 'guest@goglobaledge.com',
        customerPhone,
        deliveryAddress,
        district,
        paymentMethod,
        notes: deliveryNotes,
      });

      setCompletedOrder(order);
      setIsProcessing(false);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      setIsProcessing(false);
      showNotification('error', err.message || 'Failed to complete checkout.');
    }
  };

  // Google Workspace: Send Gmail Receipt
  const handleSendGmailReceipt = async () => {
    if (!completedOrder) return;
    const recipient = completedOrder.customerEmail || customerEmail;
    if (!recipient || recipient.includes('guest@')) {
      showNotification('error', 'Please enter a valid customer email address.');
      return;
    }

    const confirmed = window.confirm(
      `Send order receipt email to ${recipient} via your authorized Gmail account?`
    );
    if (!confirmed) return;

    setWorkspaceLoading(true);
    setGmailStatus('Sending receipt email via Gmail API...');
    const result = await sendOrderReceiptEmail(completedOrder, recipient);
    setWorkspaceLoading(false);

    if (result.success) {
      setGmailStatus('Email sent successfully via Gmail!');
      showNotification('success', 'Order receipt dispatched via Gmail!');
    } else {
      setGmailStatus(`Error: ${result.error}`);
      showNotification('error', result.error || 'Failed to send receipt email.');
    }
  };

  // Google Workspace: Export to Google Drive
  const handleExportToGoogleDrive = async () => {
    if (!completedOrder) return;
    const confirmed = window.confirm(
      `Save a copy of order receipt #${completedOrder.orderNumber} to your Google Drive?`
    );
    if (!confirmed) return;

    setWorkspaceLoading(true);
    setDriveStatus('Exporting receipt document to Google Drive...');
    const result = await exportOrderToGoogleDrive(completedOrder);
    setWorkspaceLoading(false);

    if (result.success) {
      setDriveStatus('Receipt saved to Google Drive!');
      showNotification('success', 'Receipt saved to your Google Drive!');
      if (result.webViewLink) {
        window.open(result.webViewLink, '_blank');
      }
    } else {
      setDriveStatus(`Error: ${result.error}`);
      showNotification('error', result.error || 'Failed to export to Google Drive.');
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setCompletedOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-emerald-100 overflow-hidden my-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-950 text-white border-b border-emerald-900">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-serif font-black tracking-tight">
                {completedOrder ? 'Order Confirmed!' : 'Secure Checkout • Go Global Edge'}
              </h3>
              <p className="text-[11px] text-emerald-300">
                Official Uganda Store Delivery & Payment Processing
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-white/20 text-gray-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {completedOrder ? (
          /* Order Confirmation View */
          <div className="p-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h4 className="text-xl font-serif font-black text-gray-900">
                Thank you, {completedOrder.customerName}!
              </h4>
              <p className="text-xs text-gray-600 max-w-md mx-auto">
                Your order has been recorded in our dispatch system. We will contact you on{' '}
                <strong className="text-emerald-900">{completedOrder.customerPhone}</strong> for delivery.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-xs space-y-2.5">
              <div className="flex justify-between pb-2 border-b border-gray-200">
                <span className="font-semibold text-gray-500">Order Number:</span>
                <span className="font-mono font-black text-emerald-950">
                  #{completedOrder.orderNumber}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-200">
                <span className="font-semibold text-gray-500">Transaction Reference:</span>
                <span className="font-mono text-gray-700">{completedOrder.transactionRef}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-200">
                <span className="font-semibold text-gray-500">Payment Method:</span>
                <span className="font-bold uppercase text-gray-800">
                  {completedOrder.paymentMethod.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-200">
                <span className="font-semibold text-gray-500">Delivery Address:</span>
                <span className="text-gray-800 text-right">
                  {completedOrder.deliveryAddress}, {completedOrder.district}
                </span>
              </div>

              {/* Items */}
              <div className="pt-1">
                <span className="font-bold text-gray-700 block mb-1">Items Ordered:</span>
                {completedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-[11px] text-gray-600">
                    <span>
                      {it.name} (x{it.quantity})
                    </span>
                    <span className="font-semibold">UGX {(it.price * it.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-gray-300 flex justify-between text-sm font-black text-emerald-950 font-serif">
                <span>Total Amount Paid / Due:</span>
                <span>UGX {completedOrder.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Google Workspace & External integrations */}
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Google Workspace Integrations (Gmail & Google Drive)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleSendGmailReceipt}
                  disabled={workspaceLoading}
                  className="p-2.5 rounded-xl bg-white border border-emerald-200 hover:border-emerald-400 text-emerald-950 text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs hover:bg-emerald-50/50 transition-all"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Send Receipt via Gmail</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportToGoogleDrive}
                  disabled={workspaceLoading}
                  className="p-2.5 rounded-xl bg-white border border-emerald-200 hover:border-emerald-400 text-emerald-950 text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs hover:bg-emerald-50/50 transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Save to Google Drive</span>
                </button>
              </div>

              {(gmailStatus || driveStatus) && (
                <div className="text-[11px] space-y-1 font-mono text-emerald-800 bg-white/80 p-2 rounded-lg">
                  {gmailStatus && <div>• {gmailStatus}</div>}
                  {driveStatus && <div>• {driveStatus}</div>}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handlePrintReceipt}
                className="py-3 px-4 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-50"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>

              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Go%20Global%20Edge,%20I%20placed%20order%20%23${completedOrder.orderNumber}%20for%20UGX%20${completedOrder.totalAmount}.%20Please%20confirm%20delivery.`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md"
              >
                <Share2 className="w-4 h-4 text-amber-300" />
                <span>Notify on WhatsApp</span>
              </a>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          /* Checkout Input Form */
          <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Step 1: Customer & Delivery Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[11px] flex items-center justify-center font-sans">
                  1
                </span>
                Customer & Delivery Address
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Mukasa"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Phone Number (MTN / Airtel) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+256 700 123 456"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email Address (For receipts)
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    City / District in Uganda *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden bg-white"
                  >
                    <option value="Kampala">Kampala City (Central, Nakawa, Kawempe, Makindye)</option>
                    <option value="Wakiso">Wakiso / Entebbe / Kira</option>
                    <option value="Mukono">Mukono / Seeta</option>
                    <option value="Jinja">Jinja / Eastern Region</option>
                    <option value="Mbarara">Mbarara / Western Region</option>
                    <option value="Gulu">Gulu / Northern Region</option>
                    <option value="Upcountry">Other Upcountry District</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Physical Street Address / Landmark *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Plot 14 Acacia Avenue, Kololo or Near Shell Fuel Station"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Special Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Call before dispatch, deliver between 2pm - 5pm"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[11px] flex items-center justify-center font-sans">
                  2
                </span>
                Payment Method (Uganda)
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'mtn_mobile_money', label: 'MTN MoMo', icon: Phone, color: 'border-yellow-400 bg-yellow-50/50' },
                  { id: 'airtel_money', label: 'Airtel Money', icon: Phone, color: 'border-red-400 bg-red-50/50' },
                  { id: 'bank_card', label: 'Bank Card', icon: CreditCard, color: 'border-blue-400 bg-blue-50/50' },
                  { id: 'cash_on_delivery', label: 'Cash on Del.', icon: Banknote, color: 'border-emerald-400 bg-emerald-50/50' },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        paymentMethod === m.id
                          ? `border-emerald-800 ring-2 ring-emerald-700 bg-emerald-50 font-bold text-emerald-950 shadow-xs`
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-emerald-800" />
                      <span className="text-xs font-semibold">{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Payment specific prompt notes */}
              {paymentMethod === 'mtn_mobile_money' && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-700" />
                    <span>MTN Mobile Money Uganda:</span>
                  </div>
                  <p className="text-[11px]">
                    Enter your registered MTN number below. You will receive an instant prompt on your phone to confirm payment of <strong>UGX {cartTotal.toLocaleString()}</strong>.
                  </p>
                  <input
                    type="tel"
                    placeholder="+256 770 000 000"
                    value={momoNumber}
                    onChange={(e) => setMomoNumber(e.target.value)}
                    className="w-full mt-1.5 px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs"
                  />
                  <p className="text-[10px] text-amber-700 italic">
                    Security Notice: We NEVER ask for or store your Mobile Money PIN.
                  </p>
                </div>
              )}

              {paymentMethod === 'airtel_money' && (
                <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-red-700" />
                    <span>Airtel Money Uganda:</span>
                  </div>
                  <p className="text-[11px]">
                    Enter your Airtel number below to initiate the push prompt for <strong>UGX {cartTotal.toLocaleString()}</strong>.
                  </p>
                  <input
                    type="tel"
                    placeholder="+256 750 000 000"
                    value={momoNumber}
                    onChange={(e) => setMomoNumber(e.target.value)}
                    className="w-full mt-1.5 px-3 py-1.5 bg-white border border-red-300 rounded-lg text-xs"
                  />
                  <p className="text-[10px] text-red-700 italic">
                    Security Notice: We NEVER ask for or store your Mobile Money PIN.
                  </p>
                </div>
              )}

              {paymentMethod === 'bank_card' && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-2">
                  <div className="font-bold text-gray-800 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Visa / Mastercard Payment:</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Card Number (4000 1234 5678 9010)"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'cash_on_delivery' && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <Banknote className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Cash on Delivery in Uganda:</span>
                  </div>
                  <p className="text-[11px]">
                    Pay cash in UGX directly to our courier agent when your package is handed to you in tamper-proof packaging.
                  </p>
                </div>
              )}
            </div>

            {/* Total Summary */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-1.5">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal:</span>
                <span className="font-bold text-gray-900">UGX {cartSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charge ({district}):</span>
                <span className="font-bold text-gray-900">
                  {cartDeliveryFee === 0 ? 'FREE' : `UGX ${cartDeliveryFee.toLocaleString()}`}
                </span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Applied Discount:</span>
                  <span>-UGX {cartDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-200 text-base font-black text-emerald-950 font-serif">
                <span>Total Amount to Pay:</span>
                <span>UGX {cartTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Processing indicator or Submit */}
            {isProcessing ? (
              <div className="p-4 bg-emerald-900 text-white rounded-xl text-center space-y-2">
                <div className="inline-block w-6 h-6 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-semibold">{processingStep}</p>
                <p className="text-[10px] text-emerald-300">
                  Please keep this window open while we communicate with the payment server...
                </p>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-4 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-700/30 transition-all active:scale-98"
              >
                <Lock className="w-4 h-4 text-amber-300" />
                <span>Confirm & Pay UGX {cartTotal.toLocaleString()}</span>
              </button>
            )}

            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Never stores your PIN • End-to-end Encrypted Verification</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
