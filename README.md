# HexPaleta 🎨

O **HexPaleta** é um Progressive Web App (PWA) minimalista em preto e branco projetado para gerar paletas de cores hexadecimais harmoniosas e estruturadas de acordo com os princípios clássicos da **teoria das cores**. O aplicativo funciona **100% offline**.

---

## 🚀 O que é um PWA?
Um **Progressive Web App (PWA)** combina o melhor da web e dos aplicativos móveis. Ele pode ser acessado diretamente pelo navegador sem instalação prévia, mas também oferece a opção de ser **instalado no seu celular ou computador** como um aplicativo nativo, com ícone próprio e suporte completo para funcionamento offline.

---

## 📖 Como Usar o App

1. **Escolher Cores Base (Opcional):** Utilize até 3 seletores de cor no topo para definir cores obrigatórias que devem compor a paleta. Se preferir criar livremente, limpe ou deixe os seletores padrão.
2. **Escolher Esquema de Cores:** Selecione o tipo de harmonia desejada no menu suspenso:
   - *Sorte do Dia (Livre)*
   - *Monocromática*
   - *Complementar*
   - *Análoga*
   - *Triádica*
   - *Mais Quentes*
   - *Mais Frias*
3. **Gerar Paleta:** Clique no botão **"Gerar Paleta"** para calcular e exibir os novos blocos de cores.
4. **Copiar Códigos HEX:** Clique no botão **"Copiar"** (`🖐️`) em qualquer bloco de cor para copiar instantaneamente o código hexadecimal para a sua área de transferência.
5. **Baixar Paleta:** Clique no botão **"Baixar Paleta (JSON)"** na parte inferior para exportar a paleta completa para o seu dispositivo.
6. **Alternar Tema:** Clique no botão `🌓` no topo à direita para alternar entre o modo claro e escuro.

---

## 🌐 Como Usar no Site (Sem Instalar)
Basta abrir o arquivo `index.html` ou o link publicado diretamente no seu navegador favorito. Nenhuma instalação é necessária para começar a criar.

---

## 📱 Como Instalar como Aplicativo

### 🤖 No Android (Chrome / Edge)
1. Acesse o site do app.
2. Toque no **menu de três pontos** (`⋮`) no canto superior direito.
3. Selecione **"Instalar aplicativo"** ou **"Adicionar à tela inicial"**.
4. Confirme. O ícone aparecerá na sua gaveta de aplicativos.

### 🍎 No iPhone e iPad (Safari)
1. Abra o site no navegador **Safari**.
2. Toque no botão **Compartilhar** (quadrado com seta para cima na barra inferior).
3. Selecione **"Adicionar à Tela de Início"** e confirme.

### 💻 No Computador (Chrome, Edge, Brave)
1. Acesse o site no navegador.
2. Clique no ícone de instalação na barra de endereços (ou abra o menu `⋮` > **Instalar HexPaleta...**).
3. Confirme. O app abrirá em uma janela própria dedicada.

---

## 💻 Como Instalar e Rodar Localmente

1. Baixe todos os arquivos do projeto para uma pasta local (`index.html`, `style.css`, `app.js`, `sw.js`, `manifest.json`, `logo.svg`).
2. Inicie um servidor HTTP local simples:
   - **Com Python 3:** `python -m http.server 8000`
   - **Com Node.js / npx:** `npx serve`
   - **Com VS Code:** Use a extensão *Live Server* e clique em "Go Live".
3. Acesse `http://localhost:8000` no seu navegador.

---


├── index.html
├── style.css
├── app.js
├── sw.js
├── manifest.json
├── logo.svg
└── README.md
