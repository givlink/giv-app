export default function({ store, redirect, route }) {
  if (store.state.user && route.name === "login") {
    if (route.query && route.query.next) {
      let url = route.query.next;
      if (!!route.hash) {
        url += route.hash;
      }
      redirect(url);
    } else {
      redirect("/");
    }
  }

  if (!store.state.user && route.name !== "login") {
    let url = `/login?next=${route.path}`;
    if (!!route.hash) {
      url += route.hash;
    }
    redirect(url);
  }
}
