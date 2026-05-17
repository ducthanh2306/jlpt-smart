# 🎓 JLPT Smart

**JLPT Smart** là nền tảng thi thử và đánh giá năng lực tiếng Nhật (JLPT) tự động, giúp người học từ N5 đến N1 dễ dàng ôn luyện với cấu trúc chuẩn kỳ thi thực tế. Ứng dụng cung cấp bảng phân tích điểm số tự động, đồng thời hỗ trợ Admin quản lý đề thi một cách linh hoạt.

![JLPT Smart Banner](https://placehold.co/800x200/222222/ffffff?text=JLPT+Smart+-+Nen+Tang+Thi+Thu)

---

## ✨ Tính năng nổi bật

### 👨‍🎓 Dành cho Thí sinh (User)
- **Thi thử chuẩn JLPT**: Làm bài thi với giao diện thân thiện, hỗ trợ đầy đủ các phần: *Moji Goi, Bunpo, Dokkai, Choukai* (có tích hợp audio nghe).
- **Chấm điểm thông minh & tức thời**: Tính điểm chuẩn theo trọng số của JLPT (thang điểm 180). Tự động phân loại điểm thành 3 phần chính: *Language Knowledge, Reading, Listening*.
- **Phân tích kết quả chi tiết**: Đánh giá **ĐỖ / TRƯỢT** dựa trên điểm tổng và điểm liệt. Hiển thị chi tiết từng câu sai, kèm giải thích (nếu có).
- **Lịch sử thi**: Lưu trữ các bài làm cũ để người dùng tiện theo dõi sự tiến bộ.

### 🛡️ Dành cho Quản trị viên (Admin)
- **Bảng điều khiển Quản trị**: Theo dõi danh sách toàn bộ đề thi trong hệ thống (số lượng câu hỏi, số người đã làm bài, v.v.).
- *(Sắp ra mắt)* CRUD Đề thi: Tạo mới, chỉnh sửa, xóa và tải lên file Audio cho bài thi Nghe.

---

## 🛠️ Công nghệ sử dụng
- **Frontend & Backend**: [Next.js (App Router)](https://nextjs.org/) - React 19.
- **Styling**: Tailwind CSS v4 & CSS thuần (các component đẹp mắt và tối ưu).
- **Cơ sở dữ liệu**: SQLite (có thể dễ dàng chuyển đổi sang PostgreSQL / MySQL với Prisma).
- **ORM**: [Prisma](https://www.prisma.io/) (v5.22.0).
- **Authentication**: JWT (JSON Web Tokens) với thư viện `jose` và `bcryptjs`.

---

## 🚀 Hướng dẫn cài đặt & Chạy cục bộ (Local)

### 1. Yêu cầu hệ thống
- Node.js (phiên bản 18.x hoặc mới nhất)
- NPM, Yarn, hoặc pnpm.

### 2. Cài đặt thư viện
Clone / Tải source code về máy và cài đặt package:
```bash
npm install
```

### 3. Thiết lập Database & Dữ liệu mẫu (Seed)
Dự án đã được thiết lập sẵn file `.env` trỏ đến SQLite cục bộ (`dev.db`). Để khởi tạo cấu trúc DB và tạo tài khoản Admin cùng 3 đề thi mẫu (N5, N4, N3), chạy:
```bash
npm run prisma:push
npm run prisma:generate
npm run seed
```

> **Lưu ý**: Lệnh `npm run seed` sẽ tạo cho bạn tài khoản quản trị:
> - **Email**: `admin@jlptsmart.local`
> - **Mật khẩu**: `Admin@123`

### 4. Chạy ứng dụng
Mở ứng dụng trên môi trường phát triển:
```bash
npm run dev
```
Truy cập vào trình duyệt tại: [http://localhost:3000](http://localhost:3000)

---

## 📂 Cấu trúc thư mục

```bash
jlpt-smart/
├── prisma/
│   ├── schema.prisma   # Định nghĩa cấu trúc Database (User, Exam, Attempt, ...)
│   └── seed.js         # Script tạo dữ liệu mẫu tự động
├── public/             # Chứa ảnh, audio, favicon, v.v.
├── src/
│   ├── app/            # Next.js App Router (Pages & API)
│   │   ├── admin/      # Giao diện cho Admin
│   │   ├── api/        # Các endpoints (auth, exams/submit)
│   │   ├── dashboard/  # Bảng điều khiển người dùng
│   │   ├── exam/       # Trang làm bài thi
│   │   ├── result/     # Trang kết quả chi tiết
│   │   └── login...    # Các trang xác thực
│   ├── components/     # Chứa các component dùng chung (ExamRunner, AuthForm, ...)
│   └── lib/            # Logic hệ thống, Query DB, Auth, Hàm chấm điểm
└── package.json        # Danh sách thư viện và scripts
```

---

## 📝 License
Phát triển bởi đội ngũ JLPT Smart Team. All rights reserved.
