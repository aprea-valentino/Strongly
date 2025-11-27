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
                contentType,
                p.getDescuento()
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
                        contentType,
                        p.getDescuento()
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
                null,
                p.getDescuento()
            ))
            .toList();
        }

    
 @Override
public ProductResponse createProduct(
        String name,
        String description,
        int stock,
        BigDecimal price,
        long category_id,
        long id_user,
        List<byte[]> imagesBytes,
        List<String> imagesContentTypes,
        BigDecimal descuento
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
    p.setDescuento(descuento);
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
            null,
            saved.getDescuento()
    );
}




    @Override
    public ProductResponse updateProduct(UpdateProductRequest req) throws ProductNotFoundException {

        Product product = productRepository.findById(req.getIdProducto())
                .orElseThrow(() -> new ProductNotFoundException("Producto " + req.getIdProducto() + " no encontrado"));

        
        if (req.getPrecio() != null) {
            product.setPrice(BigDecimal.valueOf(req.getPrecio()));
        }

        
        if (req.getStock() != null) {
            product.setStock(req.getStock());
        }

       
        if (req.getName() != null && !req.getName().trim().isEmpty()) {
            product.setName(req.getName());
            product.setSlug(req.getName().trim().toLowerCase().replace(" ", "-"));
        }

        
        if (req.getId_category() != null) {
            Category category = categoryRepository.findById(req.getId_category())
                    .orElseThrow(() -> new CategoryNotFoundException("La categoria " + req.getId_category() + " no existe"));
            product.setCategory(category);
        }

    BigDecimal descuento = req.getDescuento();
if (descuento == null || descuento.compareTo(BigDecimal.ZERO) < 0) {
    descuento = BigDecimal.ZERO;
}
product.setDescuento(descuento);

        Product updated = productRepository.save(product);

        return new ProductResponse(
            updated.getId(),
            updated.getName(),
            updated.getDescription(),
            updated.getPrice(),
            updated.getStock(),
            null,
            null,
            updated.getDescuento()
        );
    }


@Override
public List<ProductResponseCategory> searchProductsByName(String nameQuery) {

    return productRepository.findByNameContainingIgnoreCase(nameQuery).stream()
        .map(p -> {

            byte[] imageBytes = null;
            String contentType = null;

            // Tomar la primera imagen si existe
            if (p.getImages() != null && !p.getImages().isEmpty()) {
                ProductImage img = p.getImages().get(0);
                imageBytes = img.getImage();
                contentType = img.getImageContentType();
            }

            return new ProductResponseCategory(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getPrice(),   // precio con descuento
                p.getStock(),
                p.getCategory() != null ? p.getCategory().getId() : null,
                imageBytes,
                contentType,
                p.getDescuento()
            );
        })
        .toList();
}




}

