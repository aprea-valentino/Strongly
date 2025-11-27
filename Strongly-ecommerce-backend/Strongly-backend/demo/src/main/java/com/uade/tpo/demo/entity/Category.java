package com.uade.tpo.demo.entity;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.ToString;
import jakarta.persistence.*;

@Entity
@Table(name = "categories")
@Data
public class Category {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "description", length = 255)
    private String description;

    // árbol opcional
    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Category parent;

    // 1 categoría → muchos productos (lado inverso)
    @OneToMany(mappedBy = "category")
    @ToString.Exclude
    @JsonIgnore               //  evita recursion al serializar Category
    private List<Product> products;
}
