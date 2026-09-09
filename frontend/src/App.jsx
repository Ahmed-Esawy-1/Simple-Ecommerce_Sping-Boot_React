import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";

export default function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/products/new" element={<AddProduct />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/products/:id/edit" element={<EditProduct />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}
