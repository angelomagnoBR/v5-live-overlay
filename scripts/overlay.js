/**
 * V5 Live Overlay
 * Overlay transparente para OBS com Vitalidade, Força de Vontade e Fome.
 *
 * Como usar:
 * 1. Crie um usuário no Foundry chamado exatamente "OBS".
 * 2. Ative este módulo no mundo.
 * 3. Entre no mundo como usuário OBS em uma aba/janela separada ou Browser Source do OBS.
 * 4. Edite ACTOR_NAMES abaixo com os nomes exatos dos personagens.
 */

const V5_LIVE_OVERLAY = {
  // Nome exato do usuário que verá SOMENTE o overlay.
  obsUserName: "OBS",

  // Coloque aqui os nomes EXATOS dos Actors/personagens no Foundry.
  actorNames: [
    "Alastair MacLeod",
    "Velvet"
  ],

  // Caminhos testados para o sistema Vampire: The Masquerade 5e.
  // Fome já confirmada: system.hunger.value / system.hunger.max
  paths: {
    hungerValue: "system.hunger.value",
    hungerMax: "system.hunger.max",

    healthValue: "system.health.value",
    healthMax: "system.health.max",

    willpowerValue: "system.willpower.value",
    willpowerMax: "system.willpower.max"
  },

  // true = mostra nome do personagem no card.
  showName: true
};

Hooks.once("ready", () => {
  if (game.user.name !== V5_LIVE_OVERLAY.obsUserName) return;

  document.body.classList.add("v5-live-overlay-mode");

  v5CreateOverlayRoot();
  v5RenderOverlay();

  Hooks.on("updateActor", (actor) => {
    if (V5_LIVE_OVERLAY.actorNames.includes(actor.name)) {
      v5RenderOverlay();
    }
  });

  Hooks.on("createActor", v5RenderOverlay);
  Hooks.on("deleteActor", v5RenderOverlay);

  // Atualização de segurança caso algum sistema altere dados sem disparar updateActor como esperado.
  setInterval(v5RenderOverlay, 3000);
});

function v5CreateOverlayRoot() {
  document.getElementById("v5-live-overlay")?.remove();

  const overlay = document.createElement("main");
  overlay.id = "v5-live-overlay";
  overlay.setAttribute("aria-label", "V5 Live Overlay");
  document.body.appendChild(overlay);
}

function v5RenderOverlay() {
  const overlay = document.getElementById("v5-live-overlay");
  if (!overlay) return;

  overlay.innerHTML = "";

  const actors = V5_LIVE_OVERLAY.actorNames
    .map((name) => game.actors.find((actor) => actor.name === name))
    .filter(Boolean);

  if (!actors.length) {
    const warning = document.createElement("div");
    warning.className = "v5-overlay-warning";
    warning.textContent = "Nenhum Actor encontrado. Confira os nomes em scripts/overlay.js.";
    overlay.appendChild(warning);
    return;
  }

  for (const actor of actors) {
    overlay.appendChild(v5CreateActorCard(actor));
  }
}

function v5CreateActorCard(actor) {
  const card = document.createElement("section");
  card.className = "v5-player-card";
  card.dataset.actorName = actor.name;

  if (V5_LIVE_OVERLAY.showName) {
    const title = document.createElement("div");
    title.className = "v5-player-name";
    title.textContent = actor.name;
    card.appendChild(title);
  }

  const healthValue = v5ReadNumber(actor, V5_LIVE_OVERLAY.paths.healthValue, 0);
  const healthMax = v5ReadNumber(actor, V5_LIVE_OVERLAY.paths.healthMax, 5);
  card.appendChild(v5CreateSquareRow("Vitalidade", healthValue, healthMax));

  const willpowerValue = v5ReadNumber(actor, V5_LIVE_OVERLAY.paths.willpowerValue, 0);
  const willpowerMax = v5ReadNumber(actor, V5_LIVE_OVERLAY.paths.willpowerMax, 5);
  card.appendChild(v5CreateSquareRow("Vontade", willpowerValue, willpowerMax));

  const hungerValue = v5ReadNumber(actor, V5_LIVE_OVERLAY.paths.hungerValue, 0);
  const hungerMax = v5ReadNumber(actor, V5_LIVE_OVERLAY.paths.hungerMax, 5);
  card.appendChild(v5CreateDotRow("Fome", hungerValue, hungerMax));

  return card;
}

function v5CreateSquareRow(label, value, max) {
  const row = v5CreateRow(label);
  const marks = row.querySelector(".v5-marks");

  const safeMax = Math.max(0, Number(max) || 0);
  const safeValue = Math.max(0, Number(value) || 0);

  for (let i = 1; i <= safeMax; i++) {
    const box = document.createElement("span");
    box.className = "v5-box";
    if (i <= safeValue) box.classList.add("v5-box-filled");
    marks.appendChild(box);
  }

  return row;
}

function v5CreateDotRow(label, value, max) {
  const row = v5CreateRow(label, "v5-hunger-row");
  const marks = row.querySelector(".v5-marks");

  const safeMax = Math.max(0, Number(max) || 0);
  const safeValue = Math.max(0, Number(value) || 0);

  for (let i = 1; i <= safeMax; i++) {
    const dot = document.createElement("span");
    dot.className = "v5-dot";
    if (i <= safeValue) dot.classList.add("v5-dot-filled");
    marks.appendChild(dot);
  }

  return row;
}

function v5CreateRow(label, extraClass = "") {
  const row = document.createElement("div");
  row.className = `v5-stat-row ${extraClass}`.trim();

  const labelEl = document.createElement("div");
  labelEl.className = "v5-stat-label";
  labelEl.textContent = label;

  const marks = document.createElement("div");
  marks.className = "v5-marks";

  row.appendChild(labelEl);
  row.appendChild(marks);

  return row;
}

function v5ReadNumber(actor, path, fallback = 0) {
  const raw = foundry.utils.getProperty(actor, path);

  // Alguns sistemas guardam recursos como { value, max } em objetos diferentes.
  if (typeof raw === "object" && raw !== null && "value" in raw) {
    const nested = Number(raw.value);
    return Number.isFinite(nested) ? nested : fallback;
  }

  const number = Number(raw);
  return Number.isFinite(number) ? number : fallback;
}
