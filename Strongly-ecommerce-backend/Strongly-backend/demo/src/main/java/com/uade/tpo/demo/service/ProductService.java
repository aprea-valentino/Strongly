package com.uade.tpo.demo.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.uade.tpo.demo.entity.dto.ProductResponse;
import com.uade.tpo.demo.entity.dto.UpdateProductRequest;
import com.uade.tpo.demo.exceptions.CategoryNotFoundException;
import com.uade.tpo.demo.exceptions.ProductDuplicateException;
import com.uade.tpo.demo.exceptions.ProductNotFoundException;
import com.uade.tpo.demo.entity.dto.ProductResponseCategory;

public interface ProductService {

    
    Page<ProductResponseCategory> getProduct(Pageable pageable);

    Optional<ProductResponse> getProductById(Long productId);

    List<ProductResponse> getProductsByCategory(Long categoryId) throws CategoryNotFoundException;

    ProductResponse createProduct(String name, String description, int stock, BigDecimal price, long category_id, long id_user, List<byte[]> imagesBytes,List<String> imagesContentTypes, BigDecimal descuento)
            throws ProductDuplicateException, CategoryNotFoundException;

    
    ProductResponse updateProduct(UpdateProductRequest request) throws ProductNotFoundException, CategoryNotFoundException;
    List<ProductResponseCategory> searchProductsByName(String nameQuery);

}
