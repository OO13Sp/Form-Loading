import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),

  layout("routes/auth-layout.tsx", [route("sign-up", "routes/sign-up.tsx")]),
] satisfies RouteConfig;
