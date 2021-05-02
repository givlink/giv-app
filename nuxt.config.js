import path from "path";
import fs from "fs";

export default {
  server: {
    host: "0.0.0.0",
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "localhost.key")),
      cert: fs.readFileSync(path.resolve(__dirname, "localhost.crt"))
    }
  },
  mode: "spa",
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, maximum-scale=1"
      },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png"
      },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" }
    ]
  },
  env: {
    baseUrl: process.env.BASE_URL || "https://api.giv.link", //https://api-dev.giv.link"//" //検証
    cdn: "https://storage.googleapis.com/givlink.appspot.com" //@Todo migrate to a proper cdn
  },
  loading: { color: "#fff" },
  css: [{ src: "~/assets/sass/main.scss", lang: "scss" }],
  router: {
    middleware: "router"
  },
  plugins: [
    "~/plugins/api.js",
    "~/plugins/utils.js",
    "~/plugins/scroll.js",
    "~/plugins/pull-refresh.js",
    "~/plugins/vue-select.js",
    "~/plugins/auth.js",
    { src: "~/plugins/vue-lazyload.js", ssr: false }
  ],
  buildModules: ["@nuxtjs/tailwindcss"],
  modules: [
    "@nuxtjs/sentry",
    "bootstrap-vue/nuxt",
    "nuxt-sass-resources-loader",
    "@nuxtjs/auth",
    "@nuxtjs/axios",
    "nuxt-client-init-module",
    "vue-sweetalert2/nuxt"
  ],
  sentry: {
    dsn:
      process.env.NODE_ENV === "production"
        ? "https://f9986109c421440d877bec0ed85a899d@o516148.ingest.sentry.io/5622239"
        : "",
    config: {}
  },
  build: {
    extend(config, ctx) {}
  }
};
