# Đẩy foxfit-bot lên GitHub (repo namlegym) — làm trên máy MỚI

Repo đích: **https://github.com/vygoldensea-ux/namlegym** (đang trống, public).

Mình đã đóng gói sẵn toàn bộ code thành 1 file **`namlegym.bundle`** (là cả repo git, đã commit sẵn, đã đặt nhánh `main`). Trên máy mới bạn chỉ cần cài Git rồi chạy các lệnh sau.

## Cách 1 — Từ file bundle (khuyên dùng khi đổi máy)

```bash
# 1. Clone code ra từ bundle
git clone namlegym.bundle namlegym
cd namlegym

# 2. Trỏ remote về repo GitHub của bạn
git remote set-url origin https://github.com/vygoldensea-ux/namlegym.git

# 3. Đẩy lên (GitHub sẽ hỏi đăng nhập — xem phần Xác thực bên dưới)
git push -u origin main
```

## Cách 2 — Nếu bạn có sẵn thư mục foxfit-bot (không dùng bundle)

```bash
cd foxfit-bot
git init
git add -A
git commit -m "Foxfit bot"
git branch -M main
git remote add origin https://github.com/vygoldensea-ux/namlegym.git
git push -u origin main
```

## Xác thực khi push (chọn 1)

- **Dễ nhất:** cài **GitHub CLI** rồi `gh auth login` (đăng nhập qua trình duyệt), sau đó `git push` sẽ tự dùng.
- **Hoặc Personal Access Token:** vào GitHub → Settings → Developer settings → **Personal access tokens (fine-grained)** → tạo token có quyền **Contents: Read and write** cho repo `namlegym`. Khi `git push` hỏi:
  - Username: `vygoldensea-ux`
  - Password: **dán token** (không phải mật khẩu tài khoản).
- Sau khi push xong, nếu không dùng nữa thì **xoá token** cho an toàn.

Xong bước push, mở lại link repo là thấy toàn bộ code. Lúc đó bạn xoá thư mục local trên máy cũ thoải mái.
