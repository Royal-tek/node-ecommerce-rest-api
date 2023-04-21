# node-ecommerce-rest-api
A fully functional e-commerce rest API built with node js.
API Endpoints
Authentication
POST /api/v1/auth/register - Register a new user
POST /api/v1/auth/login - Login an existing user
Products
GET /api/v1/products - Get all products
GET /api/v1/products/:id - Get a single product by ID
POST /api/v1/products - Create a new product
PUT /api/v1/products/:id - Update a product by ID
DELETE /api/v1/products/:id - Delete a product by ID
Cart
GET /api/v1/cart - Get the current user's cart
POST /api/v1/cart - Add a product to the cart
PUT /api/v1/cart/:id - Update a product's quantity in the cart
DELETE /api/v1/cart/:id - Remove a product from the cart
Orders
GET /api/v1/orders - Get all orders
GET /api/v1/orders/:id - Get a single order by ID
POST /api/v1/orders - Create a new order
Contributing
Contributions are welcome! If you'd like to contribute to this project, please create a pull request with your changes.

License
This project is licensed under the MIT License.
