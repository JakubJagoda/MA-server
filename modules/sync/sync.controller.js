const subtotals = new Map();
const overalls = new Map();

export function getSubtotals(productId) {
    productId = Number(productId);
    if (!subtotals.has(productId)) {
        subtotals.set(productId, new Map());
    }

    return subtotals.get(productId);
}

export function getOverall(productId) {
    productId = Number(productId);
    let overall = 0;

    for (const [_, subtotal] of subtotals.get(productId).entries()) {
        overall += subtotal;
    }

    return overall;
}

export function setSubtotal(productId, guid, subtotal) {
    productId = Number(productId);

    if (!overalls.has(productId)) {
        overalls.set(productId, 0);
    }

    if (!subtotals.has(productId)) {
        subtotals.set(productId, new Map());
    }

    const bucket = subtotals.get(productId);
    bucket.set(guid, subtotal);
}
