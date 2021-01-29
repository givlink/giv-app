export default function({ store, redirect, route }) {
  store.state.user && route.name === "login" ? redirect("/") : "";
  !store.state.user && route.name !== "login" ? redirect("/login") : "";
}
