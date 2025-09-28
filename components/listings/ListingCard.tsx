import Image from 'next/image';
import { Listing } from '@/types';

const ListingCard = ({ listing }: { listing: Listing }) => {
  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-56 w-full">
        <Image
          src={listing.images[0] ?? 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80'}
          alt={listing.title}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-slate-700">
          {listing.propertyType}
        </span>
      </div>
      <div className="space-y-3 p-5">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{listing.title}</h3>
          <p className="text-sm text-slate-500">{listing.address}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
          <span>{listing.area} m²</span>
          <span>{listing.bedrooms} PN</span>
          <span>{listing.bathrooms} WC</span>
          <span>Nội thất: {listing.furniture}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-secondary">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              maximumFractionDigits: 0
            }).format(listing.price)}
          </p>
          <p className="text-xs text-slate-500">
            Đặt cọc:{' '}
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              maximumFractionDigits: 0
            }).format(listing.deposit)}
          </p>
        </div>
      </div>
    </article>
  );
};

export default ListingCard;
