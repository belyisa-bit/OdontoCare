# Listagem de dentistas

A página /dentistas usa o mesmo cabeçalho e rodapé da Home. Permite busca por nome, especialidade ou CRO; filtros combinados; limpeza; contagem de resultados; estados de carregamento, erro com nova tentativa e lista sem resultados.

## Fonte atual

Os 12 profissionais de assets/data/dentistas-demo.json são fictícios e a tela informa isso. Não foram inventados registros CRO, avaliações, endereços ou contatos. A estrutura dos dados acompanha DentistaDTO do backend.

O backend atual não expõe um endpoint para listar dentistas. Quando estiver disponível, substituir a fonte em DentistasService.listar() por um adapter para esse endpoint, mantendo o retorno Promise<Dentista[]> ou ajustando o componente em conjunto. A página não usa a lista global de agendamentos.

## Navegação e filtros

- /dentistas: lista completa.
- /dentistas?especialidade=Ortodontia: especialidade vinda da Home.
- /dentistas?q=ana&especialidade=Ortodontia: busca e filtro combinados.
- O texto é normalizado para aceitar busca sem acentos e sem diferença de maiúsculas.
- Os filtros ficam na URL para sobreviver ao recarregamento.
- Os cards abrem /dentistas/:id. A página de detalhes continua sendo apenas a estrutura, para implementação na feat correspondente.
- As dez especialidades estão em core/models/especialidade.model.ts, compartilhadas pela Home e pelos filtros.

A lista de demonstração será substituída pela API; nenhum cadastro real ou agendamento é realizado nesta feature.
## Retratos de demonstração

As fotos foram geradas por IA para estes perfis fictícios e ficam em assets/images/dentistas. Não representam profissionais reais. A propriedade fotoUrl é opcional; em caso de falha no carregamento, o card apresenta as iniciais do nome. As imagens usam WebP, carregamento sob demanda e dimensões reservadas para evitar alterações no layout.
