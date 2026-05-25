import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from '@/src/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Layout from '@/src/components/Layout';
import Home from '@/src/pages/Home';
import Search from '@/src/pages/Search';
import ListingDetail from '@/src/pages/ListingDetail';
import Login from '@/src/pages/Login';
import Register from '@/src/pages/Register';
import TravelerDashboard from '@/src/pages/traveler/Dashboard';
import VendorDashboard from '@/src/pages/vendor/Dashboard';
import ListingManager from '@/src/pages/vendor/ListingManager';
import PublicVendorPage from '@/src/pages/PublicVendorPage';
import { Toaster } from 'sonner';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setSession(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="text-4xl font-light tracking-tighter mb-4">Tripetrip</div>
          <div className="h-1 w-24 bg-white/20 overflow-hidden">
            <div className="h-full bg-white animate-[loading_1.5s_infinite]" style={{ width: '30%' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="top-center" theme="dark" />
      <Routes>
        <Route element={<Layout session={session} />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/listing/:id" element={<ListingDetail />} />
          <Route path="/v/:slug" element={<PublicVendorPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={session ? <TravelerDashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/vendor" 
            element={session ? <VendorDashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/vendor/listing/new" 
            element={session ? <ListingManager /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/vendor/listing/edit/:id" 
            element={session ? <ListingManager /> : <Navigate to="/login" />} 
          />
        </Route>
      </Routes>
    </Router>
  );
}
