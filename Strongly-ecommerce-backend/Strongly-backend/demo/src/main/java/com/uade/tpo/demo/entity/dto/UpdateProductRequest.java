package com.uade.tpo.demo.entity.dto;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class UpdateProductRequest {
    private Long idProducto;
    private Double precio;
    private Integer stock;
    private String name;
    private Long id_category;
    private BigDecimal descuento;
}
