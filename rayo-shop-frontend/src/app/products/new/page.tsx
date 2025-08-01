import ProductForm from '@/app/components/product/ProductForm';

// Esta página se mostrará en la URL /products/new
const NewProductPage = () => {
  return (
    // Renderizamos el componente del formulario que ya creamos
    <ProductForm />
  );
};

export default NewProductPage;