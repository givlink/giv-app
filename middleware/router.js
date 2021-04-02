export default function({ store, redirect, route }) {
  if (store.state.user && route.name === "login") {
    if (route.query.pushtoken) {
      localStorage.setItem("pushToken", route.query.pushtoken);
    }
    redirect("/");
  }

  if (!store.state.user && route.name !== "login") {
    if (route.query.pushtoken) {
      localStorage.setItem("pushToken", route.query.pushtoken);
    }
    let url = `/login`;
    redirect(url);
  }
}
