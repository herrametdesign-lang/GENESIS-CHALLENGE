(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const KEY = "genesis.referrals.demo.v1";

  let data = {};
  try {
    data = JSON.parse(localStorage.getItem(KEY)) || {};
  } catch (_) {}

  if (!data.code) {
    data.code = "GEN-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  }

  data.shares = Number(data.shares || 0);
  data.visits = Number(data.visits || 0);
  data.pending = Number(data.pending || 0);
  data.valid = Number(data.valid || 0);

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (_) {}
  }

  function refresh() {
    $("referralCode").textContent = data.code;
    $("referralShares").textContent = data.shares;
    $("referralVisits").textContent = data.visits;
    $("referralPending").textContent = data.pending;
    $("referralValid").textContent = data.valid;
  }

  const incoming = new URLSearchParams(location.search).get("ref");

  if (incoming && incoming !== data.code) {
    const visitKey = "genesis.referral.visited." + incoming;
    try {
      if (!localStorage.getItem(visitKey)) {
        localStorage.setItem(visitKey, "1");
        data.visits++;
        data.pending++;
      }
    } catch (_) {}
  }

  $("referralsLaunch").addEventListener("click", () => {
    $("gameStage").dataset.view = "referrals";
    refresh();
  });

  $("referralsBack").addEventListener("click", () => {
    $("gameStage").dataset.view = "home";
  });

  $("referralShare").addEventListener("click", async () => {
    const url = new URL(location.href);
    url.searchParams.set("ref", data.code);

    const shareData = {
      title: "GENESIS CHALLENGE",
      text: "Te invito a probar GENESIS CHALLENGE. ¡Sumate al desafío!",
      url: url.href
    };

    data.shares++;
    save();
    refresh();

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        $("referralStatus").textContent =
          "Panel de compartir utilizado. El envío no puede confirmarse desde GENESIS.";
      } else if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url.href);
        $("referralStatus").textContent = "Enlace copiado.";
      } else {
        $("referralStatus").textContent = "Enlace para compartir: " + url.href;
      }
    } catch (error) {
      $("referralStatus").textContent =
        error.name === "AbortError"
          ? "Compartir cancelado. El intento quedó registrado."
          : "No se pudo compartir. Podés copiar el enlace manualmente: " + url.href;
    }
  });

  save();
  refresh();

  $("referralStatus").textContent = incoming
    ? "Código de invitación detectado."
    : "Tu código personal está listo.";

})();