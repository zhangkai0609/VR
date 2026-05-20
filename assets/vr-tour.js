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
    description: "围墙、门体与周边绿化形成入口前的空间界面，点击白色发光点可打开空调遥控二级页面。",
    image: "assets/vr-images/_DSC2764-HDR-web.jpg",
    thumb: "assets/vr-images/_DSC2764-HDR-thumb.jpg",
    hotspot: { x: 58, y: 58 },
    remoteText: "当前热点位于庭院围墙附近，可作为建筑外部设备控制点。二级界面用于展示空调控制、温度、模式与设备状态。"
  },
  {
    title: "庭院南",
    subtitle: "室外通行与控制点",
    description: "从庭院中央观察建筑玻璃门窗、步道和设备位置，适合展示空间导览与设施联动。",
    image: "assets/vr-images/_DSC2771-HDR-web.jpg",
    thumb: "assets/vr-images/_DSC2771-HDR-thumb.jpg",
    hotspot: { x: 72, y: 47 },
    remoteText: "热点靠近建筑玻璃立面，可模拟室内空调系统入口。点击后进入漂亮的遥控器界面，适合给用户演示交互功能。"
  },
  {
    title: "庭院西南",
    subtitle: "立面细节控制点",
    description: "转角视角突出墙面、门窗和屋檐结构，白点热点用于进入设备遥控二级页面。",
    image: "assets/vr-images/_DSC2774-HDR-web.jpg",
    thumb: "assets/vr-images/_DSC2774-HDR-thumb.jpg",
    hotspot: { x: 65, y: 42 },
    remoteText: "当前热点放置在建筑转角附近，用于表现立面细节中的设备控制入口。二级遥控界面可作为未来真实智能设备控制的视觉原型。"
  },
  {
    title: "庭院西",
    subtitle: "设备维护视角",
    description: "庭院西侧视角强调墙面、设备箱与步道关系，适合作为空调设备维护点的导览节点。",
    image: "assets/vr-images/_DSC2764-HDR-web.jpg",
    thumb: "assets/vr-images/_DSC2764-HDR-thumb.jpg",
    hotspot: { x: 50, y: 53 },
    remoteText: "当前热点位于庭院西侧，可模拟靠近设备箱的空调控制入口，便于展示维护、开关与状态读取。"
  },
  {
    title: "设备间",
    subtitle: "管线与设备集中区",
    description: "设备间节点用于承接建筑机电信息，可通过空调遥控二级页面展示设备状态和运行模式。",
    image: "assets/vr-images/_DSC2774-HDR-web.jpg",
    thumb: "assets/vr-images/_DSC2774-HDR-thumb.jpg",
    hotspot: { x: 56, y: 50 },
    remoteText: "当前热点对应设备间区域，二级桌面可展示空调系统、风速、扫风和连接状态。"
  },
  {
    title: "庭院西北",
    subtitle: "围合空间视角",
    description: "庭院西北侧展示建筑围合边界和通行关系，适合放置联动控制、简介说明等导览信息。",
    image: "assets/vr-images/_DSC2771-HDR-web.jpg",
    thumb: "assets/vr-images/_DSC2771-HDR-thumb.jpg",
    hotspot: { x: 70, y: 44 },
    remoteText: "当前热点位于庭院西北侧，适合模拟一个从导览进入设备控制的空间交互入口。"
  },
  {
    title: "庭院北",
    subtitle: "建筑北侧通道",
    description: "庭院北侧节点补齐完整场景选择体验，让底部导航更接近多点位 VR 导览的真实界面。",
    image: "assets/vr-images/_DSC2764-HDR-web.jpg",
    thumb: "assets/vr-images/_DSC2764-HDR-thumb.jpg",
    hotspot: { x: 60, y: 56 },
    remoteText: "当前热点位于庭院北侧，可作为建筑导览中的空调控制演示入口。"
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

function focusHotspot() {
  const current = scenes[sceneIndex];
  const limits = panLimits();
  panX = clamp((50 - current.hotspot.x) * window.innerWidth * 0.012, -limits.x, limits.x);
  panY = clamp((50 - current.hotspot.y) * window.innerHeight * 0.012, -limits.y, limits.y);
  scale = Math.max(scale, 1.08);
  applyTransform();
}

function loadScene(index) {
  sceneIndex = (index + scenes.length) % scenes.length;
  const current = scenes[sceneIndex];
  image.style.opacity = "0";
  image.src = current.image;
  image.alt = current.title;
  image.onload = () => { image.style.opacity = "1"; };
  image.onerror = () => { image.style.opacity = "1"; };
  sceneTitle.textContent = current.title;
  hotspot.style.setProperty("--hotspot-x", `${current.hotspot.x}%`);
  hotspot.style.setProperty("--hotspot-y", `${current.hotspot.y}%`);
  remoteSceneText.textContent = current.remoteText;
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

loadScene(0);
updateRemoteStatus();
scenes.forEach(s => preloadImage(s.image));
if (window.location.hash === "#remote") {
  openRemote();
}
