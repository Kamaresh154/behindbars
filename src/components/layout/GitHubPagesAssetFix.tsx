"use client";

import { useEffect } from "react";

const BASE = "/behindbars";

function fixAssets() {
  document.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
    if (img.src.includes("/behindbars/images/")) return;
    if (img.getAttribute("src")?.startsWith("/images/")) {
      img.src = `${BASE}${img.getAttribute("src")}`;
    }
    const srcset = img.getAttribute("srcset");
    if (srcset?.includes("/images/")) {
      img.setAttribute("srcset", srcset.replaceAll("/images/", `${BASE}/images/`));
    }
  });

  document.querySelectorAll<HTMLElement>("[style]").forEach((el) => {
    const style = el.getAttribute("style");
    if (style?.includes("url(/images/")) {
      el.setAttribute("style", style.replaceAll("url(/images/", `url(${BASE}/images/`));
    }
  });
}

export function GitHubPagesAssetFix() {
  useEffect(() => {
    fixAssets();
    const observer = new MutationObserver(fixAssets);
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["src", "srcset", "style"] });
    return () => observer.disconnect();
  }, []);

  return null;
}
