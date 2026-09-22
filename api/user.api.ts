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
    return this.request.post(`${this.baseUrl}/verifyLogin`, {
      form: {
        email: payload.email,
        password: payload.password,
      },
    });
  }

  async register(payload: RegisterPayload): Promise<APIResponse> {
    return this.request.post(`${this.baseUrl}/createAccount`, {
      form: {
        name: `${payload.firstName} ${payload.lastName}`,
        email: payload.email,
        password: payload.password,
        title: 'Mr',
        birth_date: '10',
        birth_month: '5',
        birth_year: '1995',
        firstname: payload.firstName,
        lastname: payload.lastName,
        company: 'QA Factory',
        address1: 'Main Street 1',
        address2: 'Floor 2',
        country: 'India',
        zipcode: '1111',
        state: 'Budapest',
        city: 'Budapest',
        mobile_number: '301234567',
      },
    });
  }

  async getUserByEmail(email: string): Promise<APIResponse> {
    return this.request.get(
      `${this.baseUrl}/getUserDetailByEmail?email=${encodeURIComponent(email)}`,
    );
  }

  async getProfile(email: string): Promise<APIResponse> {
    return this.getUserByEmail(email);
  }
}
