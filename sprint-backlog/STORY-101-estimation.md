### 1. 探索性實作數據 (Exploratory Implementation Metrics)
- **影響檔案數量**：2 個
- **影響檔案明細與關鍵方法**：
  - `demo-app/index.html` (表單新增期數下拉選單 UI)
  - `demo-app/expense_manager.js` (修改 `expense-form` 的 `submit` 事件監聽器中的預算驗證與寫入邏輯)
- **總修改行數預估**：約 34 行 (25 新增, 9 刪除)

### 2. 重構建議 (Refactoring Recommendations)
在進行暴力實作時，我為了讓分期能運作，必須讓 `expense-form` 的 `submit` 事件迴圈產生多筆未來月份的紀錄寫入 `expenseDatabase`。同時，我也必須強制修改預算防禦邏輯，使其只判斷「首期金額」是否超過當月預算 (`currentMonthTotal + perAmount > BUDGET_LIMIT`) 以繞過阻擋。然而，原有的 `calculateCurrentMonthTotal()` 是完全寫死只針對「當下月份」計算，這導致：
1. 寫入的未來月份分期資料，實際上根本無法在未來的月份報表中正確被統計與呈現。
2. Flat Array 的設計使得被拆解的這幾筆分期資料毫無關聯 (無 Master-Detail 結構)，未來若要修改或退除，勢必引發嚴重的資料不一致。
強烈建議在正式實作前，必須先重構資料模型加入關聯性，並將時間查詢邏輯解耦為可接受傳入特定年份/月份的模組，否則該功能上線將會帶來更多 Bug。

### 3. 建議估點 (Suggested Story Points)
建議估點：**5 點** 
判斷理由：單從暴力修改量來看並不高（僅 34 行，2 個檔案），但如果僅是套用髒邏輯，上線後報表系統將無法正確顯示未來的現金流。為了確保資料庫的一致性與擴展性，必須進行資料模型的重構與查詢模組重構，這會帶來一定的複雜度與風險，因此給出 5 點的建議。

**⚠️ 必加免責聲明 (Mandatory Disclaimer)**: 
此估點僅為基於『暴力實作修改量』的自動試算參考。Story Point 的真實意義會依照不同團隊的 Velocity 基準與技術熟練度而有巨大差異。最終 Sprint 承諾請務必由人類團隊透過 Planning Poker 等方式共同決議。
