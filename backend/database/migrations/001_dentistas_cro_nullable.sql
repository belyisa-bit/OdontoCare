-- Bancos existentes: executar antes de iniciar a carga de dentistas.
-- Os dados de demonstracao nao possuem CRO; a restricao UNIQUE e preservada.
ALTER TABLE dentistas ALTER COLUMN cro DROP NOT NULL;
