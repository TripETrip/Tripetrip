import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '@/firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Validation check
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firebase connection established.");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration or internet connection.");
    }
  }
}
testConnection();

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerInfo: { providerId: string; displayName: string; email: string; }[];
  }
}

export function handleFirestoreError(error: any, operationType: FirestoreErrorInfo['operationType'], path: string | null = null) {
  const user = auth.currentUser;
  const errorInfo: FirestoreErrorInfo = {
    error: error.message || String(error),
    operationType,
    path,
    authInfo: {
      userId: user?.uid || 'anonymous',
      email: user?.email || 'none',
      emailVerified: user?.emailVerified || false,
      isAnonymous: user?.isAnonymous || true,
      providerInfo: user?.providerData.map(p => ({
        providerId: p.providerId,
        displayName: p.displayName || '',
        email: p.email || ''
      })) || []
    }
  };
  throw new Error(JSON.stringify(errorInfo));
}

export interface VendorProfile {
  id: string;
  user_id: string;
  business_name: string;
  business_type: string;
  business_email?: string;
  business_phone?: string;
  description?: string;
  slug: string;
  custom_website?: string;
  logo_url?: string;
  banner_url?: string;
  social_links?: {
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
  };
  address?: string;
  created_at: any;
}

export interface Booking {
  id: string;
  listing_id: string;
  vendor_id: string;
  traveler_id: string;
  traveler_name: string;
  start_date: any;
  end_date: any;
  guests: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: any;
}

export type UserRole = 'traveler' | 'vendor' | 'admin';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
}

export interface Listing {
  id: string;
  vendor_id: string;
  title: string;
  description: string;
  category: string;
  base_price: number;
  price_unit: 'per_night' | 'per_person' | 'per_day' | 'fixed';
  max_capacity: number | null;
  images: string[];
  amenities: string[];
  location: string;
  lat: number | null;
  lng: number | null;
  specifics?: Record<string, any>;
  is_active: boolean;
  created_at: string;
}
