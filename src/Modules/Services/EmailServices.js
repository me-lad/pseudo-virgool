//! This module contains user email and email setter and getter methods
class EmailServices {
  constructor() {
    this.email = "";
  }

  setEmail(email) {
    this.email = email;
    localStorage.setItem("email", email);
  }

  getEmail() {
    return this.email || localStorage.getItem("email");
  }
}

export { EmailServices };
