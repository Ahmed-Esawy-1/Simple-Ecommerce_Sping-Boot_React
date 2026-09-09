import axios from "axios";
import { API_BASE_URL } from "./config";


//
//   GET    /api/products                           -> Product[]
//   GET    /api/product/{id}                       -> Product
//   GET    /api/product/{id}/image                 -> raw image bytes
//   POST   /api/product                            -> multipart: "imageFile" + "product" (JSON)
//   PUT    /api/product/{id}                       -> multipart: "imageFile" + "product" (JSON)
//   DELETE /api/product/{id}
//   POST   /api/product/generate-description       -> String
//   POST   /api/product/generate-image
//   GER    /api/products/search?keyword=${keyword} -> Product[4]

const client = axios.create({ baseURL: API_BASE_URL });

export async function getAllProducts() {
    const { data } = await client.get("/api/products");
    return data;
}

export async function getProductById(id) {
    const { data } = await client.get(`/api/product/${id}`);
    return data;
}

export function getProductImageUrl(id) {
    return `${API_BASE_URL}/api/product/${id}/image`;
}

export async function createProduct(product, imageFile) {
    const { data } = await client.post(
        "/api/product",
        toMultipart(product, imageFile),
        {
            headers: { "Content-Type": "multipart/form-data" },
        },
    );
    return data;
}

export async function updateProduct(id, product, imageFile) {
    const { data } = await client.put(
        `/api/product/${id}`,
        toMultipart(product, imageFile),
        {
            headers: { "Content-Type": "multipart/form-data" },
        },
    );
    return data;
}

export async function deleteProduct(id) {
    await client.delete(`/api/product/${id}`);
}

export async function searchProducts(keyword) {
    const { data } = await client.get(
        `/api/products/search?keyword=${keyword}`,
    );
    return data;
}

export async function generateProductDescription({ name, brand, category }) {
    const { data } = await client.post(
        "/api/product/generate-description",
        null,
        {
            params: { name, category, brand },
        },
    );
    return data;

}

export async function generateProductImage({
    name,
    brand,
    category,
    description,
}) {
    const { data } = await client.post("/api/product/generate-image", null, {
        params: { name, category, brand, description },
        responseType: "arraybuffer",
    });
    // return data
    return new File([data], "ai-generated-image.png", { type: "image/png" });
}

export async function sendChatMessage(message) {
    const { data } = await client.get("/api/chat/ask", {
        params: { message },
    });
    return data;

    // return data.description;

}

export async function generateProductImage({
    name,
    brand,
    category,
    description,
}) {
    const { data } = await client.post("/api/product/generate-image", null, {
        params: { name, category, brand, description },
        responseType: "arraybuffer",
    });
    // return data
    return new File([data], "ai-generated-image.png", { type: "image/png" });
}

export async function sendChatMessage(message) {
    const { data } = await client.get("/api/chat/ask", {
        params: { message },
    });
    return data;
}

// ---- HELPERS ----------------------------------------------
function toMultipart(product, imageFile) {
    const formData = new FormData();
    if (imageFile) formData.append("imageFile", imageFile);
    formData.append(
        "product",
        new Blob([JSON.stringify(product)], { type: "application/json" }),
    );
    return formData;
}
