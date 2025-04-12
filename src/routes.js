import { Blog } from "./Modules/Pages/Blog.js";
import { Home } from "./Modules/Pages/Home.js";
import { Login } from "./Modules/Pages/Login.js";
import { Podcast } from "./Modules/Pages/Podcast.js";
import { Post } from "./Modules/Pages/Post.js";
import { Profile } from "./Modules/Pages/Profile.js";
import { Register } from "./Modules/Pages/Register.js";
import { Search } from "./Modules/Pages/Search.js";
import { Setting } from "./Modules/Pages/Setting.js";
import { Tag } from "./Modules/Pages/Tag.js";
import { Topic } from "./Modules/Pages/Topic.js";
import { User } from "./Modules/Pages/User.js";
import { Verify } from "./Modules/Pages/Verify.js";

const routes = [
  new Blog("blog", "blog.html"),
  new Home("home", "home.html"),
  new Login("login", "login.html"),
  new Podcast("podcast", "podcast.html"),
  new Post("post", "post.html"),
  new Profile("profile", "profile.html"),
  new Register("register", "register.html"),
  new Search("search", "search.html"),
  new Setting("setting", "setting.html"),
  new Tag("tag", "tag.html"),
  new Topic("topic", "topic.html"),
  new User("user", "user.html"),
  new Verify("verify", "verify.html"),
];

export { routes };
