import Card from "react-bootstrap/Card";
import { PostType } from "../../types.ts";
import axios from "axios";
import { useQueryClient } from "react-query";
import { useState } from "react";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

export default function PostCard({ post }: { post: PostType }) {
  const queryClient = useQueryClient();
  const [editable, setEditable] = useState(false);

  const [editableTitle, setEditableTitle] = useState(post.title);
  const [editableContent, setEditableContent] = useState(post.content);

  return (
    <Card style={{ width: "25%", margin: "3rem", display: "inline-block" }}>
      <Card.Body>
        <Card.Title>
          {!editable ? (
            post.title
          ) : (
            <FormControl
              value={editableTitle}
              onChange={(e) => {
                setEditableTitle(e.target.value);
              }}
            />
          )}
        </Card.Title>
        <Card.Text>
          {!editable ? (
            post.content
          ) : (
            <FormControl
              as={"textarea"}
              value={editableContent}
              onChange={(e) => {
                setEditableContent(e.target.value);
              }}
            />
          )}
        </Card.Text>
        {editable ? (
          <div className="mb-3">
            <Button
              className="btn-sm me-1"
              onClick={() => {
                axios
                  .put(`http://localhost:8080/api/posts/${post.id}`, {
                    title: editableTitle,
                    content: editableContent,
                  })
                  .then((response) => {
                    console.log(response);
                    setEditable(false);
                    queryClient.invalidateQueries("postData");
                  })
                  .catch((error) => {
                    alert("Something went wrong...");
                    console.log(error);
                  });
              }}
            >
              Submit
            </Button>
            <Button
              className="btn-sm ms-2"
              variant="outline-secondary"
              onClick={() => {
                setEditable(false);
                setEditableTitle(post.title);
                setEditableContent(post.content);
              }}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <a
            style={{ display: "block", color: "#3c67ff", cursor: "pointer" }}
            onClick={() => setEditable(true)}
          >
            Edit
          </a>
        )}

        <a
          style={{ color: "red", cursor: "pointer", display: "block" }}
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
