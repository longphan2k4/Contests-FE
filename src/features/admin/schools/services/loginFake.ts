import axios from "axios";

let isAuthenticated = false;

export const loginFake = async () => {
  if (isAuthenticated) {
    return; // Nếu đã đăng nhập rồi thì không cần đăng nhập lại
  }

  try {
    await axios.post(
      "http://localhost:3000/api/auth/login",
      {
        identifier: "admin",
        password: "admin@123"
      },
      {
        withCredentials: true // Cho phép gửi/nhận cookies
      }
    );
    isAuthenticated = true;
    console.log("Đăng nhập thành công");
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    isAuthenticated = false;
  }
};
