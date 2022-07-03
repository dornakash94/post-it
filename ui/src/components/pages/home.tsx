//import { api } from "../../gateway/post-it";

function Home() {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const token = localStorage.getItem("token")!;

  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set("Authorization", token);

  //api.posts.getAllPosts({}, { headers: requestHeaders });
  return <div>hi</div>;
  //TODO -> if not login redirect to index
}

export default Home;
