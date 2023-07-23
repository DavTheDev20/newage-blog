import Card from "react-bootstrap/Card";
import { PostType } from "../../types.ts";
import axios from "axios";
import { useQueryClient } from "react-query";

export default function PostCard({ post }: { post: PostType }) {
  const queryClient = useQueryClient();

  return (
    <Card style={{ width: "25%", margin: "3rem", display: "inline-block" }}>
      <Card.Body>
        <Card.Title>{post.title}</Card.Title>
        <Card.Text>{post.content}</Card.Text>
        <a
          style={{ color: "red", cursor: "pointer" }}
          onClick={async () => {
            axios
              .delete(`http://localhost:8080/api/posts/${post.id}`)
              .then(() => {
                queryClient.invalidateQueries("postData");
              })
              .catch((error) => {
                alert("Something went wrong...");
                console.log(error);
              });
          }}
        >
          Delete
        </a>
      </Card.Body>
      <Card.Footer>
        <Card.Text>
          Created On: {new Date(post.createdAt).toLocaleDateString()}
        </Card.Text>
      </Card.Footer>
    </Card>
  );
}
