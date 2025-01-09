export function formatPrice(price?: number) {
    return (price || 0).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });
}
