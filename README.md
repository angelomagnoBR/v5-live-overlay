# V5 Live Overlay

Overlay transparente para OBS com **Vitalidade**, **Força de Vontade** e **Fome** para Vampire: The Masquerade 5e no Foundry VTT.

## Como usar

1. Suba esta pasta para um repositório do GitHub.
2. Compacte o conteúdo em `v5-live-overlay.zip` para criar uma release.
3. No Foundry, instale usando a URL bruta do `module.json`.
4. Ative o módulo no mundo.
5. Crie um usuário chamado exatamente `OBS`.
6. Entre no mundo como `OBS` em uma fonte Browser Source do OBS.
7. Edite `scripts/overlay.js` e troque os nomes em `actorNames` pelos nomes exatos dos personagens.

## Campos usados

A Fome foi confirmada no sistema como:

```js
system.hunger.value
system.hunger.max
```

Vitalidade e Força de Vontade estão configuradas como:

```js
system.health.value
system.health.max
system.willpower.value
system.willpower.max
```

Se esses caminhos forem diferentes na sua ficha, basta alterar em `scripts/overlay.js`.

## URL para instalar no Foundry

Depois de subir para o GitHub, use este formato:

```txt
https://raw.githubusercontent.com/SEU-USUARIO/v5-live-overlay/main/module.json
```

Troque `SEU-USUARIO` pelo seu usuário do GitHub.
