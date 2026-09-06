
import authService from '@/modules/auth/auth.service';
import authRepository from '@/modules/auth/auth.repository';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { AppError } from '@/errors/AppError';

jest.mock('@/modules/auth/auth.repository', () => ({
    __esModule: true,
    default: {
        findUserByEmail: jest.fn(),
        findUserById: jest.fn(),
    },
}));

jest.mock('bcrypt', () => ({
    __esModule: true,
    default: {
        compare: jest.fn(),
    },
}));

jest.mock('jsonwebtoken', () => ({
    __esModule: true,
    default: {
        sign: jest.fn(),
    },
}));

const mockedAuthRepository = jest.mocked(authRepository);
const mockedBcrypt = jest.mocked(bcrypt);
const mockedJwt = jest.mocked(jwt);

describe('AuthService', () => {

    beforeEach(() => {
        jest.clearAllMocks();

        process.env.JWT_SECRET = 'test-secret';
    });

    describe('login', () => {

        it('should login successfully with valid credentials', async () => {
            const user = {
                id: 'user-123',
                name: 'Nicholas',
                email: 'nicholas@email.com',
                passwordHash: 'hashed-password',
                role: 'USER',
            };

            mockedAuthRepository.findUserByEmail.mockResolvedValue(user as any);

            mockedBcrypt.compare.mockResolvedValue(true as never);

            mockedJwt.sign.mockReturnValue('fake-jwt-token' as never);

            const result = await authService.login({
                email: user.email,
                password: 'correct-password',
            });

            expect(
                mockedAuthRepository.findUserByEmail
            ).toHaveBeenCalledWith(user.email);

            expect(
                mockedBcrypt.compare
            ).toHaveBeenCalledWith(
                'correct-password',
                user.passwordHash
            );

            expect(mockedJwt.sign).toHaveBeenCalled();

            expect(result).toEqual({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: 'fake-jwt-token',
            });
        });

        it('should throw an error when user does not exist', async () => {
            mockedAuthRepository.findUserByEmail.mockResolvedValue(null);

            await expect(
                authService.login({
                    email: 'unknown@email.com',
                    password: 'password',
                })
            ).rejects.toMatchObject({
                message: 'Invalid credentials or User not exists',
                statusCode: 401,
                code: 'INVALID_CREDENTIALS',
            });

            expect(
                mockedBcrypt.compare
            ).not.toHaveBeenCalled();

            expect(
                mockedJwt.sign
            ).not.toHaveBeenCalled();
        });

        it('should throw an error when password is incorrect', async () => {
            const user = {
                id: 'user-123',
                name: 'Nicholas',
                email: 'nicholas@email.com',
                passwordHash: 'hashed-password',
                role: 'USER',
            };

            mockedAuthRepository.findUserByEmail.mockResolvedValue(user as any);

            mockedBcrypt.compare.mockResolvedValue(false as never);

            await expect(
                authService.login({
                    email: user.email,
                    password: 'wrong-password',
                })
            ).rejects.toMatchObject({
                message: 'Invalid credentials',
                statusCode: 401,
                code: 'INVALID_CREDENTIALS',
            });

            expect(
                mockedJwt.sign
            ).not.toHaveBeenCalled();
        });

    });

    describe('me', () => {

        it('should return user data when user exists', async () => {
            const user = {
                id: 'user-123',
                name: 'Nicholas',
                email: 'nicholas@email.com',
                role: 'USER',
                createdAt: new Date('2026-01-01'),
                updatedAt: new Date('2026-01-02'),
            };

            mockedAuthRepository.findUserById.mockResolvedValue(user as any);

            const result = await authService.me({
                id: user.id,
            });

            expect(
                mockedAuthRepository.findUserById
            ).toHaveBeenCalledWith(user.id);

            expect(result).toEqual({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            });
        });

        it('should throw an error when user does not exist', async () => {
            mockedAuthRepository.findUserById.mockResolvedValue(null);

            await expect(
                authService.me({
                    id: 'user-123',
                })
            ).rejects.toMatchObject({
                message: 'User not found',
                statusCode: 404,
                code: 'USER_NOT_FOUND',
            });
        });

    });

    describe('logout', () => {

        it('should return user data when user exists', async () => {
            const user = {
                id: 'user-123',
                name: 'Nicholas',
                email: 'nicholas@email.com',
                role: 'USER',
            };

            mockedAuthRepository.findUserById.mockResolvedValue(user as any);

            const result = await authService.logout({
                id: user.id,
            });

            expect(
                mockedAuthRepository.findUserById
            ).toHaveBeenCalledWith(user.id);

            expect(result).toEqual({
                message: 'Logout successful',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        });

        it('should throw an error when user does not exist', async () => {
            mockedAuthRepository.findUserById.mockResolvedValue(null);

            await expect(
                authService.logout({
                    id: 'user-123',
                })
            ).rejects.toMatchObject({
                message: 'User not found',
                statusCode: 404,
                code: 'USER_NOT_FOUND',
            });
        });

    });

});
