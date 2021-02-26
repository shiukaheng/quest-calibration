export interface ClientHandler {
    handleString: string // 
    onMessage(data: string): void
    onConnect(): void
    onDisconnect(): void
}