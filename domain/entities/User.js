
export class User {
  constructor(firstName, lastName, email, phoneNumber, password, id = null, token = null) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.password = password;
    this.token = token;
  }
}