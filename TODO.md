# TODO — DevWill

- [x] **Onboarding e painel inicial**
  - Onboarding inicial com apresentação do DevWill e entrada no workspace móvel.
  - Painel inicial preservando a identidade visual do projeto de referência e oferecendo acesso rápido às áreas Arquivos, Injetor, Limpeza e Laboratório de Papéis de Parede.

- [x] **Navegação do workspace**
  - Navegação móvel consistente entre as áreas principais, Ajustes e telas informativas.

- [x] **Arquivos do workspace**
  - Explorador para organizar e navegar pelos arquivos de aplicativos dentro dos limites de armazenamento e permissões disponíveis no ambiente WebDev.
  - No workspace local, permitir buscar, abrir pastas, navegar por breadcrumbs, criar pastas, ver detalhes e selecionar arquivos manualmente; salvar somente metadados. Não copiar bytes para cache, ler conteúdo ou enviar arquivos.

- [x] **Criação e importação de patches**
  - Fluxo do Injetor para criar e importar patches portáteis no formato `.3105`; a criação/importação registra apenas metadados locais e não executa o conteúdo.

- [x] **Estados e controle de patches**
  - Gerenciamento de patches `.3105` com ativação, desativação e restauração, incluindo estados e confirmações claras; tais estados são demonstrativos e não aplicam alterações no iOS.

- [x] **Limpeza delimitada e confirmada**
  - Limpeza restrita a itens demonstrativos em `Library/Caches` e `tmp`, com seleção, resumo da ação e confirmação antes de remover linhas da demonstração; nenhum arquivo real é examinado ou apagado.

- [x] **Pacotes de papéis de parede**
  - Importação e gerenciamento de metadados dos pacotes de papel de parede `.tendies`, escolhidos pelo usuário; não descompactar nem enviar o conteúdo.

- [x] **Laboratório de Papéis de Parede**
  - Laboratório de Papéis de Parede para visualizar, organizar e marcar como aplicado no workspace os conteúdos importados; não altera o papel de parede do aparelho.

- [x] **Ajustes e informações**
  - Ajustes com seleção de idioma (Português do Brasil, inglês, vietnamita e chinês simplificado), informações do aplicativo e créditos, preservando o conteúdo e os fluxos documentados no projeto iOS.

- [x] **Referências visuais a repositório/projeto de origem**
  - Remover da interface botão, ícone, link ou seção que direcione ao repositório; remover a notificação visual que direciona ao repositório; remover referências visuais ao repositório, preservando o layout, cores, ícones, identidade e funcionalidades não relacionadas. Não alterar mecanismos de segurança, verificação de integridade ou componentes privilegiados. A auditoria não encontrou botão/link/notificação; a indicação visual para LICENSE/THIRD_PARTY_NOTICES no projeto de origem foi removida das quatro traduções, mantendo os créditos.

- [x] **Workflow macOS para IPA iOS sem assinatura**
  - `.github/workflows/build.yml` instala dependências com `pnpm-lock.yaml`, roda typecheck/lint, gera o diretório iOS Expo, instala CocoaPods, executa Xcode em Release para `iphoneos` com assinatura desativada, valida `Payload/<app>.app/Info.plist`, executável ARM64 e bundle identifier, e envia `DevWill-unsigned.ipa` no artifact `DevWill-unsigned-ios-ipa`. Dispara manualmente ou em pushes para `main`; não publica o app.

- [x] **Instruções para execução futura**
  - `BUILD-IOS-GITHUB-ACTIONS.md` explica como colocar o conteúdo do ZIP na raiz do repositório, iniciar/baixar a Action e informa que runner padrão é gratuito em repositório público; repositório privado consome saldo computacional ou pode incorrer em cobrança.

- [ ] **Execução real do build macOS**
  - O workflow deve concluir numa execução de GitHub Actions com IPA anexado e validação de bundle/ARM64. Este ambiente não tem macOS/Xcode e a sessão GitHub não está conectada; portanto, nenhuma execução ou IPA foi confirmada nesta etapa.

> Limites do runtime: arquivos são selecionados pelo usuário e representados no workspace; não há leitura de contêineres de outros apps, exploração do iOS, execução de exploit, injeção de código, exclusão real em caminhos de sistema ou instalação de wallpapers no aparelho.

> Revisão independente somente leitura: concluída; foram incorporadas validação das listas persistidas, ausência de cópia para cache, rótulos acessíveis e navegação/criação de pastas.
