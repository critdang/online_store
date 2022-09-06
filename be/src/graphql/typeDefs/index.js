const { gql } = require('apollo-server');

// scalar UploadImg
const typeDefs = gql`
  scalar Upload
  scalar Date
  type User {
    id: ID
    fullname: String
    email: String
    isActive: Boolean
    address: String
    phone: String
    gender: String
    avatar: String
    birthday: Date
  }
  type Product {
    id: ID
    name: String
    description: String
    price: Float
    amount: Int
    productImage: [ProductImage]
    # categoryProduct: [CategoryProduct]
    category: [Category]
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
    # categoryProduct: [CategoryProduct]
    product: [Product]
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
    quantity: Int
    cartId: Int
    product: [Product]
  }

  type ProductImage {
    id: ID!
    href: String
  }
  type ProductInOrder {
    id: ID!
    orderId: Int
    productId: Int
    quantity: Int
    price: Float
    product: [Product]
  }
  type Order {
    orderId: Int
    paymentDate: String
    firstItem: Product
    totalItem: Int
    totalAmount: Int
  }
  type OrderDetail {
    paymentDate: String
    orderDate: String
    product: [ProductOrder]
    totalAmount: Int
  }
  type ProductOrder {
    name: String
    price: String
    thumbnail: String
    quantity: Int
  }

  type ProductInCart {
    cartId: Int
    productId: Int
    name: String
    price: Float
    description: String
    quantity: Int
    thumbnail: String
  }

  type Query {
    user: User!
    products(isDefault: Boolean): [Product]
    listProducts(productOrderBy: ProductOrderBy): [Product]
    productDetail(productId: ProductId):Product!
    filterProductByCategory(categoryId: CategoryId): [Product]
    productImage: [ProductImage]
    cartProduct: [CartProduct]
    listCategory(categoryId: CategoryId): Category
    getCart: [ProductInCart]
    listOrders(input: listOrdersBy): [Order]!
    orderDetail(orderId: OrderId): OrderDetail!
    listCategories(input: listCategoriesBy): [Category]
    # categories: [Category]
  }

  type Mutation {
    createUser(inputSignup: InputSignup): String!
    verify(inputToken: InputToken): String
    login(inputLogin: InputLogin): AuthDataResponse!
    changePassword(inputPassword: InputPassword): User!
    requestReset(inputRequest: InputRequest): String
    resetPassword(inputReset: InputReset): String
    editProfile( inputProfile : InputProfile): User!
    addToCart(inputProduct: InputProduct): String!
    deleteItemCart(inputItem: InputItem): String!
    changeOrderStatus(
      orderId: Int
      paymentMethod: PaymentMethod
    ): Order!
    createOrder(inputOrder: InputOrder): String!
    uploadAvatar(file: Upload!): String!
  }

  input InputItem {
    productId: Int!
  }

  input InputProduct {
    quantity:Int
    productId:Int!
  }
  
  type AuthDataResponse {
    token: String!
    userId: String!
  }
  input CategoryId {
    categoryId: Int!
  }
  input InputToken {
    token: String!
  }

  input InputReset {
    token: String
    password: String
    confirmPassword: String
  }

  input InputRequest {
    email: String
  }

  input OrderId {
    id: Int!
  }

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }
  
  input InputSignup {
    email: String
    password: String
    fullname: String
    address:String
    phone: String
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

  input CategoryId {
    categoryId:Int!
  }

  input ProductId {
    productId:Int!
  }
  input listOrdersBy {
    date: OrderType
    amount: OrderType
  }

  input ProductOrderBy {
    name: OrderType
    price: OrderType
    category: OrderType
    page: Int
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

module.exports = typeDefs;
