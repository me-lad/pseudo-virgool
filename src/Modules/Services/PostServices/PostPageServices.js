//! This module handles the post page setting menu process
class PostPageServices {
  constructor() {
    this.tagInput;
    this.tagList;
  }
  //! Before render related methods
  addCategory(category) {
    const categoryElm = document.createElement("option");
    categoryElm.textContent = category.name;
    categoryElm.setAttribute("value", category.id);
    return categoryElm;
  }

  //! After render related methods
  eventCaller() {
    //! Storing variables
    this.tagInput = document.querySelector(".tags-block--add");
    this.tagList = document.querySelector(".tags-block-list ");
    const readRangeInput = document.getElementById("rangeInput");
    const uploadElm = document.getElementById("upload-div");

    //! Setting events
    this.tagInput.onkeypress = this.addTag.bind(this);
    readRangeInput.oninput = this.updateReadTime.bind(this);
    uploadElm.onchange = this.uploadFileHandler.bind(this);
  }

  addTag(event) {
    const targetKey = event.key;

    if (this.tagList.children.length >= 5) {
      this.tagInput.disabled = true;
      this.tagInput.placeholder = "بیش از 5 تگ مجاز نیست.";
      this.tagInput.style.color = "red";
      return;
    }

    if (targetKey == "-" || targetKey == "Enter") {
      event.preventDefault();
      if (this.tagInput.value.trim()) {
        const tagElm = document.createElement("li");
        tagElm.className = "tags-block-list--item";
        tagElm.innerHTML = `<span>${this.tagInput.value}</span><button class="tags-block-list--remove">x</button>`;
        this.tagList.appendChild(tagElm);
        this.tagInput.value = "";

        //! Remove tag handler
        const removeBtn = tagElm.querySelector(".tags-block-list--remove");
        removeBtn.onclick = this.removeTag.bind(this);
      }
    }
  }

  removeTag(event) {
    const clickedTag = event.currentTarget.parentElement;
    clickedTag.remove();

    if (this.tagList.children.length < 5) {
      this.tagInput.disabled = false;
      this.tagInput.placeholder = "افزودن تگ...";
      this.tagInput.style.color = "unset";
    }
  }

  updateReadTime(event) {
    const allTimeElm = document.querySelectorAll(".read-time");
    allTimeElm.forEach((timeElm) => (timeElm.textContent = event.currentTarget.value));
  }

  uploadFileHandler() {
    const imageWrapper = document.getElementById("preview-image");
    const fileInput = document.getElementById("file-input");
    const reader = new FileReader();
    const uploadedFile = fileInput.files[0];

    reader.onload = () => {
      imageWrapper.src = reader.result;
      reader.onload = "";
    };
    if (uploadedFile) {
      reader.readAsDataURL(uploadedFile);
    }
  }
}

export { PostPageServices };
