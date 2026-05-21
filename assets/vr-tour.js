const preloaded = new Set();

function preloadImage(src) {
  if (preloaded.has(src)) return;
  const img = new Image();
  img.src = src;
  preloaded.add(src);
}

const scenes = [
  {
    title: "庭院出入口",
    subtitle: "外墙设备控制点",
    description: "围墙、门体与周边绿化形成入口前的空间界面。",
    image: "assets/vr-images/_DSC2764-HDR-web.jpg",
    thumb: "assets/vr-images/_DSC2764-HDR-thumb.jpg",
    hotspot: null
  },
  {
    title: "庭院南",
    subtitle: "室外通行与控制点",
    description: "从庭院中央观察建筑玻璃门窗、步道和设备位置，适合展示空间导览与设施联动。",
    image: "assets/vr-images/_DSC2771-HDR-web.jpg",
    thumb: "assets/vr-images/_DSC2771-HDR-thumb.jpg",
    hotspot: null
  },
  {
    title: "庭院西南",
    subtitle: "立面细节控制点",
    description: "转角视角突出墙面、门窗和屋檐结构。",
    image: "assets/vr-images/_DSC2774-HDR-web.jpg",
    thumb: "assets/vr-images/_DSC2774-HDR-thumb.jpg",
    hotspot: null
  },
  {
    title: "庭院西",
    subtitle: "设备维护视角",
    description: "庭院西侧视角强调墙面、设备箱与步道关系。",
    image: "assets/vr-images/_DSC2764-HDR-web.jpg",
    thumb: "assets/vr-images/_DSC2764-HDR-thumb.jpg",
    hotspot: null
  },
  {
    title: "设备间",
    subtitle: "管线与设备集中区",
    description: "设备间节点用于承接建筑机电信息。",
    image: "assets/vr-images/_DSC2774-HDR-web.jpg",
    thumb: "assets/vr-images/_DSC2774-HDR-thumb.jpg",
    hotspot: null
  },
  {
    title: "庭院西北",
    subtitle: "围合空间视角",
    description: "庭院西北侧展示建筑围合边界和通行关系。",
    image: "assets/vr-images/_DSC2771-HDR-web.jpg",
    thumb: "assets/vr-images/_DSC2771-HDR-thumb.jpg",
    hotspot: null
  },
  {
    title: "庭院北",
    subtitle: "建筑北侧通道",
    description: "庭院北侧节点补齐完整场景选择体验。",
    image: "assets/vr-images/_DSC2764-HDR-web.jpg",
    thumb: "assets/vr-images/_DSC2764-HDR-thumb.jpg",
    hotspot: null
  },
  {
    title: "空调控制点①",
    subtitle: "蓝色标记点位",
    description: "根据照片中蓝色标记点定位的空调控制入口。",
    image: "assets/vr-images/ac-guide-1-web.jpg",
    thumb: "assets/vr-images/ac-guide-1-thumb.jpg",
    fit: "contain",
    hotspot: { x: 62.7, y: 58.3, imgW: 1920, imgH: 2876 },
    remoteText: "当前热点对应照片中蓝色标记位置，点击打开空调遥控界面。"
  },
  {
    title: "空调控制点②",
    subtitle: "蓝色标记点位",
    description: "根据照片中蓝色标记点定位的空调控制入口。",
    image: "assets/vr-images/ac-guide-2-web.jpg",
    thumb: "assets/vr-images/ac-guide-2-thumb.jpg",
    fit: "contain",
    hotspot: { x: 6.4, y: 37.5, imgW: 1920, imgH: 2876 },
    remoteText: "当前热点对应照片中蓝色标记位置，点击打开空调遥控界面。"
  }
];

const viewer = document.getElementById("viewer");
const stage = document.getElementById("sceneStage");
const image = document.getElementById("sceneImage");
const hotspot = document.getElementById("acHotspot");
const mapHotspot = document.getElementById("mapHotspot");
const sceneTitle = document.getElementById("sceneTitle");
const sceneCards = document.getElementById("sceneCards");
const remotePage = document.getElementById("remotePage");
const remoteSceneText = document.getElementById("remoteSceneText");
const guideToast = document.getElementById("guideToast");
const temperatureEl = document.getElementById("temperature");
const modeStatus = document.getElementById("modeStatus");
const fanStatus = document.getElementById("fanStatus");
const swingStatus = document.getElementById("swingStatus");
const powerBtn = document.getElementById("powerBtn");

let sceneIndex = 0;
let panX = 0;
let panY = 0;
let scale = 1;
let startX = 0;
let startY = 0;
let dragging = false;
let temperature = 24;
let fanLevel = 0;
let swingOn = true;
let powered = true;
const fanLabels = ["自动", "低风", "中风", "高风"];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function panLimits() {
  return {
    x: window.innerWidth * 0.24 * scale,
    y: window.innerHeight * 0.26 * scale
  };
}

function applyTransform() {
  stage.style.setProperty("--x", `${panX}px`);
  stage.style.setProperty("--y", `${panY}px`);
  stage.style.setProperty("--scale", scale.toFixed(3));
}

function resetView() {
  panX = 0;
  panY = 0;
  scale = 1;
  applyTransform();
}

function imgToStage(hotspotData, fitMode) {
  const stageW = stage.clientWidth;
  const stageH = stage.clientHeight;
  if (!stageW || !stageH) return { x: hotspotData.x, y: hotspotData.y };

  const imgW = hotspotData.imgW || 1920;
  const imgH = hotspotData.imgH || 2876;
  const stageRatio = stageW / stageH;
  const imgRatio = imgW / imgH;

  let imgScale, renderedW, renderedH, offsetX, offsetY;
  const isContain = fitMode === "contain";

  if (isContain) {
    if (imgRatio > stageRatio) {
      imgScale = stageW / imgW;
      renderedW = stageW;
      renderedH = imgH * imgScale;
      offsetX = 0;
      offsetY = (stageH - renderedH) / 2;
    } else {
      imgScale = stageH / imgH;
      renderedW = imgW * imgScale;
      renderedH = stageH;
      offsetX = (stageW - renderedW) / 2;
      offsetY = 0;
    }
  } else {
    if (imgRatio > stageRatio) {
      imgScale = stageH / imgH;
      renderedW = imgW * imgScale;
      renderedH = stageH;
      offsetX = (stageW - renderedW) / 2;
      offsetY = 0;
    } else {
      imgScale = stageW / imgW;
      renderedW = stageW;
      renderedH = imgH * imgScale;
      offsetX = 0;
      offsetY = (stageH - renderedH) / 2;
    }
  }

  const imgPX = hotspotData.x / 100 * imgW;
  const imgPY = hotspotData.y / 100 * imgH;
  const stagePX = offsetX + imgPX * imgScale;
  const stagePY = offsetY + imgPY * imgScale;

  return {
    x: Math.round(stagePX / stageW * 10000) / 100,
    y: Math.round(stagePY / stageH * 10000) / 100
  };
}

function updateHotspotPos() {
  const current = scenes[sceneIndex];
  if (!current.hotspot) return;
  const pos = imgToStage(current.hotspot, current.fit);
  hotspot.style.setProperty("--hotspot-x", `${pos.x}%`);
  hotspot.style.setProperty("--hotspot-y", `${pos.y}%`);
}

function focusHotspot() {
  const current = scenes[sceneIndex];
  if (!current.hotspot) return;
  const pos = imgToStage(current.hotspot, current.fit);
  const limits = panLimits();
  panX = clamp((50 - pos.x) * window.innerWidth * 0.012, -limits.x, limits.x);
  panY = clamp((50 - pos.y) * window.innerHeight * 0.012, -limits.y, limits.y);
  scale = Math.max(scale, 1.08);
  applyTransform();
}

function loadScene(index) {
  sceneIndex = (index + scenes.length) % scenes.length;
  const current = scenes[sceneIndex];

  image.style.opacity = "1";
  image.src = current.thumb;

  const full = new Image();
  full.src = current.image;
  full.onload = () => {
    image.src = full.src;
    updateHotspotPos();
  };

  image.alt = current.title;
  image.style.objectFit = current.fit || "cover";
  sceneTitle.textContent = current.title;
  if (current.hotspot) {
    hotspot.style.display = "";
    mapHotspot.style.display = "";
    updateHotspotPos();
  } else {
    hotspot.style.display = "none";
    mapHotspot.style.display = "none";
  }
  remoteSceneText.textContent = current.remoteText || "";
  renderCards();
  resetView();
  preloadAdjacent();
}

function preloadAdjacent() {
  preloadImage(scenes[(sceneIndex + 1) % scenes.length].image);
  preloadImage(scenes[(sceneIndex + 2) % scenes.length].image);
}

function renderCards() {
  sceneCards.innerHTML = "";
  scenes.forEach((scene, index) => {
    const button = document.createElement("button");
    button.className = `scene-card${index === sceneIndex ? " active" : ""}`;
    button.type = "button";
    button.innerHTML = `<img src="${scene.thumb}" alt=""><b>${scene.title}</b><small>${scene.subtitle}</small>`;
    button.addEventListener("click", () => loadScene(index));
    sceneCards.appendChild(button);
  });
}

function openRemote() {
  remotePage.classList.add("open");
  remotePage.setAttribute("aria-hidden", "false");
}

function closeRemote() {
  remotePage.classList.remove("open");
  remotePage.setAttribute("aria-hidden", "true");
}

function updateRemoteStatus() {
  temperatureEl.textContent = temperature;
  fanStatus.textContent = fanLabels[fanLevel];
  swingStatus.textContent = swingOn ? "开启" : "关闭";
  powerBtn.classList.toggle("off", !powered);
  document.querySelector(".signal").textContent = powered ? "ON" : "OFF";
}

viewer.addEventListener("pointerdown", (event) => {
  if (event.target.closest("button, a, .remote-page, .guide-toast")) return;
  dragging = true;
  startX = event.clientX;
  startY = event.clientY;
  viewer.classList.add("dragging");
  viewer.setPointerCapture(event.pointerId);
});

viewer.addEventListener("pointermove", (event) => {
  if (!dragging) return;
  const dx = event.clientX - startX;
  const dy = event.clientY - startY;
  startX = event.clientX;
  startY = event.clientY;
  const limits = panLimits();
  panX = clamp(panX + dx, -limits.x, limits.x);
  panY = clamp(panY + dy, -limits.y, limits.y);
  applyTransform();
});

viewer.addEventListener("pointerup", (event) => {
  dragging = false;
  viewer.classList.remove("dragging");
  try {
    viewer.releasePointerCapture(event.pointerId);
  } catch (error) {
    // Pointer capture can already be released by the browser.
  }
});

viewer.addEventListener("dblclick", resetView);
viewer.addEventListener("wheel", (event) => {
  event.preventDefault();
  scale = clamp(scale + (event.deltaY > 0 ? -0.06 : 0.06), 0.94, 1.45);
  applyTransform();
}, { passive: false });

document.addEventListener("click", (event) => {
  const actionEl = event.target.closest("[data-action]");
  if (!actionEl) return;
  const action = actionEl.dataset.action;
  if (action === "reset") resetView();
  if (action === "hotspot") focusHotspot();
  if (action === "fullscreen") {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }
  if (action === "prev") loadScene(sceneIndex - 1);
  if (action === "next") loadScene(sceneIndex + 1);
  if (action === "guide") guideToast.classList.add("open");
  if (action === "close-guide") guideToast.classList.remove("open");
  if (action === "close-remote") closeRemote();
});

hotspot.addEventListener("click", (event) => {
  event.stopPropagation();
  openRemote();
});

mapHotspot.addEventListener("click", (event) => {
  event.stopPropagation();
  openRemote();
});

document.querySelectorAll("[data-temp]").forEach((button) => {
  button.addEventListener("click", () => {
    temperature = clamp(temperature + Number(button.dataset.temp), 18, 30);
    updateRemoteStatus();
  });
});

document.querySelectorAll("[data-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-mode]").forEach((item) => item.classList.toggle("selected", item === button));
    modeStatus.textContent = button.dataset.mode;
  });
});

document.querySelector("[data-fan]").addEventListener("click", () => {
  fanLevel = (fanLevel + 1) % fanLabels.length;
  updateRemoteStatus();
});

document.querySelector("[data-swing]").addEventListener("click", () => {
  swingOn = !swingOn;
  updateRemoteStatus();
});

powerBtn.addEventListener("click", () => {
  powered = !powered;
  updateRemoteStatus();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeRemote();
    guideToast.classList.remove("open");
  }
  if (event.key === "ArrowLeft") loadScene(sceneIndex - 1);
  if (event.key === "ArrowRight") loadScene(sceneIndex + 1);
});

window.addEventListener("resize", updateHotspotPos);

loadScene(0);
updateRemoteStatus();
preloadAdjacent();
if (window.location.hash === "#remote") {
  openRemote();
}
