import { ReactNode } from "react";

interface ItemTableProps {
	children: ReactNode;
}

export const ItemTable = ({ children }: ItemTableProps) => {
	return (
		<div className="max-w-full overflow-x-auto">
			<table className="border-collapse bg-gray-400 w-full text-sm">
				<thead className="bg-slate-700">
					<tr>
						<th scope="col" className="text-left px-4 py-2">
							Obraz
						</th>
						<th scope="col" className="text-left px-4 py-2">
							Nazwa
						</th>
						<th scope="col" className="text-left px-4 py-2">
							Numer ID
						</th>
						<th scope="col" className="text-left px-4 py-2">
							Kategoria
						</th>
						<th scope="col" className="text-left px-4 py-2">
							Pomieszczenie
						</th>
						<th scope="col" className="text-left px-4 py-2">
							Data dodania
						</th>
						<th scope="col" className="text-left px-4 py-2">
							Data wymiany
						</th>
						<th scope="col" className="text-left px-4 py-2">
							Edycja / Usuń
						</th>
					</tr>
				</thead>
				<tbody>
					{children}
				</tbody>
			</table>
		</div>
	);
};
