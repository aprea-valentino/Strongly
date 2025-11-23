package com.uade.tpo.demo.entity.dto;

import lombok.Data;

@Data
public class UpdateProductRequest {
    private Long idProducto;
    private Double precio;
    private Integer stock;
}
