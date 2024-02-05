"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components";
import { useSession } from "next-auth/react";

const Home = () => {
  const router = useRouter();
  const { data: session } = useSession();
  console.log(session);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [selectedFile, setSelectedFile] = useState<File>();

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length === 0) {
      return; // User canceled file selection
    }

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    fetch("/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setImage(data.filename);
      })
      .catch((error) => console.error(error));
  }

  const handleCreateItem = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/inv-item/add-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        description: description,
        quantity: quantity,
        image: image,
        category: category,
        authorId: session?.user.id,
      }),
    });

    if (res?.status === 200) {
      window.location.href = "/";
      router.refresh();
      console.log(res);
    } else {
      if (res?.status === 401) {
        setError("Invalid Email or Password!");
      }
    }

    setLoading(false);
  };

  if (session?.user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="container mx-auto p-5">
            <form
              className="max-w-[600px] mx-auto pt-12"
              method="POST"
              onSubmit={handleCreateItem}
            >
              <div className="mb-4">
                <label
                  htmlFor="image"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  placeholder="Enter image URL"
                  onChange={handleFileUpload}
                  className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                {image && (
                  <img
                    src={`/assets/${image}`}
                    alt=""
                    className=" max-h-64 w-full"
                  />
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                ></textarea>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="quantity"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="category"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Select a category</option>
                  <option value="furniture">furniture</option>
            <option value="electronic">electronic</option>
            <option value="item">item</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {loading ? "Loading..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <div className="h-screen flex items-center justify-center">
        <h2 className="text-5xl">Unauthorized User</h2>
      </div>
    );
  }
};

export default Home;
