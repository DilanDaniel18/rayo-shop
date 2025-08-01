"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Definimos la estructura de un producto
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

        // Mantenemos la protección para manejar respuestas de API flexibles
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && typeof data === 'object') {
          setProducts([data]);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error al cargar los productos:", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  // --- 1. LÓGICA COMPLETA PARA ELIMINAR UN PRODUCTO ---
  const deleteProduct = async (id: number) => {
    // Pedimos confirmación al usuario para evitar borrados accidentales
    const isConfirmed = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
    if (!isConfirmed) {
      return; // Si el usuario dice "Cancelar", no hacemos nada
    }

    try {
      // Hacemos la petición a la API con el método DELETE
      const response = await fetch(`http://localhost:8080/api/product/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        // Si el servidor responde con un error, lo lanzamos
        throw new Error('No se pudo eliminar el producto en el servidor.');
      }

      // Si la eliminación en el backend fue exitosa, actualizamos la UI
      // quitando el producto de nuestra lista local.
      setProducts(currentProducts => currentProducts.filter(product => product.id !== id));
      
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      alert("Ocurrió un error al intentar eliminar el producto.");
    }
  };

  return (
    <div className="overflow-x-auto bg-gray-900 rounded-lg shadow-lg">
      <table className="min-w-full text-sm text-left text-gray-400">
        <thead className="text-xs text-gray-300 uppercase bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3">ID</th>
            <th scope="col" className="px-6 py-3">Nombre</th>
            <th scope="col" className="px-6 py-3">Precio</th>
            <th scope="col" className="px-6 py-3">Stock</th>
            <th scope="col" className="px-6 py-3">Categoría</th>
            <th scope="col" className="px-6 py-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="bg-gray-900 border-b border-gray-800 hover:bg-gray-800">
              <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{product.id}</td>
              <td className="px-6 py-4">{product.name}</td>
              <td className="px-6 py-4">${product.price ? product.price.toFixed(2) : 'N/A'}</td>
              <td className="px-6 py-4">{product.stock}</td>
              <td className="px-6 py-4">{product.categoryName}</td>
              
              {/* --- 2. BOTONES DE ACCIÓN EN LA TABLA --- */}
              <td className="px-6 py-4 text-center">
                <div className="flex items-center justify-center gap-4">

                  {/* Botón de Editar: Navega a la página del formulario */}
                  <Link href={`/products/edit/${product.id}`} passHref>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-md text-xs transition-colors">
                      Editar
                    </button>
                  </Link>

                  {/* Botón de Eliminar: Llama a la función deleteProduct */}
                  <button 
                    onClick={() => deleteProduct(product.id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md text-xs transition-colors"
                  >
                    Eliminar
                  </button>

                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          <p>No hay productos para mostrar. ¡Añade uno nuevo!</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;