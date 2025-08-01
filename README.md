# Blog API

Blog API là một RESTful API được xây dựng bằng Node.js, Express và MongoDB, hỗ trợ quản lý người dùng, bài viết, bình luận, lượt thích và xác thực bảo mật. Dự án phù hợp cho các hệ thống blog hoặc nền tảng chia sẻ nội dung.

## Tính năng chính

- Đăng ký, đăng nhập, xác thực người dùng bằng JWT
- Quản lý người dùng (admin, user)
- CRUD bài viết (tạo, đọc, cập nhật, xoá)
- Bình luận và lượt thích cho bài viết
- Upload ảnh banner cho blog (tích hợp Cloudinary)
- Phân quyền truy cập (admin, user)
- Giới hạn tốc độ truy cập API (rate limit)
- Bảo mật với Helmet, CORS, XSS filter

## Công nghệ sử dụng

- Node.js >= 18.x
- TypeScript ^5.8.3
- Express.js ^5.1.0
- MongoDB (Mongoose) ^8.16.4
- JWT (jsonwebtoken) ^9.0.2, bcrypt ^6.0.0
- Cloudinary ^2.7.0
- express-rate-limit ^8.0.1, express-validator ^7.2.1
- Helmet ^8.1.0, CORS ^2.8.5, compression ^1.8.1
- Multer ^2.0.2 (upload file)
- Winston ^3.17.0 (logging)
- Prettier ^3.6.2, ESLint (format/lint)

## Cấu trúc thư mục

```
Blog_api/
├── src/
│   ├── config/           # Cấu hình môi trường, biến môi trường
│   ├── controllers/      # Xử lý logic cho các route (auth, blog, user, ...)
│   ├── lib/              # Thư viện dùng chung (jwt, mongoose, logger, ...)
│   ├── middlewares/      # Xác thực, phân quyền, upload, validate, ...
│   ├── models/           # Định nghĩa schema cho MongoDB
│   ├── routes/           # Định nghĩa các route API
│   ├── utils/            # Tiện ích dùng chung
│   └── server.ts         # File khởi động server
├── package.json
├── tsconfig.json
├── nodemon.json
```

## Cài đặt

1. Clone repository:
   ```bash
   git clone <repo-url>
   cd Blog_api
   ```
2. Cài đặt dependencies:
   ```bash
   npm install
   ```
3. Tạo file `.env` với các biến môi trường:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/blog_api
   JWT_ACCESS_SECRET=your_access_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_EXPIRY=7d
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Khởi động server:
   ```bash
   npm run dev
   ```

## Sử dụng

- API chạy tại: `http://localhost:3000/api/v1`
- Tham khảo các route trong thư mục `src/routes/v1/` để biết chi tiết endpoint.
- Sử dụng Postman hoặc Swagger để test API.

## Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng tạo pull request hoặc issue nếu bạn muốn đóng góp hoặc báo lỗi.

## License

ISC
