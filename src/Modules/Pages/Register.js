import { Page } from "../Models/Page.js";
import { RegisterValidation } from "../Services/ValidationServices/RegisterValidation.js";

class Register extends Page {
  afterRender() {
    new RegisterValidation();
  }

  isLogoutNecessary() {
    return true;
  }
}

export { Register };
