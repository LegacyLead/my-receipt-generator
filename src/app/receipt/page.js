'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../lib/supabase';
import { Plus, Trash2, Download, Receipt, LogOut, MessageSquare } from 'lucide-react';
import { toPng } from 'html-to-image';

const LOGO_SRC = "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAFQAR4DASIAAhEBAxEB/8QAHQABAAEEAwEAAAAAAAAAAAAAAAgBBQQHAgQJA//EAE8QAAEDAwIDBQQHBAcFAw0AAAEAAgMEBREGIQcSMQgTQVFhInGBkRQyQlKhscEVI2JyM0OSwtHh8BYkU6LSVoKyCRcYJjQ1N2RzlbPT8f/EABsBAQACAwEBAAAAAAAAAAAAAAAEBQEDBgIH/8QANREAAgIBAwMCBAUDAgcAAAAAAAECAwQFESESMUETIgYyUWEUI3GBoUKRsdHwFRYkNGLB4f/aAAwSHIFTQ1N2RzlbPT8f/EABsBAQACAwEBAAAAAAAAAAAAAAAEBQEDBgIH/8QANREAAgIBAwMCBAUDAgcAAAAAAAECAwQFESESMUETIgYyUWEUI3GBoUKRsdHwFRYkNGLB4f/aAAメイドイン";

function LogoBadge() {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-5 pointer-events-none z-50">
      <div className="flex items-center gap-2.5 bg-white/80 backdrop-blur-md border border-slate-200/70 rounded-2xl px-4 py-2 shadow-lg shadow-slate-900/5">
        <img src={LOGO_SRC} alt="ReceiptGen logo" className="w-6 h-6 rounded-md object-contain" />
        <div className="flex flex-col leading-none">
          <span className="text-[8px] font-semibold tracking-[0.18em] uppercase text-slate-400">Powered by</span>
          <span className="text-[11px] font-black tracking-tight text-slate-700">HaQQ Computers</span>
        </div>
        <div className="w-px h-5 bg-slate-200 mx-0.5" />
        <span className="text-[8px] font-medium text-slate-400 tracking-wide">Professional Edition</span>
      </div>
    </div>
  );
}

export default function ReceiptGenerator() {
  const router = useRouter();
  const receiptRef = useRef(null);

  const [businessData, setBusinessData] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState([{ name: '', qty: 1, price: 0 }]);
  const [loading, setLoading] = useState(true);
  const [newRowIdx, setNewRowIdx] = useState(null);

  useEffect(() => {
    async function loadMyProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      const { data, error } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
      if (data) { setBusinessData(data); } else { router.push('/'); }
      setLoading(false);
    }
    loadMyProfile();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const addItem = () => {
    const idx = items.length;
    setItems([...items, { name: '', qty: 1, price: 0 }]);
    setNewRowIdx(idx);
    setTimeout(() => setNewRowIdx(null), 400);
  };

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

  const shareToWhatsApp = () => {
    const clientName = customerName.trim() || 'Valued Customer';
    const totalAmount = calculateTotal().toLocaleString();
    const businessName = businessData?.business_name || 'Our Shop';
    
    // Construct text summary of items
    const itemsSummary = items
      .filter(item => item.name.trim() !== '')
      .map(item => `• ${item.name} (Qty: ${item.qty})`)
      .join('\n');

    const itemSection = itemsSummary ? `\n\nItems:\n${itemsSummary}` : '';

    const message = `Hello ${clientName},\n\nThank you for your patronage! Here is the summary of your receipt from *${businessName}*.\n\n*Total Due: ₦${totalAmount}*${itemSection}\n\nHave a wonderful day!`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?text=${encodedMessage}`, '_blank');
  };

  if (loading || !businessData) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          <p className="text-sm font-medium text-slate-500 tracking-wide">Loading your dashboard…</p>
        </div>
        <LogoBadge />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-24" style={{ animation: 'fadeIn 0.35s ease both' }}>

      {/* Top nav bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/70 px-6 py-3 flex items-center justify-between shadow-sm shadow-slate-900/3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow shadow-blue-500/25">
            <Receipt size={15} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 leading-none">{businessData.business_name}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Receipt Dashboard</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 active:scale-95 px-3 py-1.5 rounded-xl transition-all duration-150">
          <LogOut size={13} /> Log Out
        </button>
      </header>

      <div className="max-w-5xl mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ── LEFT: INPUT PANEL ── */}
        <div className="space-y-4" style={{ animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) 0.05s both' }}>

          {/* Customer */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Customer Name</label>
            <div className="relative group">
              <input
                type="text" placeholder="Enter customer name"
                value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-200"
              />
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Items Purchased</label>

            <div className="hidden sm:grid sm:grid-cols-[1fr_60px_100px_32px] gap-2 px-1">
              <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Description</span>
              <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider text-center">Qty</span>
              <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider text-right">Price</span>
              <span />
            </div>

            <div className="space-y-3 sm:space-y-2">
              {items.map((item, idx) => (
                <div key={idx}
                  className="flex flex-col sm:grid sm:grid-cols-[1fr_60px_100px_32px] gap-2 bg-slate-50/50 sm:bg-transparent p-3 sm:p-0 rounded-xl border border-slate-100 sm:border-none relative"
                  style={{ animation: idx === newRowIdx ? 'rowIn 0.3s cubic-bezier(0.16,1,0.3,1) both' : undefined }}>
                  
                  <div className="w-full">
                    <span className="block sm:hidden text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Description</span>
                    <input type="text" placeholder="Item description" value={item.name}
                      onChange={(e) => updateItem(idx, 'name', e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-200" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:contents">
                    <div>
                      <span className="block sm:hidden text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Qty</span>
                      <input type="number" placeholder="1" value={item.qty}
                        onChange={(e) => updateItem(idx, 'qty', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-center text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-200" />
                    </div>

                    <div>
                      <span className="block sm:hidden text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Price</span>
                      <div className="relative group w-full">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300 group-focus-within:text-blue-400 transition-colors pointer-events-none select-none">₦</span>
                        <input type="number" placeholder="0" value={item.price}
                          onChange={(e) => updateItem(idx, 'price', parseFloat(e.target.value) || 0)}
                          className="w-full pl-5 pr-1.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-right text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-200" />
                      </div>
                    </div>
                  </div>

                  {items.length > 1 ? (
                    <button onClick={() => removeItem(idx)}
                      className="absolute top-2 right-2 sm:static flex items-center justify-center w-7 h-7 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 active:scale-90 transition-all duration-150 self-end sm:self-auto">
                      <Trash2 size={13} />
                    </button>
                  ) : <span className="hidden sm:inline" />}
                </div>
              ))}
            </div>

            <button onClick={addItem}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 active:scale-[0.98] border border-dashed border-blue-200 hover:border-blue-300 rounded-2xl transition-all duration-200">
              <Plus size={13} /> Add another item
            </button>
          </div>

          {/* Total summary */}
          <div className="bg-slate-900 rounded-2xl px-5 py-4 flex items-center justify-between shadow-md shadow-slate-900/15">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Total</span>
            <span className="text-2xl font-black text-white tracking-tight">
              ₦{calculateTotal().toLocaleString()}
            </span>
          </div>

          {/* Action Buttons Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Download Button */}
            <button onClick={downloadReceipt}
              className="group flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-white font-bold py-3.5 rounded-2xl transition-all duration-200 text-xs shadow-md">
              <Download size={15} className="transition-transform duration-200 group-hover:-translate-y-0.5" />
              Download Receipt Image
            </button>

            {/* WhatsApp Share Button */}
            <button onClick={shareToWhatsApp}
              className="group flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold py-3.5 rounded-2xl transition-all duration-200 text-xs shadow-md shadow-emerald-600/10">
              <MessageSquare size={15} className="transition-transform duration-200 group-hover:scale-110" />
              Send via WhatsApp
            </button>
          </div>
        </div>

        {/* ── RIGHT: RECEIPT PREVIEW ── */}
        <div className="flex justify-center items-start" style={{ animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}>
          <div className="w-full max-w-[400px]">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-3">Live Preview</p>
            <div className="rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200 overflow-hidden">
              <div ref={receiptRef} className="bg-white font-mono text-xs p-6 space-y-4">
                <div className="text-center border-b border-dashed border-slate-300 pb-4">
                  <h2 className="text-base font-black text-slate-900 uppercase tracking-wide">{businessData.business_name}</h2>
                  <p className="text-[10px] font-bold text-slate-800 mt-1">{businessData.shop_address}</p>
                  <p className="text-[10px] font-bold text-slate-800">Tel: {businessData.phone_number}</p>
                </div>

                <div className="space-y-1 text-[11px] text-slate-900">
                  <p><span className="font-bold">Date:</span> {new Date().toLocaleDateString()}</p>
                  <p><span className="font-bold">Client:</span> {customerName || 'Cash Customer'}</p>
                </div>

                <table className="w-full text-left border-b border-dashed border-slate-300 pb-2">
                  <thead>
                    <tr className="text-slate-900 font-bold text-[10px] uppercase border-b border-slate-200">
                      <th className="pb-1">Item</th>
                      <th className="pb-1 text-center">Qty</th>
                      <th className="pb-1 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, i) => (
                      <tr key={i} className="text-[11px] text-slate-900 font-medium">
                        <td className="py-1.5 truncate max-w-[150px]">{item.name || 'Unspecified Item'}</td>
                        <td className="py-1.5 text-center font-bold">{item.qty}</td>
                        <td className="py-1.5 text-right font-bold">₦{(item.qty * item.price).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-between items-center pt-2 text-sm font-black text-slate-900">
                  <span>TOTAL DUE:</span>
                  <span>₦{calculateTotal().toLocaleString()}</span>
                </div>

                <div className="text-center border-t border-dashed border-slate-300 pt-4 text-[10px] font-bold text-slate-900 uppercase tracking-wider">
                  Thank you for your patronage!
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <LogoBadge />

      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
        @keyframes rowIn   { from { opacity:0; transform:translateY(-8px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </div>
  );
}