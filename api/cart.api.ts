import { APIRequestContext, APIResponse } from '@playwright/test';

export interface AddToCartPayload {
  productId: string;
  quantity: number;
}

export class CartApi {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl = '',
  ) {}

  supportsCartMutations(): boolean {
    return !this.baseUrl.includes('automationexercise.com/api');
  }

  async getCart(token: string): Promise<APIResponse> {
    return this.request.get(`${this.baseUrl}/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async addToCart(
    token: string,
    payload: AddToCartPayload,
  ): Promise<APIResponse> {
    return this.request.post(`${this.baseUrl}/cart/items`, {
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async clearCart(token: string): Promise<APIResponse> {
    return this.request.delete(`${this.baseUrl}/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
