import { test, expect } from '@playwright/test';

test('catálogo, cantidades, total y eliminación', async ({ page }) => {
    const errores = [];
    page.on('pageerror', error => errores.push(error.message));
    await page.goto('/');
    await expect(page.locator('.product-card')).toHaveCount(4);
    await expect(page.locator('#contadorCarrito')).toHaveText('0');
    await expect.poll(() => page.locator('.product-card img').first().evaluate(imagen => imagen.naturalWidth)).toBeGreaterThan(0);
    await page.screenshot({ path: 'capturas/01-catalogo.png', fullPage: true });
    const tarjeta = page.locator('.product-card').filter({ hasText: 'Battlefield 6' });
    await tarjeta.getByRole('button', { name: 'Agregar', exact: true }).click();
    await tarjeta.getByRole('button', { name: 'En el carrito · +1', exact: true }).click();
    await page.locator('.product-card').filter({ hasText: 'Helldivers II' }).getByRole('button', { name: 'Agregar', exact: true }).click();
    await expect(page.locator('#contadorCarrito')).toHaveText('3');
    await page.locator('[data-bs-target="#panelCarrito"]').click();
    await expect(page.locator('#panelCarrito')).toBeVisible();
    await expect(page.locator('#panelCarrito')).toHaveClass('offcanvas offcanvas-end text-bg-dark show');
    await expect(page.locator('#totalCarrito')).toHaveText(/159\.970/);
    await page.screenshot({ path: 'capturas/02-carrito.png', fullPage: false, animations: 'disabled' });
    await page.getByRole('button', { name: 'Eliminar Battlefield 6', exact: true }).click();
    await expect(page.locator('#contadorCarrito')).toHaveText('1');
    await expect(page.locator('#totalCarrito')).toHaveText(/39\.990/);
    await page.getByRole('button', { name: 'Vaciar carrito', exact: true }).click();
    await expect(page.getByText('Tu carrito está vacío.', { exact: true })).toBeVisible();
    await expect(page.locator('#contadorCarrito')).toHaveText('0');
    await expect(page.getByRole('button', { name: 'Vaciar carrito', exact: true })).toBeDisabled();
    await page.screenshot({ path: 'capturas/03-carrito-vacio.png', fullPage: false, animations: 'disabled' });
    expect(errores).toEqual([]);
});

test('búsqueda combinada con categorías y vista móvil', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.locator('.product-card')).toHaveCount(4);
    await page.getByRole('button', { name: 'Aventura', exact: true }).click();
    await expect(page.locator('.product-card')).toHaveCount(1);
    await expect(page.locator('.product-card')).toContainText('Returnal');
    await page.getByRole('searchbox').fill('Battlefield');
    await page.getByRole('button', { name: 'Buscar', exact: true }).click();
    await expect(page.getByText('No encontramos productos con esa búsqueda.', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Todos', exact: true }).click();
    await expect(page.locator('.product-card')).toHaveCount(1);
    await page.getByRole('searchbox').fill('');
    await expect(page.locator('.product-card')).toHaveCount(4);
    await page.getByRole('button', { name: 'Abrir menú', exact: true }).click();
    await page.locator('[data-bs-target="#panelCarrito"]').click();
    await expect(page.getByText('Tu carrito está vacío.', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Cerrar carrito', exact: true }).click();
    await expect(page.locator('#panelCarrito')).not.toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: 'capturas/04-movil.png', fullPage: true });
});

test('error de carga y recuperación mediante reintento', async ({ page }) => {
    let fallar = true;
    await page.route('**/productos-*.json', route => fallar ? route.fulfill({ status: 503, body: 'No disponible' }) : route.continue());
    await page.goto('/');
    await expect(page.getByText('No fue posible cargar el catálogo.', { exact: false })).toBeVisible();
    await expect(page.locator('.product-card')).toHaveCount(0);
    await page.screenshot({ path: 'capturas/05-error.png', fullPage: true });
    fallar = false;
    await page.getByRole('button', { name: 'Reintentar', exact: true }).click();
    await expect(page.locator('.product-card')).toHaveCount(4);
    await expect(page.getByRole('button', { name: 'Reintentar', exact: true })).toHaveCount(0);
});
