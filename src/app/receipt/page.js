'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';
import { Plus, Trash2, Share2, Receipt, LogOut } from 'lucide-react';
import { toPng } from 'html-to-image';

export default function ReceiptGenerator() {
  const router = useRouter();
  const receiptRef = useRef(null);
  
  const [businessData, setBusinessData] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState([{ name: '', qty: 1, price: 0 }]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMyProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setBusinessData(data);
      } else {
        router.push('/');
      }
      setLoading(false);
    }
    loadMyProfile();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const addItem = () => setItems([...items, { name: '', qty: 1, price: 0 }]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));
  
  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const calculateTotal = () => items.reduce((sum, item) => sum + (item.qty * item.price), 0);

  const downloadReceipt = async () => {
    if (!receiptRef.current) return;
    try {
      const dataUrl = await toPng(receiptRef.current, { cacheBust: true });
      const link = document.createElement('a');
      link.download = `Receipt-${customerName || 'Customer'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error generating receipt image:', error);
    }
  };

  if (loading || !businessData) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center">
        <p className="text-slate-600 font-medium animate-pulse">Loading receipt dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] p-4 md:p-8 text-slate-800">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Input Pane */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Receipt className="text-blue-600" /> New Receipt
            </h1>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-xl transition"
            >
              <LogOut size={14} /> Log Out
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Customer Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-600">Items purchased</label>
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Item description"
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  value={item.name}
                  onChange={(e) => updateItem(idx, 'name', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Qty"
                  className="w-16 px-2 py-2 border border-slate-200 rounded-xl text-sm text-center"
                  value={item.qty}
                  onChange={(e) => updateItem(idx, 'qty', parseInt(e.target.value) || 0)}
                />
                <input
                  type="number"
                  placeholder="Price"
                  className="w-24 px-2 py-2 border border-slate-200 rounded-xl text-sm"
                  value={item.price}
                  onChange={(e) => updateItem(idx, 'price', parseFloat(e.target.value) || 0)}
                />
                {items.length > 1 && (
                  <button onClick={() => removeItem(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
            <button onClick={addItem} className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:underline pt-1">
              <Plus size={16} /> Add another item
            </button>
          </div>

          <button onClick={downloadReceipt} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-sm">
            <Share2 size={18} /> Generate & Save Receipt
          </button>
        </div>

        {/* Right Preview Pane */}
        <div className="flex justify-center items-start">
          <div ref={receiptRef} className="bg-white w-full max-w-[400px] p-6 shadow-md rounded-md border border-slate-200 font-mono text-xs space-y-4">
            <div className="text-center border-b border-dashed border-slate-300 pb-4">
              <h2 className="text-base font-bold uppercase tracking-wide">{businessData.business_name}</h2>
              <p className="text-[10px] text-slate-500 mt-1">{businessData.shop_address}</p>
              <p className="text-[10px] text-slate-500">Tel: {businessData.phone_number}</p>
            </div>

            <div className="space-y-1 text-[11px]">
              <p><span className="text-slate-400">Date:</span> {new Date().toLocaleDateString()}</p>
              <p><span className="text-slate-400">Client:</span> {customerName || 'Cash Customer'}</p>
            </div>

            <table className="w-full text-left border-b border-dashed border-slate-300 pb-2">
              <thead>
                <tr className="text-slate-400 text-[10px] uppercase border-b border-slate-100">
                  <th className="pb-1">Item</th>
                  <th className="pb-1 text-center">Qty</th>
                  <th className="pb-1 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} className="text-[11px]">
                    <td className="py-1.5 truncate max-w-[150px]">{item.name || 'Unspecified Item'}</td>
                    <td className="py-1.5 text-center">{item.qty}</td>
                    <td className="py-1.5 text-right">₦{(item.qty * item.price).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center pt-2 text-sm font-bold">
              <span>TOTAL DUE:</span>
              <span>₦{calculateTotal().toLocaleString()}</span>
            </div>

            <div className="text-center border-t border-dashed border-slate-300 pt-4 text-[10px] text-slate-400 uppercase tracking-wider">
              Thank you for your patronage!
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}