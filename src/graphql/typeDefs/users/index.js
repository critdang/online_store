const {gql} = require('apollo-server');

module.exports = gql`
  type User {
    id: ID
    fullname: String
    email: String
    is_active: Boolean
    address: String
    phone: String
    gender: String
  }
  type Product {
    id: ID
    name: String
    description: String
    price: Int
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
    user(id: ID!): User!
    listProducts(input: ProductOrderBy): [Product]
    productImage: [ProductImage]
    cartProduct: [CartProduct]
    listCategory(id: ID!): Category
    getCart: Cart!
    listAllOrders: Order!
    getListItemInCart: Cart!
    listCategories(input: listCategoriesBy): [Category]
  }

  type Mutation {
    createUser(
      email: String!
      password: String!
    ): User!
    login(
      email: String!
      password: String!
    ):AuthDataResponse!
    changePassword(
      email: String!
      oldPassword: String!
      newPassword: String!
    ): User!
    editProfile(
      fullname: String
      address: String
      phone: String
      gender: String
    ):User!
    addToCart(quantity:Int,productId:Int)
    : Cart!
    deleteItemCart(deleteItem: Int)
    : Cart!
    productDetail(productId:Int)
    :Product!
    changeOrderStatus(
      orderId: Int
      payment: String
    ): Order!
    createOrder(
      payment: String
      cartId: Int
    ): Order!
  }


  type AuthDataResponse {
    token: String!
    userId: String!
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

`