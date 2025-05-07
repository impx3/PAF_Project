import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/utils/axiosConfig.ts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Delete = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleDelete = async () => {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this post?",
      );

      if (!confirmDelete) {
        navigate("/posts");
        return;
      }

      try {
        await api.delete(`/posts/${id}`);
        navigate("/posts");
      } catch (err) {
        setError("Failed to delete post. Please try again.");
        console.error(err);
      } finally {
        setIsDeleting(false);
      }
    };

    handleDelete();
  }, [id, navigate]);

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <Card className="p-6 text-center">
        {isDeleting ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-lg font-medium">Deleting post...</p>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <p className="text-red-500 font-medium">{error}</p>
            <Button onClick={() => navigate("/posts")}>Back to Posts</Button>
          </div>
        ) : null}
      </Card>
    </div>
  );
};

export default Delete;
