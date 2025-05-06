import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      Home
      <br />
      <Link to="/post/text">
        <button style={{ marginTop: "20px" }}>Create text post</button>
      </Link>
      <br />
      <Link to="/post/create">
        <button style={{ marginTop: "20px" }}>Create 1 post</button>
      </Link>
      <br />
      <Link to="/post/CreateWithMultipleImages">
        <button style={{ marginTop: "20px" }}>
          Create 1 post with many photos
        </button>
      </Link>
      <br />
      <Link to="/post/createvid">
        <button style={{ marginTop: "20px" }}>Create video</button>
      </Link>
    </div>
  );
};

export default Home;
