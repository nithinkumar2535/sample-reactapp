import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';

function UserCart() {
    const [data, setData] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();

    const calculateTotalPrice = (products) => {
        return products.reduce((acc, item) => acc + (item.itemPrice * item.quantity), 0);
    };

    useEffect(() => {
        axios.get("/api/user/viewcart")
            .then((response) => {
                const products = response.data.products; 
                setData(products);
    
                // Calculate the total price based on the products with their quantities
                const total = calculateTotalPrice(products);
                setTotalPrice(total);
            })
            .catch((error) => {
                console.error("Error fetching cart data:", error);
            });
    }, []);
    

    const handleDelete = (itemId) => {
        axios.delete(`/api/deletefromcart/${itemId}`)
            .then((response) => {
                console.log(response.data);
                const newData = data.filter(item => item._id !== itemId);
                setData(newData);
                const total = calculateTotalPrice(newData);
                setTotalPrice(total);
            })
            .catch((error) => {
                console.error("Error deleting item from cart");
            });
    };


    const handleIncrement = (itemId) => {
        axios.put(`/api/cart/increment/${itemId}`)
            .then((response) => {
                if (response.data.success) {
                    const newData = data.map(item => {
                        if (item._id === itemId) {
                            return { ...item, quantity: item.quantity + 1 };
                        }
                        return item;
                    });
                    setData(newData);
                    const total = calculateTotalPrice(newData);
                    setTotalPrice(total);
                } else {
                    console.error("Failed to increment item quantity");
                }
            })
            .catch((error) => {
                console.error("Error incrementing item quantity:", error);
            });
    };
    
    
    const handleDecrement = (itemId) => {
        axios.put(`/api/cart/decrement/${itemId}`)
            .then((response) => {
                if (response.data.success) {
                    const newData = data.map(item => {
                        if (item._id === itemId && item.quantity > 1) {
                            return { ...item, quantity: item.quantity - 1 };
                        }
                        return item;
                    });
                    setData(newData);
                    const total = calculateTotalPrice(newData);
                    setTotalPrice(total);
                } else {
                    console.error("Failed to decrement item quantity");
                }
            })
            .catch((error) => {
                console.error("Error decrementing item quantity:", error);
            });
    };
    
    

    return (
        <div className="container">
            <h2>Products</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">No</th>
                        <th scope="col">Item Name</th>
                        <th scope="col">Item Description</th>
                        <th scope="col">Price</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Image</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((item, index) => (
                            <tr key={item._id}>
                                <th scope="row">{index + 1}</th>
                                <td>{item.itemName}</td>
                                <td>{item.itemDesc}</td>
                                <td>{item.itemPrice}</td>
                                <td>
                                    <button className="btn btn-warning rounded me-2" onClick={() => handleDecrement(item._id)}>-</button>
                                    {item.quantity}
                                    <button className="btn btn-warning rounded ms-2" onClick={() => handleIncrement(item._id)}>+</button>
                                </td>
                                <td><img src={`http://localhost:3000/images/product-images/${item._id}.jpg?timestamp=${new Date().getTime()}`} style={{ maxWidth: "50px" }} alt={item.itemName} /></td>
                                <td>
                                    <button onClick={() => handleDelete(item._id)} className="btn btn-outline-danger">Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">No items in Cart</td>
                        </tr>
                    )}
                    <tr>
                        <th scope="row"></th>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Total Price: <br/>{totalPrice.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
            <Link to="/addproducts" className="btn btn-success">Checkout</Link>
        </div>
    );
}

export default UserCart;
