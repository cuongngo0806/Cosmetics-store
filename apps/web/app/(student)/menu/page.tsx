import { Suspense } from 'react';
import { StudentHeader } from '@/components/student-header';
import { MenuClient } from '@/features/menu/menu-client';

export default function MenuPage() { return <><StudentHeader /><main><Suspense fallback={<div className="container-shell py-20">Đang tải sản phẩm…</div>}><MenuClient /></Suspense></main></>; }

