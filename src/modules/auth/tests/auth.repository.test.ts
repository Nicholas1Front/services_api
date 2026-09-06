import authRepository from '@/modules/auth/auth.repository';
import { prisma } from '@/config/prisma';

jest.mock('@/config/prisma', () => ({
    prisma: {
        user: {
            findUnique: jest.fn(),
        },
    },
}));

const mockedPrisma = jest.mocked(prisma);

describe('AuthRepository', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('findUserByEmail', () => {

        it('should return a user when email exists', async () => {
            const user = {
                id: 'user-123',
                name: 'Nicholas',
                email: 'nicholas@email.com',
                passwordHash: 'hashed-password',
                role: 'USER',
            };

            mockedPrisma.user.findUnique.mockResolvedValue(user as any);

            const result = await authRepository.findUserByEmail(
                user.email
            );

            expect(
                mockedPrisma.user.findUnique
            ).toHaveBeenCalledWith({
                where: {
                    email: user.email,
                },
            });

            expect(result).toEqual(user);
        });

        it('should return null when email does not exist', async () => {
            mockedPrisma.user.findUnique.mockResolvedValue(null);

            const result = await authRepository.findUserByEmail(
                'unknown@email.com'
            );

            expect(
                mockedPrisma.user.findUnique
            ).toHaveBeenCalledWith({
                where: {
                    email: 'unknown@email.com',
                },
            });

            expect(result).toBeNull();
        });

    });

    describe('findUserById', () => {

        it('should return a user when id exists', async () => {
            const user = {
                id: 'user-123',
                name: 'Nicholas',
                email: 'nicholas@email.com',
                passwordHash: 'hashed-password',
                role: 'USER',
            };

            mockedPrisma.user.findUnique.mockResolvedValue(user as any);

            const result = await authRepository.findUserById(
                user.id
            );

            expect(
                mockedPrisma.user.findUnique
            ).toHaveBeenCalledWith({
                where: {
                    id: user.id,
                },
            });

            expect(result).toEqual(user);
        });

        it('should return null when id does not exist', async () => {
            mockedPrisma.user.findUnique.mockResolvedValue(null);

            const result = await authRepository.findUserById(
                'unknown-id'
            );

            expect(
                mockedPrisma.user.findUnique
            ).toHaveBeenCalledWith({
                where: {
                    id: 'unknown-id',
                },
            });

            expect(result).toBeNull();
        });

    });

});