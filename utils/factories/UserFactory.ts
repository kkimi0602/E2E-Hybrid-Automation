import { randomEmail } from '../helpers';
import { SignupDetails } from '../../pages/AuthPage';

export class SignupDataBuilder {
  private data: SignupDetails;

  constructor() {
    const email = randomEmail('automation-exercise-user-');
    this.data = {
      title: 'Mr',
      name: 'Automation User',
      email,
      password: 'Password123!',
      day: '10',
      month: '5',
      year: '1995',
      firstName: 'Automation',
      lastName: 'User',
      company: 'QA Factory',
      address1: 'Main Street 1',
      address2: 'Floor 2',
      country: 'India',
      state: 'Budapest',
      city: 'Budapest',
      zipcode: '1111',
      mobileNumber: '301234567',
    };
  }

  withEmail(email: string): SignupDataBuilder {
    this.data.email = email;
    return this;
  }

  withName(name: string): SignupDataBuilder {
    this.data.name = name;
    this.data.firstName = name.split(' ')[0] ?? this.data.firstName;
    this.data.lastName = name.split(' ')[1] ?? this.data.lastName;
    return this;
  }

  build(): SignupDetails {
    return { ...this.data };
  }
}
