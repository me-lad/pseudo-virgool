//! This module handles the header account center click event
class AccountButton {
  constructor() {
    //! Variables
    this.accountElm = document.querySelector(".login-NoActivate");
    this.accountCenter = document.querySelector(".account");

    //! Set events
    this.accountElm.onclick = this.accountCenterHandler.bind(this);
  }

  accountCenterHandler() {
    this.accountCenter.classList.toggle("hidden");
  }
}

export { AccountButton };
