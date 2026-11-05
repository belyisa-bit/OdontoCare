# Retratos fictícios dos dentistas

As 12 imagens foram geradas com a ferramenta integrada imagegen para o projeto acadêmico OdontoCare. Não foram copiadas de perfis de profissionais reais. A página informa que os perfis e fotos são fictícios.

## Arquivos

As versões finais estão em src/assets/images/dentistas, no formato WebP com 400 pixels de largura, mantendo a proporção da geração original. Nomes: ana-bezerra.webp, lucas-martins.webp, carla-santos.webp, renato-lima.webp, juliana-costa.webp, rafael-mendes.webp, fernanda-alves.webp, pedro-oliveira.webp, camila-rocha.webp, bruno-ferreira.webp, marina-souza.webp e andre-ribeiro.webp.

## Prompt de geração

Foi feita uma geração independente por perfil. Em cada chamada, DESCRIPTION foi substituído pela descrição da tabela abaixo.

```text
Asset: one square professional headshot photo for a fictional dentist in a university demo directory. A fully fictional adult DESCRIPTION. Friendly natural smile, white dental coat over pale blue scrubs, no stethoscope, no tools, no badge text. Clean studio photography, soft diffuse frontal daylight, very pale blue seamless background (#e5f2fd), natural skin texture, realistic proportions. Consistent composition: front-facing head and shoulders, entire hair visible with generous headroom, face centered at 50% horizontal and 42% vertical, shoulders included, crop at upper chest, no hands. Professional yet approachable. Single individual only. No text, logos, watermarks, borders, collages, frames, props or other people. This is a standalone generated photograph, not a UI screenshot.
```

| Perfil fictício | DESCRIPTION |
| --- | --- |
| Ana Bezerra | woman, early 30s, shoulder-length dark brown hair, light olive skin, brown eyes |
| Lucas Martins | man, late 30s, short dark brown hair, medium tan skin, neatly trimmed short beard |
| Carla Santos | woman, early 40s, dark skin, natural curly black hair to shoulders, brown eyes |
| Renato Lima | man, mid 40s, light skin, short chestnut hair, subtle rectangular glasses, clean-shaven |
| Juliana Costa | woman, mid 30s, medium brown skin, long wavy dark brown hair pulled behind shoulders |
| Rafael Mendes | man, early 30s, warm brown skin, short curly black hair, clean-shaven |
| Fernanda Alves | woman, early 40s, light skin, straight shoulder-length chestnut hair, fine oval glasses |
| Pedro Oliveira | man, early 50s, olive skin, short salt-and-pepper hair, neatly trimmed beard |
| Camila Rocha | woman, late 20s, medium tan skin, dark wavy bob haircut |
| Bruno Ferreira | man, early 40s, dark skin, closely cropped black hair, clean-shaven |
| Marina Souza | woman, late 30s, fair skin, shoulder-length auburn hair, brown eyes |
| André Ribeiro | man, mid 30s, light olive skin, short straight black hair, subtle dark glasses, clean-shaven |

Apenas o tamanho e a codificação foram ajustados na exportação WebP. O conteúdo dos retratos foi mantido. No card, object-fit: cover adapta o enquadramento ao espaço disponível. Se uma foto falhar, a interface mostra as iniciais do nome.