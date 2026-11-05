import { expect, test } from '@playwright/test';

test('menu permite navegar no celular e fecha depois da escolha', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/home$/);
  await page.locator('ion-menu-button:visible').click();
  await page.locator('ion-menu ion-item[routerLink="/dentistas"]').click();
  await expect(page).toHaveURL(/\/dentistas$/);
  await expect(page.locator('ion-menu')).not.toHaveClass(/menu-enabled.*show-menu|show-menu/);
  await expect(page.locator('app-dentistas h1')).toHaveText('Dentistas');
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

test('card preserva a especialidade escolhida na navegação', async ({ page }) => {
  await page.goto('/home');
  await page.getByRole('link', { name: 'Ortodontia', exact: true }).click();
  await expect(page).toHaveURL(/\/dentistas\?especialidade=Ortodontia$/);
});

test('sino apresenta o estado desconectado sem pedir permissão de notificações', async ({ page }) => {
  await page.goto('/home');
  await page.getByRole('button', { name: 'Abrir lembretes' }).click();
  await expect(page.getByText('Seus lembretes, em um só lugar')).toBeVisible();
});

test('menu e lembretes funcionam pelo teclado e devolvem o foco', async ({ page }) => {
  await page.goto('/home');
  const menuButton = page.locator('ion-menu-button:visible').locator('button');
  const firstLink = page.locator('ion-menu ion-item').first().locator('a');
  const lastLink = page.locator('ion-menu ion-item').last().locator('a');
  await menuButton.focus();
  await page.keyboard.press('Enter');
  await expect(firstLink).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(lastLink).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(firstLink).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menuButton).toBeFocused();
  const bellButton = page.locator('.reminder-button:visible').locator('button');
  await bellButton.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText('Seus lembretes, em um só lugar')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('ion-popover')).not.toBeVisible();
  await expect(bellButton).toBeFocused();
});
