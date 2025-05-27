import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <div>
          <h1>Chào mừng đến với trang quản trị</h1>
          <p>Đây là nội dung chính của trang quản trị.</p>
        </div>
      } />
      <Route path="*" element={
        <div>
          <h1>404 - Không tìm thấy trang</h1>
          <p>Trang bạn đang tìm kiếm không tồn tại.</p>
        </div>
      } />
    </Routes>
  );
}

export default App;
