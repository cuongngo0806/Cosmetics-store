import { Role, StudentDirectoryStatus, UserStatus } from '@prisma/client';
import { AuthService } from './auth.service';

jest.mock('@nestjs/jwt', () => ({ JwtService: class JwtService {} }));
const jwt = { signAsync: jest.fn().mockResolvedValue('access-token') };

function createPrismaMock() {
  const tx = {
    studentDirectory: {
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({ id: 'directory-new' }),
      update: jest.fn().mockResolvedValue({ id: 'directory-existing' }),
    },
    user: { create: jest.fn().mockResolvedValue({ id: 'user-1', email: 'lan.nguyen@gmail.com', role: Role.STUDENT }) },
    studentProfile: { create: jest.fn().mockResolvedValue({ id: 'profile-1' }) },
  };
  return {
    user: { findUnique: jest.fn().mockResolvedValue(null) },
    refreshToken: { create: jest.fn().mockResolvedValue({ id: 'session-1' }) },
    $transaction: jest.fn(async (callback: (client: typeof tx) => unknown) => callback(tx)),
    tx,
  };
}

const dto = { fullName: 'Nguyễn Thị Lan', email: ' Lan.Nguyen@GMAIL.com ', password: 'Password1', confirmPassword: 'Password1' };

describe('AuthService customer registration', () => {
  it('accepts any email and creates a customer record, wallet, loyalty account and cart', async () => {
    const prisma = createPrismaMock();
    const service = new AuthService(prisma as never, jwt as never);
    const result = await service.registerStudent(dto);
    expect(result.user).toEqual({ id: 'user-1', email: 'lan.nguyen@gmail.com', role: Role.STUDENT, displayName: 'Nguyễn Thị Lan' });
    expect(prisma.tx.studentDirectory.create).toHaveBeenCalledWith({ data: expect.objectContaining({ schoolEmail: 'lan.nguyen@gmail.com', fullName: 'Nguyễn Thị Lan', status: StudentDirectoryStatus.ACTIVE }) });
    expect(prisma.tx.user.create).toHaveBeenCalledWith({ data: expect.objectContaining({ email: 'lan.nguyen@gmail.com', role: Role.STUDENT, status: UserStatus.ACTIVE }) });
    expect(prisma.tx.studentProfile.create).toHaveBeenCalledWith({ data: expect.objectContaining({ studentDirectoryId: 'directory-new', wallet: { create: { balance: 0 } }, loyaltyAccount: { create: { points: 0 } }, cart: { create: {} } }) });
  });

  it('reuses an unclaimed customer record with the same email', async () => {
    const prisma = createPrismaMock();
    prisma.tx.studentDirectory.findUnique.mockResolvedValue({ id: 'directory-existing', status: StudentDirectoryStatus.ACTIVE, studentProfile: null });
    const service = new AuthService(prisma as never, jwt as never);
    await service.registerStudent(dto);
    expect(prisma.tx.studentDirectory.create).not.toHaveBeenCalled();
    expect(prisma.tx.studentProfile.create).toHaveBeenCalledWith({ data: expect.objectContaining({ studentDirectoryId: 'directory-existing' }) });
  });

  it('rejects an email that already has an account', async () => {
    const prisma = createPrismaMock();
    prisma.user.findUnique.mockResolvedValue({ id: 'user-existing' });
    const service = new AuthService(prisma as never, jwt as never);
    await expect(service.registerStudent(dto)).rejects.toMatchObject({ response: { code: 'STUDENT_ALREADY_REGISTERED' } });
  });

  it('rejects mismatched password confirmation', async () => {
    const prisma = createPrismaMock();
    const service = new AuthService(prisma as never, jwt as never);
    await expect(service.registerStudent({ ...dto, confirmPassword: 'Password2' })).rejects.toMatchObject({ response: { code: 'PASSWORD_CONFIRMATION_MISMATCH' } });
  });
});
