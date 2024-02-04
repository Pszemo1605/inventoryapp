"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

const Home = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { id: itemId } = params;
  console.log(itemId);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");

  const [data, setData] = useState(null);

  const getSingle = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/inv-item/get-single?id=${itemId}`, {
        method: "GET",
        cache: "no-store",
      });
      const data = await response.json();
      setData(data.data);
      console.log(data.data);
      setTitle(data?.data?.title);
      setDescription(data?.data?.description);
      setQuantity(data?.data?.quantity);
      setCategory(data?.data?.category);
    } catch (e) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getSingle();
  }, []);

  const handleUpdatetem = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsUpdating(true)
    const res = await fetch(`/api/inv-item/update-item?id=${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        description: description,
        quantity: quantity,
        category: category,
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
    setIsUpdating(false)

  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1>Loading...</h1>
      </div>
    );
  }

  if (session?.user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          {data === null ? (
            <h1>Invalid Id didn't found!</h1>
          ) : (
            <div className="container mx-auto p-5">
              <form
                className="max-w-[600px] mx-auto pt-12"
                method="PUT"
                onSubmit={handleUpdatetem}
              >
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
                    rows={5}
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
                    <option value="Raw Materials">Raw Materials</option>
                    <option value="Finished Goods">Finished Goods</option>
                    <option value="Tools and Equipment">
                      Packaging Materials
                    </option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    {isUpdating ? "Loading..." : "Update"}
                  </button>
                </div>
              </form>
            </div>
          )}
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
