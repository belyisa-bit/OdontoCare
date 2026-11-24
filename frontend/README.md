# OdontoCare — frontend

Base em Ionic com Angular. Requer Node.js e npm compatíveis com as versões do package.json.

## Executar

Na pasta frontend, execute npm ci e depois npm start. Abra http://localhost:4200.

## Verificações

- npm run lint
- npm run build
- npm run test:unit
- npm run test:e2e (requer os navegadores do Playwright instalados)

## Rotas

/home, /dentistas, /dentistas/:id, /agendamentos e /sobre. Endereços inexistentes voltam para /home.

Esta entrega inclui somente a estrutura, rotas e menu responsivo. Conteúdo das páginas, integração com a API, pipes e diretivas serão desenvolvidos nas respectivas features.
