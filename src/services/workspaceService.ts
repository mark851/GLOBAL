import { getCachedAccessToken } from '../firebase';
import { Order, Product } from '../types';

/**
 * Encodes string to RFC 4648 Base64URL
 */
function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Format currency to UGX
 */
function formatUGX(amount: number): string {
  return 'UGX ' + amount.toLocaleString('en-US');
}

/**
 * Sends order confirmation receipt via Gmail API (requires user token)
 */
export async function sendOrderReceiptEmail(
  order: Order,
  toEmail: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const token = getCachedAccessToken();
  if (!token) {
    return {
      success: false,
      error: 'Google Workspace access token not found. Please sign in with Google first.',
    };
  }

  const itemsList = order.items
    .map((item) => `- ${item.name} x${item.quantity} : ${formatUGX(item.price * item.quantity)}`)
    .join('\r\n');

  const emailContent = [
    `To: ${toEmail}`,
    `Subject: Order Confirmation #${order.orderNumber} - Go Global Edge`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    '',
    `Dear ${order.customerName},`,
    '',
    `Thank you for shopping with Go Global Edge! Your order #${order.orderNumber} has been received successfully.`,
    '',
    '--- ORDER DETAILS ---',
    itemsList,
    '',
    `Subtotal: ${formatUGX(order.subtotal)}`,
    `Delivery Fee: ${formatUGX(order.deliveryFee)}`,
    order.discount > 0 ? `Discount: -${formatUGX(order.discount)}` : '',
    `Total Amount: ${formatUGX(order.totalAmount)}`,
    '',
    `Delivery Address: ${order.deliveryAddress}, ${order.district}`,
    `Payment Method: ${order.paymentMethod.replace(/_/g, ' ').toUpperCase()}`,
    `Payment Status: ${order.paymentStatus}`,
    `Transaction Ref: ${order.transactionRef}`,
    '',
    'Need assistance? Contact our WhatsApp support at +256707658107.',
    '',
    'Warm regards,',
    'Go Global Edge Wellness Team',
  ]
    .filter(Boolean)
    .join('\r\n');

  const raw = base64UrlEncode(emailContent);

  try {
    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    return { success: true, messageId: data.id };
  } catch (err: any) {
    console.error('Gmail send error:', err);
    return { success: false, error: err.message || 'Failed to send email' };
  }
}

/**
 * Uploads an Order Receipt text document to Google Drive
 */
export async function exportOrderToGoogleDrive(
  order: Order
): Promise<{ success: boolean; fileId?: string; webViewLink?: string; error?: string }> {
  const token = getCachedAccessToken();
  if (!token) {
    return {
      success: false,
      error: 'Google Workspace access token not found. Please sign in with Google first.',
    };
  }

  const itemsList = order.items
    .map((item) => `* ${item.name} (Qty: ${item.quantity}) - ${formatUGX(item.price * item.quantity)}`)
    .join('\n');

  const receiptContent = `=====================================================
GO GLOBAL EDGE - OFFICIAL PURCHASE RECEIPT
=====================================================
Order Number:     #${order.orderNumber}
Date:             ${new Date(order.createdAt).toLocaleString()}
Customer:         ${order.customerName}
Phone:            ${order.customerPhone}
Email:            ${order.customerEmail || 'N/A'}
Delivery District:${order.district}
Address:          ${order.deliveryAddress}

-----------------------------------------------------
ITEMS ORDERED
-----------------------------------------------------
${itemsList}

-----------------------------------------------------
FINANCIAL SUMMARY
-----------------------------------------------------
Subtotal:         ${formatUGX(order.subtotal)}
Delivery Fee:     ${formatUGX(order.deliveryFee)}
Discount:         ${formatUGX(order.discount)}
Total Amount:     ${formatUGX(order.totalAmount)}

Payment Method:   ${order.paymentMethod.replace(/_/g, ' ').toUpperCase()}
Payment Status:   ${order.paymentStatus}
Order Status:     ${order.orderStatus}
Transaction Ref:  ${order.transactionRef}

=====================================================
Dietary Wellness Products • Pure Verified Formulations
Contact WhatsApp: +256707658107
=====================================================`;

  const metadata = {
    name: `Receipt_Order_${order.orderNumber}.txt`,
    mimeType: 'text/plain',
    description: `Official receipt for Go Global Edge order #${order.orderNumber}`,
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: text/plain\r\n\r\n' +
    receiptContent +
    closeDelimiter;

  try {
    const res = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body: multipartRequestBody,
      }
    );

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    return { success: true, fileId: data.id, webViewLink: data.webViewLink };
  } catch (err: any) {
    console.error('Google Drive export error:', err);
    return { success: false, error: err.message || 'Failed to export to Google Drive' };
  }
}

/**
 * Uploads an Inventory Status Report CSV to Google Drive
 */
export async function exportInventoryToGoogleDrive(
  products: Product[]
): Promise<{ success: boolean; fileId?: string; webViewLink?: string; error?: string }> {
  const token = getCachedAccessToken();
  if (!token) {
    return {
      success: false,
      error: 'Google Workspace access token not found. Please sign in with Google first.',
    };
  }

  const csvHeader = 'SKU,Product Name,Category,Price (UGX),Sale Price (UGX),Stock,Status\n';
  const csvRows = products
    .map(
      (p) =>
        `"${p.sku}","${p.name}","${p.category}",${p.price},${p.salePrice || p.price},${p.stock},"${p.status}"`
    )
    .join('\n');
  const csvContent = csvHeader + csvRows;

  const metadata = {
    name: `GoGlobalEdge_Inventory_${new Date().toISOString().slice(0, 10)}.csv`,
    mimeType: 'text/csv',
    description: 'Go Global Edge Real-time Inventory Snapshot',
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: text/csv\r\n\r\n' +
    csvContent +
    closeDelimiter;

  try {
    const res = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body: multipartRequestBody,
      }
    );

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    return { success: true, fileId: data.id, webViewLink: data.webViewLink };
  } catch (err: any) {
    console.error('Drive export inventory error:', err);
    return { success: false, error: err.message || 'Failed to export inventory' };
  }
}
