package com.rayo_shop.productos.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import com.rayo_shop.productos.entity.Product;
import com.rayo_shop.productos.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/product")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    @Autowired
    private ProductService productService;

    // Endpoint para obtener todos los productos
    @GetMapping
    public List<Map<String, Object>> getAllProducts() {
        return productService.getAllProducts();
    }

    // Otro ejemplo de endpoint para obtener un producto por ID
    @GetMapping("/{id}")
    public List<Map<String, Object>> getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    // Crear un nuevo producto
    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productService.saveProduct(product);
    }
    
    // Actualizar un producto existente
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        return productService.updateProduct(id, productDetails);
    }

    // Borrar un producto
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }
}