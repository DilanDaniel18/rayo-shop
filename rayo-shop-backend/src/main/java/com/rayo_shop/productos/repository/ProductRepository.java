package com.rayo_shop.productos.repository;

import com.rayo_shop.productos.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Encuentra productos por nombre
    List<Product> findByName(String name);
    
    // Encuentra productos por categoría
    List<Product> findByCategoryId(Long categoryId);
    
    // Encuentra productos por rango de precio
    List<Product> findByPriceBetween(Double minPrice, Double maxPrice);
}