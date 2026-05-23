export function route(name?: string): string {
    return name ? `/${name}` : '/';
}
