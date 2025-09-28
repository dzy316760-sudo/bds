'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getFirebaseAuth } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  sendEmailVerification
} from 'firebase/auth';

const authSchema = z
  .object({
    mode: z.enum(['email', 'phone']),
    email: z.string().email('Email không hợp lệ').optional(),
    password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự').optional(),
    phone: z
      .string()
      .regex(/^(\+?84|0)(\d{9,10})$/, 'Số điện thoại phải bao gồm mã quốc gia (+84) hoặc số 0 đầu.')
      .optional(),
    role: z.enum(['Landlord', 'Marketer', 'Broker'])
  })
  .superRefine((values, ctx) => {
    if (values.mode === 'email') {
      if (!values.email) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['email'],
          message: 'Vui lòng nhập email của bạn.'
        });
      }

      if (!values.password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['password'],
          message: 'Vui lòng tạo mật khẩu.'
        });
      }
    }

    if (values.mode === 'phone' && !values.phone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['phone'],
        message: 'Vui lòng nhập số điện thoại hợp lệ.'
      });
    }
  });

type AuthValues = z.infer<typeof authSchema>;

const AuthForm = () => {
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<AuthValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      mode: 'email',
      role: 'Landlord'
    }
  });

  const mode = watch('mode');

  const onSubmit = async (values: AuthValues) => {
    setMessage('');
    setIsLoading(true);

    try {
      const auth = getFirebaseAuth();
      if (values.mode === 'email' && values.email && values.password) {
        const result = await createUserWithEmailAndPassword(auth, values.email, values.password);
        if (result.user) {
          await sendEmailVerification(result.user);
          setMessage('Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản.');
        }
      }

      if (values.mode === 'phone' && values.phone) {
        if (typeof window === 'undefined') {
          throw new Error('reCAPTCHA chỉ khả dụng trên trình duyệt.');
        }

        if (!window.recaptchaVerifier) {
          window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible'
          });
        }

        const confirmation = await signInWithPhoneNumber(auth, values.phone, window.recaptchaVerifier);
        setMessage('Mã OTP đã được gửi. Vui lòng nhập mã trong ứng dụng Firebase của bạn.');
        console.log('OTP confirmation result', confirmation);
      }
    } catch (error) {
      console.error(error);
      setMessage('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md">
      <h3 className="text-lg font-semibold text-slate-900">Đăng ký tài khoản</h3>
      <p className="mt-1 text-sm text-slate-600">Chọn phương thức đăng ký phù hợp và xác minh tài khoản.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="radio" value="email" {...register('mode')} defaultChecked />
            Email
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" value="phone" {...register('mode')} />
            Số điện thoại
          </label>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Vai trò</label>
          <select
            {...register('role')}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="Landlord">Chủ nhà</option>
            <option value="Marketer">Marketer</option>
            <option value="Broker">Môi giới</option>
          </select>
        </div>

        {mode === 'email' ? (
          <>
            <div>
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                {...register('email')}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Mật khẩu</label>
              <input
                type="password"
                {...register('password')}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>
          </>
        ) : (
          <div>
            <label className="text-sm font-medium text-slate-700">Số điện thoại (kèm +84)</label>
            <input
              type="tel"
              {...register('phone')}
              placeholder="+84901234567"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
            <div id="recaptcha-container" />
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Đang xử lý...' : 'Đăng ký ngay'}
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-secondary">{message}</p>}
      <p className="mt-3 text-xs text-slate-400">
        *Để kích hoạt đăng ký qua điện thoại, bạn cần cấu hình Firebase Authentication với Phone Sign-in.
      </p>
    </div>
  );
};

export default AuthForm;
