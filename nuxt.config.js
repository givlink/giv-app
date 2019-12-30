export default {
  mode: "spa",
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  env: {
    baseUrl: process.env.BASE_URL || "https://api.giv.link" //検証　"https://api-dev.giv.link"
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: [{ src: "~/assets/sass/main.scss", lang: "scss" }],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    "bootstrap-vue/nuxt",
    "nuxt-sass-resources-loader",
    "@nuxtjs/auth",
    "@nuxtjs/axios",
    'nuxt-client-init-module'
  ],
  auth: {
    //検証
    // strategies: {
    //   auth0: {
    //     domain: "giv-dev.auth0.com", // 追加
    //     client_id: "VGa2SVojtmq50NiC5I2rpV4XALrAkZql", // 追加
    //     audience: "https://giv-dev.auth0.com/api/v2/",
    //     scope: ["openid", "profile", "email"],
    //     response_type: "id_token token",
    //     token_key: "access_token"
    //   }
    // },
    strategies: {
      auth0: {
        domain: "givlink.auth0.com", // 追加
        client_id: "GTr5NAD6xw9lRF4F72iJ0g9HkjqIWvCu", // 追加
        audience: "https://givlink.auth0.com/api/v2/",
        scope: ["openid", "profile", "email"],
        response_type: "id_token token",
        token_key: "access_token"
      }
    },
    redirect: {
      // login: "/invite", // 未ログイン時のリダイレクト先
      logout: "/login", // ログアウト処理を実行した直後のリダイレクト先
      callback: "/callback", // コールバックURL
      home: "/regist" // ログイン後に遷移するページ
    }
  },
  // auth: {
  //   redirect: {
  //     login: '/invite',  // 未ログイン時のリダイレクト先
  //     callback: '/callback',  // コールバックURL（各プロバイダで設定したものと同じPathにする）
  //     home: '/regist',         // ログイン後のリダイレクトURL
  //   },
  //   strategies: {
  //     facebook: {
  //       client_id: '415902109120496',
  //       userinfo_endpoint: 'https://graph.facebook.com/v2.12/me?fields=about,name,picture{url},email,birthday',
  //       scope: ['public_profile', 'email', 'user_birthday']
  //     },
  //   }
  //
  // },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
};
