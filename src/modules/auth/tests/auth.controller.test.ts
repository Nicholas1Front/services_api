import authController from '@/modules/auth/auth.controller';
import authService from '@/modules/auth/auth.service';

import type { Request, Response } from 'express';

jest.mock('@/modules/auth/auth.service', () => ({
    __esModule: true,
    default: {
        login: jest.fn(),
        me: jest.fn(),
        logout: jest.fn(),
    },
}));

const mockedAuthService = jest.mocked(authService);

describe('AuthController', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('login', () => {

        it('should login successfully', async () => {
            const req = {
                body: {
                    email: 'nicholas@email.com',
                    password: 'correct-password',
                },
            } as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            } as unknown as Response;

            const serviceResult = {
                id: 'user-123',
                name: 'Nicholas',
                email: 'nicholas@email.com',
                role: 'USER',
                token: 'fake-jwt-token',
            };

            mockedAuthService.login.mockResolvedValue(serviceResult);

            await authController.login(req, res);

            expect(
                mockedAuthService.login
            ).toHaveBeenCalledWith({
                email: 'nicholas@email.com',
                password: 'correct-password',
            });

            expect(
                res.status
            ).toHaveBeenCalledWith(200);

            expect(
                res.json
            ).toHaveBeenCalledWith({
                message: 'Login successful',
                data: serviceResult,
            });
        });

        it('should reject invalid login data', async () => {
            const req = {
                body: {
                    email: 'invalid-email',
                    password: '',
                },
            } as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            } as unknown as Response;

            await expect(
                authController.login(req, res)
            ).rejects.toThrow();

            expect(
                mockedAuthService.login
            ).not.toHaveBeenCalled();
        });

    });

    describe('me', () => {

        it('should return user data when authenticated', async () => {
            const req = {
                user: {
                    id: 'user-123',
                },
            } as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            } as unknown as Response;

            const serviceResult = {
                id: 'user-123',
                name: 'Nicholas',
                email: 'nicholas@email.com',
                role: 'USER',
                createdAt: new Date('2026-01-01'),
                updatedAt: new Date('2026-01-02'),
            };

            mockedAuthService.me.mockResolvedValue(serviceResult);

            await authController.me(req, res);

            expect(
                mockedAuthService.me
            ).toHaveBeenCalledWith({
                id: 'user-123',
            });

            expect(
                res.status
            ).toHaveBeenCalledWith(200);

            expect(
                res.json
            ).toHaveBeenCalledWith({
                message: 'User data retrieved successfully',
                data: serviceResult,
            });
        });

        it('should throw unauthorized when user is not authenticated', async () => {
            const req = {
                user: undefined,
            } as unknown as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            } as unknown as Response;

            await expect(
                authController.me(req, res)
            ).rejects.toMatchObject({
                message: 'Unauthorized',
                statusCode: 401,
                code: 'UNAUTHORIZED',
            });

            expect(
                mockedAuthService.me
            ).not.toHaveBeenCalled();
        });

    });

    describe('logout', () => {

        it('should logout successfully when authenticated', async () => {
            const req = {
                user: {
                    id: 'user-123',
                },
            } as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            } as unknown as Response;

            const serviceResult = {
                message: 'Logout successful',
                user: {
                    id: 'user-123',
                    name: 'Nicholas',
                    email: 'nicholas@email.com',
                    role: 'USER',
                },
            };

            mockedAuthService.logout.mockResolvedValue(serviceResult);

            await authController.logout(req, res);

            expect(
                mockedAuthService.logout
            ).toHaveBeenCalledWith({
                id: 'user-123',
            });

            expect(
                res.status
            ).toHaveBeenCalledWith(200);

            expect(
                res.json
            ).toHaveBeenCalledWith({
                message: 'Logout successful',
                data: serviceResult,
            });
        });

        it('should throw unauthorized when user is not authenticated', async () => {
            const req = {
                user : undefined,
            } as unknown as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            } as unknown as Response;

            await expect(
                authController.logout(req, res)
            ).rejects.toMatchObject({
                message: 'Unauthorized',
                statusCode: 401,
                code: 'UNAUTHORIZED',
            });

            expect(
                mockedAuthService.logout
            ).not.toHaveBeenCalled();
        });

    });

});