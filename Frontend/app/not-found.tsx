import { PasteError } from "@/components/paste/PasteError";

export default function NotFound() {
    return (
        <PasteError
            message="This paste is unavailable. It may have expired, exceeded its view limit, or the ID is incorrect."
        />
    );
}
