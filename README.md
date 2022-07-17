# blog-back-end
The back end of my blog.


# Plan

## MongoDB collections
Each heading bellow is a separate MongoDB collection inside the same database.

### User
* Fields
  * username
  * password
  * admin
    * True: has permission to create, update and delete posts, and create and delete comments.
    * False: has permission to create comment.

### Post
* Fields
  * Title
  * Content
    * It will come in HTML5 because of TinyMCE6
  * Creation Date
  * Publish Date
    * It will allow for scheduling posts.
    * That is, only posts past "now" will be show publicly
    * Different dates allows for different sortings in admin dashboard.
  * Author
    * Reference to the user who created it.
* Endpoints
  * `/posts`
    * **GET:** Fetches the list of all posts
    * **POST:** Creates a new post
  * `posts/:postId`
    * **GET:** Fetches a single post
    * **PUT:** Updates a single post
    * **DELETE:** Deletes a single post

### Comment
* Fields
  * Post
    * Reference to the post that is being commented.
  * Content
    * It will come in HTML5 because of TinyMCE6
  * Creation Date
  * Author
    * Reference to the user who created it.