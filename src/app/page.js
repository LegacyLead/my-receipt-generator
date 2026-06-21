'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Store, Phone, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ProfileSetup() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState('');
  const [phoneNumber, setPhoneNumber]   = useState('');
  const [shopAddress, setShopAddress]   = useState('');
  const [loading, setLoading]           = useState(true);
  const [message, setMessage]           = useState('');
  const [success, setSuccess]           = useState(false);
  const [profile, setProfile] = useState(null);
useEffect(() => {
    async function checkExistingProfile() {
      try {
        const devUserId = '00000000-0000-0000-0000-000000000000';
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', devUserId)
          .single();

        if (data) {
          setProfile(data);
          router.push('/receipt'); 
        }
      } catch (err) {
        console.log('No profile found yet:', err.message);
      } finally {
        setLoading(false);
      }
    }
    checkExistingProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center">
        <p className="text-slate-600 font-medium animate-pulse">Loading HaQQ Computers...</p>
      </div>
    );
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setSuccess(false);

    if (!businessName.trim()) {
      setMessage('Please enter your business name.');
      setLoading(false);
      return;
    }

    try {
      const devUserId = '00000000-0000-0000-0000-000000000000';

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: devUserId,
          business_name: businessName,
          phone_number: phoneNumber,
          shop_address: shopAddress,
        });

      if (error) throw error;

      setSuccess(true);
      setMessage('Profile saved! Taking you to your receipt maker…');

      setTimeout(() => {
        window.location.href = '/receipt';
      }, 1200);

    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      id: 'businessName',
      label: 'Business Name',
      placeholder: "e.g. Kemi's Fashion Home",
      icon: Store,
      type: 'text',
      value: businessName,
      onChange: setBusinessName,
      multiline: false,
    },
    {
      id: 'phoneNumber',
      label: 'Phone Number',
      placeholder: 'e.g. 08012345678',
      icon: Phone,
      type: 'text',
      value: phoneNumber,
      onChange: setPhoneNumber,
      multiline: false,
    },
    {
      id: 'shopAddress',
      label: 'Shop Address',
      placeholder: 'e.g. Suite 12, Shopping Complex, Lagos',
      icon: MapPin,
      type: 'text',
      value: shopAddress,
      onChange: setShopAddress,
      multiline: true,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col justify-center items-center px-4 py-10">

      {/* Brand mark */}
      <div className="mb-8 flex flex-col items-center gap-2">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 shadow-lg">
          <Store size={22} className="text-white" />
        </span>
        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400">ReceiptGen</span>
      </div>

      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-7"
        style={{ animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both' }}
      >
        <div className="mb-7">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Set up your business
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
            This appears at the top of every receipt you send. You only need to do this once.
          </p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          {fields.map(({ id, label, placeholder, icon: Icon, value, onChange, multiline }) => (
            <div key={id} className="group" style={{ animation: 'fadeIn 0.3s ease both' }}>
              <label htmlFor={id} className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                {label}
              </label>
              <div className="relative">
                <span className={`absolute left-3 ${multiline ? 'top-3.5' : 'inset-y-0 flex items-center'} pointer-events-none text-slate-300 group-focus-within:text-slate-600 transition-colors duration-200`}>
                  <Icon size={17} />
                </span>
                {multiline ? (
                  <textarea
                    id={id}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    rows={2}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 focus:bg-white transition-all duration-200 text-sm resize-none"
                  />
                ) : (
                  <input
                    id={id}
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 focus:bg-white transition-all duration-200 text-sm"
                  />
                )}
              </div>
            </div>
          ))}

          {/* Feedback */}
          {message && (
            <div
              className={`flex items-center gap-2 p-3.5 rounded-2xl text-xs font-medium transition-all duration-300
                ${success
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  : 'bg-red-50 text-red-600 border border-red-100'
                }`}
            >
              {success && <CheckCircle2 size={14} className="shrink-0" />}
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || success}
            className="group w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-700 active:scale-[0.98] text-white font-semibold py-3.5 px-4 rounded-2xl transition-all duration-200 text-sm disabled:opacity-60 mt-1 shadow-md shadow-slate-900/10"
          >
            <span>{loading ? 'Saving…' : success ? 'Done!' : 'Save & Continue'}</span>
            <ArrowRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </button>
        </form>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </main>
  );
}