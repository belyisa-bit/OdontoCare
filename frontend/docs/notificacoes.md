# Integração dos lembretes

## Entrega atual

Painel do sino com estados desconectado, carregando, vazio, erro e lista; contador de não lidos e ações de leitura. O serviço é compartilhado entre páginas e limpa os dados ao sair ou trocar de conta. Não contém consultas de exemplo nem solicita permissões do celular.

## Login e API (pendentes)

O login deve chamar NotificationsService.setSession(idDaConta) ao autenticar e setSession(null) ao sair. Registrar um adapter por NOTIFICATION_GATEWAY com load() e markRead(ids), usando a autenticação do projeto. Depois de autenticar, chamar refresh(). A API deve identificar a conta pela sessão autenticada e autorizar cada leitura: setSession é estado de interface, não controle de acesso.

AppointmentNotification contém id, title, message, createdAt (ISO 8601 com fuso) e read. A API deve retornar somente os avisos da conta. A leitura só muda na interface após a confirmação do servidor. Falhas não são apresentadas como lista vazia. Nenhum dado do paciente fica em localStorage.

Não usar GET /api/agendamentos atual para preencher esse painel: ele lista os agendamentos de todos os pacientes e ainda não tem filtro por sessão.

## Envio real (pendente)

Confirmação de consulta e lembrete 24 horas antes serão gerados no backend, respeitando a conta e evitando duplicatas. Data e horário da consulta devem ter fuso definido. Cancelar ou remarcar deve atualizar os lembretes pendentes.

Web Push exige publicação HTTPS, service worker, inscrição do aparelho, credenciais de envio no servidor e permissão solicitada por ação explícita do usuário. No iPhone, o usuário deve adicionar o site à Tela de Início e abrir por ela. Desvincular a inscrição da conta ao sair e permitir desativar os avisos. Preferir mensagens discretas na tela bloqueada, sem paciente ou tratamento.

Não há agendador push, adapter HTTP ou login implementados nesta feature. O painel atual é a base de frontend para essas integrações; não envia notificações com o site fechado.