import { settings, systemConfig } from "./stores.js";

export const hexToRgba = (color, opacity = 1) => {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5), 16);
  return {
    value: `rgba(${r},${g},${b},${opacity})`,
    r,
    g,
    b,
  };
};
export const hexToHsla = (color, opacity) => {
  let { r, b, g } = hexToRgba(color);
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  return {
    h,
    s,
    l,
    value: `hsla(${h},${s}%,${l}%,${opacity})`,
  };
};
export const loadConfig = async (urls) => {
  const data = await Promise.all(
    urls.map((url) => {
      const urlIns = new URL(url, location.origin);
      urlIns.searchParams.set("t", new Date().getTime().toString());
      return fetch(urlIns, {
        method: "GET",
      })
        .then((res) => res.json())
        .catch(() => ({}));
    }),
  );
  const navList = data.map((item) => item.navList ?? []).flat();
  const searchSource = data.map((item) => item.searchSource ?? []).flat();
  for (const item of data) {
    systemConfig.value = {
      ...systemConfig.value,
      ...item,
    };
  }
  systemConfig.value = {
    ...systemConfig.value,
    navList,
    searchSource,
  };
};
