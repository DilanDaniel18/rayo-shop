package com.rayo_shop.productos.service;

import com.rayo_shop.productos.entity.Product;
import com.rayo_shop.productos.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // Obtener todos los productos
    public List<Map<String, Object>> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream().map(product -> {
            Map<String, Object> productMap = new HashMap<>();
            productMap.put("id", product.getId());
            productMap.put("name", product.getName());
            productMap.put("description", product.getDescription());
            productMap.put("price", product.getPrice());
            productMap.put("stock", product.getStock());
            productMap.put("categoryName", product.getCategory().getName());
            return productMap;
        }).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getProductById(Long id) {
        Product product = productRepository.findById(id).orElse(null);
        if (product != null) {
            Map<String, Object> productMap = new HashMap<>();
            productMap.put("id", product.getId());
            productMap.put("name", product.getName());
            productMap.put("description", product.getDescription());
            productMap.put("price", product.getPrice());
            productMap.put("stock", product.getStock());
            productMap.put("categoryName", product.getCategory().getName());
            return List.of(productMap);
        }
        return List.of();
    }

    // Crear un nuevo producto
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    // Actualizar un producto existente
    public Product updateProduct(Long id, Product productDetails) {
        Product product = productRepository.findById(id).orElse(null);
        if (product != null) {
            product.setName(productDetails.getName());
            product.setDescription(productDetails.getDescription());
            product.setPrice(productDetails.getPrice());
            product.setStock(productDetails.getStock());
            product.setCategory(productDetails.getCategory());
            return productRepository.save(product);
        }
        return null;
    }

    // Borrar un producto
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}