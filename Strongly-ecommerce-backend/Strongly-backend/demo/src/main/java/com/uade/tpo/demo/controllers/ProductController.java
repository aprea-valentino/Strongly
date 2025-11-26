package com.uade.tpo.demo.controllers;

import java.io.IOException;
import java.math.BigDecimal;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.demo.entity.Product;
import com.uade.tpo.demo.entity.dto.ProductRequest;
import com.uade.tpo.demo.entity.dto.ProductResponse;
import com.uade.tpo.demo.entity.dto.ProductResponseCategory;

import com.uade.tpo.demo.entity.dto.ProductResponseSimple;
import com.uade.tpo.demo.entity.dto.UpdateProductPrice;
import com.uade.tpo.demo.entity.dto.UpdateProductRequest;
import com.uade.tpo.demo.entity.dto.UpdateProductStock;
import com.uade.tpo.demo.exceptions.CategoryNotFoundException;
import com.uade.tpo.demo.exceptions.ProductDuplicateException;
import com.uade.tpo.demo.exceptions.ProductNotFoundException;
import com.uade.tpo.demo.service.ProductService;

import jakarta.validation.Valid;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
// PreAuthorize removed from updateProduct; Security rules configured in SecurityConfig
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;
import com.uade.tpo.demo.entity.ProductImage;

@RestController
@RequestMapping("/api/v1/product")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private com.uade.tpo.demo.repository.CategoryRepository categoryRepository;

    @Autowired
    private com.uade.tpo.demo.repository.UserRepository userRepository;

    @Autowired
    private com.uade.tpo.demo.repository.ProductRepository productRepository;


            @GetMapping
public List<ProductResponseCategory> getAllProducts(
        @RequestParam(value = "q", required = false) String searchQuery
) {


    if (searchQuery != null && !searchQuery.trim().isEmpty()) {
                return productService.searchProductsByName(searchQuery);
    } 

    return  productRepository.findAllWithImages().stream()
            .map(p -> {

                // obtiene la primera imagen (o null)
                ProductImage img = p.getImages().isEmpty()
                        ? null
                        : p.getImages().get(0);

                return new ProductResponseCategory(
                        p.getId(),
                        p.getName(),
                        p.getDescription(),
                        p.getPrice(),
                        p.getStock(),
                        p.getCategory() != null ? p.getCategory().getId() : null,
                        img != null ? img.getImage() : null,
                        img != null ? img.getImageContentType() : null,
                        p.getDescuento()
                );
            })
            .toList();
}


    
     @GetMapping("/category/{categoryId}")
    public List<ProductResponse> getProductsByCategory(@PathVariable Long categoryId) {
        return productRepository.findByCategoryId(categoryId).stream()
            .map(p -> new ProductResponse(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getPrice(),   
                p.getStock(),
                null,
                null,
                p.getDescuento()
            ))
            .toList();
    }


//NUEVO UPDATE PRODUCT PRICE Y STOCK
@PostMapping("/updateProduct")
public ResponseEntity<ProductResponse> updateProduct(@RequestBody UpdateProductRequest req)
    throws ProductNotFoundException, CategoryNotFoundException {

    ProductResponse result = productService.updateProduct(req);
    return ResponseEntity.ok(result);
}


    /* 
@PostMapping("/updatePrice")
public ResponseEntity<ProductResponse> updatePrice(@RequestBody UpdateProductPrice req) 
        throws ProductNotFoundException {

    ProductResponse result = productService.updatePrice(req.getIdProducto(), req.getPrecio());
    return ResponseEntity.ok(result);
}

@PostMapping("/updateStock")
public ResponseEntity<ProductResponse> updateStock(@RequestBody UpdateProductStock req) 
        throws ProductNotFoundException {

    ProductResponse result = productService.updateStock(req.getIdProducto(), req.getStock());
    return ResponseEntity.ok(result);
}
 */

   @GetMapping("/{productId}")
public ResponseEntity<ProductResponse> getProductById(@PathVariable Long productId) {
    Optional<ProductResponse> result = productService.getProductById(productId);

    return result
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.noContent().build());
}



@PostMapping(value = "/multipart", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<?> createProduct(
        @RequestPart("product") @Valid ProductRequest req,
        @RequestPart(value = "images", required = false) MultipartFile[] imagesFiles
) throws CategoryNotFoundException, IOException, ProductDuplicateException {

    List<byte[]> imagesBytes = new ArrayList<>();
    List<String> imagesContentTypes = new ArrayList<>();

    if (imagesFiles != null) {
        for (MultipartFile file : imagesFiles) {
            if (!file.isEmpty()) {
                imagesBytes.add(file.getBytes());
                imagesContentTypes.add(file.getContentType());
            }
        }
    }

    ProductResponse response = productService.createProduct(
            req.getName(),
            req.getDescription(),
            req.getStock(),
            req.getPrice(),
            req.getId_category(),
            req.getId_User(),
            imagesBytes,
            imagesContentTypes,
            req.getDescuento()
    );

    return ResponseEntity.ok(response);
}



}

