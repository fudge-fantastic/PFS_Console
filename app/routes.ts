import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("users", "routes/users/index.tsx"),
  route("users/:userId", "routes/users/$userId.tsx"),
  route("products", "routes/products/index.tsx"),
  route("products/create", "routes/products/create.tsx"),
  route("products/:productId", "routes/products/$productId.tsx"),
  route("products/:productId/edit", "routes/products/$productId.edit.tsx"),
  route("system", "routes/system/index.tsx"),
  route("system/health", "routes/system/health.tsx"),
] satisfies RouteConfig;
