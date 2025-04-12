import { App } from "../App.js";
import { Page } from "../Models/Page.js";
import { PostPublishValidation } from "../Services/ValidationServices/PostPublishValidation.js";
import { PostSubmitServices } from "../Services/PostServices/PostSubmitServices.js";
import { Loading } from "../Utils/Loading.js";

class Post extends Page {
  async beforeRender(content) {
    //! Show loading
    Loading.show();

    const pageContent = document.createElement("div");
    pageContent.innerHTML = content;

    //! Getting categories and adding them to categories list
    const categoriesData = await App.getCategoryServices().getCategories();
    const categoriesContainer = pageContent.querySelector("#category-post");
    categoriesData.forEach((category) =>
      categoriesContainer.append(App.getPostPageServices().addCategory(category))
    );

    return pageContent.innerHTML;
  }

  afterRender() {
    //! Hide Loading
    Loading.hide();

    //! Ck editor
    this.ckEditorSetting();

    //! Post submit
    new PostPublishValidation();
    new PostSubmitServices();

    //! Post Page Services
    App.getPostPageServices().eventCaller();
  }

  ckEditorSetting() {
    ClassicEditor.create(document.querySelector("#editor"), {
      language: "fa",
      toolbar: [
        "undo",
        "redo",
        "|",
        "heading",
        "|",
        "bold",
        "italic",
        "underline",
        "|",
        "link",
        "uploadImage",
        "ckbox",
        "insertTable",
        "blockQuote",
        "mediaEmbed",
        "|",
        "bulletedList",
        "numberedList",
        "|",
        "outdent",
        "indent",
      ],
      heading: {
        options: [
          {
            model: "paragraph",
            title: "Paragraph",
            class: "ck-heading_paragraph",
          },
          {
            model: "heading1",
            view: "h1",
            title: "Heading 1",
            class: "ck-heading_heading1",
          },
          {
            model: "heading2",
            view: "h2",
            title: "Heading 2",
            class: "ck-heading_heading2",
          },
          {
            model: "heading3",
            view: "h3",
            title: "Heading 3",
            class: "ck-heading_heading3",
          },
          {
            model: "heading4",
            view: "h4",
            title: "Heading 4",
            class: "ck-heading_heading4",
          },
        ],
      },
      image: {
        resizeOptions: [
          {
            name: "resizeImage:original",
            label: "Default image width",
            value: null,
          },
          {
            name: "resizeImage:50",
            label: "50% page width",
            value: "50",
          },
          {
            name: "resizeImage:75",
            label: "75% page width",
            value: "75",
          },
        ],
        toolbar: [
          "imageTextAlternative",
          "toggleImageCaption",
          "|",
          "imageStyle:inline",
          "imageStyle:wrapText",
          "imageStyle:breakText",
          "|",
          "resizeImage",
        ],
      },
      link: {
        addTargetToExternalLinks: true,
        defaultProtocol: "https://",
      },
      table: {
        contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
      },
    })
      .then((editor) => {
        window.editor = editor;
      })
      .catch((error) => {
        console.error(error.stack);
        console.log(error);
      });
  }

  isLoginNecessary() {
    return true;
  }
}

export { Post };
