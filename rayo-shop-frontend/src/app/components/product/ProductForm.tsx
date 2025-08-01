"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';

// 1. Definimos la estructura de datos del formulario, incluyendo la descripción
interface ProductFormData {
  name: string;
  description: string;
  price: number | string;
  stock: number | string;
  categoryId: number | string;
}

const ProductForm = () => {
  const router = useRouter();
  const params = useParams();

  // 2. Estado inicial del formulario. Todos los campos como strings vacíos.
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const productId = params.id;
  const isEditing = Boolean(productId);

  // 3. Efecto para cargar los datos del producto si estamos en modo edición
  useEffect(() => {
    if (isEditing) {
      const fetchProductData = async () => {
        try {
          const res = await fetch(`http://localhost:8080/api/product/${productId}`);
          if (!res.ok) throw new Error("Producto no encontrado");
          
          const product = await res.json();
          
          // Rellenamos el formulario asegurándonos de que ningún campo sea null
          setFormData({
            name: product.name || '',
            description: product.description || '',
            price: product.price || '',
            stock: product.stock || '',
            categoryId: product.category?.id || ''
          });
        } catch (err) {
          setError('No se pudieron cargar los datos del producto.');
          console.error(err);
        }
      };
      fetchProductData();
    }
  }, [isEditing, productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null); // Limpiamos errores anteriores

    // --- IDEA IMPLEMENTADA 1: Validación Frontend ---
    // Verificamos que ningún campo esté vacío antes de enviar
    for (const key in formData) {
      if (formData[key as keyof ProductFormData] === '') {
        setError(`El campo '${key}' no puede estar vacío.`);
        return;
      }
    }
    
    setIsSubmitting(true);

    const url = isEditing
      ? `http://localhost:8080/api/product/${productId}`
      : `http://localhost:8080/api/product`;

    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(String(formData.price)),
          stock: parseInt(String(formData.stock), 10),
          categoryId: parseInt(String(formData.categoryId), 10)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ocurrió un error en el servidor.');
      }

      // Si todo sale bien, redirigimos y refrescamos los datos de la página anterior
      router.push('/');
      router.refresh();

    } catch (err) {
      setError(err instanceof Error ? err.message : "Un error inesperado ocurrió.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 border rounded-lg shadow-2xl bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-white text-center">
        {isEditing ? 'Editar Producto' : 'Crear Nuevo Producto'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Campo Nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nombre</label>
          <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required
                 className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>

        {/* --- IDEA IMPLEMENTADA 2: Campo de Descripción con `textarea` --- */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300">Descripción</label>
          <textarea id="description" name="description" rows={4} value={formData.description} onChange={handleChange} required
                    className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>

        {/* Contenedor para Precio y Stock en la misma fila */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Campo Precio */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-300">Precio</label>
            <input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required
                   className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          {/* Campo Stock */}
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-300">Existencias (Stock)</label>
            <input id="stock" name="stock" type="number" value={formData.stock} onChange={handleChange} required
                   className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>
        
        {/* Campo Categoría ID */}
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-300">ID de Categoría</label>
          <input id="categoryId" name="categoryId" type="number" value={formData.categoryId} onChange={handleChange} required
                 className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>

        {/* --- IDEA IMPLEMENTADA 3: Muestra de Errores --- */}
        {error && (
          <div className="p-3 bg-red-800 border border-red-600 text-red-200 rounded-md">
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}

        {/* Botón de envío */}
        <button type="submit" disabled={isSubmitting}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold disabled:bg-gray-500 disabled:cursor-not-allowed transition-all">
          {isSubmitting ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Producto')}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;