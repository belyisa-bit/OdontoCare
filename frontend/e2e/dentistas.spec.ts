import { expect, test } from '@playwright/test';

test('seleção da Home filtra dentistas e busca sem acentos funciona', async ({ page }) => {
  await page.goto('/home');
  await page.getByRole('link', { name: 'Ortodontia', exact: true }).click();
  await expect(page.locator('.dentist-card')).toHaveCount(2);
  await expect(page.getByRole('button', { name: 'Ortodontia', exact: true })).toHaveAttribute('aria-pressed', 'true');
  const search = page.locator('ion-searchbar input');
  await search.fill('marina');
  await expect(page.locator('.dentist-card')).toHaveCount(1);
  await expect(page.locator('.dentist-card')).toContainText('Marina Souza');
  await expect(page).toHaveURL(/q=marina/);
  await page.getByRole('button', { name: 'Limpar filtros', exact: true }).click();
  await expect(page.locator('.dentist-card')).toHaveCount(12);
  await search.fill('andre clinico');
  await expect(page.locator('.dentist-card')).toHaveCount(1);
  await page.locator('.dentist-card').click();
  await expect(page).toHaveURL(/\/dentistas\/12$/);
});

test('filtro direto na URL, sem resultados e limpeza', async ({ page }) => {
  await page.goto('/dentistas?especialidade=Endodontia');
  await expect(page.locator('.dentist-card')).toHaveCount(1);
  await page.locator('ion-searchbar input').fill('sem-correspondencia');
  await expect(page.getByRole('heading', { name: 'Nenhum profissional encontrado' })).toBeVisible();
  await page.getByRole('button', { name: 'Limpar busca e filtros', exact: true }).click();
  await expect(page.locator('.dentist-card')).toHaveCount(12);
  await expect(page).toHaveURL(/\/dentistas$/);
});

test('falha na fonte de dados mostra erro e nova tentativa recupera a lista', async ({ page }) => {
  await page.route('**/assets/data/dentistas-demo.json', (route) =>
    route.fulfill({ status: 503, body: 'Unavailable' }),
  );
  await page.goto('/dentistas');
  await expect(page.getByRole('heading', { name: 'Não foi possível carregar os dentistas' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Nenhum profissional encontrado' })).not.toBeVisible();
  await page.unroute('**/assets/data/dentistas-demo.json');
  await page.getByRole('button', { name: 'Tentar novamente', exact: true }).click();
  await expect(page.locator('.dentist-card')).toHaveCount(12);
});
