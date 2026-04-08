├── node_modules/           # Thư viện cài đặt qua npm
├── public/                 # Tài nguyên tĩnh (Static assets)
│   ├── images/             # Ảnh dùng trực tiếp (background, avatar...)
│   ├── mock-data/          # Dữ liệu JSON giả lập (questions, quizzes)
│   ├── sounds/             # Âm thanh (correct, wrong, tick)
│   ├── favicon.ico         # Icon trình duyệt (dạng .ico)
│   ├── favicon.svg         # Icon trình duyệt (dạng .svg)
│   ├── icons.svg           # Tập hợp các icon SVG chung
│   ├── logo.png            # Logo dự án
│   ├── manifest.json       # Cấu hình PWA (Ứng dụng web tiến bộ)
│   └── robots.txt          # Chỉ dẫn cho công cụ tìm kiếm (SEO)
│
├── src/
│   ├── api/                # Cấu hình kết nối Backend 
│   │   ├── authApi.js      # API Đăng nhập/Đăng ký
│   │   ├── axiosClient.js  # Cấu hình Axios chung & Interceptors
│   │   └── quizApi.js      # API Quản lý Quiz & Câu hỏi
│   │
│   ├── assets/             # Tài nguyên được xử lý bởi Vite (Asset Pipeline)
│   │   ├── images/         # Ảnh minh họa (Hero banner, logo nhỏ...)
│   │   ├── styles/         # Các file CSS đặc thù (Tailwind/Modules)
│   │   ├── hero.png        # Ảnh trang chủ
│   │   ├── react.svg       # Icon React mặc định
│   │   └── vite.svg        # Icon Vite mặc định
│   │
│   ├── components/         # Các thành phần giao diện tái sử dụng
│   │   ├── common/         # Button, Input, Modal, Badge...
│   │   └── layout/         # Header, Footer, Sidebar...
│   │
│   ├── context/            # Quản lý trạng thái toàn cục (Context API)
│   │   ├── AuthContext.jsx # Quản lý Token & User Host (FE1)
│   │   └── SocketContext.jsx # Quản lý kết nối WebSocket (FE2)
│   │
│   ├── hooks/              # Custom Hooks tự định nghĩa
│   │   ├── useAuth.js      # Hook truy cập nhanh AuthContext
│   │   └── useSocket.js    # Hook quản lý gửi/nhận tin nhắn Socket
│   │
│   ├── layouts/            # Các khung giao diện chính 
│   │   ├── AuthLayout.jsx  # Layout cho Login/Register
│   │   ├── HostLayout.jsx  # Layout Dashboard cho giảng viên
│   │   └── PlayerLayout.jsx # Layout tối giản cho người chơi
│   │
│   ├── pages/              # Các trang hiển thị theo Route 
│   │   ├── auth/           # Login.jsx, Register.jsx
│   │   ├── host/           # Quản lý Quiz, Room, Game Control
│   │   └── player/         # JoinRoom, WaitingRoom, PlayGame
│   │
│   ├── routes/             # Cấu hình điều hướng
│   │   └── AppRoutes.jsx   # Định nghĩa tất cả các Path của ứng dụng
│   │
│   ├── utils/              # Tiện ích bổ trợ
│   │   └── constants.js    # Chứa API_URL, SOCKET_URL, Error Codes...
│   │
│   ├── App.css             # CSS chính cho App
│   ├── App.jsx             # Component gốc của ứng dụng (React)
│   ├── App.tsx             # (Dự phòng) Component gốc (TypeScript)
│   ├── index.css           # CSS cơ bản (Tailwind Directives)
│   ├── main.jsx            # Điểm khởi đầu của ứng dụng (JS)
│   └── main.tsx            # Điểm khởi đầu của ứng dụng (TS)
│
├── .gitignore              # Chỉ định các file không đưa lên Git
├── eslint.config.js        # Cấu hình kiểm tra lỗi code (Linting)
├── index.html              # File HTML chính của dự án
├── package.json            # Quản lý dependencies và scripts (npm)
├── README.md               # Hướng dẫn dự án
├── vite.config.ts          # Cấu hình cho công cụ build Vite
└── (các file config TS)    # tsconfig.json, tsconfig.node.json