# ES-Survey

A modern web application for creating and managing surveys, built with React and ChakraUI.

![ES-Survey Preview](https://via.placeholder.com/800x400?text=ES-Survey+Preview)

## 🚀 Features

- User authentication and authorization
- Survey creation and management
- Real-time survey responses
- Statistical analysis and reporting
- Responsive design for all devices
- Modern and intuitive user interface

## 🛠️ Tech Stack

- **Frontend Framework:** [React](https://reactjs.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **UI Framework:** [Chakra UI](https://chakra-ui.com/)
- **Routing:** [React Router](https://reactrouter.com/)
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Code Quality:**
  - ESLint
  - Prettier
  - TypeScript

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

## 🚀 Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/es-survey.git
   cd survey-fe
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```env
   VITE_API_URL=your_api_url_here
   ```

### Running Locally

1. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

1. Build the project:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Preview the production build:
   ```bash
   npm run preview
   # or
   yarn preview
   ```

### Triển khai Production (Production Deploy)

#### 1. Build Frontend

Tại thư mục `frontend`, chạy lệnh:

```bash
npm run build
# hoặc
yarn build
```

Thư mục `dist/` sẽ được tạo ra, chứa toàn bộ mã nguồn đã build sẵn sàng để phục vụ production.

#### 2. Đảm bảo cấu trúc thư mục

Đặt cả hai thư mục `frontend` và `backend` cùng cấp (hoặc đúng như cấu hình trong `docker-compose.yml`).  
Ví dụ:

```
project-servey/
├── backend/
├── frontend/
```

#### 3. Sử dụng Docker Compose

- Đảm bảo file `Dockerfile` của frontend đã đúng (sử dụng nginx hoặc http-server để serve thư mục `dist`).
- Đảm bảo file `docker-compose.yml` ở backend đã mount đúng đường dẫn build của frontend (nếu dùng image build sẵn thì cập nhật lại image).

Tại thư mục `backend`, chạy (Nên đọc hướng dẫn):

```bash
docker-compose up -d
```

- Nginx sẽ tự động reverse proxy request đến frontend (port 80) và backend (port 3000).
- Không cần chạy riêng lẻ frontend, mọi thứ sẽ được quản lý qua Docker Compose.

#### 4. Cấu hình biến môi trường

- Tạo file `.env.production` (hoặc `.env` để tạo file package-lock.json khi chạy lệnh npm install) trong thư mục `frontend`:
  ```env
  VITE_API_URL=http://your-domain.com/api/v1
  VITE_BACKEND_DOMAIN=http://localhost:3000
  VITE_WEB_DOMAIN=http://localhost
  VITE_AUTH0_DOMAIN=
  VITE_AUTH0_CLIENT_ID=
  VITE_AUTH0_AUDIENCE=
  VITE_AUTH0_ORG_ID=
  ```

#### 5. Truy cập ứng dụng

- Truy cập frontend qua domain hoặc IP server (port 80).
- Các request API sẽ được proxy qua Nginx tới backend.

#### 6. Một số lưu ý

- Nếu thay đổi code frontend, cần build lại (`npm run build`) và khởi động lại container frontend.
- Đảm bảo bảo mật file `.env.production` và các thông tin nhạy cảm.
- Có thể cấu hình SSL cho Nginx để chạy HTTPS.

## 📁 Project Structure

```
survey-fe/
├── public/              # Static files
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable components
│   ├── contexts/       # React contexts
│   ├── layouts/        # Layout components
│   ├── pages/          # Page components
│   ├── routes/         # Route configurations
│   ├── services/       # API services
│   ├── styles/         # Global styles and theme
│   ├── App.jsx         # Root component
│   └── main.jsx        # Entry point
├── .env                # Environment variables
├── .gitignore         # Git ignore file
├── index.html         # HTML template
├── package.json       # Project dependencies
├── vite.config.js     # Vite configuration
└── README.md          # Project documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Write unit tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Project Lead:** [Your Name](https://github.com/your-username)
- **Frontend Developer:** [Team Member](https://github.com/team-member)
- **UI/UX Designer:** [Designer](https://github.com/designer)

## 📞 Contact

- **Email:** your.email@example.com
- **Project Link:** [https://github.com/your-username/es-survey](https://github.com/your-username/es-survey)

---

Made with ❤️ by the ES-Survey Team
