import Link from 'next/link';
import { AuthShell } from '@/components/auth-shell';
import { AuthForm } from '@/features/auth/auth-form';

export default function RegisterPage() { return <AuthShell title="Đăng ký tài khoản" description="Dùng bất kỳ email nào để tạo tài khoản, mua sắm mĩ phẩm và tích điểm thành viên." footer={<>Đã có tài khoản? <Link className="font-bold text-brand-600" href="/auth/login">Đăng nhập</Link></>}><AuthForm mode="register" /></AuthShell>; }

