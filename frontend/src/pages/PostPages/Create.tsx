import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Submit from "@/components/PostComponents/Submit";
import api from "@/utils/axiosConfig.ts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const Create: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };

  }, [preview]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title || !content || !image) {
      setMessage("Please fill all fields and select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);

    try {
      await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/posts");
    } catch (error) {
      setMessage("Error creating post.");
      console.error(error);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold tracking-tight mb-6 text-center">
        Create New Post
      </h2>

      {message && (
        <p className="text-red-500 text-center mb-4 font-medium">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content *</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post content"
            rows={5}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Image *</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="cursor-pointer"
          />
        </div>

        {preview && (
          <div className="mx-auto max-w-xs">
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
            Create Post
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Create;
