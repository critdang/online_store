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
    product: Product!

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
    product: Product
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
    products(is_default: Boolean): [Product]
    listProducts(input: ProductOrderBy): [Product]
    productDetail(productId: ProductId):Product!
    productImage: [ProductImage]
    cartProduct: [CartProduct]
    listCategory(id: ID!): Category
    getCart: Cart!
    listAllOrders: Order!
    getListItemInCart: Cart!
    listCategories(input: listCategoriesBy): [Category]
  }

  type Mutation {
    createUser(inputSignup: InputSignup): User!
    login(inputLogin: InputLogin): AuthDataResponse!
    changePassword(inputPassword: InputPassword): User!
    editProfile( inputProfile : InputProfile): User!
    addToCart(quantity:Int,productId:Int): Cart!
    deleteItemCart(deleteItem: Int): Cart!
    changeOrderStatus(
      orderId: Int
      payment: String
    ): Order!
    createOrder(
      payment: String
      cartId: Int
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
    category: String
  }

  enum OrderType {
    asc
    desc
  }

  input listCategoriesBy {
    name: CategoryType
    amount: CategoryType
  }

  enum CategoryType {
    asc
    desc
  }


  enum OrderStatus {
    pending
    success
  }

`;
