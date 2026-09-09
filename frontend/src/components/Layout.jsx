import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import ChatBot from "./ChatBot";

export default function Layout() {
    return (
        <div className="min-h-screen bg-paper text-ink dark:bg-paper-dark dark:text-ink-dark">
            <Navbar />
            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
                <Outlet />
            </main>
            <ChatBot />
        </div>
    );
}
