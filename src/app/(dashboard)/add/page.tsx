"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components";
import { useSession } from "next-auth/react";
import { ITEM_CATEGORIES, ITEM_CATEGORIES_TRANSLATE } from "@/utils";

const Home = () => {
	const router = useRouter();
	const { data: session } = useSession();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [place, setPlace] = useState("");
	const [category, setCategory] = useState("");
	const [image, setImage] = useState("");
	const [uploading, setUploading] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
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
				place: place,
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
				setError("Zły email lub hasło!");
			}
		}

		setLoading(false);
	};

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
				<div className="container mx-auto p-5">
					<form className="max-w-[600px] mx-auto pt-12" method="POST" onSubmit={handleCreateItem}>
						<div className="mb-4">
							<label htmlFor="image" className="block text-gray-200 text-sm font-bold mb-2">
								Zdjęcie
							</label>
							<input
								type="file"
								id="image"
								name="image"
								onChange={handleFileUpload}
								className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							/>
						</div>
						<div className="mb-4">{image && <img src={`/assets/${image}`} alt="" className=" max-h-64 w-full" />}</div>
						<div className="mb-4">
							<label htmlFor="title" className="block text-gray-200 text-sm font-bold mb-2">
								Tytuł
							</label>
							<input
								type="text"
								id="title"
								name="title"
								placeholder="Podaj tytuł"
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
								{loading ? "Ładowanie..." : "Zapisz"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

export default Home;
