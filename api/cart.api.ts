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

  async getCart(token: string): Promise<APIResponse> {
    return this.request.get(`${this.baseUrl}/api/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async addToCart(
    token: string,
    payload: AddToCartPayload,
  ): Promise<APIResponse> {
    return this.request.post(`${this.baseUrl}/api/cart/items`, {
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async clearCart(token: string): Promise<APIResponse> {
    return this.request.delete(`${this.baseUrl}/api/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
