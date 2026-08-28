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

`src/data/projects.ts` 保存從 Framer `Projects` CMS 唯讀匯入的 43 筆資料，包含啟用狀態、分類、年份、Selected／Upcoming、Landing、首頁排序、圖片焦點、圖庫、Credits 與 SEO 欄位。網站只公開其中啟用的項目。

作品、圖片或 Credits 在 Framer 更新後，應重新執行資料匯入與建置驗證，再提交 Git 版本。

## GitHub Pages

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
