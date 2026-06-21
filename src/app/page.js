'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../lib/supabase';
import { Store, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function ProfileSetup() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function checkUserSession() {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/login');
          return;
        }

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (profileData) {
          router.push('/receipt');
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error(err.message);
        setLoading(false);
      }
    }
    checkUserSession();
  }, [router]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!businessName.trim() || !phoneNumber.trim() || !shopAddress.trim()) {
      setMessage('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .insert([
          {
            business_name: businessName,
            phone_number: phoneNumber,
            shop_address: shopAddress,
            user_id: user.id
          }
        ]);

      if (error) throw error;
      router.push('/receipt');
    } catch (err) {
      setMessage(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center">
        <p className="text-slate-600 font-medium animate-pulse">Checking business profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md border border-slate-100">
        <div className="flex flex-col items-center mb-6 text-center">
          <h2 className="text-2xl font-bold text-slate-800">Set Up Your Business</h2>
          <p className="text-sm text-slate-500 mt-1">Enter your details to generate custom receipts</p>
        </div>

        {message && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm mb-4 text-center">{message}</div>}

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
            <div className="relative">
              <Store className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                placeholder="e.g. HaQQ Computers"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                placeholder="e.g. 08012345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Shop Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                placeholder="e.g. Shop 4, Lagos Road"
                value={shopAddress}
                onChange={(e) => setShopAddress(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition duration-200 flex items-center justify-center gap-2"
          >
            Save & Continue <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}