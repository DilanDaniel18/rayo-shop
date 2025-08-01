import ProductForm from '@/app/components/product/ProductForm';

// Esta página se mostrará en la URL /products/edit/[id]
const EditProductPage = () => {
  return (
    // Reutilizamos el mismo componente. ¡Él sabrá qué hacer!
    <ProductForm />
  );
};

export default EditProductPage;