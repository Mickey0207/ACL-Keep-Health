# 資料庫結構說明 (Database Schema)

本文件記錄了 ACL Keep Health 專案在 Supabase 中使用的資料庫結構、資料表、函式與安全性原則。

**最後更新日期:** 2025-10-30

---

## 資料表 (Tables)

### `public.users`

此資料表用於存放使用者的公開個人資料，並與 Supabase 內建的 `auth.users` 表進行一對一關聯。

- **用途**: 儲存基本使用者資訊，並特別擴充以支援 LINE 登入所需的 `line_user_id` 和 `line_display_name`。
- **關聯**: `id` 欄位是外鍵，參照 `auth.users(id)`。

#### 欄位定義

| 欄位名稱            | 資料類型      | 描述                                                     | 備註                                     |
| ------------------- | ------------- | -------------------------------------------------------- | ---------------------------------------- |
| `id`                | `UUID`        | 使用者唯一識別碼，與 `auth.users.id` 相同。            | **主鍵 (Primary Key)**, **外鍵 (Foreign Key)** |
| `username`          | `TEXT`        | 使用者名稱。                                             | 可由使用者自行修改。                     |
| `email`             | `TEXT`        | 使用者的電子郵件地址。                                   | `UNIQUE`                                 |
| `line_user_id`      | `TEXT`        | 綁定 LINE 帳號後，儲存的 LINE 使用者 ID。                | `UNIQUE`                                 |
| `line_display_name` | `TEXT`        | 綁定 LINE 帳號後，儲存的 LINE 顯示名稱。                 |                                          |
| `created_at`        | `TIMESTAMPTZ` | 資料建立時間。                                           | `DEFAULT now()`                          |
| `updated_at`        | `TIMESTAMPTZ` | 資料最後更新時間。                                       |                                          |

---

## 函式與觸發器 (Functions & Triggers)

### `public.handle_new_user()`

- **類型**: 函式 (Function)
- **用途**: 當 `auth.users` 表中有新使用者註冊時，此函式會被觸發，自動在 `public.users` 表中建立一筆對應的公開資料。
- **邏輯**:
  1. 從 `new` (新註冊的使用者資料) 中取得 `id` 和 `email`。
  2. 將 `id` 和 `email` 插入 `public.users` 表。
  3. 預設將 `username` 設定為 email 地址 `@` 符號前的部分。

### `on_auth_user_created`

- **類型**: 觸發器 (Trigger)
- **觸發時機**: `AFTER INSERT ON auth.users` (在 `auth.users` 表中新增資料後)。
- **執行動作**: `EXECUTE PROCEDURE public.handle_new_user()` (執行上述的函式)。

---

## 資料列級安全 (Row Level Security, RLS)

為了確保資料的私密性與安全性，`public.users` 資料表已啟用 RLS，並設定了以下策略：

1. **允許使用者讀取自己的資料 (`Allow individual read access`)**
   - **類型**: `SELECT`
   - **條件**: `auth.uid() = id`
   - **描述**: 使用者只能查詢到與自己 `id` 相符的資料列。

2. **允許使用者更新自己的資料 (`Allow individual update access`)**
   - **類型**: `UPDATE`
   - **條件**: `auth.uid() = id`
   - **描述**: 使用者只能更新與自己 `id` 相符的資料列。

3. **允許使用者刪除自己的資料 (`Allow individual delete access`)**
   - **類型**: `DELETE`
   - **條件**: `auth.uid() = id`
   - **描述**: 使用者只能刪除與自己 `id` 相符的資料列。

這些策略確保了使用者無法存取或修改其他任何人的個人資訊。
