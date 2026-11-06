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
  await page.route('**/api/auth/login', (route) => route.abort());
  await page.goto('/login');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page.getByText('Informe um e-mail válido.', { exact: true })).toBeVisible();
  await page.getByLabel('E-mail', { exact: true }).fill('pessoa@exemplo.com');
  await page.getByLabel('Senha', { exact: true }).fill('Sorriso@2026');
  await page.getByRole('button', { name: 'Mostrar senha', exact: true }).click();
  await expect(page.getByLabel('Senha', { exact: true })).toHaveAttribute('type', 'text');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Não foi possível conectar ao servidor');
  await expect(page).toHaveURL(/\/login$/);
});

test('cadastro verifica confirmação e mostra indisponibilidade sem registrar dados', async ({ page }) => {
  await page.route('**/api/auth/register', (route) => route.abort());
  await page.goto('/cadastro');
  await page.getByLabel('Nome completo').fill('Maria Souza');
  await page.getByLabel('E-mail', { exact: true }).fill('maria@exemplo.com');
  await page.getByLabel('Senha', { exact: true }).fill('Sorriso@2026');
  await page.getByLabel('Confirmar senha', { exact: true }).fill('outra-senha');
  await page.getByRole('button', { name: 'Criar conta', exact: true }).click();
  await expect(page.getByText('As senhas precisam ser iguais.')).toBeVisible();
  await page.getByLabel('Confirmar senha', { exact: true }).fill('Sorriso@2026');
  await page.getByRole('button', { name: 'Criar conta', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Não foi possível conectar ao servidor');
  await expect(page).toHaveURL(/\/cadastro$/);
});

test('requisitos da senha atualizam enquanto a pessoa digita', async ({ page }) => {
  await page.route('**/api/auth/register', (route) => route.abort());
  await page.goto('/cadastro');
  const requirements = page.locator('.password-requirements li');
  const password = page.getByLabel('Senha', { exact: true });
  await expect(requirements).toHaveCount(6);
  await expect(page.locator('.password-requirements li.met')).toHaveCount(0);
  await password.fill('A');
  await expect(requirements.nth(1)).toHaveClass('met');
  await expect(requirements.nth(2)).not.toHaveClass('met');
  await password.fill('Ab');
  await expect(page.locator('.password-requirements li.met')).toHaveCount(3);
  await password.fill('Abcdef1!');
  await expect(page.locator('.password-requirements li.met')).toHaveCount(6);
  await password.fill('Abcdef1');
  await expect(requirements.nth(0)).not.toHaveClass('met');
  await expect(requirements.nth(4)).not.toHaveClass('met');
  await password.clear();
  await expect(page.locator('.password-requirements li.met')).toHaveCount(0);
});

test('login real via contrato HTTP preserva destino, restaura sessão e sai localmente', async ({ page }) => {
  const account = { id: 7, nome: 'Maria Souza', email: 'maria@exemplo.com' };
  await page.route('**/api/auth/login', async (route) => {
    expect(route.request().postDataJSON()).toEqual({ email: account.email, senha: 'Sorriso@2026' });
    await route.fulfill({ json: { ...account, token: 'test-token' } });
  });
  await page.route('**/api/auth/me', async (route) => {
    expect(route.request().headers()['authorization']).toBe('Bearer test-token');
    await route.fulfill({ json: account });
  });
  await page.goto('/perfil');
  await page.getByLabel('E-mail', { exact: true }).fill(account.email);
  await page.getByLabel('Senha', { exact: true }).fill('Sorriso@2026');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page).toHaveURL(/\/perfil$/);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Perfil', exact: true })).toBeVisible();
  await page.locator('ion-menu-button:visible').click();
  await page.getByText('Sair da conta', { exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
  expect(await page.evaluate(() => localStorage.getItem('odontocare.auth.token'))).toBeNull();
});

test('cadastro entra automaticamente e email duplicado tem mensagem específica', async ({ page }) => {
  let duplicate = true;
  const account = { id: 7, nome: 'Maria Souza', email: 'maria@exemplo.com' };
  await page.route('**/api/auth/register', (route) =>
    duplicate
      ? route.fulfill({ status: 409, json: {} })
      : route.fulfill({ status: 201, json: { ...account, token: 'registered-token' } }),
  );
  await page.goto('/cadastro');
  await page.getByLabel('Nome completo').fill(account.nome);
  await page.getByLabel('E-mail', { exact: true }).fill(account.email);
  async function password() {
    await page.getByLabel('Senha', { exact: true }).fill('Sorriso@2026');
    await page.getByLabel('Confirmar senha', { exact: true }).fill('Sorriso@2026');
  }
  await password();
  await page.getByRole('button', { name: 'Criar conta', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Este e-mail já está cadastrado');
  duplicate = false;
  await password();
  await page.getByRole('button', { name: 'Criar conta', exact: true }).click();
  await expect(page).toHaveURL(/\/home$/);
  expect(await page.evaluate(() => localStorage.getItem('odontocare.auth.token'))).toBe('registered-token');
});

test('token expirado não libera página privada após recarregar', async ({ page }) => {
  await page.goto('/home');
  await page.evaluate(() => localStorage.setItem('odontocare.auth.token', 'expired-token'));
  await page.route('**/api/auth/me', (route) => route.fulfill({ status: 401, json: {} }));
  await page.goto('/agendamentos');
  await expect(page).toHaveURL(/\/login\?returnUrl=%2Fagendamentos$/);
  expect(await page.evaluate(() => localStorage.getItem('odontocare.auth.token'))).toBeNull();
});
