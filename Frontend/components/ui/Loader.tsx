export function Loader({ text = "Loading..." }: { text?: string }) {
    return (
        <div className="container mx-auto px-4 flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="flex flex-col items-center gap-4 animate-pulse">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-muted-foreground">{text}</p>
            </div>
        </div>
    );
}
