import { expect, test } from '@playwright/test';

test('menu permite navegar no celular e fecha depois da escolha', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/home$/);
  await page.locator('ion-menu-button:visible').click();
  await page.locator('ion-menu ion-item[routerLink="/dentistas"]').click();
  await expect(page).toHaveURL(/\/dentistas$/);
  await expect(page.locator('ion-menu')).not.toHaveClass(/menu-enabled.*show-menu|show-menu/);
  await expect(page.locator('app-dentistas ion-title')).toHaveText('Dentistas');
});

test('rotas diretas e endereço inexistente', async ({ page }) => {
  for (const path of ['/dentistas/1', '/agendamentos', '/sobre']) {
    await page.goto(path);
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.locator('ion-menu-button:visible')).toBeVisible();
  }
  await page.goto('/pagina-inexistente');
  await expect(page).toHaveURL(/\/home$/);
});
