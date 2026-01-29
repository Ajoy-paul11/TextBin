import { Request, Response } from "express";
import { prisma } from "./db";
import { nanoid } from "nanoid";

interface CreatePasteRequest {
    content: string;
    ttl_seconds?: number;
    max_views?: number;
}

// Helper to escape HTML for safe rendering
function escapeHtml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function getNow(req: Request): Date {
    const testMode = process.env.TEST_MODE === '1';
    const testNowHeader = req.headers['x-test-now-ms'];

    if (testMode && testNowHeader && typeof testNowHeader === 'string') {
        const ms = parseInt(testNowHeader, 10);
        if (!isNaN(ms)) {
            return new Date(ms);
        }
    }
    return new Date();
}

export async function healthCheck(req: Request, res: Response) {
    try {
        // Check DB connection
        await prisma.$queryRaw`SELECT 1`;
        res.json({ ok: true });
    } catch (error) {
        console.error("Health check failed", error);
        res.status(503).json({ ok: false });
    }
}

export async function createPaste(req: Request, res: Response) {
    try {
        const { content, ttl_seconds, max_views } : CreatePasteRequest = req.body;

        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            res.status(400).json({ error: "Content is required and must be a non-empty string." });
            return;
        }

        let ttlSeconds: number | null = null;
        if (ttl_seconds !== undefined && ttl_seconds !== null) {
            if (typeof ttl_seconds !== 'number' || !Number.isInteger(ttl_seconds) || ttl_seconds < 1) {
                res.status(400).json({ error: "ttl_seconds must be an integer >= 1" });
                return;
            }
            ttlSeconds = ttl_seconds;
        }

        let maxViews: number | null = null;
        if (max_views !== undefined && max_views !== null) {
            if (typeof max_views !== 'number' || !Number.isInteger(max_views) || max_views < 1) {
                res.status(400).json({ error: "max_views must be an integer >= 1" });
                return;
            }
            maxViews = max_views;
        }

        const id = nanoid();

        await prisma.paste.create({
            data: {
                id,
                content,
                ttlSeconds,
                maxViews,
                viewCount: 0
            }
        });

        const frontendUrl = process.env.FRONTEND_URL;
        const url = `${frontendUrl}/p/${id}`;

        res.json({ id, url });

    } catch (error) {
        console.error("Create paste error", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function getPaste(req: Request, res: Response) {
    await handlePasteRetrieval(req, res, 'json');
}

export async function getPasteHtml(req: Request, res: Response) {
    await handlePasteRetrieval(req, res, 'html');
}

async function handlePasteRetrieval(req: Request, res: Response, format: 'json' | 'html') {
    const { id } = req.params;
    const idString = Array.isArray(id) ? id[0] : id;
    const now = getNow(req);

    try {
        const paste = await prisma.paste.update({
            where: { id: idString },
            data: { viewCount: { increment: 1 } }
        }).catch(() => null);

        if (!paste) {
            res.status(404).json({ error: "Not Found" });
            return;
        }

        // Check TTL
        if (paste.ttlSeconds) {
            const expiresAt = new Date(paste.createdAt.getTime() + paste.ttlSeconds * 1000);
            if (now > expiresAt) {
                res.status(404).json({ error: "Expired" });
                return;
            }
        }

        // Check View Limit
        if (paste.maxViews !== null && paste.viewCount > paste.maxViews) {
            res.status(404).json({ error: "View limit exceeded" });
            return;
        }

        let expires_at_iso: string | null = null;
        if (paste.ttlSeconds) {
            expires_at_iso = new Date(paste.createdAt.getTime() + paste.ttlSeconds * 1000).toISOString();
        }

        let remaining_views: number | null = null;
        if (paste.maxViews !== null) {
            remaining_views = Math.max(0, paste.maxViews - paste.viewCount);
        }

        if (format === 'json') {
            res.json({
                content: paste.content,
                remaining_views,
                expires_at: expires_at_iso
            });
        } else {
            // HTML Response
            res.setHeader('Content-Type', 'text/html');
            // Simple UI
            const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Paste ${id}</title>
            <style>
                body { font-family: sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
                pre { background: #f4f4f4; padding: 1rem; border-radius: 4px; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word; }
                .meta { color: #666; font-size: 0.9em; margin-bottom: 1rem; }
            </style>
        </head>
        <body>
            <h1>Paste ${id}</h1>
            <div class="meta">
                ${remaining_views !== null ? `Remaining Views: ${remaining_views} <br>` : ''}
                ${expires_at_iso ? `Expires At: ${expires_at_iso}` : ''}
            </div>
            <pre>${escapeHtml(paste.content)}</pre>
            <p><a href="/">Create New Paste</a></p>
        </body>
        </html>
        `;
            res.send(html);
        }

    } catch (error) {
        console.error("Get paste error", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
