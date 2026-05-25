-- Tripetrip Database Schema (Supabase PostgreSQL)

-- 1. Enums
CREATE TYPE user_role AS ENUM ('traveler', 'vendor', 'admin');
CREATE TYPE business_type AS ENUM ('hotel', 'transport', 'adventure', 'tour_agent', 'restaurant', 'other');
CREATE TYPE price_unit AS ENUM ('per_night', 'per_person', 'per_day', 'fixed');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'escrowed', 'released', 'refunded');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');

-- 2. Profiles (Extends Auth.Users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role user_role DEFAULT 'traveler' NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Vendor Profiles
CREATE TABLE vendor_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  business_name TEXT NOT NULL,
  business_type business_type NOT NULL,
  description TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  verification_status verification_status DEFAULT 'pending' NOT NULL,
  trust_score INTEGER DEFAULT 0 CHECK (trust_score >= 0 AND trust_score <= 100),
  total_reviews INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 4. Listings
CREATE TABLE listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES vendor_profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT, -- e.g. 'Hotels', 'Adventure'
  base_price DECIMAL NOT NULL,
  price_unit price_unit NOT NULL,
  max_capacity INTEGER,
  images TEXT[] DEFAULT '{}',
  amenities JSONB DEFAULT '[]',
  location TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Availability
CREATE TABLE availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  slots_available INTEGER DEFAULT 1,
  custom_price DECIMAL,
  UNIQUE(listing_id, date)
);

-- 6. Bookings
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id) NOT NULL,
  traveler_id UUID REFERENCES profiles(id) NOT NULL,
  vendor_id UUID REFERENCES vendor_profiles(id) NOT NULL,
  check_in TIMESTAMPTZ NOT NULL,
  check_out TIMESTAMPTZ,
  guest_count INTEGER NOT NULL,
  total_price DECIMAL NOT NULL,
  status booking_status DEFAULT 'pending' NOT NULL,
  payment_status payment_status DEFAULT 'pending' NOT NULL,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  special_requests TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Reviews
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES profiles(id) NOT NULL,
  vendor_id UUID REFERENCES vendor_profiles(id) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  is_verified_booking BOOLEAN DEFAULT TRUE,
  vendor_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Messages (Notifications)
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id),
  receiver_id UUID REFERENCES profiles(id) NOT NULL,
  booking_id UUID REFERENCES bookings(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES

-- Profiles: Users can read all, but update only their own
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Vendor Profiles: Public view, self update
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public vendor profiles are viewable by everyone" ON vendor_profiles FOR SELECT USING (true);
CREATE POLICY "Vendors can update own profile" ON vendor_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Listings: Public view, vendor manage
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public listings are viewable by everyone" ON listings FOR SELECT USING (is_active = true);
CREATE POLICY "Vendors can manage their own listings" ON listings FOR ALL USING (
  vendor_id IN (SELECT id FROM vendor_profiles WHERE user_id = auth.uid())
);

-- Bookings: User can view their own, Vendor can view their own
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Travelers can view their own bookings" ON bookings FOR SELECT USING (auth.uid() = traveler_id);
CREATE POLICY "Vendors can view their own bookings" ON bookings FOR SELECT USING (
  vendor_id IN (SELECT id FROM vendor_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Travelers can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = traveler_id);

-- Add triggers for profile creation on signup
-- Note: This requires standard Supabase handle_new_user function
