"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components";
import { useSession } from "next-auth/react";

interface DataItem {
  id: string;
  title: string;
  quantity: number;
  category: string;
  description: string;
  image?: string; // Optional property
}

const Home = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [userId, setUserId] = useState(session?.user.id || "");

  console.log(session);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState([]);

  const [category, setCategory] = useState("");



  
  const getAll = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/inv-item/get-all?id=${userId}&category=${category}`, {
        method: "GET",
        cache: "no-store",
      });
      const data = await response.json();
      setData(data.data);
      console.log(data.data);
    } catch (e) {
      console.log(error);
    }
    setLoading(false);
  };


  useEffect(() => {
    getAll();
  }, [category]);


  useEffect(() => {
    if (session?.user?.id) {
      setUserId(session.user.id);
    getAll();

    }
  }, [session]);


  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/inv-item/delete-item?id=${id}`, {
        method: "DELETE",
        cache: "no-store",
      });

      if (res.status === 200) {
        router.refresh();
    getAll();

      } else {
        console.log("Invalid Email or Password!");
      }
    } catch (e) {
      console.log(error);
    }
  };

  if (session?.user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24">
          <div className="max-w-[500px] mx-auto">
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
            <option value="Tools and Equipment">Packaging Materials</option>
          </select>
            </div>
          {loading ? (
            <div className="h-screen flex items-center justify-center">
              <h2 className="text-5xl">loading items!</h2>
            </div>
          ) : (
            <div className="container mx-auto p-5">
              {data !== undefined ? (
                <div>
                  {data.map((v: DataItem, i: number) => {
                    return (
                      <div
                        key={i}
                        className="p-4 border border-black flex flex-col gap-4 rounded-md mb-4"
                      >
                        <div key={i} className="flex items-center gap-4">
                          <div>
                            {v.image && (
                              <img
                                src={`/assets/${v.image}`}
                                alt=""
                                className="h-36 w-36"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <p>
                              <span className="font-bold"> Title: </span>{" "}
                              {v?.title}
                            </p>
                            <p>
                              <span className="font-bold">Quantity:</span>{" "}
                              {v?.quantity}
                            </p>
                            <p>
                              <span className="font-bold">Category:</span>{" "}
                              {v?.category}
                            </p>
                          </div>
                          <div className="flex flex-col gap-4">
                            <button  className="py-2 px-3 text-sm font-medium text-center text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:yellow-red-300"
                              onClick={() => router.push(`/edit/${v.id}`)}
                              >
                              Edit Item
                            </button>
                            <button
                              className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300"
                              onClick={() => handleDelete(v.id)}
                            >
                              Delete Item
                            </button>
                          </div>
                        </div>
                        <p className="description">
                          <span className="font-bold">Description:</span>{" "}
                          {v?.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <h1>No Items Available</h1>
              )}
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
