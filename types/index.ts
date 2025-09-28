export type Role = 'Landlord' | 'Marketer' | 'Broker';

export type FurnitureLevel = 'cơ bản' | 'đầy đủ' | 'không';

export type PropertyType = 'phòng trọ' | 'nhà nguyên căn' | 'văn phòng';

export interface Listing {
  id: string;
  userId: string;
  propertyType: PropertyType;
  title: string;
  images: string[];
  address: string;
  mapLocation: { lat: number; lng: number };
  area: number;
  bedrooms: number;
  bathrooms: number;
  furniture: FurnitureLevel;
  price: number;
  deposit: number;
  status: 'active' | 'rented';
}

export interface UserProfile {
  id: string;
  email: string;
  phone: string | null;
  role: Role;
  verified: boolean;
  profile: {
    name?: string;
    avatar?: string;
  } | null;
}
