import { ITEM_CATEGORIES, ITEM_CATEGORIES_TRANSLATE } from "@/utils";
import type { Item } from "@prisma/client";
import Image from "next/image";

interface ItemRowProps {
	item: Item;
	onDelete: (id: string) => Promise<void>;
	onEdit: (id: string) => void;
}

export const ItemRow = ({ item, onDelete, onEdit }: ItemRowProps) => {
	return (
		<tr className="odd:bg-slate-800 even:bg-slate-900 hover:bg-slate-600">
			<td className="px-4 py-1 max-w-24">
				<Image
					src={`/assets/${item.image}`}
					alt="zdjęcie przedmiotu"
					className="text-sm aspect-square max-w-full text-center"
					width={96}
					height={96}
				/>
			</td>
			<td className="text-left px-4 py-1">{item.title}</td>
			<th className="text-left px-4 py-1">
				<span>{item.id}</span>
			</th>
			<td className="text-left px-4 py-1">
				{ITEM_CATEGORIES_TRANSLATE[item.category as keyof typeof ITEM_CATEGORIES] ?? "niepoprawna kategoria"}
			</td>
			<td className="text-left px-4 py-1">{item.place}</td>
			<td className="text-left px-4 py-1">{new Date(item.createdAt as unknown as string).toLocaleDateString()}</td>
			<td className="text-left px-4 py-1">
				{item.replacementDate ? new Date(item.replacementDate as unknown as string).toLocaleDateString() : ""}
			</td>
			<td className="text-left px-4 py-1">
				<div className="flex gap-1">
					<button
						className="py-2 px-3 text-sm font-medium text-center text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:yellow-red-300"
						onClick={() => onEdit(item.id)}
					>
						Edytuj
					</button>
					<button
						className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300"
						onClick={() => onDelete(item.id)}
					>
						Usuń
					</button>
				</div>
			</td>
		</tr>
	);
};
