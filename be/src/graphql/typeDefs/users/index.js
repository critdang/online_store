const { gql } = require('apollo-server');

module.exports = gql`
  type User {
    id: ID
    fullname: String
    email: String
    is_active: Boolean
    address: String
    phone: String
    gender: String
    avatar: String
    birthday: String
  }
  type Product {
    id: ID
    name: String
    description: String
    price: Float
    amount: Int
    productImage: [ProductImage]
    categoryProduct: [CategoryProduct]
  }

  type Cart {
    id: ID
    userId: String
    cartProduct: [CartProduct]
  }

  type Category {
    id: ID
    name: String
    thumbnail: String
    description: String
    categoryProduct: [CategoryProduct]
  }
 
  type CategoryProduct {
    id: ID
    productId: Int
    categoryId: Int
    category: Category
    product: [Product]
  }

  type CartProduct {
    id: ID!
    productId: Int
    amount: Int
    cartId: Int
    product: Product
  }

  type ProductImage {
    id: ID!
    href: String
  }
  
  type Order {
    id: ID!
    userId: Int
    status: OrderStatus
    paymentMethod: String
    paymentDate: String
  }

  type Query {
    user: User!
    products(isDefault: Boolean): [Product]
    listProducts(productOrderBy: ProductOrderBy): [Product]
    productDetail(productId: ProductId):Product!
    productImage: [ProductImage]
    cartProduct: [CartProduct]
    listCategory(id: Int): Category
    getCart: Cart!
    listOrders: [Order]!
    listCategories(input: listCategoriesBy): [Category]
    categories: [Category]
  }

  type Mutation {
    createUser(inputSignup: InputSignup): User!
    login(inputLogin: InputLogin): AuthDataResponse!
    changePassword(inputPassword: InputPassword): User!
    editProfile( inputProfile : InputProfile): User!
    addToCart(quantity:Int,productId:Int): Cart
    deleteItemCart(deleteItem: Int): Cart!
    changeOrderStatus(
      orderId: Int
      paymentMethod: PaymentMethod
    ): Order!
    createOrder(
      inputOrder: InputOrder
    ): Order!
  }
  
  input InputSignup {
    email: String!
    password: String!
  }
  
  input InputPassword {
    oldPassword: String!
    newPassword: String!
  }
  input InputLogin {
    email: String!
    password: String!
  }

  input InputProfile {
    email: String
    fullname: String
    address: String
    phone: String
    gender: String
    birthday: String
  }
  
  input InputOrder {
    paymentMethod: PaymentMethod
    cartId: Int
  }

  type AuthDataResponse {
    token: String!
    userId: String!
  }

  input ProductId {
    productId:Int!
  }

  input ProductOrderBy {
    name: OrderType
    price: OrderType
    categoryId: Int
  }

  enum OrderType {
    ASC
    DESC
  }

  input listCategoriesBy {
    name: CategoryType
    amount: CategoryType
  }

  enum CategoryType {
    ASC
    DESC
  }


  enum OrderStatus {
    PENDING
    SUCCESS
  }

  enum PaymentMethod {
    VISA
    CASH
  }

`;
