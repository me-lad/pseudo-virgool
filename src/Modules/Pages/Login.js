import { Page } from "../Models/Page.js";
import { LoginValidation } from "../Services/ValidationServices/LoginValidation.js";

class Login extends Page {
  afterRender() {
    new LoginValidation();
  }

  isLogoutNecessary() {
    return true;
  }
}

export { Login };
