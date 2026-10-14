import React from 'react';
import {
  X,
  User as UserIcon,
  Package,
  Clock,
  CheckCircle2,
  Phone,
  ShieldCheck,
  LogIn,
  LogOut,
  FileText,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { signInWithGoogle, logOut } from '../firebase';

interface CustomerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerAccountModal: React.FC<CustomerAccountModalProps> = ({ isOpen, onClose }) => {
  const { activeUser, orders, showNotification, settings } = useStore();

  if (!isOpen) return null;

  const handleSignIn = async () => {
    try {
      const res = await signInWithGoogle();
      showNotification('success', `Welcome back, ${res.user.displayName || 'Customer'}!`);
    } catch (err: any) {
      showNotification('error', err.message || 'Login failed.');
    }
  };

  const handleSignOut = async () => {
    await logOut();
    showNotification('info', 'Signed out successfully.');
    onClose();
  };

  const userOrders = orders.filter(
    (o) =>
      o.customerId === activeUser?.uid ||
      (activeUser?.email && o.customerEmail?.toLowerCase() === activeUser.email.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Processing':
      case 'Ready for Dispatch':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Paid':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-emerald-100 overflow-hidden my-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-950 text-white flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-2.5">
            <UserIcon className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif font-black text-base text-white">
              Customer Account & Orders
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-gray-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* User Profile Card */}
          {activeUser ? (
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-lg uppercase shadow-xs">
                  {activeUser.displayName ? activeUser.displayName[0] : 'U'}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">
                    {activeUser.displayName || 'Verified Customer'}
                  </h4>
                  <p className="text-xs text-gray-600">{activeUser.email}</p>
                  <span className="inline-block mt-1 text-[10px] bg-emerald-200/80 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                    Google Firebase Verified
                  </span>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="px-3.5 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
              <UserIcon className="w-10 h-10 text-emerald-700 mx-auto opacity-40" />
              <h4 className="font-serif font-bold text-base text-gray-900">
                Sign In to Track Your Orders
              </h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Sign in with your Google account to view your past orders, delivery dispatches, and saved receipts.
              </p>
              <button
                onClick={handleSignIn}
                className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-md"
              >
                <LogIn className="w-4 h-4 text-amber-300" />
                <span>Sign in with Google</span>
              </button>
            </div>
          )}

          {/* Orders Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-sm text-gray-900 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-emerald-700" />
                <span>Your Order History ({userOrders.length})</span>
              </h4>
              <span className="text-[11px] text-gray-500">Live Status Tracking</span>
            </div>

            {userOrders.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-100 text-xs text-gray-500">
                No orders found under this account yet.
              </div>
            ) : (
              <div className="space-y-3">
                {userOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl border border-gray-200 bg-white hover:border-emerald-300 transition-colors space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono font-black text-xs text-emerald-950">
                          #{ord.orderNumber}
                        </span>
                        <div className="text-[10px] text-gray-400">
                          {new Date(ord.createdAt).toLocaleDateString()} at{' '}
                          {new Date(ord.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(
                          ord.orderStatus
                        )}`}
                      >
                        {ord.orderStatus}
                      </span>
                    </div>

                    {/* Items List */}
                    <div className="space-y-1 py-1 border-t border-b border-gray-100 text-xs">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-gray-700">
                          <span>
                            {it.name} (x{it.quantity})
                          </span>
                          <span className="font-bold">
                            UGX {(it.price * it.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <div>
                        <span className="text-gray-500">Total: </span>
                        <strong className="text-emerald-950 font-serif">
                          UGX {ord.totalAmount.toLocaleString()}
                        </strong>
                      </div>
                      <span className="text-[11px] text-gray-600">
                        Method: {ord.paymentMethod.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Customer Support Notice */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-center justify-between">
            <div className="space-y-0.5">
              <strong>Need help with a return or refund?</strong>
              <p className="text-[11px] text-amber-900">
                Our support team is available on WhatsApp daily from 8:00 AM to 8:00 PM.
              </p>
            </div>
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white font-bold text-xs flex items-center gap-1 shrink-0"
            >
              <Phone className="w-3.5 h-3.5 text-amber-300" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
