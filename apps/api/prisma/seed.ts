import {
  AttendanceStatus, DiningType, DiscountType, EmployeeStatus, InventoryTransactionType,
  KitchenTaskStatus, LoyaltyTransactionType, NotificationType, OrderStatus, PaymentMethod,
  PaymentStatus, PickupType, PrismaClient, Role, ShiftStatus, StockReceiptStatus,
  StudentDirectoryStatus, StudentVoucherStatus, UserStatus, WalletRequestStatus,
  WalletRequestType, WalletTransactionType,
} from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();
const password = process.env.SEED_DEMO_PASSWORD ?? 'Glow@12345';
const referenceNow = new Date('2026-09-28T05:00:00.000Z');

type ProductSeed = { name: string; slug: string; category: string; price: number; prep: number; calories: number; vegetarian?: boolean; description: string };

const categorySeeds = [
  ['Chăm sóc da', 'cham-soc-da', '🧴'], ['Trang điểm', 'trang-diem', '💄'], ['Chăm sóc tóc', 'cham-soc-toc', '💆'],
  ['Chăm sóc cơ thể', 'cham-soc-co-the', '🛁'], ['Nước hoa', 'nuoc-hoa', '🌸'], ['Thuần chay', 'thuan-chay', '🌿'],
] as const;

const productSeeds: ProductSeed[] = [
  { name: 'Sữa rửa mặt dịu nhẹ', slug: 'sua-rua-mat-diu-nhe', category: 'Chăm sóc da', price: 189000, prep: 5, calories: 0, vegetarian: true, description: 'Gel rửa mặt pH 5.5 làm sạch nhẹ nhàng, không gây khô căng, phù hợp da nhạy cảm.' },
  { name: 'Toner hoa hồng cân bằng', slug: 'toner-hoa-hong', category: 'Chăm sóc da', price: 245000, prep: 5, calories: 0, vegetarian: true, description: 'Nước cân bằng chiết xuất hoa hồng Damask giúp cấp ẩm và làm dịu da sau khi rửa mặt.' },
  { name: 'Serum Vitamin C sáng da', slug: 'serum-vitamin-c', category: 'Chăm sóc da', price: 459000, prep: 6, calories: 0, description: 'Serum 15% Vitamin C kết hợp Vitamin E và Ferulic Acid giúp da đều màu, rạng rỡ.' },
  { name: 'Kem dưỡng ẩm Hyaluronic', slug: 'kem-duong-am-hyaluronic', category: 'Chăm sóc da', price: 389000, prep: 6, calories: 0, description: 'Kem dưỡng kết cấu mỏng nhẹ với 3 loại Hyaluronic Acid, khóa ẩm suốt 24 giờ.' },
  { name: 'Kem chống nắng SPF50+ PA++++', slug: 'kem-chong-nang-spf50', category: 'Chăm sóc da', price: 329000, prep: 5, calories: 0, description: 'Chống nắng phổ rộng, nâng tông nhẹ, không để lại vệt trắng và không gây bết dính.' },
  { name: 'Mặt nạ đất sét làm sạch', slug: 'mat-na-dat-set', category: 'Chăm sóc da', price: 279000, prep: 6, calories: 0, vegetarian: true, description: 'Mặt nạ đất sét Kaolin hút dầu thừa, làm sạch sâu lỗ chân lông chỉ trong 10 phút.' },
  { name: 'Son kem lì Rose Velvet', slug: 'son-kem-li-rose-velvet', category: 'Trang điểm', price: 219000, prep: 4, calories: 0, description: 'Son kem lì mịn như nhung, lên màu chuẩn chỉ sau một lần lướt và bền màu đến 8 giờ.' },
  { name: 'Son dưỡng có màu Peach', slug: 'son-duong-co-mau-peach', category: 'Trang điểm', price: 149000, prep: 4, calories: 0, vegetarian: true, description: 'Son dưỡng chứa bơ hạt mỡ và dầu jojoba, cho đôi môi mềm mượt với sắc hồng đào tự nhiên.' },
  { name: 'Phấn nước Cushion tự nhiên', slug: 'phan-nuoc-cushion', category: 'Trang điểm', price: 399000, prep: 5, calories: 0, description: 'Cushion che phủ vừa, lớp nền căng bóng tự nhiên, kèm lõi thay thế tiện lợi.' },
  { name: 'Mascara cong mi chống nước', slug: 'mascara-cong-mi', category: 'Trang điểm', price: 199000, prep: 4, calories: 0, description: 'Đầu chải cong giúp mi dài, cong vút và không lem trôi suốt cả ngày.' },
  { name: 'Bảng phấn mắt 9 màu Sunset', slug: 'bang-phan-mat-sunset', category: 'Trang điểm', price: 289000, prep: 5, calories: 0, description: 'Chín tông màu cam đất và nhũ ánh kim, dễ phối cho cả trang điểm hằng ngày lẫn dự tiệc.' },
  { name: 'Dầu gội thảo dược bưởi', slug: 'dau-goi-thao-duoc-buoi', category: 'Chăm sóc tóc', price: 179000, prep: 5, calories: 0, vegetarian: true, description: 'Tinh dầu vỏ bưởi và bồ kết giúp giảm gãy rụng, nuôi dưỡng chân tóc chắc khỏe.' },
  { name: 'Dầu xả phục hồi Argan', slug: 'dau-xa-phuc-hoi-argan', category: 'Chăm sóc tóc', price: 189000, prep: 5, calories: 0, description: 'Dầu xả giàu dầu Argan phục hồi tóc hư tổn, giúp tóc suôn mượt và dễ chải.' },
  { name: 'Serum dưỡng tóc Argan', slug: 'serum-duong-toc-argan', category: 'Chăm sóc tóc', price: 259000, prep: 5, calories: 0, description: 'Tinh chất dưỡng tóc không cần xả, chống xơ rối và bảo vệ tóc khỏi nhiệt.' },
  { name: 'Sữa tắm hương hoa nhài', slug: 'sua-tam-hoa-nhai', category: 'Chăm sóc cơ thể', price: 169000, prep: 5, calories: 0, description: 'Sữa tắm dịu nhẹ với hương hoa nhài thanh khiết, giữ ẩm cho làn da mềm mại.' },
  { name: 'Dưỡng thể Shea Butter', slug: 'duong-the-shea-butter', category: 'Chăm sóc cơ thể', price: 229000, prep: 5, calories: 0, vegetarian: true, description: 'Kem dưỡng thể đậm đặc từ bơ hạt mỡ, nuôi dưỡng làn da khô ráp trở nên mịn màng.' },
  { name: 'Tẩy tế bào chết cà phê', slug: 'tay-te-bao-chet-ca-phe', category: 'Chăm sóc cơ thể', price: 199000, prep: 5, calories: 0, vegetarian: true, description: 'Hạt cà phê Đắk Lắk xay mịn kết hợp dầu dừa giúp loại bỏ tế bào chết, da sáng mịn.' },
  { name: 'Nước hoa Bloom Eau de Parfum', slug: 'nuoc-hoa-bloom-edp', category: 'Nước hoa', price: 890000, prep: 7, calories: 0, description: 'Hương hoa mẫu đơn, hồng và xạ hương trắng nữ tính, lưu hương 6–8 giờ.' },
  { name: 'Xịt thơm toàn thân Vanilla', slug: 'xit-thom-vanilla', category: 'Nước hoa', price: 249000, prep: 4, calories: 0, description: 'Body mist hương vani ngọt ngào, mát lạnh, dùng hằng ngày hoặc mang theo tiện lợi.' },
  { name: 'Dầu tẩy trang thuần chay', slug: 'dau-tay-trang-thuan-chay', category: 'Thuần chay', price: 299000, prep: 5, calories: 0, vegetarian: true, description: 'Dầu tẩy trang 100% thực vật, nhũ hóa nhanh, làm sạch lớp trang điểm chống nước.' },
];

const menuImageUrls = productSeeds.map(seed => `/images/products/${seed.slug}.svg`);

const ingredientSeeds = [
  ...productSeeds.map((seed, index) => [`${seed.name} (hàng nguyên hộp)`, 'hộp', 60 + index % 5 * 20, 10, Math.round(seed.price * 0.55 / 1000) * 1000] as const),
  ['Hộp quà GlowBeauty', 'hộp', 300, 40, 12000], ['Túi giấy thương hiệu', 'cái', 800, 100, 3500],
  ['Băng keo niêm phong', 'cuộn', 120, 20, 15000], ['Thiệp cảm ơn', 'tấm', 1000, 150, 1500],
] as const;

const familyNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Phan', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Dương', 'Mai'];
const middleNames = ['Thị Minh', 'Ngọc', 'Thu', 'Quỳnh', 'Thanh', 'Hải', 'Phương', 'Khánh', 'Mai', 'Hoài', 'Bảo', 'Gia'];
const givenNames = ['Anh', 'An', 'Chi', 'Dương', 'Giang', 'Hà', 'Hương', 'Lan', 'Linh', 'Mai', 'My', 'Ngân', 'Phương', 'Quỳnh', 'Thảo', 'Trang', 'Uyên', 'Yến', 'Nam', 'Minh'];
const memberTiers = ['Thành viên Bạc', 'Thành viên Vàng', 'Thành viên Kim cương', 'Thành viên mới'] as const;
const skinTypes = ['Da dầu', 'Da khô', 'Da hỗn hợp', 'Da nhạy cảm', 'Da thường'] as const;
const regions = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Huế'] as const;
const emailSlug = (value: string) => value.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, '');

function daysBefore(days: number, hour = 4, minute = 0) {
  const date = new Date(referenceNow);
  date.setUTCDate(date.getUTCDate() - days);
  date.setUTCHours(hour, minute, 0, 0);
  return date;
}

async function resetDatabase() {
  const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'
  `;
  if (!tables.length) return;
  const names = tables.map(({ tablename }) => `"${tablename.replaceAll('"', '""')}"`).join(', ');
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${names} RESTART IDENTITY CASCADE`);
}

async function seedIdentity(passwordHash: string) {
  const adminUser = await prisma.user.create({ data: { email: 'admin@glowbeauty.vn', passwordHash, role: Role.ADMIN, status: UserStatus.ACTIVE } });
  const admin = await prisma.employeeProfile.create({ data: { userId: adminUser.id, employeeCode: 'GB-ADM-001', fullName: 'Nguyễn Thu Hà', phone: '0904100001', workRole: Role.ADMIN, status: EmployeeStatus.ACTIVE, hireDate: new Date('2023-08-01') } });
  const employees = [];
  const staff = [
    { email: 'thungan01@glowbeauty.vn', code: 'GB-TN-001', name: 'Trần Minh Anh', phone: '0904200001', role: Role.CASHIER },
    { email: 'thungan02@glowbeauty.vn', code: 'GB-TN-002', name: 'Lê Thu Trang', phone: '0904200002', role: Role.CASHIER },
    { email: 'kho01@glowbeauty.vn', code: 'GB-KHO-001', name: 'Phạm Văn Hùng', phone: '0904300001', role: Role.KITCHEN_STAFF },
    { email: 'kho02@glowbeauty.vn', code: 'GB-KHO-002', name: 'Đỗ Ngọc Mai', phone: '0904300002', role: Role.KITCHEN_STAFF },
  ];
  for (const [index, member] of staff.entries()) {
    const user = await prisma.user.create({ data: { email: member.email, passwordHash, role: member.role, status: UserStatus.ACTIVE } });
    employees.push(await prisma.employeeProfile.create({ data: { userId: user.id, employeeCode: member.code, fullName: member.name, phone: member.phone, workRole: member.role, status: EmployeeStatus.ACTIVE, hireDate: new Date(Date.UTC(2024 + index % 2, index * 2, 3)) } }));
  }
  const studentProfiles = [];
  for (let index = 0; index < 100; index++) {
    const year = 2023 + index % 4;
    const studentCode = `KH${String(index + 1).padStart(5, '0')}`;
    const fullName = `${familyNames[index % familyNames.length]} ${middleNames[index * 3 % middleNames.length]} ${givenNames[index * 7 % givenNames.length]}`;
    const email = `${emailSlug(fullName)}${String(index + 1).padStart(3, '0')}@example.com`;
    const directory = await prisma.studentDirectory.create({ data: { studentCode, schoolEmail: email, fullName, faculty: memberTiers[index % memberTiers.length], major: skinTypes[index % skinTypes.length], className: regions[index % regions.length], academicYear: String(year), status: StudentDirectoryStatus.ACTIVE } });
    if (index >= 50) continue;
    const user = await prisma.user.create({ data: { email: directory.schoolEmail, passwordHash, role: Role.STUDENT, status: UserStatus.ACTIVE, avatarUrl: '/images/default-student-avatar.svg' } });
    const startingBalance = 300000 + index % 6 * 200000;
    const startingPoints = 40 + index % 9 * 35;
    studentProfiles.push(await prisma.studentProfile.create({
      data: { userId: user.id, studentDirectoryId: directory.id,
        wallet: { create: { balance: startingBalance, bankName: index % 3 === 0 ? 'Vietcombank' : null, bankAccountNumber: index % 3 === 0 ? `001100${100000 + index}` : null, bankAccountName: index % 3 === 0 ? fullName.toUpperCase() : null, bankLinkedAt: index % 3 === 0 ? daysBefore(120 - index) : null } },
        loyaltyAccount: { create: { points: startingPoints } }, cart: { create: {} } },
      include: { user: true, wallet: true, loyaltyAccount: true },
    }));
  }
  return { adminUser, admin, employees, studentProfiles };
}

async function seedCatalog() {
  const categoryByName = new Map<string, string>();
  for (const [index, [name, slug, icon]] of categorySeeds.entries()) {
    const category = await prisma.category.create({ data: { name, slug, icon, sortOrder: index + 1 } });
    categoryByName.set(name, category.id);
  }
  const products = [];
  for (const [index, seed] of productSeeds.entries()) {
    products.push(await prisma.product.create({ data: { categoryId: categoryByName.get(seed.category)!, name: seed.name, slug: seed.slug, description: seed.description, basePrice: seed.price, preparationTimeMinutes: seed.prep, calories: seed.calories, isVegetarian: seed.vegetarian ?? false, imageUrl: menuImageUrls[index], isAvailable: true } }));
  }
  for (const product of products.filter(item => ['toner-hoa-hong', 'serum-vitamin-c', 'kem-duong-am-hyaluronic', 'sua-tam-hoa-nhai', 'nuoc-hoa-bloom-edp'].includes(item.slug))) {
    await prisma.productVariant.createMany({ data: [
      { productId: product.id, name: 'Tiêu chuẩn', sku: `${product.slug.toUpperCase()}-STD`, priceAdjustment: 0 },
      { productId: product.id, name: 'Dung tích lớn', sku: `${product.slug.toUpperCase()}-XL`, priceAdjustment: Math.round(product.basePrice * 0.6 / 1000) * 1000 },
    ] });
  }
  const shade = await prisma.productOptionGroup.create({ data: { name: 'Tông màu', slug: 'tong-mau', minSelect: 1, maxSelect: 1, isRequired: true } });
  const giftWrap = await prisma.productOptionGroup.create({ data: { name: 'Gói quà', slug: 'goi-qua', minSelect: 1, maxSelect: 1, isRequired: true } });
  await prisma.productOptionValue.createMany({ data: [
    ...['Hồng nude', 'Đỏ cherry', 'Cam đất', 'Hồng đào', 'Đỏ gạch'].map((name, sortOrder) => ({ optionGroupId: shade.id, name, sortOrder })),
    ...[['Không gói quà', 0], ['Gói quà cơ bản', 10000], ['Hộp quà cao cấp', 30000]].map(([name, priceAdjustment], sortOrder) => ({ optionGroupId: giftWrap.id, name: name as string, priceAdjustment: priceAdjustment as number, sortOrder })),
  ] });
  const shaded = products.filter(item => ['son-kem-li-rose-velvet', 'son-duong-co-mau-peach', 'phan-nuoc-cushion'].includes(item.slug));
  const giftable = products.filter(item => ['Trang điểm', 'Nước hoa'].includes(productSeeds.find(seed => seed.slug === item.slug)?.category ?? ''));
  await prisma.productOptionGroupLink.createMany({ data: [
    ...shaded.map(product => ({ productId: product.id, optionGroupId: shade.id, sortOrder: 0 })),
    ...giftable.map(product => ({ productId: product.id, optionGroupId: giftWrap.id, sortOrder: 1 })),
  ] });
  const comboSeeds = [
    ['Combo làm sạch cơ bản', 'combo-lam-sach-co-ban', [0, 1]], ['Combo sáng da chống nắng', 'combo-sang-da-chong-nang', [2, 4]],
    ['Combo dưỡng ẩm chuyên sâu', 'combo-duong-am-chuyen-sau', [1, 3]], ['Combo môi xinh', 'combo-moi-xinh', [6, 7]],
    ['Combo tóc suôn mượt', 'combo-toc-suon-muot', [11, 12, 13]],
  ] as const;
  for (const [name, slug, indexes] of comboSeeds) {
    const originalPrice = indexes.reduce((sum, index) => sum + products[index].basePrice, 0);
    await prisma.combo.create({ data: { name, slug, description: 'Bộ sản phẩm kết hợp tiết kiệm dành cho thành viên GlowBeauty.', imageUrl: products[indexes[0]].imageUrl, originalPrice, calculatedPrice: Math.round(originalPrice * 0.88 / 1000) * 1000, discountPercentage: 12, items: { create: indexes.map(index => ({ productId: products[index].id })) } } });
  }
  return products;
}

async function seedInventory(products: Awaited<ReturnType<typeof seedCatalog>>, adminEmployeeId: string) {
  const ingredients = [];
  for (const [name, unit, quantity, threshold, cost] of ingredientSeeds) {
    ingredients.push(await prisma.ingredient.create({ data: { name, unit, currentQuantity: quantity, lowStockThreshold: threshold, reorderThreshold: threshold * 2, costPerUnit: cost } }));
  }
  for (const [index, product] of products.entries()) {
    const recipe = await prisma.recipe.create({ data: { productId: product.id, name: `Định mức ${product.name}` } });
    await prisma.recipeIngredient.create({ data: { recipeId: recipe.id, ingredientId: ingredients[index].id, quantity: 1 } });
  }
  const suppliers = [];
  for (const supplier of [
    ['Mỹ phẩm Hoa Sen Việt', 'Nguyễn Văn Hòa', '02437650001', 'Cầu Giấy, Hà Nội'],
    ['Thảo dược Thiên Nhiên Xanh', 'Bùi Thị Sen', '02437650002', 'Lương Sơn, Hòa Bình'],
    ['Phân phối Beauty An Việt', 'Trần Quốc Minh', '02437650003', 'Quận 3, TP. Hồ Chí Minh'],
    ['Bao bì Glow Pack', 'Lê Thanh Hải', '02437650004', 'Long Biên, Hà Nội'],
  ]) {
    suppliers.push(await prisma.supplier.create({ data: { name: supplier[0], contactName: supplier[1], phone: supplier[2], email: `ncc${suppliers.length + 1}@glowbeauty.local`, address: supplier[3] } }));
  }
  for (let receiptIndex = 0; receiptIndex < 3; receiptIndex++) {
    const selected = ingredients.slice(receiptIndex * 8, receiptIndex * 8 + 8);
    const totalCost = selected.reduce((sum, item) => sum + item.costPerUnit * 20, 0);
    const receipt = await prisma.stockReceipt.create({ data: { receiptCode: `PN-202609-${String(receiptIndex + 1).padStart(3, '0')}`, supplierId: suppliers[receiptIndex].id, employeeId: adminEmployeeId, receivedAt: daysBefore(24 - receiptIndex * 8, 1), confirmedAt: daysBefore(24 - receiptIndex * 8, 2), totalCost, status: StockReceiptStatus.CONFIRMED } });
    for (const ingredient of selected) {
      await prisma.stockReceiptItem.create({ data: { stockReceiptId: receipt.id, ingredientId: ingredient.id, quantity: 20, unitCost: ingredient.costPerUnit, lineTotal: ingredient.costPerUnit * 20 } });
      await prisma.inventoryTransaction.create({ data: { ingredientId: ingredient.id, type: InventoryTransactionType.STOCK_IN, quantity: 20, quantityBefore: Number(ingredient.currentQuantity) - 20, quantityAfter: ingredient.currentQuantity, reservedBefore: 0, reservedAfter: 0, referenceType: 'STOCK_RECEIPT', referenceId: receipt.id, note: 'Nhập kho dữ liệu mẫu', createdAt: receipt.receivedAt } });
    }
  }
}

async function seedPromotions() {
  const startAt = new Date('2026-01-01T00:00:00.000Z');
  const expireAt = new Date('2027-12-31T23:59:59.000Z');
  const coupons = [];
  for (const seed of [
    ['CHAOBANMOI', 'Chào thành viên mới', DiscountType.PERCENTAGE, 15, 200000, 50000, false],
    ['GLOW10', 'Rạng rỡ mỗi ngày', DiscountType.PERCENTAGE, 10, 300000, 60000, false],
    ['COMBO30K', 'Combo tiết kiệm', DiscountType.FIXED_AMOUNT, 30000, 400000, null, true],
    ['THUHAI20K', 'Thứ Hai làm đẹp', DiscountType.FIXED_AMOUNT, 20000, 250000, null, false],
    ['SONXINH', 'Ưu đãi son môi', DiscountType.FIXED_AMOUNT, 25000, 200000, 25000, false],
  ] as const) {
    coupons.push(await prisma.coupon.create({ data: { code: seed[0], name: seed[1], description: `${seed[1]} tại GlowBeauty`, type: seed[2], discountValue: seed[3], minimumOrderValue: seed[4], maximumDiscount: seed[5], requiresCombo: seed[6], usageLimit: 500, perStudentLimit: 5, startAt, expireAt } }));
  }
  const vouchers = [];
  for (const seed of [
    ['GLOW20K', 'Voucher 20.000đ', 50, 20000, 150000], ['GLOW50K', 'Voucher 50.000đ', 100, 50000, 300000],
    ['GLOW100K', 'Voucher 100.000đ', 180, 100000, 600000], ['GLOW150K', 'Voucher 150.000đ', 250, 150000, 900000],
  ] as const) {
    vouchers.push(await prisma.voucher.create({ data: { code: seed[0], name: seed[1], description: `Đổi ${seed[2]} điểm để nhận ${seed[1]}`, discountType: DiscountType.FIXED_AMOUNT, discountValue: seed[3], requiredPoints: seed[2], totalQuantity: 300, remainingQuantity: 250, minimumOrderValue: seed[4], startAt, expireAt, perStudentLimit: 3 } }));
  }
  return { coupons, vouchers };
}

async function seedStudentBenefits(profiles: Awaited<ReturnType<typeof seedIdentity>>['studentProfiles'], products: Awaited<ReturnType<typeof seedCatalog>>, vouchers: Awaited<ReturnType<typeof seedPromotions>>['vouchers']) {
  for (const [index, profile] of profiles.entries()) {
    await prisma.walletTransaction.create({ data: { walletId: profile.wallet!.id, type: WalletTransactionType.TOP_UP, amount: profile.wallet!.balance, balanceBefore: 0, balanceAfter: profile.wallet!.balance, description: 'Nạp số dư đầu kỳ', reference: `GB-TOPUP-${String(index + 1).padStart(3, '0')}`, createdAt: daysBefore(150 - index) } });
    await prisma.loyaltyTransaction.create({ data: { loyaltyAccountId: profile.loyaltyAccount!.id, type: LoyaltyTransactionType.EARN, points: profile.loyaltyAccount!.points, balanceBefore: 0, balanceAfter: profile.loyaltyAccount!.points, description: 'Điểm tích lũy đầu kỳ', reference: `GB-POINT-${String(index + 1).padStart(3, '0')}`, createdAt: daysBefore(145 - index) } });
    await prisma.favorite.createMany({ data: [0, 1, 2].map(offset => ({ studentProfileId: profile.id, productId: products[(index * 3 + offset * 5) % products.length].id })) });
    if (index % 2 === 0) {
      await prisma.studentVoucher.create({ data: { studentProfileId: profile.id, voucherId: vouchers[index % vouchers.length].id, serialCode: `GB-SV-${String(index + 1).padStart(4, '0')}`, status: index % 6 === 0 ? StudentVoucherStatus.USED : StudentVoucherStatus.ACTIVE, redeemedAt: daysBefore(60 - index % 30), usedAt: index % 6 === 0 ? daysBefore(20 - index % 10) : null } });
    }
    if (index < 8) {
      await prisma.walletRequest.create({ data: { requestCode: `YC-${String(index + 1).padStart(4, '0')}`, walletId: profile.wallet!.id, type: index % 4 === 0 ? WalletRequestType.WITHDRAWAL : WalletRequestType.DEPOSIT, amount: 50000 + index % 3 * 50000, method: 'Chuyển khoản ngân hàng', status: index < 5 ? WalletRequestStatus.APPROVED : index < 7 ? WalletRequestStatus.PENDING : WalletRequestStatus.REJECTED, note: 'Yêu cầu ví dữ liệu mẫu', createdAt: daysBefore(12 - index), reviewedAt: index < 5 || index === 7 ? daysBefore(11 - index) : null } });
    }
  }
}

async function seedWorkforce(employees: Awaited<ReturnType<typeof seedIdentity>>['employees']) {
  for (const [employeeIndex, employee] of employees.entries()) {
    for (let dayOffset = 10; dayOffset >= -5; dayOffset--) {
      const date = daysBefore(dayOffset, 0);
      const completed = dayOffset > 0;
      const shift = await prisma.shift.create({ data: { employeeId: employee.id, date, startTime: employeeIndex % 2 === 0 ? '07:00' : '10:00', endTime: employeeIndex % 2 === 0 ? '15:00' : '18:00', workRole: employee.workRole, status: completed ? ShiftStatus.COMPLETED : ShiftStatus.SCHEDULED } });
      if (completed) {
        const late = (employeeIndex + dayOffset) % 5 === 0;
        const absent = (employeeIndex + dayOffset) % 13 === 0;
        await prisma.attendance.create({ data: { employeeId: employee.id, shiftId: shift.id, scheduledStart: new Date(date.getTime() + (employeeIndex % 2 === 0 ? 0 : 3) * 3_600_000), scheduledEnd: new Date(date.getTime() + (employeeIndex % 2 === 0 ? 8 : 11) * 3_600_000), clockInAt: absent ? null : new Date(date.getTime() + (employeeIndex % 2 === 0 ? 0 : 3) * 3_600_000 + (late ? 12 : 0) * 60_000), clockOutAt: absent ? null : new Date(date.getTime() + (employeeIndex % 2 === 0 ? 8 : 11) * 3_600_000), status: absent ? AttendanceStatus.ABSENT : late ? AttendanceStatus.LATE : AttendanceStatus.PRESENT } });
      }
    }
  }
}

function statusForOrder(index: number): OrderStatus {
  if (index >= 188) return [OrderStatus.PENDING, OrderStatus.ACCEPTED, OrderStatus.PREPARING, OrderStatus.READY][index % 4];
  return [OrderStatus.COMPLETED, OrderStatus.COMPLETED, OrderStatus.COMPLETED, OrderStatus.COMPLETED, OrderStatus.REJECTED, OrderStatus.CANCELLED][index % 6];
}

async function seedOrders(
  products: Awaited<ReturnType<typeof seedCatalog>>,
  profiles: Awaited<ReturnType<typeof seedIdentity>>['studentProfiles'],
  employees: Awaited<ReturnType<typeof seedIdentity>>['employees'],
  coupons: Awaited<ReturnType<typeof seedPromotions>>['coupons'],
) {
  const kitchenEmployees = employees.filter(employee => employee.workRole === Role.KITCHEN_STAFF);
  const cashiers = employees.filter(employee => employee.workRole === Role.CASHIER);
  const dailyCounts = new Map<string, number>();
  for (let index = 0; index < 200; index++) {
    const daysAgo = Math.floor((199 - index) * 240 / 199);
    const createdAt = daysBefore(daysAgo, 2 + index % 7, index * 11 % 60);
    const dateKey = createdAt.toISOString().slice(0, 10);
    const daySequence = (dailyCounts.get(dateKey) ?? 0) + 1;
    dailyCounts.set(dateKey, daySequence);
    const status = statusForOrder(index);
    const profile = profiles[index * 7 % profiles.length];
    const itemCount = 1 + index % 3;
    const selectedProducts = Array.from({ length: itemCount }, (_, itemIndex) => products[(index * 5 + itemIndex * 7) % products.length]);
    const quantities = selectedProducts.map((_, itemIndex) => 1 + ((index + itemIndex) % 7 === 0 ? 1 : 0));
    const subtotal = selectedProducts.reduce((sum, product, itemIndex) => sum + product.basePrice * quantities[itemIndex], 0);
    const coupon = index % 8 === 0 ? coupons[index % coupons.length] : null;
    const rawDiscount = coupon ? (coupon.type === DiscountType.PERCENTAGE ? Math.round(subtotal * coupon.discountValue / 100) : coupon.discountValue) : 0;
    const couponDiscount = coupon ? Math.min(rawDiscount, coupon.maximumDiscount ?? rawDiscount) : 0;
    const pointDiscount = index % 17 === 0 ? Math.min(5000, subtotal - couponDiscount) : 0;
    const totalAmount = Math.max(0, subtotal - couponDiscount - pointDiscount);
    const paymentMethod = [PaymentMethod.CASH, PaymentMethod.VNPAY_QR_MOCK, PaymentMethod.CANTEEN_WALLET][index % 3];
    const isCancelled = status === OrderStatus.CANCELLED;
    const isRejected = status === OrderStatus.REJECTED;
    const isPaid = !isRejected && status !== OrderStatus.PENDING;
    const paymentStatus = isCancelled && index % 2 === 0 ? PaymentStatus.REFUNDED : isPaid ? PaymentStatus.PAID : isRejected ? PaymentStatus.FAILED : PaymentStatus.PENDING;
    const acceptedAt = [OrderStatus.ACCEPTED, OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.COMPLETED, OrderStatus.CANCELLED].includes(status) ? new Date(createdAt.getTime() + 4 * 60_000) : null;
    const readyAt = [OrderStatus.READY, OrderStatus.COMPLETED].includes(status) ? new Date(createdAt.getTime() + 18 * 60_000) : null;
    const completedAt = status === OrderStatus.COMPLETED ? new Date(createdAt.getTime() + 24 * 60_000) : null;
    const cancelledAt = isCancelled ? new Date(createdAt.getTime() + 7 * 60_000) : null;
    const orderCode = `GB-${dateKey.replaceAll('-', '')}-${String(daySequence).padStart(3, '0')}`;
    const history = [
      { oldStatus: null, newStatus: OrderStatus.PENDING, createdAt },
      ...([OrderStatus.ACCEPTED, OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.COMPLETED].includes(status) ? [{ oldStatus: OrderStatus.PENDING, newStatus: OrderStatus.ACCEPTED, changedByUserId: cashiers[index % cashiers.length].userId, createdAt: new Date(createdAt.getTime() + 4 * 60_000) }] : []),
      ...([OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.COMPLETED].includes(status) ? [{ oldStatus: OrderStatus.ACCEPTED, newStatus: OrderStatus.PREPARING, createdAt: new Date(createdAt.getTime() + 7 * 60_000) }] : []),
      ...([OrderStatus.READY, OrderStatus.COMPLETED].includes(status) ? [{ oldStatus: OrderStatus.PREPARING, newStatus: OrderStatus.READY, createdAt: new Date(createdAt.getTime() + 18 * 60_000) }] : []),
      ...(status === OrderStatus.COMPLETED ? [{ oldStatus: OrderStatus.READY, newStatus: OrderStatus.COMPLETED, changedByUserId: cashiers[index % cashiers.length].userId, createdAt: completedAt! }] : []),
      ...(isRejected ? [{ oldStatus: OrderStatus.PENDING, newStatus: OrderStatus.REJECTED, changedByUserId: cashiers[index % cashiers.length].userId, note: 'Sản phẩm tạm hết hàng', createdAt: new Date(createdAt.getTime() + 3 * 60_000) }] : []),
      ...(isCancelled ? [{ oldStatus: OrderStatus.ACCEPTED, newStatus: OrderStatus.CANCELLED, note: 'Khách hàng hủy đơn', createdAt: cancelledAt! }] : []),
    ];
    const order = await prisma.order.create({
      data: {
        orderCode, idempotencyKey: `gb-seed-order-${String(index + 1).padStart(4, '0')}`, studentProfileId: profile.id,
        diningType: index % 3 === 0 ? DiningType.TAKEAWAY : DiningType.DINE_IN,
        pickupType: index % 5 === 0 ? PickupType.SCHEDULED : PickupType.ASAP,
        scheduledPickupAt: index % 5 === 0 ? new Date(createdAt.getTime() + 35 * 60_000) : null,
        subtotal, couponDiscount, pointDiscount, pointsUsed: pointDiscount / 100, discountTotal: couponDiscount + pointDiscount, totalAmount,
        status, paymentStatus, paymentMethod, couponId: coupon?.id,
        note: index % 11 === 0 ? 'Gói quà giúp mình, kèm thiệp chúc mừng sinh nhật.' : index % 13 === 0 ? 'Nhận hàng tại quầy số 2.' : null,
        cancellationReason: isCancelled ? (index % 2 === 0 ? 'Khách hàng đổi ý' : 'Đặt nhầm sản phẩm') : isRejected ? 'Sản phẩm tạm hết hàng' : null,
        createdAt, acceptedAt, readyAt, completedAt, cancelledAt,
        items: { create: selectedProducts.map((product, itemIndex) => ({
          productId: product.id, quantity: quantities[itemIndex], productNameSnapshot: product.name, unitPriceSnapshot: product.basePrice,
          lineSubtotal: product.basePrice * quantities[itemIndex], note: itemIndex === 0 && index % 9 === 0 ? 'Bọc chống sốc kỹ giúp mình' : null,
          requiresKitchen: product.preparationTimeMinutes > 2,
          kitchenTask: product.preparationTimeMinutes > 2 ? { create: {
            employeeId: [OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.COMPLETED].includes(status) ? kitchenEmployees[index % kitchenEmployees.length].id : null,
            status: status === OrderStatus.COMPLETED || status === OrderStatus.READY ? KitchenTaskStatus.DONE : status === OrderStatus.PREPARING ? KitchenTaskStatus.PREPARING : status === OrderStatus.ACCEPTED ? KitchenTaskStatus.CLAIMED : KitchenTaskStatus.WAITING,
            claimedAt: acceptedAt, startedAt: [OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.COMPLETED].includes(status) ? new Date(createdAt.getTime() + 7 * 60_000) : null,
            completedAt: [OrderStatus.READY, OrderStatus.COMPLETED].includes(status) ? new Date(createdAt.getTime() + (15 + itemIndex) * 60_000) : null,
          } } : undefined,
        })) },
        statusHistory: { create: history },
        payments: { create: { method: paymentMethod, status: paymentStatus, amount: totalAmount, idempotencyKey: `gb-seed-payment-${String(index + 1).padStart(4, '0')}`, providerRef: `GB-PAY-${String(index + 1).padStart(6, '0')}`, paidAt: isPaid ? new Date(createdAt.getTime() + 2 * 60_000) : null, failedAt: isRejected ? new Date(createdAt.getTime() + 3 * 60_000) : null, metadata: { seed: true, channel: paymentMethod }, createdAt } },
      }, include: { items: true },
    });
    if (coupon) await prisma.couponUsage.create({ data: { couponId: coupon.id, studentProfileId: profile.id, orderId: order.id, discountAmount: couponDiscount, createdAt } });
    if (paymentMethod === PaymentMethod.CANTEEN_WALLET && isPaid) {
      await prisma.walletTransaction.create({ data: { walletId: profile.wallet!.id, orderId: order.id, type: WalletTransactionType.PAYMENT, amount: -totalAmount, balanceBefore: profile.wallet!.balance + totalAmount, balanceAfter: profile.wallet!.balance, description: `Thanh toán đơn ${orderCode}`, reference: `GB-WALLET-ORDER-${index + 1}`, createdAt } });
    }
    if (status === OrderStatus.COMPLETED) {
      const earned = Math.max(1, Math.floor(totalAmount / 10000));
      await prisma.loyaltyTransaction.create({ data: { loyaltyAccountId: profile.loyaltyAccount!.id, orderId: order.id, type: LoyaltyTransactionType.EARN, points: earned, balanceBefore: Math.max(0, profile.loyaltyAccount!.points - earned), balanceAfter: profile.loyaltyAccount!.points, description: `Tích điểm đơn ${orderCode}`, reference: `GB-LOYALTY-ORDER-${index + 1}`, createdAt: completedAt! } });
    }
    if (index % 10 === 0) {
      const room = await prisma.chatRoom.create({ data: { orderId: order.id, createdAt } });
      const cashier = cashiers[index % cashiers.length];
      await prisma.chatParticipant.createMany({ data: [{ roomId: room.id, userId: profile.userId }, { roomId: room.id, userId: cashier.userId }] });
      await prisma.chatMessage.createMany({ data: [
        { roomId: room.id, senderUserId: profile.userId, senderRole: Role.STUDENT, content: 'Shop gói quà giúp mình nhé ạ.', createdAt: new Date(createdAt.getTime() + 60_000) },
        { roomId: room.id, senderUserId: cashier.userId, senderRole: Role.CASHIER, content: 'GlowBeauty đã ghi chú cho đơn của bạn.', readAt: new Date(createdAt.getTime() + 3 * 60_000), createdAt: new Date(createdAt.getTime() + 2 * 60_000) },
      ] });
    }
  }
  for (const [dateKey, count] of dailyCounts) await prisma.orderDailyCounter.create({ data: { date: new Date(`${dateKey}T00:00:00.000Z`), value: count } });
  const reviewableItems = await prisma.orderItem.findMany({ where: { order: { status: OrderStatus.COMPLETED }, productId: { not: null } }, include: { order: true }, take: 90, orderBy: { createdAt: 'desc' } });
  const comments = ['Sản phẩm thấm nhanh, mùi dễ chịu.', 'Dùng hai tuần thấy da mịn hơn hẳn.', 'Giá hợp lý, hàng chính hãng.', 'Đóng gói cẩn thận, sẽ mua lại.', 'Chất lượng ổn, mong shop có thêm dung tích lớn.'];
  for (const [index, item] of reviewableItems.entries()) {
    await prisma.review.create({ data: { studentProfileId: item.order.studentProfileId, productId: item.productId!, orderItemId: item.id, rating: index % 11 === 0 ? 3 : index % 4 === 0 ? 4 : 5, comment: comments[index % comments.length], createdAt: new Date(item.order.completedAt!.getTime() + 60 * 60_000) } });
  }
  for (const product of products) {
    const aggregate = await prisma.review.aggregate({ where: { productId: product.id, isHidden: false }, _avg: { rating: true }, _count: { rating: true } });
    await prisma.product.update({ where: { id: product.id }, data: { averageRating: aggregate._avg.rating ?? 0, totalReviews: aggregate._count.rating } });
  }
}

async function seedNotificationsAndAudit(identity: Awaited<ReturnType<typeof seedIdentity>>) {
  for (const [index, profile] of identity.studentProfiles.entries()) {
    await prisma.notification.createMany({ data: [
      { userId: profile.userId, type: NotificationType.SYSTEM, title: 'Chào mừng đến GlowBeauty', message: 'Khám phá sản phẩm làm đẹp và tích điểm cho mỗi đơn hàng.', isRead: index % 3 === 0, readAt: index % 3 === 0 ? daysBefore(20) : null, createdAt: daysBefore(30) },
      { userId: profile.userId, type: index % 2 === 0 ? NotificationType.VOUCHER : NotificationType.LOYALTY, title: index % 2 === 0 ? 'Bạn có voucher mới' : 'Tích điểm mỗi đơn hàng', message: index % 2 === 0 ? 'Mở mục ưu đãi để xem voucher đang có.' : 'Mỗi đơn hoàn tất đều giúp bạn nhận thêm điểm.', isRead: false, createdAt: daysBefore(index % 7) },
    ] });
  }
  await prisma.auditLog.createMany({ data: [
    { actorUserId: identity.adminUser.id, action: 'SEED_RESET', entityType: 'DATABASE', afterData: { students: 100, registeredStudents: 50, unregisteredStudents: 50, staff: 5, products: 20, orders: 200 }, createdAt: referenceNow },
    { actorUserId: identity.adminUser.id, action: 'UPDATE_SETTINGS', entityType: 'CanteenSetting', entityId: 'default', afterData: { canteenName: 'GlowBeauty' }, createdAt: referenceNow },
  ] });
}

async function main() {
  if (process.argv.includes('--if-empty')) {
    const counts = await Promise.all([
      prisma.user.count(),
      prisma.category.count(),
      prisma.order.count(),
      prisma.canteenSetting.count(),
    ]);
    if (counts.some(count => count > 0)) {
      console.log('Database đã có dữ liệu; bỏ qua việc nạp dữ liệu mẫu tự động.');
      return;
    }
  }

  console.log('Đang xóa toàn bộ dữ liệu nghiệp vụ hiện tại...');
  await resetDatabase();
  const passwordHash = await argon2.hash(password);
  await prisma.canteenSetting.create({ data: {
    id: 'default', canteenName: 'GlowBeauty', address: '120 Xuân Thủy, Cầu Giấy, Hà Nội',
    openingTime: '08:00', closingTime: '21:30', contactInformation: '0328 866 959', defaultPickupInterval: 30,
    pointValueVnd: 100, comboDiscountPercent: 12, timezone: 'Asia/Ho_Chi_Minh',
    expenses: [{ name: 'Nhập hàng', amount: 68000000, month: '2026-09' }, { name: 'Nhân sự', amount: 32000000, month: '2026-09' }, { name: 'Mặt bằng & điện nước', amount: 18500000, month: '2026-09' }, { name: 'Marketing', amount: 6500000, month: '2026-09' }],
  } });
  const identity = await seedIdentity(passwordHash);
  const products = await seedCatalog();
  await seedInventory(products, identity.admin.id);
  const promotions = await seedPromotions();
  await seedStudentBenefits(identity.studentProfiles, products, promotions.vouchers);
  await seedWorkforce(identity.employees);
  await seedOrders(products, identity.studentProfiles, identity.employees, promotions.coupons);
  await seedNotificationsAndAudit(identity);
  console.log('Hoàn tất: 100 khách hàng (50 đã có tài khoản), 1 admin, 2 thu ngân, 2 nhân viên kho, 20 sản phẩm và 200 đơn đa dạng.');
  console.log(`Mật khẩu chung: ${password}`);
}

main().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => prisma.$disconnect());
