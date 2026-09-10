import { ShippingDetails } from '../../pages/CheckoutPage';

export class PaymentDetailsBuilder {
  private data: ShippingDetails;

  constructor() {
    this.data = {
      firstName: 'QA CARD HOLDER',
      lastName: '4111111111111111',
      address: '123',
      city: '12',
      zipCode: '2030',
      country: 'N/A',
    };
  }

  withCardNumber(cardNumber: string): PaymentDetailsBuilder {
    this.data.lastName = cardNumber;
    return this;
  }

  build(): ShippingDetails {
    return { ...this.data };
  }
}
