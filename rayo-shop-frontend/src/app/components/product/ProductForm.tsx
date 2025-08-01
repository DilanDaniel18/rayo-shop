"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';

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

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const productId = params.id;
  const isEditing = Boolean(productId);

  // Debugging log 1: Check component's understanding of its state.
  console.log('Component loaded. Product ID:', productId, 'Is Editing:', isEditing);

  useEffect(() => {
    const fetchData = async () => {
      // In creation mode, there's no data to fetch initially.
      if (!isEditing) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Debugging log 2: Confirm useEffect is running for editing.
        console.log('useEffect triggered for editing. Fetching product with ID:', productId);

        const url = `http://localhost:8080/api/product/${productId}`;
        const productRes = await fetch(url);
        
        // Debugging log 3: Inspect the raw API response.
        console.log('API Response object:', productRes);

        if (!productRes.ok) {
          throw new Error(`Failed to fetch product data (Status: ${productRes.status})`);
        }
        
        const product = await productRes.json();

        // Debugging log 4: Inspect the final data structure. This is the most important log.
        console.log('Product data received (JSON):', product);

        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price || '',
          stock: product.stock || '',
          categoryId: product.category?.id || ''
        });
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred while loading data.';
        setError(errorMessage);
        console.error('Error in fetchData:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [isEditing, productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.description || formData.price === '' || formData.stock === '' || formData.categoryId === '') {
      setError(`All fields are required.`);
      return;
    }
    
    setIsSubmitting(true);

    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(String(formData.price)),
      stock: parseInt(String(formData.stock), 10),
      category: {
        id: parseInt(String(formData.categoryId), 10)
      }
    };

    const url = isEditing
      ? `http://localhost:8080/api/product/${productId}`
      : `http://localhost:8080/api/product`;

    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Server error occurred.');
      }

      router.push('/');
      router.refresh();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <p className="text-center text-white mt-10">Loading...</p>
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 border rounded-lg shadow-2xl bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-white text-center">
        {isEditing ? 'Editar Producto' : 'Crear Nuevo Producto'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nombre</label>
          <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required
                 className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300">Descripción</label>
          <textarea id="description" name="description" rows={4} value={formData.description} onChange={handleChange} required
                    className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-300">Precio</label>
            <input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required
                   className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-300">Existencias (Stock)</label>
            <input id="stock" name="stock" type="number" value={formData.stock} onChange={handleChange} required
                   className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>
        
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-300">ID de Categoría</label>
          <input id="categoryId" name="categoryId" type="number" value={formData.categoryId} onChange={handleChange} required
                 className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>

        {error && (
          <div className="p-3 bg-red-800 border border-red-600 text-red-200 rounded-md">
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}

        <button type="submit" disabled={isSubmitting || isLoading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold disabled:bg-gray-500 disabled:cursor-not-allowed transition-all">
          {isSubmitting ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Producto')}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;