package com.ahmedesawy.simpleEcommerce.controller;

import com.ahmedesawy.simpleEcommerce.model.Product;
import com.ahmedesawy.simpleEcommerce.service.ProductService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;



@RestController
@RequestMapping("/api")
@CrossOrigin
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;


    // ---- QUIRES -------------------------------------------------
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getProducts() {
        return new ResponseEntity<>(productService.getAllProducts(), HttpStatus.OK);
    }

    @GetMapping("/product/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable int id) {
        try {
            Product product = productService.getProductById(id);
            return new ResponseEntity<>(product, HttpStatus.OK);
        } catch(Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/product/{id}/image")
    public ResponseEntity<byte[]> getProductImage(@PathVariable int id) {
        try {
            Product product = productService.getProductById(id);
            return new ResponseEntity<>(product.getImageData(), HttpStatus.OK);
        } catch(Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    

    // ---- CREATE --------------------------------------------------------------------
    @PostMapping("/product")
    public ResponseEntity<?> addProduct(@RequestPart Product product, @RequestPart MultipartFile imageFile) {
        Product savedProduct = null;
        try{
            savedProduct = productService.addOrUpdateProduct(product, imageFile);
            return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
        } catch(IOException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ---- UPDATE ------------------------------------------------------------------------------------------
    @PutMapping("/product/{id}")
    public ResponseEntity<String> updateProduct(@PathVariable int id, @RequestPart Product product, @RequestPart MultipartFile imageFile) {
        try{
            product.setId(id);
            productService.addOrUpdateProduct(product, imageFile);
            return new ResponseEntity<>("Updated", HttpStatus.OK);
        } catch(IOException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        
    }

    // ---- DELETE ---------------------------------------------------------------------
    @DeleteMapping("/product/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable int id) {
        Product product = productService.getProductById(id);
        if (product != null) {
            productService.deleteProduct(id);
            return new ResponseEntity<>("Deleted", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Not Found", HttpStatus.NOT_FOUND);
        }
    }


    // ---- SEARCH -----------------------------------------------------------------------
    @GetMapping("/products/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword) {
        List<Product> products = productService.searchProducts(keyword);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }


    // ---- Generate Description -----------------------------------------------------
    @PostMapping("/product/generate-description")
    public ResponseEntity<String> generateDescription(
            @RequestParam String name,
            @RequestParam String category,
            @RequestParam String brand
    ) {
        try {
            String aiDesc = productService.generateDescription(name, category, brand);
            return new ResponseEntity<>(aiDesc, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    // ---- Generate Image -----------------------------------------------------
    @PostMapping("/product/generate-image")
    public ResponseEntity<?> generateImage(
            @RequestParam String name,
            @RequestParam String category,
            @RequestParam String brand,
            @RequestParam String description
    ) {
        try {
            byte[] aiImage = productService.generateImage(name, category, brand, description);
            return new ResponseEntity<>(aiImage, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
