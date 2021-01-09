export default function({ store, redirect }) {
  console.log("Auth middleware");
  if (!store.state.auth.loggedIn) {
    // redirect('/login');
  } else {
    redirect("/");
  }
}
