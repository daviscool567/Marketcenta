import { createRouter, createWebHistory } from '@ionic/vue-router';
import Home from '../views/Home.vue'

const Account = () => import("@/views/Account.vue");
const Login = () => import("@/views/Auth/Login.vue");
const Register = () => import("@/views/Auth/Register.vue");
const Wallet = () => import("@/views/Wallet.vue");
const Membership = () => import("@/views/Membership.vue");
const Refer = () => import("@/views/Refer.vue");
const Partner = () => import("@/views/Partner.vue");
const Category = () => import("@/views/Category");
const Orders = () => import("@/views/Orders.vue");
const Wishlist = () => import("@/views/Wishlist.vue");
const SingleProduct = () => import("@/views/ViewProduct.vue");
const SingleSharedProduct = () => import("@/views/ViewSharedProduct.vue");
const Cart = () => import("@/views/Cart.vue");
const ForgotPassword = () => import("@/views/Auth/ForgotPassword.vue");
const LinkSent = () => import("@/views/Auth/LinkSent.vue");
const Contact = () => import("@/views/Contact.vue");
const About = () => import("@/views/AboutIndex.vue");
const Faq = () => import("@/views/Faq.vue");








const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: "/account",
    name: "Account",
    component: Account,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/wallet",
    name: "Wallet",
    component: Wallet,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/membership",
    name: "Membership",
    component: Membership,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/refer",
    name: "Refer",
    component: Refer,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/partner",
    name: "Partner",
    component: Partner,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/contact",
    name: "Contact",
    component: Contact,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/faq",
    name: "Faq",
    component: Faq,
  },
  {
    path: "/categories/:category_name/:category_id",
    name: "ProductCategory",
    component: Category,
  },
  {
    path: "/share/product/detail/:item_id/:userid",
    name: "SingleSharedProduct",
    component: SingleSharedProduct,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/view/:product_id",
    name: "SingleProduct",
    component: SingleProduct,
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/bad_request",
    name: "NotFound",
    component:  () => import('@/views/NotFound.vue')
    
  },
  {
    path: "/orders",
    name: "Orders",
    component: Orders,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/wishlist",
    name: "Wishlist",
    component: Wishlist,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/cart",
    name: "Cart",
    component: Cart,
    meta: {
      requiresAuth: true,
    },
  },

  // Authentication Routes
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      requiresVisitor: true,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      requiresVisitor: true,
    },
  },
  {
    path: "/forgot-password",
    name: "Forgot-password",
    component: ForgotPassword,
    meta: {
      requiresVisitor: true,
    },
  },
  {
    path: "/link-sent",
    name: "LinkSent",
    component: LinkSent,
    meta: {
      requiresVisitor: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
