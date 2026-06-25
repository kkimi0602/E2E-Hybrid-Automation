import { APIRequestContext, APIResponse } from '@playwright/test';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export class UserApi {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl = '',
  ) {}

  async login(payload: LoginPayload): Promise<APIResponse> {
    return this.request.post(`${this.baseUrl}/api/users/login`, {
      data: payload,
    });
  }

  async register(payload: RegisterPayload): Promise<APIResponse> {
    return this.request.post(`${this.baseUrl}/api/users/register`, {
      data: payload,
    });
  }

  async getProfile(token: string): Promise<APIResponse> {
    return this.request.get(`${this.baseUrl}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
