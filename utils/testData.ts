export interface Credentials {
  email: string;
  password: string;
}

export interface ProductSelection {
  id: string;
  name: string;
  quantity: number;
}

export function buildStandardUser(): Credentials {
  return {
    email: process.env.E2E_STANDARD_USER_EMAIL || 'standard.user@example.com',
    password: process.env.E2E_STANDARD_USER_PASSWORD || 'Password123!',
  };
}

export function buildAdminUser(): Credentials {
  return {
    email: process.env.E2E_ADMIN_USER_EMAIL || 'admin.user@example.com',
    password: process.env.E2E_ADMIN_USER_PASSWORD || 'Password123!',
  };
}

export function buildPrimaryProduct(): ProductSelection {
  return {
    id: process.env.E2E_PRIMARY_PRODUCT_ID || 'prod-backpack-001',
    name: process.env.E2E_PRIMARY_PRODUCT_NAME || 'Blue Top',
    quantity: Number(process.env.E2E_PRIMARY_PRODUCT_QTY || 1),
  };
}
