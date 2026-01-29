
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Paste {
    id: string;
    content: string;
    remaining_views: number | null;
    expires_at: string | null;
}

export interface CreatePasteResponse {
    id: string;
    url: string;
}

export async function createPaste(content: string, ttl?: number, maxViews?: number): Promise<CreatePasteResponse> {
    const res = await fetch(`${API_URL}/api/pastes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content,
            ttl_seconds: ttl,
            max_views: maxViews,
        }),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create paste');
    }

    return res.json();
}

export async function getPaste(id: string): Promise<Paste> {
    const res = await fetch(`${API_URL}/api/pastes/${id}`);

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Paste not found or unavailable');
    }

    return res.json();
}
