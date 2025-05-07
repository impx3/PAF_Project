import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/utils/axiosConfig.ts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";

interface RouteParams {
  id: string;
}

const Update: React.FC = () => {
  const { id } = useParams() as unknown as RouteParams;
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [imageURLInCase, setimageURLInCase] = useState<string>("");

  useEffect(() => {
    api
      .get(`/posts/${id}`)
      .then((response) => {
        setTitle(response.data.title);
        setContent(response.data.content);
        const imageUrl = `http://localhost:8080/images/${response.data.imageUrl.split("\\").pop()}`;
        setPreview(imageUrl);
        setimageURLInCase(response.data.imageUrl.split("\\").pop());
      })
      .catch((error) => console.error("Error fetching post:", error));
  }, [id]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);
    formData.append("imageURLinCaseUserDidnotREUPLOAD", imageURLInCase);

    try {
      const token = localStorage.getItem("token");
      await api.put(`/posts/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/posts");
    } catch (error) {
      setMessage("Error updating post.");
      console.error(error);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <Card className="p-6">
        <h2 className="text-3xl font-bold tracking-tight mb-6 text-center">
          Update Post
        </h2>

        {message && (
          <p className="text-green-500 text-center mb-4 font-medium">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Post content"
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Update Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer"
            />
          </div>

          {preview && (
            <div className="mx-auto max-w-md">
              <AspectRatio ratio={4 / 3}>
                <img
                  src={preview}
                  alt="Preview"
                  className="rounded-lg object-cover w-full h-full border"
                />
              </AspectRatio>
            </div>
          )}

          <div className="flex justify-center gap-4">
            <Button type="submit" className="w-full sm:w-auto">
              Update Post
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Update;
