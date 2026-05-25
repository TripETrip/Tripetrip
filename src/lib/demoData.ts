import { db, auth } from './firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, limit, setDoc, doc } from 'firebase/firestore';

export async function seedDemoData(vendorId: string) {
  const listingsRef = collection(db, 'listings');
  const snapshot = await getDocs(query(listingsRef, where('vendor_id', '==', vendorId), limit(1)));
  
  // Only seed if this specific vendor has no listings
  if (!snapshot.empty) return;

  const demoListings = [
    // STAYS
    {
      title: "Riverside Glamping Dome",
      description: "Experience the stars from a luxury dome right by the Beas river. Includes breakfast and a private bonfire pit.",
      category: "Stays",
      base_price: 120,
      price_unit: "per_night",
      location: "Old Manali, Riverside",
      images: ["https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800"],
      amenities: ["Fast WiFi", "Bonfire", "Heating", "Breakfast"],
      specifics: { property_type: "Camping / Glamping", units: 4, check_in: "14:00", check_out: "11:00" },
      vendor_id: vendorId,
      is_active: true,
      created_at: serverTimestamp()
    },
    {
      title: "Vintage Pine Wood Cottage",
      description: "A cozy 2-bedroom cottage surrounded by apple orchards. Perfect for families looking for peace and quiet.",
      category: "Stays",
      base_price: 85,
      price_unit: "per_night",
      location: "Naggar, Upper Hills",
      images: ["https://images.unsplash.com/photo-1449156733864-dd5471bb7427?auto=format&fit=crop&w=800"],
      amenities: ["Fireplace", "Mountain View", "Kitchen", "Pet Friendly"],
      specifics: { property_type: "Villa / Apartment", units: 1, check_in: "12:00", check_out: "10:00" },
      vendor_id: vendorId,
      is_active: true,
      created_at: serverTimestamp()
    },

    // ADVENTURE
    {
      title: "Rohtang Pass Snow Trek",
      description: "A guided trek to the mesmerizing Rohtang Pass. Perfect for thrill-seekers looking for pristine snow views.",
      category: "Adventure",
      base_price: 45,
      price_unit: "per_person",
      location: "Solang Valley base",
      images: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800"],
      amenities: ["Guide", "Safety Gear", "Emergency Kit"],
      specifics: { difficulty: "Advanced", duration: "6 Hours", min_age: 15, gear: "Ice Axe, Boots" },
      vendor_id: vendorId,
      is_active: true,
      created_at: serverTimestamp()
    },
    {
      title: "Paragliding over Solang Valley",
      description: "Fly like a bird and witness the majestic Himalayas from above. Tandem flight with certified pilots.",
      category: "Adventure",
      base_price: 60,
      price_unit: "per_person",
      location: "Solang Valley",
      images: ["https://images.unsplash.com/photo-1533727937480-da3a97967e95?auto=format&fit=crop&w=800"],
      amenities: ["Pilot", "HD Video Recording", "Transport to Launch Site"],
      specifics: { difficulty: "Moderate", duration: "1 Hour", min_age: 12, gear: "Paraglide, Helmet" },
      vendor_id: vendorId,
      is_active: true,
      created_at: serverTimestamp()
    },

    // TRANSPORT
    {
      title: "Royal Enfield Himalayan Rental",
      description: "The ultimate bike for the ultimate terrain. Fully serviced and ready for the Leh-Manali highway.",
      category: "Transport",
      base_price: 25,
      price_unit: "per_day",
      location: "Manali Mall Road",
      images: ["https://images.unsplash.com/photo-1558981403-c5f91cbba527?auto=format&fit=crop&w=800"],
      amenities: ["Helmet", "Carrier Rack", "Tool Kit"],
      specifics: { vehicle_type: "Royal Enfield 411cc", fuel_policy: "Full to Full", transmission: "Manual", license_needed: "Class A" },
      vendor_id: vendorId,
      is_active: true,
      created_at: serverTimestamp()
    },
    {
      title: "Private 4x4 Jeep Safari",
      description: "Explore the rugged Spiti valley in a comfortable, powerful SUV with an experienced driver.",
      category: "Transport",
      base_price: 150,
      price_unit: "fixed",
      location: "Pickup from Manali",
      images: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800"],
      amenities: ["Driver", "Music System", "Comfortable Seats"],
      specifics: { vehicle_type: "Mahindra Thar 4x4", fuel_policy: "Included", transmission: "Manual", license_needed: "N/A (Driver provided)" },
      vendor_id: vendorId,
      is_active: true,
      created_at: serverTimestamp()
    },

    // TOURS
    {
      title: "Spiti Valley Cultural Roadtrip",
      description: "A 7-day deep dive into the 'Middle Land'. Visit ancient monasteries, high-altitude villages, and hidden lakes.",
      category: "Tours",
      base_price: 800,
      price_unit: "per_person",
      location: "Starts from Manali",
      images: ["https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800"],
      amenities: ["Accommodation", "All Meals", "Local Legend Guide"],
      specifics: { languages: "English, Hindi, Tibetan", group_size: 8, meeting_point: "Old Manali Gate", inclusions: "Inner Line Permits, Fuel" },
      vendor_id: vendorId,
      is_active: true,
      created_at: serverTimestamp()
    },
    {
      title: "Hidden Waterfalls & Picnic Tour",
      description: "Forget the crowds. We take you to a secret waterfall where you can enjoy a fresh mountain meal.",
      category: "Tours",
      base_price: 30,
      price_unit: "per_person",
      location: "Vashisht Hills",
      images: ["https://images.unsplash.com/photo-1433086566608-bc752495d4ed?auto=format&fit=crop&w=800"],
      amenities: ["Lunch", "Photography", "Walking Stick"],
      specifics: { languages: "English, Hindi", group_size: 12, meeting_point: "Vashisht Temple", inclusions: "Home-cooked lunch, Tea" },
      vendor_id: vendorId,
      is_active: true,
      created_at: serverTimestamp()
    },

    // FOOD
    {
      title: "Traditional Pahari Thali Experience",
      description: "Dine like a local in a 100-year-old traditional wooden house. Authentic flavors of the mountains.",
      category: "Food",
      base_price: 15,
      price_unit: "per_person",
      location: "Naggar Village",
      images: ["https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800"],
      amenities: ["Organic", "Traditional Seating", "Live Music"],
      specifics: { cuisine: "Traditional Pahari", dietary: "Veg / Non-Veg", speciality: "Siddu with ghee", capacity: 20 },
      vendor_id: vendorId,
      is_active: true,
      created_at: serverTimestamp()
    },
    {
      title: "Mountain Orchard Cafe & Bakery",
      description: "Freshly brewed coffee and hand-made apple pies right in the middle of an apple orchard.",
      category: "Food",
      base_price: 10,
      price_unit: "per_person",
      location: "Goshal Village",
      images: ["https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800"],
      amenities: ["Outdoor Seating", "WiFi", "Pet Friendly"],
      specifics: { cuisine: "Artisanal Bakery & Coffee", dietary: "Vegan Options", speciality: "Himalayan Apple Pie", capacity: 15 },
      vendor_id: vendorId,
      is_active: true,
      created_at: serverTimestamp()
    }
  ];

  for (const listing of demoListings) {
    await addDoc(collection(db, 'listings'), listing);
  }
}
