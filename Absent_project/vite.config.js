import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/Similan-Absent",
  server: {
    port: 5173, // หรือพอร์ตที่คุณต้องการ
    host: "192.168.1.0.202", // เปลี่ยนเป็น IP Address ของคุณ
  },
});
