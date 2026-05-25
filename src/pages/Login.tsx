import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '@/src/lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plane, Mail, Lock, Loader2, ArrowRight, UserCircle, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { seedDemoData } from '@/src/lib/demoData';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleDemoLogin = async (role: 'traveler' | 'vendor') => {
    setIsDemoLoading(role);
    const demoEmail = `${role}@demo.com`;
    const demoPass = 'password123';

    try {
      // 1. Try regular login
      let user;
      try {
        const res = await signInWithEmailAndPassword(auth, demoEmail, demoPass);
        user = res.user;
      } catch (e: any) {
        // 2. Fallback: Create demo account if it doesn't exist (handle both common error codes)
        if (e.code === 'auth/user-not-found' || e.code === 'auth/invalid-credential') {
          const res = await createUserWithEmailAndPassword(auth, demoEmail, demoPass);
          user = res.user;
          // Create/Update profile with merge to avoid disrupting existing fields
          await setDoc(doc(db, 'profiles', user.uid), {
            role: role,
            full_name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
            created_at: serverTimestamp()
          }, { merge: true });
          
          if (role === 'vendor') {
             const businessName = "Demo Adventures Manali";
             const { generateSlug } = await import('@/src/lib/utils');
             await setDoc(doc(db, 'vendor_profiles', user.uid), {
                user_id: user.uid,
                business_name: businessName,
                business_type: "stays",
                slug: `${generateSlug(businessName)}-${user.uid.slice(0, 4)}`,
                created_at: serverTimestamp()
             }, { merge: true });
          }
        } else {
          throw e;
        }
      }

      // 3. Seed data after successful login (once authenticated permissions are active)
      if (role === 'vendor') {
        await seedDemoData(user.uid);
      }

      toast.success(`Logged in as Demo ${role}`);
      navigate(role === 'vendor' ? '/vendor' : '/dashboard');
    } catch (error: any) {
      console.error("Demo login error:", error);
      toast.error('Demo login failed: ' + error.message);
    } finally {
      setIsDemoLoading(null);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Fetch role for redirection
      const profileSnap = await getDoc(doc(db, 'profiles', user.uid));
      const role = profileSnap.exists() ? profileSnap.data().role : 'traveler';
      
      toast.success('Welcome back to Tripetrip');
      navigate(role === 'vendor' ? '/vendor' : '/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Check if profile exists, if not create one
      const profileRef = doc(db, 'profiles', user.uid);
      const profileSnap = await getDoc(profileRef);
      
      let role = 'traveler';
      if (!profileSnap.exists()) {
        await setDoc(profileRef, {
          role: 'traveler', // Default for Google login
          full_name: user.displayName,
          created_at: serverTimestamp()
        });
      } else {
        role = profileSnap.data().role;
      }
      
      toast.success('Welcome back to Tripetrip');
      navigate(role === 'vendor' ? '/vendor' : '/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-indigo-600 opacity-[0.03] blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-indigo-600 opacity-[0.02] blur-[100px] rounded-full translate-y-1/3 -translate-x-1/4" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex w-12 h-12 bg-indigo-600 rounded-xl items-center justify-center mb-6 shadow-lg shadow-indigo-100">
            <Plane className="text-white w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Sign in to your direct travel account</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-50 border-slate-200 h-12 pl-12 rounded-xl focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Password</Label>
                <Link to="/forgot" className="text-[10px] uppercase font-bold text-indigo-600 hover:underline tracking-widest">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-50 border-slate-200 h-12 pl-12 rounded-xl focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-300"
                  required
                />
              </div>
            </div>

            <Button disabled={loading} className="w-full bg-indigo-600 text-white hover:bg-indigo-700 h-14 rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-indigo-100 transition-all">
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Log In'}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
              <span className="bg-white px-4 text-slate-300">Or continue with</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={handleGoogleLogin}
            className="w-full border-slate-200 hover:bg-slate-50 text-slate-600 h-14 rounded-xl font-bold uppercase tracking-widest text-xs transition-all"
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4 mr-3" alt="google" />
            Google
          </Button>
        </div>

        <p className="text-center mt-12 text-xs font-bold uppercase tracking-widest text-slate-400">
          Don't have an account? {' '}
          <Link to="/register" className="text-indigo-600 hover:underline">Create one</Link>
        </p>

        {/* Demo Section */}
        <div className="mt-12 pt-12 border-t border-slate-100">
           <div className="text-center mb-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300">Fast-Track Exploration</span>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                onClick={() => handleDemoLogin('traveler')}
                disabled={!!isDemoLoading}
                className="h-20 border-slate-200 bg-white hover:border-indigo-600 hover:bg-indigo-50/30 flex flex-col items-center justify-center gap-2 rounded-2xl group transition-all"
              >
                 {isDemoLoading === 'traveler' ? (
                   <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                 ) : (
                   <>
                    <UserCircle className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-indigo-600">Traveler Demo</span>
                   </>
                 )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleDemoLogin('vendor')}
                disabled={!!isDemoLoading}
                className="h-20 border-slate-200 bg-white hover:border-emerald-600 hover:bg-emerald-50/30 flex flex-col items-center justify-center gap-2 rounded-2xl group transition-all"
              >
                 {isDemoLoading === 'vendor' ? (
                   <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                 ) : (
                   <>
                    <Briefcase className="w-6 h-6 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-emerald-600">Vendor Demo</span>
                   </>
                 )}
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}
