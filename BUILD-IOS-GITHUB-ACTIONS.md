# Build iOS do DevWill pelo GitHub Actions

O projeto usa Expo/React Native e gera o diretório iOS a partir da configuração Expo pela CNG (`expo prebuild`).[3] O workflow `.github/workflows/build.yml` gera esse projeto, instala CocoaPods e compila Release num runner macOS padrão do GitHub. Não usa EAS, conta Apple, certificado, perfil de provisionamento ou segredo.

## Como executar

1. Extraia o ZIP e envie **o conteúdo da pasta `DevWill/`** para a raiz de um repositório GitHub.
2. Para usar runners macOS padrão sem custo do GitHub Actions, o repositório deve ser público. Se o código precisar permanecer privado, o uso entra no saldo computacional incluído do plano e poderá ter cobrança quando ele acabar. Confira a política vigente antes de executar. [1] [2]
3. Envie `main` ao GitHub: o build dispara automaticamente. Para repetir depois, abra **Actions → Build DevWill iOS IPA (unsigned) → Run workflow**.
4. Quando a execução terminar com sucesso, baixe o artifact **`DevWill-unsigned-ios-ipa`** na página dessa execução. O workflow interrompe com mensagem de erro se instalação, prebuild, CocoaPods, compilação, validação da estrutura ou upload falhar.

A compilação usa `CODE_SIGNING_ALLOWED=NO`, `CODE_SIGNING_REQUIRED=NO` e identidade vazia, opções de build relacionadas à assinatura no Xcode.[4] Em seguida, o workflow empacota o app em `Payload/<app>.app` dentro do arquivo `.ipa`. Ele valida a presença de `Info.plist`, executável ARM64 e o bundle identifier configurado antes de enviar o artifact. A IPA é unsigned e não será instalada diretamente pelo iOS; use o processo de assinatura que você escolher. A compatibilidade desse pacote com eSign/GBox não foi testada aqui.

O projeto contém um workflow pronto, mas não foi executado nesta sessão. A primeira execução real ocorre no GitHub Actions, que é quem fornece o runner macOS/Xcode. Portanto, a compilação só estará confirmada depois de uma execução bem-sucedida, com o artifact disponível.

## Referências oficiais

[1]: https://docs.github.com/en/actions/reference/runners/github-hosted-runners "GitHub-hosted runners reference"
[2]: https://docs.github.com/billing/managing-billing-for-github-actions/about-billing-for-github-actions "GitHub Actions billing"
[3]: https://docs.expo.dev/workflow/prebuild/ "Expo Prebuild"
[4]: https://developer.apple.com/documentation/xcode/build-settings-reference "Xcode build settings reference"
