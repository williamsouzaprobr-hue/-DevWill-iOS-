# Plano de implementação — DevWill

## Escopo e abordagem

Adaptar a identidade e os fluxos do projeto iOS fornecido ao starter gerenciado Expo/React Native/TypeScript do WebDev. O aplicativo apresenta onboarding, painel inicial e as áreas Arquivos, Injetor, Limpeza, Laboratório de Papéis de Parede e Ajustes, com navegação móvel em retrato e português brasileiro por padrão.

O produto será um workspace local de demonstração. O usuário escolhe cada arquivo pelo seletor nativo; o app registra apenas nome, extensão e tamanho, sem copiar o conteúdo para o cache, descompactar, enviar ou executar o arquivo. Arquivos e pastas criados no workspace são metadados locais salvos com AsyncStorage. Ativação/restauração de patches e aplicação de papéis de parede são estados do workspace, não operações no iOS. A limpeza mostra itens demonstrativos limitados a `Library/Caches` e `tmp`, com seleção, resumo e confirmação, sem varrer nem apagar dados reais.

O runtime Expo do WebDev não tem autorização para ler contêineres de outros aplicativos, explorar o sistema iOS, executar exploits, injetar código ou modificar arquivos protegidos. Não habilitar armazenamento gerenciado adicional, autenticação, backend próprio ou chamadas à API; o servidor/banco automáticos do starter ficam sem uso pelo produto.

## Implementação e dependências

- Preservar o starter fixo Expo Router, React Native, TypeScript e NativeWind. Manter orientação portrait, identificadores gerados, scheme e `appSlug` existentes.
- Usar `expo-document-picker` para escolhas explícitas de arquivos; validar extensões `.3105` e `.tendies` quando iniciadas pelos seus fluxos específicos e persistir somente metadados.
- Persistir onboarding, idioma e listas locais pelo AsyncStorage; validar o formato dos registros carregados antes de passá-los às telas.
- Suportar interface em português do Brasil, inglês, vietnamita e chinês simplificado, com rótulos completos nas quatro opções.
- Implementar navegação inferior para cinco áreas e um atalho superior para Ajustes. O Explorador tem busca, breadcrumbs, criação e navegação de pastas, detalhes de metadados e importação para a pasta aberta.
- Pedir confirmação nas transições demonstrativas de patch, limpeza e papel de parede; mensagens devem dizer que não há mudança no sistema do aparelho.
- Reutilizar o ícone e a referência visual fornecidos. Atualizar nome visível, ícones e splash mantendo os IDs de plataforma.
- Entrega atualizada: fornecer o projeto preparado para GitHub Actions, com workflow que roda em runner macOS padrão `macos-15`, gera o projeto nativo pela CNG do Expo, compila Release para dispositivo sem assinatura e envia o `.ipa` como artifact. Não usar EAS, certificados, perfil, conta Apple, segredos nem publicação automática.
- O workflow será acionado em `push` para `main` e manualmente por `workflow_dispatch`. A preparação será validada estaticamente neste Sandbox Linux; não alegar que o build Xcode foi executado antes de uma execução real do workflow no GitHub.

## Estrutura do projeto

- `app/(tabs)/index.tsx`: estado do workspace, onboarding, persistência, seleção de arquivos, confirmações e navegação da seção ativa.
- `app/(tabs)/_layout.tsx`: Expo Router com cabeçalho/abas padrão ocultos.
- `components/devwill/ui.tsx`: tokens, cabeçalho, abas, botões, avisos de escopo, cartões e modal de confirmação.
- `components/devwill/screens/`: telas independentes para Início, Arquivos, Injetor, Limpeza, Papéis de Parede e Ajustes.
- `lib/devwill/types.ts`: modelos locais dos registros; `lib/devwill/strings.ts`: catálogo de texto para os quatro idiomas.
- `assets/images/`: identidade visual fornecida aplicada aos ícones e splash Expo.
- `app.config.ts`: nome e identidade Expo, metadado literal `logoUrl`, mantendo identificadores existentes.
- `.github/workflows/build.yml`: instalação congelada de dependências, validação TypeScript/lint, Expo prebuild iOS, CocoaPods, Xcode Release sem assinatura, verificação de bundle/ARM64 e upload do artifact.
- `BUILD-IOS-GITHUB-ACTIONS.md`: passos curtos para importar o projeto, acionar o workflow e baixar a IPA, com limites de custo público/privado.
- `plan.md` e `TODO.md`: decisões e progresso do produto/build.

## Design

### Movimento de design

Minimalismo utilitário inspirado em interfaces nativas do iOS, reinterpretado como workspace de ferramentas confiável e leve.

### Princípios centrais

1. Hierarquia imediata: cada tela comunica propósito, escopo e estado antes das ações.
2. Controles comedidos: listas e cartões claros, tipografia legível e ícones funcionais.
3. Consentimento visível: confirmação para limpeza e linguagem inequívoca para operações locais/simuladas.
4. Continuidade: navegação inferior persistente, rótulos consistentes e áreas de toque confortáveis.

### Filosofia de cor

Fundos cinza-claro e superfícies brancas ecoam as capturas fornecidas; grafite dá contraste; o laranja quente do ícone identifica ações e seleção. Verde fica reservado a estados prontos/concluídos. Evitar cor de alerta como decoração.

### Paradigma de layout

Composição vertical de cabeçalho compacto, cartões contextuais, breadcrumbs e listas escaneáveis, com conteúdo alinhado à esquerda. Uma barra inferior persistente dá acesso às cinco áreas. No topo, um atalho de Ajustes e indicador discreto de workspace.

### Elementos de assinatura

- Acento laranja em ícones, traços e estados selecionados.
- Cartões de superfície branca com cantos suaves e divisores discretos.
- A marca ilustrada fornecida como ícone, acompanhada do wordmark DevWill em tipografia de sistema.

### Filosofia de interação

Toques curtos e previsíveis; seleção destaca o item imediatamente; ações exigem resumo e confirmação explícita; os estados locais informam que nenhuma alteração no sistema do iPhone ocorreu.

### Animação

Transições curtas e discretas (aprox. 150–220 ms) para seleção de abas e modais, com leve mudança de opacidade/escala. Sem movimento contínuo, parallax decorativo ou animação que sugira execução de acesso privilegiado.

### Tipografia

Família nativa do sistema para leitura fluida em iOS e Android. Hierarquia: título forte, título de seção semibold, corpo legível e metadados menores com contraste suficiente.

### Essência da marca

“Um workspace claro para organizar seus projetos e pacotes móveis, com limites transparentes.” Personalidade: cuidadosa, direta, organizada.

### Voz da marca

Títulos claros e CTAs orientados à ação, sem promessas de acesso ao dispositivo. Exemplos: “Seu workspace, em ordem.” e “Selecione um pacote para adicionar ao espaço de trabalho.”

### Wordmark e logo

Usar o ícone ilustrado original do ZIP sem alterar sua arte; o wordmark textual DevWill acompanha a marca em tipografia de sistema.

### Cor de marca

Laranja quente inspirado no asset do app; cor exclusiva de ação/seleção, com neutros claros ao redor.

## Execução

Projeto Mobile gerenciado já inicializado com Expo Router/React Native/TypeScript/NativeWind, Metro/Web fixo em 8081 e endpoint API 3000. Diagnósticos TypeScript do Sandbox registrados. O app não depende das rotas de autenticação/API ou do banco provisionado pelo starter.
