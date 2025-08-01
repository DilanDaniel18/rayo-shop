import Link from 'next/link'; // Importante para la navegación
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProductList from './components/product/ProductList';

const HomePage = () => {
  return (
    <>
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        
        {/* Encabezado de la sección de productos */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">
            Inventario de Productos
          </h1>
          
          {/* ---- ¡AQUÍ ESTÁ TU BOTÓN! ---- */}
          <Link href="/products/new" passHref>
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
              + Añadir Producto
            </button>
          </Link>
        </div>

        {/* La tabla de productos se renderiza aquí abajo */}
        <ProductList />

      </main>
      <Footer />
    </>
  );
};

export default HomePage;