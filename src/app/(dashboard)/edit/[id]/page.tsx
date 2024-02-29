"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { ITEM_CATEGORIES, ITEM_CATEGORIES_TRANSLATE } from "@/utils";

const Home = () => {
	const router = useRouter();
	const params = useParams<{ id: string }>();
	const { id: itemId } = params;
	const { data: session } = useSession();
	const [loading, setLoading] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [error, setError] = useState("");

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [place, setPlace] = useState("");
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
			setPlace(data?.data?.place);
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
		setIsUpdating(true);
		const res = await fetch(`/api/inv-item/update-item?id=${itemId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				title: title,
				place: place,
				description: description,
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
		setIsUpdating(false);
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<h1>Ładowanie...</h1>
			</div>
		);
	}

	if (!session?.user) {
		return (
			<div className="h-screen flex items-center justify-center">
				<h2 className="text-5xl">Nieautoryzowany użytkownik</h2>
			</div>
		);
	}

	return (
		<>
			<Navbar />
			<div className="min-h-screen flex items-center justify-center">
				{data === null ? (
					<h1>Nie znaleziono podanego ID</h1>
				) : (
					<div className="container mx-auto p-5">
						<form className="max-w-[600px] mx-auto pt-12" method="PUT" onSubmit={handleUpdatetem}>
							<div className="mb-4">
								<label htmlFor="title" className="block text-gray-200 text-sm font-bold mb-2">
									Tytuł
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
								<label htmlFor="place" className="block text-gray-200 text-sm font-bold mb-2">
									Pomieszczenie
								</label>
								<textarea
									id="place"
									name="place"
									placeholder="Wpisz pomieszczenie"
									value={place}
									onChange={(e) => setPlace(e.target.value)}
									className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								></textarea>
							</div>

							<div className="mb-4">
								<label htmlFor="category" className="block text-gray-200 text-sm font-bold mb-2">
									Kategoria
								</label>
								<select
									id="category"
									name="category"
									value={category}
									onChange={(e) => setCategory(e.target.value)}
									className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								>
									<option value="">Wybierz kategorię</option>
									<option value={ITEM_CATEGORIES.furniture}>{ITEM_CATEGORIES_TRANSLATE.furniture}</option>
									<option value={ITEM_CATEGORIES.electronic}>{ITEM_CATEGORIES_TRANSLATE.electronic}</option>
									<option value={ITEM_CATEGORIES.item}>{ITEM_CATEGORIES_TRANSLATE.item}</option>
								</select>
							</div>

							<div className="flex items-center justify-between">
								<button
									type="submit"
									className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
								>
									{isUpdating ? "Ładowanie..." : "Aktualizuj"}
								</button>
							</div>
						</form>
					</div>
				)}
			</div>
		</>
	);
};

export default Home;
