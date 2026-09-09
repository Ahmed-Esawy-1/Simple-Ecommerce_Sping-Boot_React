package com.ahmedesawy.simpleEcommerce.service;

import com.ahmedesawy.simpleEcommerce.model.Product;
import com.ahmedesawy.simpleEcommerce.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ChatClient chatClient;
    private final AiImageGenService aiImageGenService;
    private final VectorStore vectorStore;


    // ---- ALL PRODUCTS ---------------------
    public List<Product> getAllProducts() {
        return productRepository.findAllByOrderByReleaseDateDesc();
    }

    // ---- PRODUCT BY ID --------------------------------------------
    public Product getProductById(int id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product with " + id + " not found."));
    }

    // ---- CREATE | UPDATE -----------------------------------------
    public Product addOrUpdateProduct(Product product, MultipartFile image) throws IOException {
        boolean isUpdate = product.getId() != null;

        product.setImageName(image.getOriginalFilename());
        product.setImageType(image.getContentType());
        product.setImageData(image.getBytes());

        Product savedProduct = productRepository.save(product);

        // Remove old vector store entry if this is an update
        if (isUpdate) {
            vectorStore.delete(
                    "productId == '" + savedProduct.getId() + "'"
            );
        }



        String content = String.format("""
                Product Name: %s
                Description: %s
                Brand: %s
                Category: %s
                Price: %.2f
                Release Date: %s
                Available: %s
                Stock: %s
            """,
                savedProduct.getName(),
                savedProduct.getDescription(),
                savedProduct.getBrand(),
                savedProduct.getCategory(),
                savedProduct.getPrice(),
                savedProduct.getReleaseDate(),
                savedProduct.isProductAvailable(),
                savedProduct.getStockQuantity()
        );

        Document document = new Document(
                UUID.randomUUID().toString(),
                content,
                Map.of("productId", String.valueOf(savedProduct.getId()))
                );

                vectorStore.add(List.of(document));

        return savedProduct;
    }

    // ---- DELETE ------------------------------------------------------------------------
    public void deleteProduct(int id) {
        productRepository.deleteById(id);
        vectorStore.delete("productId == '" + id + "'");
    }

    // ---- SEARCH -----------------------------------------------------------------------
    public List<Product> searchProducts(String keyword) {
//        return productRepository.searchProducts(keyword);
        List<Document> results = vectorStore.similaritySearch(
                SearchRequest.builder()
                        .query(keyword)
                        .topK(4)
                        .similarityThreshold(.45)
                        .build()
        );

        List<Integer> productIds = results.stream()
                .map(doc -> doc.getMetadata().get("productId"))
                .filter(Objects::nonNull)
                .map(id -> Integer.valueOf((String) id))
                .toList();

        if (productIds.isEmpty()) {
            return List.of();
        }

        List<Product> products = productRepository.findAllById(productIds);

        Map<Integer, Product> productMap = products.stream()
                .collect(Collectors.toMap(Product::getId, p -> p));

        return productIds.stream()
                .map(productMap::get)
                .filter(Objects::nonNull)
                .toList();

    }

    // ---- Generate Description -------------------------------------------------------
    public String generateDescription(String name, String category, String brand) {
        String prompt = String.format("""
                Write a concise and professional product description for an e-commerce listing.
                
                Product Name: %s
                Category: %s
                Brand: %s
                
                Keep it simple, engaging, and highlight its primary features or benefits.
                Avoid technical jargon and keep it customer-friendly.
                Limit the description to 250 characters maximum.
                
                """, name, category, brand);

        String desc = chatClient.prompt(prompt)
                .call()
                .chatResponse()
                .getResult()
                .getOutput()
                .getText();

        return desc;
    }

    public byte[] generateImage(String name, String category, String brand, String description) {
        String prompt = String.format("""
                Generate a highly realistic, professional-grade e-commerce product image.
                
                Product Details:
                    - Category: %s
                    - Brand: %s
                    - Name: '%s'
                    - Description: %s
                
                Requirements:
                    - Use a clean, minimalistic, white or very light grey background.
                    - Ensure the product is well-lit with soft, natural-looking lighting.
                    - Add realistic shadows and soft reflections to ground the product naturally.
                    - No humans, brand logos, watermarks, or text overlays should be visible.
                    - Showcase the product from its most flattering angle that highlights key features.
                    - Ensure the product occupies a prominent position in the frame, centered or slightly off-centered.
                    - Maintain a high resolution and sharpness, ensuring all textures, colors, and details are clear.
                    - Follow the typical visual style of top e-commerce websites like Amazon, Flipkart, or Shopify.
                    - Make the product appear life-like and professionally photographed in a studio setup.
                    - The final image should look immediately ready for use on an e-commerce website without further editing.
                """, category, brand, name, description);

        byte[] aiImage = aiImageGenService.generateImage(prompt);

        return aiImage;
    }
}
