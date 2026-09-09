import axios from "axios";
import { API_BASE_URL } from "./config";


//   GET    /api/orders              -> Order[]
//   POST   /api/orders/place        


const client = axios.create({ baseURL: API_BASE_URL });


export async function getOrders() {
    const { data } = await client.get("/api/orders");
    return data;
}


export async function placeOrder({ customerName, email, items }) {
    const { data } = await client.post("/api/orders/place", {
        customerName,
        email,
        items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
        })),
    });
    return data;
}
