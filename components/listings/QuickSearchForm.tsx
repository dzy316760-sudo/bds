'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const parseOptionalNumber = (value: unknown) => {
  if (value === '' || value === null || typeof value === 'undefined') {
    return undefined;
  }

  if (typeof value === 'number') {
    return Number.isNaN(value) ? undefined : value;
  }

  const normalized = String(value)
    .trim()
    .replace(/\s+/g, '')
    .replace(/\./g, '')
    .replace(/,/g, '.');
  const numeric = Number(normalized);
  return Number.isNaN(numeric) ? undefined : numeric;
};

const optionalCurrencyField = z
  .preprocess(parseOptionalNumber, z.number().min(0, 'Giá trị không hợp lệ'))
  .optional();

const searchSchema = z
  .object({
    keyword: z.string().min(2, 'Từ khóa quá ngắn').optional().or(z.literal('')),
    propertyType: z.enum(['phòng trọ', 'nhà nguyên căn', 'văn phòng']).optional(),
    minPrice: optionalCurrencyField,
    maxPrice: optionalCurrencyField,
    area: z
      .preprocess(parseOptionalNumber, z.number().min(0, 'Diện tích không hợp lệ'))
      .optional()
  })
  .superRefine((values, ctx) => {
    if (
      typeof values.minPrice === 'number' &&
      typeof values.maxPrice === 'number' &&
      values.minPrice > values.maxPrice
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['maxPrice'],
        message: 'Giá cao nhất phải lớn hơn hoặc bằng giá thấp nhất'
      });
    }
  });

export type QuickSearchValues = z.infer<typeof searchSchema>;

const QuickSearchForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<QuickSearchValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      keyword: '',
      propertyType: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      area: undefined
    }
  });

  const onSubmit = (values: QuickSearchValues) => {
    console.log('Search values', values);
    alert('Chức năng tìm kiếm sẽ sớm ra mắt!');
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl shadow-primary/10 md:p-8">
      <h2 className="text-xl font-semibold text-slate-900">Tìm kiếm nhanh</h2>
      <p className="mt-2 text-sm text-slate-500">
        Lọc nhanh theo nhu cầu để tìm được bất động sản phù hợp nhất.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
        <div>
          <label className="text-sm font-medium text-slate-700">Từ khóa</label>
          <input
            {...register('keyword')}
            placeholder="VD: căn hộ 2 phòng ngủ quận 7"
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {errors.keyword && <p className="mt-1 text-xs text-red-500">{errors.keyword.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Loại bất động sản</label>
          <select
            {...register('propertyType')}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Tất cả</option>
            <option value="phòng trọ">Phòng trọ</option>
            <option value="nhà nguyên căn">Nhà nguyên căn</option>
            <option value="văn phòng">Văn phòng</option>
          </select>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">Giá thấp nhất (₫)</label>
            <input
              type="number"
              step="100000"
              {...register('minPrice', { valueAsNumber: true })}
              placeholder="0"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {errors.minPrice && <p className="mt-1 text-xs text-red-500">{errors.minPrice.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Giá cao nhất (₫)</label>
            <input
              type="number"
              step="100000"
              {...register('maxPrice', { valueAsNumber: true })}
              placeholder="50.000.000"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {errors.maxPrice && <p className="mt-1 text-xs text-red-500">{errors.maxPrice.message}</p>}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Diện tích tối thiểu (m²)</label>
          <input
            type="number"
            step="1"
            {...register('area', { valueAsNumber: true })}
            placeholder="20"
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {errors.area && <p className="mt-1 text-xs text-red-500">{errors.area.message}</p>}
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-secondary/90"
        >
          Tìm kiếm ngay
        </button>
      </form>
    </div>
  );
};

export default QuickSearchForm;
