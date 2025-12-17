const PROXY_URL = "http://192.168.45.231:3000/proxy";
const AUTH_SECRET = "some-secret";

async function fetchFlags() {
  try {
    const response = await fetch(PROXY_URL, {
      headers: {
        Authorization: AUTH_SECRET,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();

    try {
      const data = JSON.parse(text);
      console.log("Fetched flags:", data);
      return data;
    } catch (jsonErr) {
      console.error("Response was not valid JSON:", text);
      return { toggles: [] };
    }
  } catch (err) {
    console.error("Fetch failed:", err);
    return { toggles: [] };
  }
}

async function updateFeatures() {
  const flags = await fetchFlags();

  document.querySelectorAll("[data-feature]").forEach((el) => {
    const flag = flags.toggles.find((f) => f.name === el.dataset.feature);
    el.style.display = flag?.enabled ? "block" : "none";

    fetch("http://192.168.45.231:5000/logFeature", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        feature: el.dataset.feature,
        enabled: flag?.enabled,
        timestamp: new Date().toISOString(),
      }),
    }).catch((err) => console.error("Logging feilet:", err));
  });
}

updateFeatures();

// Polling hvert 15. sekund
/* setInterval(updateFeatures, 15000); */
