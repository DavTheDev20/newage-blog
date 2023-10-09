import "bootstrap/dist/css/bootstrap.min.css";
import PostCard from "./components/PostCard";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { PostType } from "../types";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useRef } from "react";

export default function App() {
  const queryClient = useQueryClient();
  const formRef = useRef(HTMLFormElement);

  async function getPosts() {
    const response = await fetch("http://localhost:8080/api/posts");
    const data = await response.json();
    return data.posts as Array<PostType>;
  }

  const { isLoading, error, data } = useQuery("postData", getPosts);
  const mutation = useMutation({
    mutationFn: (newPost) => {
      return axios.post("http://localhost:8080/api/posts", newPost);
    },
    onSuccess: () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      formRef.current["title"].value = "";
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      formRef.current["content"].value = "";
      queryClient.invalidateQueries("postData");
    },
    onError: (error) => {
      alert("Something went wrong");
      console.log(error);
    },
  });

  return (
    <div>
      <nav
        style={{
          backgroundColor: "gray",
          height: "5vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: "1.5rem" }}>Newage Blog</h1>
      </nav>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate({
            title: formRef.current["title"].value,
            content: formRef.current["content"].value,
          });
        }}
        ref={formRef}
      >
        <InputGroup className="w-25 mx-5 mt-5">
          <InputGroup.Text>Post Title</InputGroup.Text>
          <FormControl name="title" />
        </InputGroup>

        <InputGroup className="w-25 mx-5 mt-3">
          <FloatingLabel
            controlId="floatingTextarea"
            label="Content"
            className="mb-3"
          >
            <FormControl
              as={"textarea"}
              style={{ height: "150px" }}
              name="content"
            />
          </FloatingLabel>
        </InputGroup>

        <Button className="mx-5" type="submit">
          Submit
        </Button>
      </form>

      <hr />

      {isLoading ? "Loading..." : null}

      {error ? "ERROR" : null}

      {data?.length == 0 ? (
        <div>
          <h3 className="mx-5">No posts, add a new post above!</h3>
        </div>
      ) : (
        data
          ?.map((post) => {
            return <PostCard key={post.id} post={post} />;
          })
          .reverse()
      )}
    </div>
  );
}
