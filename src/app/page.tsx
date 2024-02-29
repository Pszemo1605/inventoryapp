"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components";
import { useSession } from "next-auth/react";
import { Item } from "@prisma/client";
import { ItemTable } from "@/components/item-table";
import { ItemRow } from "@/components/item-row";
import { useDebouncedCallback } from "use-debounce";
import { translateQuery } from "@/utils";

const Home = () => {
	const router = useRouter();
	const { data: session } = useSession();

	const [loading, setLoading] = useState(false);
	const [items, setItems] = useState<Item[]>([]);

	const [query, setQuery] = useState("");
	const [queryError, setQueryError] = useState("");

	const debouncedGetAll = useDebouncedCallback(async () => {
		try {
			const response = await fetch(`/api/inv-item/get-all?query=${translateQuery(query)}`, {
				method: "GET",
				cache: "no-store",
			});

			const body = await response.json();

			if (!response.ok) throw new Error(body?.message);

			setQueryError("");
			setItems(body.data);
		} catch (e) {
			if (e instanceof Error) {
				setQueryError(e.message);
			}
		}
	}, 400);

	const getAll = async () => {
		try {
			setLoading(true);
			const response = await fetch("/api/inv-item/get-all", {
				method: "GET",
				cache: "no-store",
			});

			const items = await response.json();
			setItems(items.data);
		} catch (e) {
			console.log(e);
		}
		setLoading(false);
	};

	useEffect(() => {
		if (session?.user?.id) {
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
			console.log(e);
		}
	};

	const handleEdit = (id: string) => {
		router.push(`/edit/${id}`);
	};

	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value);

		debouncedGetAll();
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
			<div className="min-h-screen pt-24 w-3/4 mx-auto">
				<div className="max-w-[500px] mx-auto mb-10">
					<span>{queryError}</span>
					<input
						name="search"
						type="text"
						placeholder="Wyszukaj"
						className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						value={query}
						onChange={handleSearch}
					/>
				</div>
				{loading ? (
					<div className="h-screen flex items-center justify-center">
						<h2 className="text-5xl">loading items!</h2>
					</div>
				) : (
					<ItemTable>
						{items === undefined && (
							<tr>
								<th scope="row">Brak dostępnych przedmiotów</th>
							</tr>
						)}
						{items !== undefined &&
							items.map((item) => <ItemRow key={item.id} item={item} onDelete={handleDelete} onEdit={handleEdit} />)}
					</ItemTable>
				)}
			</div>
		</>
	);
};

export default Home;
