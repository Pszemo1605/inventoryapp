"use client"
import { useEffect, useState } from 'react';
import db from '../../lib/prisma';

interface Product {
  id: number;
  title: string;
}

// async function getProducts(): Promise<Product[]> {
//   const products = await db.product.findMany();
//   return products;
// }

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  // useEffect(() => {
  //   async function fetchProducts() {
  //     const products = await getProducts();
  //     setProducts(products);
  //   }
  //   fetchProducts();
  // }, []);

  console.log({ products });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* Render your products here */}
    </main>
  );
}
