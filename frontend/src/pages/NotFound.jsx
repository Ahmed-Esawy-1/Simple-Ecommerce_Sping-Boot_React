import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import EmptyState from "../components/EmptyState";

export default function NotFound() {
    return (
        <EmptyState
            icon={Compass}
            title="Page not found"
            description="The page you're looking for doesn't exist."
            action={
                <Link
                    to="/"
                    className="mt-1 inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700/90 dark:bg-emerald-600"
                >
                    Back to catalog
                </Link>
            }
        />
    );
}
