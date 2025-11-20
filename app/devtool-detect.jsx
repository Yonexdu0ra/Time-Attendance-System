"use client";
import useDevtoolDetect from "@/hooks/useDevtoolDetect";

function DevtoolDetect({ children, production = false }) {
  const isOpen = useDevtoolDetect();
  if (!production) {
    return children;
  }
  return isOpen ? (
    <>
      {isOpen ? "open" : "closed"}
      <div className="fixed inset-0 bg-red-600 text-white flex flex-col items-center justify-center z-50 p-4">
        <h1 className="text-3xl font-bold mb-4">Cảnh báo!</h1>
        <p className="mb-2 text-center">
          Công cụ phát triển (DevTools) đang được mở. Vui lòng tắt nó để tiếp
          tục sử dụng ứng dụng.
        </p>
        <p className="text-center">
          Việc sử dụng DevTools có thể gây ra các vấn đề về bảo mật và ảnh hưởng
          đến trải nghiệm người dùng.
        </p>
      </div>
    </>
  ) : (
    children
  );
}

export default DevtoolDetect;
