# 人類打不贏的 TicTacToe

這是一個純前端的井字棋頁面，玩家永遠使用 `X`，AI 永遠使用 `O`。AI 採用 `minimax` 完整搜尋，在標準規則下理論上不會輸。

## 本機啟動

### 方式 1：直接用 Node 啟動（推薦）

1. 進入專案資料夾：

   ```bash
   cd /workspace/codex-test-tictactoe
   ```

2. 啟動本機伺服器：

   ```bash
   npm start
   ```

3. 在瀏覽器打開：

   ```text
   http://localhost:3000
   ```

### 方式 2：指定埠號

```bash
PORT=8080 npm start
```

然後在瀏覽器打開 `http://localhost:8080`。

## 讓同一個網路中的其他使用者也能使用

預設伺服器會綁定在 `0.0.0.0`，所以只要你的電腦和其他裝置在同一個網路中，其他人就可以透過你的區域網路 IP 存取：

```text
http://你的區域網路IP:3000
```

例如：

```text
http://192.168.1.25:3000
```

> 如果其他裝置打不開，通常是本機防火牆或公司 / 校園網路限制造成的。

## 部署給真正的外部使用者

因為這是靜態頁面，你可以直接部署到任何靜態網站平台，例如：

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages

部署時只需要上傳這些檔案：

- `index.html`
- `styles.css`
- `app.js`

如果平台支援 Node 啟動，也可以直接用：

```bash
npm start
```

## 檢查指令

```bash
npm run check
```

這會檢查 `app.js` 和 `server.js` 的語法是否正確。
