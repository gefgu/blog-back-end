# My Blog Back-End

# Plan

## MongoDB collections

Each heading bellow is a separate MongoDB collection inside the same database.

### User

- Fields
  - **username**
  - **password**
    - It will store as bcrypt hashing with salting.
  - **admin**
    - _True_: has permission to create, update and delete posts, and create and delete comments.
    - _False_: has permission to create comments and delete self's comments.
- Authentication
  - JSON Web Tokens and PassportJS
    - Expiration date: 1 Day
    - It will be saved in Local Storage.
- Endpoints
  - `/users`
    - **GET:** Returns user data given JWT token.
    - **POST:** Creates a new user.
      - It will receive the password as bcrypt hashing with salting. This way, the actual password will not be sended to the server.
  - `/users/login`
    - **POST:** Log in user.
      - Returns JWT token.

### Post

- Fields
  - **Title**
  - **Content**
    - It will be simple text.
  - **Creation Date**
  - **Publish Date**
    - It will allow for scheduling posts.
    - That is, only posts past "now" will be show publicly
    - Different dates allows for different sortings in admin dashboard.
    - This is the only not required field. If it has no value, the post is not published
  - **Author**
    - Reference to the user who created it.
- Endpoints
  - `/posts`
    - **GET:** Fetches the list of all posts
    - **POST:** Creates a new post
  - `posts/:postId`
    - **GET:** Fetches a single post
    - **PUT:** Updates a single post
    - **DELETE:** Deletes a single post
  - `/posts/published`
    - **GET:** Fetches the list of all posts published until "today"

### Comment

- Fields
  - **Content**
    - It will be simple text.
  - **Creation Date**
  - **Post**
    - Reference to the post that is being commented.
  - **Author**
    - Reference to the user who created it.
- Endpoints
  - `/posts/:postId/comments`
    - **GET:** Fetches the list of all comments of a single post
    - **POST:** Creates a new comment for a single post
  - `/posts/:postId/comments/:commmentId`
    - **GET:** Fetches a single comment.
    - No **PUT** because no one can update comments.
    - **DELETE:** Deletes a single comment.
    

## Related Repositories

* [Author's view](https://github.com/gefgu/blog-author-view)  
* [Reader's view](https://github.com/gefgu/blog-reader-view)  
* [Back-End](https://github.com/gefgu/blog-back-end)
