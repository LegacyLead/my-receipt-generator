'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Share2, Receipt, User } from 'lucide-react';
import { toPng } from 'html-to-image';

/* tiny helpers */
const fmt = (n) => Number(n || 0).toLocaleString('en-NG');

export default function ReceiptGenerator() {
  const [profile,      setProfile]      = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [items,        setItems]        = useState([{ description: '', quantity: 1, price: '' }]);
  const [generating,   setGenerating]   = useState(false);
  const [newRowIdx,    setNewRowIdx]    = useState(null);
  const [receiptDate, setReceiptDate] = useState('');
const [receiptNo, setReceiptNo] = useState(''); // tracks freshly-added row for animation
  const receiptRef = useRef(null);
  

  /* ── load profile ──────────────────────────────────────── */
  useEffect(() => {
    async function fetchProfile() {
      try {
        const devUserId = '00000000-0000-0000-0000-000000000000';
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', devUserId)
          .single();
        if (error) throw error;
        if (data) setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err.message);
      }
    }
    fetchProfile();
  }, []);

  /* ── item actions ──────────────────────────────────────── */
  const handleAddItem = () => {
    const idx = items.length;
    setItems([...items, { description: '', quantity: 1, price: '' }]);
    setNewRowIdx(idx);
    setTimeout(() => setNewRowIdx(null), 400);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const next = [...items];
    next[index][field] = value;
    setItems(next);
  };

  const calculateTotal = () =>
    items.reduce((sum, item) => sum + item.quantity * (Number(item.price) || 0), 0);

  /* ── share / download ──────────────────────────────────── */
  const handleShareReceipt = async () => {
    if (!customerName.trim()) {
      alert('Please enter a customer name first.');
      return;
    }
    if (!receiptRef.current) return;
    setGenerating(true);

    try {
      const dataUrl = await toPng(receiptRef.current, { backgroundColor: '#ffffff', quality: 0.95 });

      const devUserId = '00000000-0000-0000-0000-000000000000';
      await supabase.from('receipts').insert({
        vendor_id:     devUserId,
        customer_name: customerName,
        items:         items,
        total_amount:  calculateTotal(),
      });

      const response = await fetch(dataUrl);
      const blob     = await response.blob();
      const file     = new File([blob], `Receipt-${Date.now()}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Business Receipt',
          text:  `Thank you for your patronage, ${customerName}! Here is your digital receipt.`,
        });
      } else {
        const link      = document.createElement('a');
        link.download   = `Receipt-${customerName}.png`;
        link.href       = dataUrl;
        link.click();
        alert('Image downloaded! You can now attach and send it directly to your client on WhatsApp.');
      }
    } catch (error) {
      console.error('Sharing failed:', error);
    } finally {
      setGenerating(false);
    }
  };

  // const receiptDate = new Date().toLocaleDateString('en-NG', {
  //   day: '2-digit', month: 'short', year: 'numeric',
  // });
  // const receiptNo = `RG-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  /* ──────────────────────────────────────────────────────── */
  return (
    <main className="min-h-screen bg-[#F0F2F5] px-4 py-8 max-w-md mx-auto flex flex-col gap-5">

      {/* ── HEADER ── */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center shadow">
          <Receipt size={17} className="text-white" />
        </div>
        <div>
          <h1 className="text-base font-extrabold text-slate-900 leading-none">New Receipt</h1>
          <p className="text-[11px] text-slate-400 mt-0.5">Fill details, then share to WhatsApp</p>
        </div>
      </div>

      {/* ── INPUT CARD ── */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-5">

        {/* Customer Name */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            Customer Name
          </label>
          <div className="relative group">
            <User
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-600 transition-colors duration-200 pointer-events-none"
            />
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full pl-9 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/15 focus:border-slate-400 focus:bg-white transition-all duration-200"
            />
          </div>
        </div>

        {/* Line Items */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Line Items
          </label>

          {/* Column headers */}
          <div className="grid grid-cols-[1fr_44px_96px_24px] gap-1.5 px-1 mb-1">
            <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Item</span>
            <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider text-center">Qty</span>
            <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider text-right pr-1">Price (₦)</span>
            <span />
          </div>

          <div className="space-y-2">
            {items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr_44px_96px_24px] gap-1.5 items-center"
                style={{
                  animation: index === newRowIdx ? 'rowSlide 0.35s cubic-bezier(0.16,1,0.3,1) both' : undefined,
                }}
              >
                {/* Description */}
                <input
                  type="text"
                  placeholder="Item name"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/15 focus:border-slate-400 focus:bg-white transition-all duration-200"
                />

                {/* Qty */}
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                  className="w-full text-center px-1 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/15 focus:border-slate-400 focus:bg-white transition-all duration-200"
                />

                {/* Price — ₦ prepended visually */}
                <div className="relative group">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 group-focus-within:text-slate-700 pointer-events-none transition-colors duration-200 select-none">
                    ₦
                  </span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                    className="w-full pl-5 pr-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 text-right placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/15 focus:border-slate-400 focus:bg-white transition-all duration-200"
                  />
                </div>

                {/* Delete */}
                {items.length > 1 ? (
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="flex items-center justify-center w-6 h-6 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 active:scale-90 transition-all duration-150"
                  >
                    <Trash2 size={13} />
                  </button>
                ) : <span />}
              </div>
            ))}
          </div>

          {/* Add Item */}
          <button
            onClick={handleAddItem}
            className="mt-3 w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 active:scale-[0.97] border border-dashed border-slate-200 hover:border-slate-300 rounded-2xl transition-all duration-200"
          >
            <Plus size={13} />
            Add Item
          </button>
        </div>
      </div>

      {/* ── RECEIPT CANVAS ── */}
      <div className="bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-slate-100 bg-slate-50/70">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preview</span>
          <span className="text-[10px] text-slate-400">{receiptDate}</span>
        </div>

        {/* ← This div is what gets captured as the image → */}
        <div
          ref={receiptRef}
          className="p-7 bg-white font-sans"
          style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" }}
        >
          {/* Receipt header */}
          <div className="text-center pb-5 mb-5 border-b border-dashed border-slate-200">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-slate-900 rounded-xl mb-3">
              <Receipt size={18} color="white" />
            </div>
            <h1 className="text-lg font-black uppercase tracking-tight text-slate-900 leading-tight">
              {profile?.business_name || 'MY BUSINESS NAME'}
            </h1>
            {profile?.shop_address && (
              <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                {profile.shop_address}
              </p>
            )}
            {profile?.phone_number && (
              <p className="text-[10px] text-slate-500">{profile.phone_number}</p>
            )}
          </div>

          {/* Meta row */}
          <div className="flex justify-between text-[10px] text-slate-500 mb-5">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Bill To</p>
              <p className="font-semibold text-slate-800 text-xs">{customerName || '—'}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Date</p>
              <p className="font-medium text-slate-700">{receiptDate}</p>
              <p className="text-[9px] text-slate-400 mt-0.5">#{receiptNo}</p>
            </div>
          </div>

          {/* Items table */}
          <table className="w-full text-xs text-left mb-5">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-2 text-[9px] font-bold uppercase tracking-widest text-slate-400">Description</th>
                <th className="pb-2 text-[9px] font-bold uppercase tracking-widest text-slate-400 text-center">Qty</th>
                <th className="pb-2 text-[9px] font-bold uppercase tracking-widest text-slate-400 text-right">Amount (₦)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-100">
                  <td className="py-2.5 text-slate-800 font-medium">{item.description || 'Unnamed Item'}</td>
                  <td className="py-2.5 text-center text-slate-500">{item.quantity}</td>
                  <td className="py-2.5 text-right font-semibold text-slate-800">
                    {fmt(item.quantity * (Number(item.price) || 0))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total */}
          <div className="flex items-center justify-between bg-slate-900 rounded-2xl px-5 py-4 mb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Total Paid</span>
            <span className="text-xl font-black text-white tracking-tight">₦{fmt(calculateTotal())}</span>
          </div>

          {/* Footer stamp */}
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <circle cx="4" cy="4" r="4" fill="#10b981"/>
                <path d="M2 4l1.5 1.5L6 2.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Transaction Successful
            </span>
            <p className="text-[8px] text-slate-300 mt-3 tracking-widest uppercase">Generated via ReceiptGen</p>
          </div>
        </div>
      </div>

      {/* ── SHARE BUTTON ── */}
      <button
        onClick={handleShareReceipt}
        disabled={generating}
        className={`
          w-full flex items-center justify-center gap-2.5
          bg-[#25D366] hover:bg-[#1ebe5d] active:scale-[0.97]
          text-white font-bold py-4 rounded-3xl
          shadow-lg shadow-green-600/25
          transition-all duration-200 text-sm
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {/* WhatsApp icon */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className={generating ? 'opacity-60' : ''}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        {generating ? 'Compiling image…' : 'Share Receipt via WhatsApp'}
      </button>

      <style>{`
        @keyframes rowSlide {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)  scale(1); }
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </main>
  );
}