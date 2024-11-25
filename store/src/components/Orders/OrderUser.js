import React, { useState, useEffect } from "react";
import "./Order.css"

const OrderUser = () => {
    const [orders, setOrders] = useState([]); // Dữ liệu lịch sử đơn hàng

    useEffect(() => {
        const fetchOrderHistory = async () => {
            const url = "http://26.214.87.26:8080/api/orders";
            const token = localStorage.getItem("token"); // Lấy token từ localStorage
        
            try {
                const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                });
                console.log("Dữ liệu API trả về:", response.data);
                setOrders(response.data.content); // Lưu lịch sử đơn hàng vào state
            } catch (err) {
                setError("Không thể tải lịch sử đơn hàng."); // Xử lý lỗi nếu API thất bại
            }
        };
        fetchOrderHistory();
        console.log("âcsc: ", orders);
    }, []);

    return (
        <div className='order-wrapper'>
            <div className="user-order-wrapper">
                <h1>Lịch sử đơn hàng</h1>
                <div className="order-table">
                {/* Tiêu đề của bảng */}
                <div className="order-header">
                    <span>Mã đơn hàng</span>
                    <span>Trạng thái</span>
                    <span>Số lượng sản phẩm</span>
                    <span>Giá tiền</span>
                </div>
                {/* Dữ liệu của từng đơn hàng */}
                {orders.length > 0 ? (
                    orders.map((order) => (
                    <div
                        className="order-card"
                        key={order.orderId}
                        onClick={() => handleOrderClick(order.orderId)} // Nếu cần chuyển đến trang chi tiết
                    >
                        <span>#{order.orderId}</span>
                        <span>{order.status}</span>
                        <span>
                        {order.orderDetails.reduce((sum, detail) => sum + detail.quantity, 0)} {/* Tổng số lượng sản phẩm */}
                        </span>
                        <span>
                        {order.orderDetails
                            .reduce((sum, detail) => sum + detail.price * detail.quantity, 0)
                            .toLocaleString()}{" "}
                        VNĐ
                        </span>
                    </div>
                    ))
                ) : (
                    <p>Không có lịch sử đơn hàng.</p>
                )}
                </div>
            </div>
        </div>
    )
}

export default OrderUser