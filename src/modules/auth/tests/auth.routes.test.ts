import request from 'supertest';

import jwt from 'jsonwebtoken';

import app from '@/app';
import authService from '@/modules/auth/auth.service';

import {AppError} from '@/errors/AppError';

jest.mock('@/modules/auth/auth.service', () => ({
    __esModule: true,
    default: {
        login: jest.fn(),
        me: jest.fn(),
        logout: jest.fn(),
    },
}));

const mockedAuthService = jest.mocked(authService);
const mockedJwt = jest.mocked(jwt);
const mockedAppError = jest.mocked(AppError);

beforeEach(()=>{
    jest.clearAllMocks();
})

describe('POST /auth/login', ()=>{
    it('should login successfully ', async()=>{
        const mockToken = 'mocked-jwt-token';

        mockedAuthService.login.mockResolvedValue({
            token: mockToken,
            name: 'John Doe',
            email : 'teste@gmail.com',
            role : 'USER',
            id : 'aseoenn'
        });

        const response = await request(app)
            .post('/auth/login')
            .send({
                email : 'teste@gmail.com',
                password : 'password123'
            })

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            message : 'Login successful',
            data : {
                token: mockToken,
                name: 'John Doe',
                email : 'teste@gmail.com',
                role : 'USER',
                id : 'aseoenn'
            }
        });
    });

    it('should return error for invalid credentials', async()=>{
        mockedAuthService.login.mockRejectedValue(
            new AppError({
                message : "Invalid credentials or User not exists",
                statusCode : 401,
                code : "INVALID_CREDENTIALS"
            })
        );

        const response = await request(app)
            .post('/auth/login')
            .send({
                email : 'teste@gmail.com',
                password : 'wrongpassword'
            })

        expect(response.status).toBe(401);

        expect(response.body).toMatchObject({
            message : "Invalid credentials or User not exists",
            statusCode : 401,
            code : "INVALID_CREDENTIALS"
        })
    })
})