import CatalogScreen from '../screens/CatalogScreen.js';
import ProductScreen from '../screens/ProductScreen.js';
import { restartApp, parsePrice } from '../helpers/app.js';

/** True when every value is >= the previous one (or <= when descending). */
function isSorted(values, direction = 'asc') {
    return values.every((value, i) => {
        if (i === 0) return true;
        const prev = values[i - 1];
        if (typeof value === 'string') {
            const cmp = prev.localeCompare(value);
            return direction === 'asc' ? cmp <= 0 : cmp >= 0;
        }
        return direction === 'asc' ? prev <= value : prev >= value;
    });
}

describe('Product catalog', () => {
    beforeEach(async () => {
        await restartApp();
        await CatalogScreen.waitForIsShown();
    });

    it('TC-CAT-01 lists products with a name and a price @smoke @regression', async () => {
        const titles = await CatalogScreen.getVisibleTitles();
        const prices = await CatalogScreen.getVisiblePrices();
        await expect(titles.length).toBeGreaterThan(0);
        await expect(prices.length).toBe(titles.length);
        prices.forEach((price) => expect(parsePrice(price)).toBeGreaterThan(0));
    });

    it('TC-CAT-02 sorts products by name A to Z @regression', async () => {
        await CatalogScreen.sortBy('nameAsc');
        await expect(isSorted(await CatalogScreen.getVisibleTitles(), 'asc')).toBe(true);
    });

    it('TC-CAT-03 sorts products by name Z to A @regression', async () => {
        await CatalogScreen.sortBy('nameDesc');
        await expect(isSorted(await CatalogScreen.getVisibleTitles(), 'desc')).toBe(true);
    });

    it('TC-CAT-04 sorts products by price low to high @regression', async () => {
        await CatalogScreen.sortBy('priceAsc');
        const prices = (await CatalogScreen.getVisiblePrices()).map(parsePrice);
        await expect(isSorted(prices, 'asc')).toBe(true);
    });

    it('TC-CAT-05 sorts products by price high to low @regression', async () => {
        await CatalogScreen.sortBy('priceDesc');
        const prices = (await CatalogScreen.getVisiblePrices()).map(parsePrice);
        await expect(isSorted(prices, 'desc')).toBe(true);
    });

    it('TC-CAT-06 opens product details matching the catalog entry @smoke @regression', async () => {
        const [title] = await CatalogScreen.getVisibleTitles();
        const [price] = await CatalogScreen.getVisiblePrices();

        await CatalogScreen.openProduct(0);
        await ProductScreen.waitForIsShown();

        await expect(await ProductScreen.getTitle()).toBe(title);
        await expect(await ProductScreen.getPrice()).toBe(price);
    });
});
