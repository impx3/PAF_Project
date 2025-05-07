import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Create New Content
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-xl font-semibold">Text Post</h2>
            <Link to="/post/text" className="w-full">
              <Button variant="outline" className="w-full">
                Create text post
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-xl font-semibold">Single Image Post</h2>
            <Link to="/post/create" className="w-full">
              <Button variant="outline" className="w-full">
                Create 1 post
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-xl font-semibold">Multi-Image Post</h2>
            <Link to="/post/CreateWithMultipleImages" className="w-full">
              <Button variant="outline" className="w-full">
                Create with many photos
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-xl font-semibold">Video Content</h2>
            <Link to="/post/createvid" className="w-full">
              <Button variant="outline" className="w-full">
                Create video
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;
