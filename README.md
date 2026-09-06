# Objet Petit L — GitHub Rebuild

小幻光設計所 Objet Petit L(ighting) 的獨立 Astro 網站工程。Framer 正式站在新站完成驗收與網域切換前維持不變。

## 開發環境

- Node.js 22.12 或更新版本
- pnpm 11

```sh
pnpm install
pnpm dev
pnpm verify
pnpm build
pnpm preview
```

## 內容來源

`src/data/projects.ts` 保存從 Framer `Projects` CMS 唯讀匯入的 44 筆資料，包含啟用狀態、分類、年份、Selected／Upcoming、Landing、首頁排序、圖片焦點、圖庫、Credits 與 SEO 欄位。網站只公開其中啟用的項目。

作品、圖片或 Credits 在 Framer 更新後，應重新執行資料匯入與建置驗證，再提交 Git 版本。

## 首頁原版排版（2026-09-06）

首頁改以 Framer 正式站的 HTML/CSS 快照保留原始四宮格、圖片焦點、字型、完整文案與五種響應式排版；不再使用早期重建的輪播首頁。原版來源：https://objetpetitlight.framer.website/

- `src/data/framer-home.html`：原版靜態結構，已移除 Framer 執行程式與 hydration。請勿在相鄰標籤之間加入換行／空白，原版的 `pre-wrap` 文字會因此改變行高。
- `src/styles/framer-home.css`：原版字型與完整響應式樣式。
- `src/scripts/home-interactions.ts`、`src/styles/home-interactions.css`：獨立執行的作品展開與 Works 選單。
- `src/pages/index.astro`：套用 GitHub Pages 子路徑、SEO、CMS 圖片／作品連結與 FormSubmit。

這是固定版本快照，不會隨 Framer 自動更新。若更動 Framer 首頁文字、結構或 CMS 首頁排序，需一併重新擷取首頁快照／樣式及更新 CMS 資料，再比對五種尺寸。只更新 `projects.ts` 不會改變快照中的列標題與順序。圖片及字型目前仍使用原版 CDN。

驗證指令：`pnpm verify`、`pnpm build`、`pnpm verify:build`。首頁已比對 1440×900、1024×768、834×1112、768×390、390×844 的可見命名區塊位置與尺寸；不包含 Framer 平台徽章／編輯浮鈕及瀏覽器文字抗鋸齒差異。內頁維持既有重建版，不在本次首頁排版校正範圍。

## 服務頁原版排版（2026-09-06）

四項服務內頁使用 `src/data/framer-services.json` 與 `src/styles/services/` 的 Framer 正式站靜態快照，保留完整文案、合作流程、案例與響應式排版。`src/pages/services/[service].astro` 只載入該頁樣式，並轉換所有站內連結以支援 GitHub Pages 子路徑；Works 選單沿用首頁互動程式。

快照不會自動同步。Framer 服務頁修改後需重新擷取 HTML/CSS，移除平台執行程式與徽章，且不可在相鄰標籤間新增空白／換行，以免影響原版 pre-wrap 文字排版。圖片與字型仍使用原版 CDN。獨立 `/services` 索引頁沒有對應的 Framer 原頁，維持既有版本。

## GitHub Pages

### 作品頁幻燈片（2026-09-06）

所有啟用作品使用 `src/data/framer-project.html` 與 `src/styles/framer-project.css` 中的原版共用排版；標題、公司、場地、返回分類、照片及 Credits 仍由 `projects.ts` 在建置時填入。修改原版結構時才需更新此版型，不必為每件作品複製 HTML。

`ProjectGallery.astro`／`project-gallery.ts` 提供單張完整大圖、底部橫向縮圖、前後循環換圖、240ms 淡入與手機滑動。點主圖開啟覆蓋整個瀏覽器視窗的劇照檢視；可點左右箭頭、鍵盤方向鍵、關閉鈕、背景或 Esc 操作。使用原生 dialog 隔離背景焦點、鎖定背景捲動並在關閉後還原焦點。此為原版風格的視窗全螢幕，不會強制隱藏瀏覽器工具列。照片使用原圖，不拿縮圖放大；單張／空圖庫會使用封面作為備援。

`ProjectCredits.astro` 保留原版前六項／完整名單收合，無 JavaScript 時仍可讀到所有 Credits。建置驗證會檢查每件啟用作品的圖片數量、全螢幕控制與 GitHub Pages 子路徑。

推送到 `main` 後，`.github/workflows/deploy.yml` 會執行來源檢查、靜態建置並部署 GitHub Pages。Repository 的 Pages Source 需設定為 **GitHub Actions**。

工程會自動處理 `username.github.io/repository` 子路徑。若使用自有網域，於建置環境設定：

```text
SITE_URL=https://your-domain.example
PUBLIC_GOOGLE_SITE_VERIFICATION=Search Console 驗證碼
```

## 表單與正式切換

聯絡表單透過 FormSubmit 轉寄至工作室信箱；第一次收到提交時需依確認信啟用。正式切換前仍需完成：

1. GitHub Pages Preview 的桌機、平板、手機直橫式驗收。
2. 自有網域與 DNS 設定。
3. 在實際主機或 CDN 設定真正的 301 redirects。
4. 提交 sitemap 並確認 Search Console 索引狀態。
