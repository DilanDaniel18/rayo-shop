"use client";

import { useEffect, useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  categoryName: string;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/product');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const deleteProduct = async (id: number) => {
    const isConfirmed = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
    if (!isConfirmed) return;

    try {
      await fetch(`http://localhost:8080/api/product/${id}`, {
        method: 'DELETE',
      });
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

return (
  <div className="p-4">
    <h2 className="text-2xl font-bold mb-4">Productos</h2>
    <table className="min-w-full bg-black border border-gray-500">
      <thead>
        <tr style={{ backgroundColor: '#3f4649ff', color: '#ffffff' }} className="border-b">
          <th className="py-2 px-4 text-left">ID</th>
          <th className="py-2 px-4 text-left">Nombre</th>
          <th className="py-2 px-4 text-left">Precio</th>
          <th className="py-2 px-4 text-left">Stock</th>
          <th className="py-2 px-4 text-left">Categoría</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id} className="border-b hover:bg-gray-500">
            <td className="py-2 px-4">{product.id}</td>
            <td className="py-2 px-4">{product.name}</td>
            <td className="py-2 px-4">{product.price}</td>
            <td className="py-2 px-4">{product.stock}</td>
            <td className="py-2 px-4">{product.categoryName}</td>
            <td className="py-2 px-4">
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
};

export default ProductList;