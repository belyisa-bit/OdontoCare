import { expect, test } from '@playwright/test';

test('páginas privadas pedem login e preservam o destino ao alternar para cadastro', async ({ page }) => {
  for (const destination of ['/dentistas/1', '/agendamentos', '/perfil']) {
    await page.goto(destination);
    await expect(page).toHaveURL(new RegExp('/login\\?returnUrl=' + encodeURIComponent(destination) + '$'));
    await expect(page.getByRole('heading', { name: 'Que bom ter você aqui!' })).toBeVisible();
    await page.getByRole('link', { name: 'Cadastre-se', exact: true }).click();
    await expect(page).toHaveURL(new RegExp('/cadastro\\?returnUrl=' + encodeURIComponent(destination) + '$'));
  }
});

test('login valida campos e não aceita entrada fictícia sem servidor', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page.getByText('Informe um e-mail válido.', { exact: true })).toBeVisible();
  await page.getByLabel('E-mail', { exact: true }).fill('pessoa@exemplo.com');
  await page.getByLabel('Senha', { exact: true }).fill('Sorriso@2026');
  await page.getByRole('button', { name: 'Mostrar senha', exact: true }).click();
  await expect(page.getByLabel('Senha', { exact: true })).toHaveAttribute('type', 'text');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Acesso temporariamente indisponível');
  await expect(page).toHaveURL(/\/login$/);
});

test('cadastro verifica confirmação e mostra indisponibilidade sem registrar dados', async ({ page }) => {
  await page.goto('/cadastro');
  await page.getByLabel('Nome completo').fill('Maria Souza');
  await page.getByLabel('E-mail', { exact: true }).fill('maria@exemplo.com');
  await page.getByLabel('Senha', { exact: true }).fill('Sorriso@2026');
  await page.getByLabel('Confirmar senha', { exact: true }).fill('outra-senha');
  await page.getByRole('button', { name: 'Criar conta', exact: true }).click();
  await expect(page.getByText('As senhas precisam ser iguais.')).toBeVisible();
  await page.getByLabel('Confirmar senha', { exact: true }).fill('Sorriso@2026');
  await page.getByRole('button', { name: 'Criar conta', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Cadastro temporariamente indisponível');
  await expect(page).toHaveURL(/\/cadastro$/);
});

test('requisitos da senha atualizam enquanto a pessoa digita', async ({ page }) => {
  await page.goto('/cadastro');
  const requirements = page.locator('.password-requirements li');
  const password = page.getByLabel('Senha', { exact: true });
  await expect(requirements).toHaveCount(5);
  await expect(page.locator('.password-requirements li.met')).toHaveCount(0);
  await password.fill('A');
  await expect(requirements.nth(1)).toHaveClass('met');
  await expect(requirements.nth(2)).not.toHaveClass('met');
  await password.fill('Ab');
  await expect(page.locator('.password-requirements li.met')).toHaveCount(2);
  await password.fill('Abcdef1!');
  await expect(page.locator('.password-requirements li.met')).toHaveCount(5);
  await password.fill('Abcdef1');
  await expect(requirements.nth(0)).not.toHaveClass('met');
  await expect(requirements.nth(4)).not.toHaveClass('met');
  await password.clear();
  await expect(page.locator('.password-requirements li.met')).toHaveCount(0);
});
