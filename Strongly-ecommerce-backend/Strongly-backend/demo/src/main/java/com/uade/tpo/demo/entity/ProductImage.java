package com.uade.tpo.demo.entity;

import jakarta.persistence.*;
import jakarta.persistence.Index;
import lombok.Data;

@Entity
@Table(name = "product_images",
       indexes = {@Index(name = "idx_img_product", columnList = "product_id, sort_order")})
@Data
public class ProductImage {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id")
    private Product product;

    @Lob
    @Column(name = "image", columnDefinition = "LONGBLOB")
    private byte[] image;

    @Column(name = "image_content_type")
    private String imageContentType;


    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;

}
