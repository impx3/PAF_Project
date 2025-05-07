import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const CreateWithMultipleImages: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).slice(0, 3);
    const fileArray = files as File[];
    setImages(fileArray);
    setPreviews(fileArray.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    images.forEach((img) => formData.append("images", img));

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8080/api/posts/multi", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/post/posts");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold tracking-tight mb-6 text-center">
        Create Post with Multiple Images
      </h2>

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
          <Label htmlFor="images">Images (Max 3) *</Label>
          <Input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="cursor-pointer"
          />
        </div>

        {previews.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {previews.map((src, idx) => (
              <div key={idx} className="relative">
                <AspectRatio ratio={1}>
                  <img
                    src={src}
                    alt={`Preview ${idx}`}
                    className="rounded-lg object-cover w-full h-full border"
                  />
                </AspectRatio>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center">
          <Button type="submit" className="w-full sm:w-auto">
            Create Post
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateWithMultipleImages;
