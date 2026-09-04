# Objet Petit L(ighting) — GitHub Rebuild Saved Point

更新日期：2026-08-28（台北時間）  
工程資料夾：`objet-petit-light/`  
Git 分支：`main`  
Git commit：`b7d9c8d Fix deployment and import Framer CMS`  
本機 Git tag：`github-rebuild-saved-point-2026-08-28`

## 保存點目的

此文件保存 GitHub 重建工程完成第一輪全面修正後的穩定狀態。後續若開發結果需要回復，可使用上述 commit 或 tag 回到此版本。Framer 正式網站仍維持不變。

## 已完成內容

- 建立獨立 Astro 靜態網站與本機 Git repository。
- 首頁 Landing、工作室宣言、Work Index、Selected、Upcoming、Services 與 Contact。
- Theatre、Dance、Architecture & Spatial、Exhibition & Branding Event 四類作品頁。
- Projects 詳情頁、主劇照、圖庫、全螢幕檢視及 Credits。
- 共用 Header、Footer 與所有主要頁面的 Contact 表單。
- Profile / CV、服務頁、404 頁面。
- GitHub Pages 自動部署工作流程及 repository 子路徑支援。
- sitemap、robots、canonical、Open Graph、結構化資料及 Google Search Console 驗證標記。
- 舊 Framer 分類網址相容頁：`/theater`、`/dance`、`/architecture-landscape`、`/exhib.-event`。

## CMS 保存狀態

- 已從 Framer `Projects` CMS 唯讀匯入 43 筆作品。
- 其中 41 筆為啟用狀態。
- Landing：4 筆。
- Selected：2 筆。
- Upcoming：3 筆。
- 已保留年份、分類、製作單位、場地、圖庫、Credits、首頁排序、圖片焦點、活動連結與 SEO 欄位。
- 劇照目前仍使用 `framerusercontent.com` 圖片網址；正式脫離 Framer 前需搬移至自有圖片儲存空間。

## 驗證結果

- `pnpm verify` 通過。
- 一般網域靜態建置通過。
- GitHub Pages repository 子路徑模擬建置通過。
- 共產生 59 個靜態頁面。
- 所有產生的內部連結均可解析。
- 桌機與手機版無水平溢出。
- 手機選單可正常開啟。
- 首頁 4 張 Landing、2 筆 Selected、3 筆 Upcoming 顯示正確。
- 作品圖庫、Credits 與全螢幕檢視通過。
- 瀏覽器檢查沒有 console error 或 warning。

## 正式發布前仍需完成

1. 建立遠端 GitHub repository 並推送 `main` 與本保存點 tag。
2. 在 GitHub Pages 設定中選擇 GitHub Actions 作為發布來源。
3. 首次測試 Contact 表單後，完成 FormSubmit 寄至 `objet.petit.light@gmail.com` 的確認程序。
4. 將 Framer CDN 劇照搬至自有圖片儲存空間並重新驗證圖片品質與載入速度。
5. 完成 Preview 的桌機、平板、手機直式與橫式人工驗收。
6. 最後才設定自有網域、真正的 301 redirects 與 Search Console 網址變更。

## 回復方式

在 `objet-petit-light/` repository 中，可使用 commit `b7d9c8d` 或 tag `github-rebuild-saved-point-2026-08-28` 建立新的回復分支。不要使用會清除未提交工作的強制重設指令。
