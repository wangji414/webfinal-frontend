import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Crud = () => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    image: "",
    description: "",
    tags: "",
    product_id: "",
    launch_date: new Date().toISOString(), // 預設設為當前時間
  });
  const [isEditing, setIsEditing] = useState(false);

  // 從 API 獲取商品資料
  useEffect(() => {
    axios
      .get("http://localhost:7000/api/products") // 確保與後端路由匹配
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  // 處理輸入框的變化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 新增或更新數據
  const handleAddData = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.stock || !formData.description || !formData.image || !formData.product_id) {
      alert("所有欄位均為必填！");
      return;
    }

    const newProduct = {
      ...formData,
      tags: formData.tags.split(",").map((tag) => tag.trim()), // 處理標籤
    };

    if (isEditing) {
      // 編輯商品 (將 PUT 改為 PATCH)
      axios
        .patch(`http://localhost:7000/api/products/${formData.product_id}`, newProduct) // 使用商品ID來更新
        .then((response) => {
          const updatedData = data.map((item) =>
            item.product_id === formData.product_id ? response.data.data : item
          );
          setData(updatedData);
          resetForm();
          toast.success("商品更新成功!");
        })
        .catch((error) => {
          console.error("Error updating product:", error);
          toast.error("商品更新失敗!");
        });
    } else {
      // 新增商品
      axios
        .post("http://localhost:7000/api/products", newProduct)
        .then((response) => {
          setData([...data, response.data.data]);
          resetForm();
          toast.success("商品新增成功!");
        })
        .catch((error) => {
          console.error("Error adding product:", error);
          toast.error("商品新增失敗!");
        });
    }
  };

  // 重置表單
  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      stock: "",
      image: "",
      description: "",
      tags: "",
      product_id: "",
      launch_date: new Date().toISOString(),
    });
    setIsEditing(false);
  };

  // 編輯數據
  const handleEditData = (index) => {
    setIsEditing(true);
    const item = data[index];
    setFormData({
      name: item.name,
      price: item.price,
      stock: item.stock,
      image: item.image,
      description: item.description,
      tags: item.tags.join(", "),
      product_id: item.product_id, // 使用正確的 product_id
      launch_date: item.launch_date,
    });
  };

  // 刪除數據
  const handleDeleteData = (id) => {
    if (window.confirm("確定刪除這筆資料？")) {
      // 刪除商品
      axios
        .delete(`http://localhost:7000/api/products/${id}`)
        .then(() => {
          setData(data.filter((item) => item.product_id !== id)); // 刪除本地資料
          toast.error("商品已刪除!");
        })
        .catch((error) => {
          console.error("Error deleting product:", error.response ? error.response.data : error);
          toast.error("刪除商品失敗!");
        });
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <h1>即時更新的 CRUD 系統</h1>
      <form onSubmit={handleAddData}>
        <input type="text" name="image" className="form-control mb-2" placeholder="輸入圖片URL" value={formData.image} onChange={handleInputChange} />
        {formData.image && (
          <img src={formData.image} alt="Preview" className="photo-preview mb-2" style={{ width: "100px", height: "100px" }} />
        )}
        <input type="text" name="name" className="form-control mb-2" placeholder="輸入名稱" value={formData.name} onChange={handleInputChange} />
        <input type="number" name="price" className="form-control mb-2" placeholder="輸入價格" value={formData.price} onChange={handleInputChange} />
        <input type="number" name="stock" className="form-control mb-2" placeholder="輸入庫存" value={formData.stock} onChange={handleInputChange} />
        <input type="text" name="description" className="form-control mb-2" placeholder="輸入描述" value={formData.description} onChange={handleInputChange} />
        <input type="text" name="tags" className="form-control mb-2" placeholder="輸入標籤（用逗號分隔）" value={formData.tags} onChange={handleInputChange} />
        <input type="text" name="product_id" className="form-control mb-2" placeholder="輸入商品ID" value={formData.product_id} onChange={handleInputChange} />
        <input type="text" name="launch_date" className="form-control mb-2" placeholder="輸入發布日期" value={formData.launch_date} onChange={handleInputChange} />
        <button type="submit" className="btn btn-primary">{isEditing ? "更新" : "新增"}</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={resetForm}>取消</button>
      </form>

      <h2>商品列表</h2>
      <table className="table mt-4">
        <thead>
          <tr>
            <th>照片</th>
            <th>名稱</th>
            <th>價格</th>
            <th>庫存</th>
            <th>描述</th>
            <th>標籤</th>
            <th>商品ID</th>
            <th>發布日期</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.product_id}>
              <td><img src={item.image} alt="Item" className="photo-preview" style={{ width: "50px", height: "50px" }} /></td>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{item.stock}</td>
              <td>{item.description}</td>
              <td>{item.tags.join(", ")}</td>
              <td>{item.product_id}</td>
              <td>{new Date(item.launch_date).toLocaleDateString()}</td>
              <td>
                <button className="btn btn-warning btn-sm" onClick={() => handleEditData(index)}>編輯</button>
                <button className="btn btn-danger btn-sm ms-2" onClick={() => handleDeleteData(item.product_id)}>刪除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Crud;
