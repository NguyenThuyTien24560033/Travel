//logic cho phần banner
//Step 1: component render -> current =0
//Step 2:Hiển thị ảnh đầu tiên
//Step 3: useEffect chạy -> tạo interval 
//Step 4: update ảnh vào setCurrent=> dùng chia lấy số dư để xoay quanh length liên tục
//Step 5: sau 10s thì re-render lại 1 lần, hiển thị ảnh update

//useState: lưu data
//useEffect: chạy logic theo thời gian
import { useState, useEffect } from "react";
//import các ảnh để chạy banner
import img1 from '../image/Khang.jpg'
import img2 from '../image/Nhan.jpg'
import img3 from '../image/Tien.jpg'
import img4 from '../image/Van.jpg'
//import css
import "./Banner.css";
//collect mấy cái ảnh thành array
const images = [img1, img2, img3, img4];
//tạo hàm Banner
export default function Banner() {
  //current: image hiện tại
  //setCurrent: image được update
  //useSate: data hiện tại là 0 => image đầu tiên
  const [current, setCurrent] = useState(0);

  //tự động đổi ảnh
  useEffect(() => {
    //hàm setInterval là hàm chạy lại 1 logic sau 1 fixed time
    const interval = setInterval(() => {
      //(prev+1)%images.legth: tăng index, nếu hết thì quay đầu lại
      //
      setCurrent((prev) => (prev + 1) % images.length);
      //sau 10s thì ảnh đổi 1 lần
    }, 10000);
    //dọn dẹp interval để trách leak bộ nhớ
    return () => clearInterval(interval);
    //chạy 1 lần khi component được gọi
  }, []);

  //render UI
  return (
    <div className="banner">
      <img src={images[current]} alt="banner" />
    </div>
  );
}


