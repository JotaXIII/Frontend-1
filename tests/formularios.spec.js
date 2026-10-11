import { test, expect } from '@playwright/test';

test('contacto rechaza datos inválidos y acepta un mensaje completo', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Enviar mensaje', exact: true }).click();
    await expect(page.locator('#contacto-nombre')).toBeFocused();
    await expect(page.locator('#contacto-nombre-error')).toBeVisible();
    await expect(page.locator('#contacto-email-error')).toBeVisible();
    await expect(page.locator('#contacto-mensaje-error')).toBeVisible();
    await page.getByLabel('Nombre', { exact: true }).fill('   ');
    await page.getByLabel('Email', { exact: true }).fill('correo-invalido');
    await page.getByLabel('Mensaje', { exact: true }).fill('   ');
    await page.getByRole('button', { name: 'Enviar mensaje', exact: true }).click();
    await expect(page.locator('#contacto-email')).toHaveAttribute('aria-invalid', 'true');
    await page.getByLabel('Nombre', { exact: true }).fill('Cliente');
    await page.getByLabel('Email', { exact: true }).fill('cliente@example.com');
    await page.getByLabel('Mensaje', { exact: true }).fill('Quisiera consultar la disponibilidad de Returnal.');
    await page.getByRole('button', { name: 'Enviar mensaje', exact: true }).click();
    await expect(page.getByText('Gracias, Cliente.', { exact: false })).toContainText('no se ha enviado un correo');
    await expect(page.locator('#contacto-nombre')).toHaveValue('');
    await expect(page.locator('#contacto-email-error')).toHaveCount(0);
    await page.screenshot({ path: test.info().outputPath('contacto.png'), fullPage: true });
});

test('altas, filtros y bajas mantienen catálogo y carrito sincronizados', async ({ page }) => {
    await page.goto('./');
    await expect(page.locator('.product-card')).toHaveCount(4);
    await page.getByText('Abrir gestión del catálogo', { exact: true }).click();
    await page.getByRole('button', { name: 'Agregar videojuego', exact: true }).click();
    await expect(page.locator('#juego-nombre-error')).toBeVisible();
    await page.getByLabel('Nombre del videojuego', { exact: true }).fill('Nueva aventura');
    await page.getByLabel('Categoría', { exact: true }).selectOption({ label: 'Aventura' });
    await page.getByLabel('Precio en CLP', { exact: true }).fill('-1');
    await page.getByLabel('Descripción', { exact: true }).fill('Explora un mundo lleno de aventuras.');
    await page.getByLabel('Portada', { exact: true }).selectOption({ label: 'returnal.jpg' });
    await page.getByRole('button', { name: 'Agregar videojuego', exact: true }).click();
    await expect(page.locator('#juego-precio-error')).toBeVisible();
    await expect(page.locator('.product-card')).toHaveCount(4);
    await page.getByLabel('Precio en CLP', { exact: true }).fill('15990');
    await page.getByRole('button', { name: 'Agregar videojuego', exact: true }).click();
    await expect(page.locator('.product-card')).toHaveCount(5);
    await page.getByRole('button', { name: 'Aventura', exact: true }).click();
    await expect(page.locator('.product-card')).toHaveCount(2);
    const tarjeta = page.locator('.product-card').filter({ hasText: 'Nueva aventura' });
    await tarjeta.getByRole('button', { name: 'Agregar', exact: true }).click();
    await expect(page.locator('#contadorCarrito')).toHaveText('1');
    await expect.poll(() => tarjeta.locator('img').evaluate(img => img.naturalWidth)).toBeGreaterThan(0);
    await page.getByRole('button', { name: 'Eliminar del catálogo Nueva aventura', exact: true }).click();
    await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
    await expect(tarjeta).toHaveCount(1);
    await page.getByRole('button', { name: 'Eliminar del catálogo Nueva aventura', exact: true }).click();
    await page.getByRole('button', { name: 'Confirmar eliminación', exact: true }).click();
    await expect(tarjeta).toHaveCount(0);
    await expect(page.locator('.product-card')).toHaveCount(4);
    await expect(page.locator('#contadorCarrito')).toHaveText('0');
    await page.screenshot({ path: test.info().outputPath('gestion.png'), fullPage: true });
});

test('formularios se adaptan a pantallas estrechas', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto('./');
    await expect(page.locator('.product-card')).toHaveCount(4);
    await page.getByText('Abrir gestión del catálogo', { exact: true }).click();
    await page.getByRole('button', { name: 'Enviar mensaje', exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: test.info().outputPath('movil-formularios.png'), fullPage: true });
});

test('catálogo inválido permite reintentar sin mostrar productos rotos', async ({ page }) => {
    let invalido = true;
    await page.route('**/productos-*.json', route => invalido ? route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify([{ id: 1, nombre: 'Juego', precio: -1, categoria: 'Acción', descripcion: 'Descripción', imagen: 'no-existe.jpg' }])
    }) : route.continue());
    await page.goto('./');
    await expect(page.getByRole('button', { name: 'Reintentar', exact: true })).toBeVisible();
    await expect(page.locator('.product-card')).toHaveCount(0);
    invalido = false;
    await page.getByRole('button', { name: 'Reintentar', exact: true }).click();
    await expect(page.locator('.product-card')).toHaveCount(4);
});
