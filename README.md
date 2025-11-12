# 🚀 Projeto Guia Santa Cruz (Aplicativo)

Aplicativo (React Native + Expo) de guia turístico e comercial para a cidade de Santa Cruz dos Milagres. Este repositório contém o **Frontend (o Aplicativo)**.

O cérebro (API Node.js) desse projeto está em outro repositório: [LINK-DO-REPO-DA-API-AQUI]

---

## ✨ Features Atuais (O que já tá funcionando)

* [x] Autenticação de Usuário (Login e Cadastro)
* [x] Visualização do Mapa com locais (HU5) - *Status: Dados Mockados (JSON)*
* [x] Filtro de Locais por Categoria (HU6)
* [x] Detalhes do Local (em `Alert`) (HU8)
* [x] Layout do Menu de Navegação (Tabs)
* [x] Layout da Barra de Busca (HU7 - Visual)
* [ ] **(Próximo):** `HU7 (Lógica)`: Fazer a Busca funcionar.
* [ ] `HU3`: Formulário de Submissão de Local (Dono)
* [ ] `HU4`: Painel de Validação (Admin)
* [ ] `HU8 (Refatoração)`: Tela de Detalhes Completa

---

## 🛠️ Tecnologias Utilizadas

* **React Native** (com **Expo**)
* **Expo Router** (para navegação)
* **Axios** (para chamar a API)
* **React Native Maps** (para o mapa)
* **TypeScript**

---

## 🏁 Como Rodar (Instalação)

1.  **Clone o repositório:**
    ```bash
    git clone [LINK-DO-TEU-REPO-GIT-AQUI]
    cd app-santa-cruz
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Execute o projeto (com Expo Go):**
    ```bash
    npx expo start --clear
    ```
    (Aí é só ler o QR Code com o Expo Go no celular).
