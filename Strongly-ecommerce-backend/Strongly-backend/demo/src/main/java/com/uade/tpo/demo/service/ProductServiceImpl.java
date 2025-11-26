package com.uade.tpo.demo.service;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.entity.Category;
import com.uade.tpo.demo.entity.Product;
import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.entity.dto.ProductResponse;
import com.uade.tpo.demo.entity.dto.UpdateProductRequest;
import com.uade.tpo.demo.exceptions.CategoryNotFoundException;
import com.uade.tpo.demo.exceptions.ProductDuplicateException;
import com.uade.tpo.demo.exceptions.ProductNotFoundException;
import com.uade.tpo.demo.repository.CategoryRepository;
import com.uade.tpo.demo.repository.ProductRepository;
import com.uade.tpo.demo.repository.UserRepository;
import com.uade.tpo.demo.entity.dto.ProductResponseCategory;
import com.uade.tpo.demo.entity.ProductImage;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;


    // --------------------- GET PRODUCTS ---------------------
  /*
    @Override
    public Page<ProductResponseCategory> getProduct(Pageable pageable) {
        return productRepository.findAll(pageable).map(p -> new ProductResponseCategory(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getPrice(),
                p.getStock(),
            p.getCategory() != null ? p.getCategory().getId() : null

            ));
    }
*/

@Override
public Page<ProductResponseCategory> getProduct(Pageable pageable) {

    return productRepository.findAll(pageable).map(p -> {

        byte[] imageBytes = null;
        String contentType = null;

        if (p.getImages() != null && !p.getImages().isEmpty()) {
            ProductImage img = p.getImages().get(0); // primera imagen
            imageBytes = img.getImage();
            contentType = img.getImageContentType();
        }

        return new ProductResponseCategory(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getPrice(),
                p.getStock(),
                p.getCategory() != null ? p.getCategory().getId() : null,
                imageBytes,
                contentType
        );
    });
}

   @Override
public Optional<ProductResponse> getProductById(Long productId) {

    return productRepository.findProductImageById(productId)
            .map(p -> {

                byte[] imageBytes = null;
                String contentType = null;

                if (p.getImages() != null && !p.getImages().isEmpty()) {
                    ProductImage img = p.getImages().get(0);
                    imageBytes = img.getImage();
                    contentType = img.getImageContentType();
                }

                return new ProductResponse(
                        p.getId(),
                        p.getName(),
                        p.getDescription(),
                        p.getPrice(),
                        p.getStock(),
                        imageBytes,
                        contentType
                );
            });
}


    @Override
    public List<ProductResponse> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId).stream()
            .map(p -> new ProductResponse(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getPrice(),
                p.getStock(),
                null,
                null
            ))
            .toList();
        }

    // --------------------- CREATE ---------------------
 @Override
public ProductResponse createProduct(
        String name,
        String description,
        int stock,
        BigDecimal price,
        long category_id,
        long id_user,
        List<byte[]> imagesBytes,
        List<String> imagesContentTypes
) throws ProductDuplicateException, CategoryNotFoundException {

    if (!productRepository.findByname(name).isEmpty()) {
        throw new ProductDuplicateException();
    }

    Category category = categoryRepository.findById(category_id)
            .orElseThrow(() -> new CategoryNotFoundException("La categoria " + category_id + " no existe"));

    User creator = userRepository.findById(id_user).orElse(null);

    Product p = new Product();
    p.setName(name);
    p.setDescription(description);
    p.setPrice(price);
    p.setStock(stock);
    p.setSlug(name.trim().toLowerCase().replace(" ", "-"));
    p.setCategory(category);

    if (creator != null) p.setCreatedBy(creator);

    // Agregar imágenes
    if (imagesBytes != null && !imagesBytes.isEmpty()) {
        for (int i = 0; i < imagesBytes.size(); i++) {
            ProductImage pi = new ProductImage();
            pi.setImage(imagesBytes.get(i));
            pi.setImageContentType(imagesContentTypes.get(i));
            pi.setProduct(p);
            p.getImages().add(pi);
        }
    }

    Product saved = productRepository.save(p);

    return new ProductResponse(
            saved.getId(),
            saved.getName(),
            saved.getDescription(),
            saved.getPrice(),
            saved.getStock(),
            null,
            null
    );
}



    // --------------------- UPDATE ---------------------
    /* ESTE ES EL UPDATE DE PRICE Y STOCK SEPARADOS

    @Override
    public ProductResponse updatePrice(Long productId, BigDecimal newPrice) throws ProductNotFoundException {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Producto " + productId + " no encontrado"));

        product.setPrice(newPrice);
        Product updated = productRepository.save(product);

        return new ProductResponse(
            updated.getId(),
            updated.getName(),
            updated.getDescription(),
            updated.getPrice(),
            updated.getStock()
        );
    }

    @Override
    public ProductResponse updateStock(Long productId, int newStock) throws ProductNotFoundException {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Producto " + productId + " no encontrado"));

        product.setStock(newStock);
        Product updated = productRepository.save(product);

        return new ProductResponse(
            updated.getId(),
            updated.getName(),
            updated.getDescription(),
            updated.getPrice(),
            updated.getStock()
        );
    }
}
*/

// ESTE ES EL UPDATE QUE UNE PRICE Y STOCK EN UN SOLO MÉTODO
    @Override
    public ProductResponse updateProduct(UpdateProductRequest req) throws ProductNotFoundException {

        Product product = productRepository.findById(req.getIdProducto())
                .orElseThrow(() -> new ProductNotFoundException("Producto " + req.getIdProducto() + " no encontrado"));

        // Si viene precio lo actualiza
        if (req.getPrecio() != null) {
            product.setPrice(BigDecimal.valueOf(req.getPrecio()));
        }

        // Si viene stock lo actualiza
        if (req.getStock() != null) {
            product.setStock(req.getStock());
        }

        // Si viene nombre lo actualiza (y actualiza slug)
        if (req.getName() != null && !req.getName().trim().isEmpty()) {
            product.setName(req.getName());
            product.setSlug(req.getName().trim().toLowerCase().replace(" ", "-"));
        }

        // Si viene id_category lo actualiza
        if (req.getId_category() != null) {
            Category category = categoryRepository.findById(req.getId_category())
                    .orElseThrow(() -> new CategoryNotFoundException("La categoria " + req.getId_category() + " no existe"));
            product.setCategory(category);
        }

        Product updated = productRepository.save(product);

        return new ProductResponse(
            updated.getId(),
            updated.getName(),
            updated.getDescription(),
            updated.getPrice(),
            updated.getStock(),
            null,
            null
        );
    }


 @Override
public List<ProductResponseCategory> searchProductsByName(String nameQuery) {

    return productRepository.findByNameContainingIgnoreCase(nameQuery).stream()
        .map(p -> new ProductResponseCategory(
            p.getId(),
            p.getName(),
            p.getDescription(),
            p.getPrice(),
            p.getStock(),
            p.getCategory() != null ? p.getCategory().getId() : null,
            null,
            null
        ))
        .toList();
    }

}


/* 
    public List<ProductRequest> getProductsByCategory(Long categoryId) throws CategoryNotFoundException {
        
        Category categoria = categoryRepository.findById(categoryId).orElseThrow(() -> new CategoryNotFoundException("La categoria" + categoryId +" no existe"));
        List<Product> productos = productRepository.findProductByCategory(categoria);
        return productos;

    }    

    public ProductRequest updatePrice(Long productId, BigDecimal newPrice) throws ProductNotFoundException {
         Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ProductNotFoundException("Producto " + productId + " no encontrado"));
    product.setPrice(newPrice);
    return productRepository.save(product);
    }

    
    public ProductRequest updateStock(Long productId, int newStock) throws ProductNotFoundException {
         Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Producto " + productId + " no encontrado"));
        product.setStock(newStock);
        return productRepository.save(product);
    }
 */
   