"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
import Image from "next/image";


export default function Product() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        thumbnail: null,
    });
    const [buttonLoading, setButtonLoading] = useState(false);
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
            if (file) {
                setFormData({...formData, thumbnail: file});
                
                // Create preview URL
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result);
                };
                reader.readAsDataURL(file);
            }
    };

    const fetchProduct = async () => {
        try {
            setLoading(true);   
            // Simulate API call
            const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
            const res = await fetch(`${apiUrl}products/${id}`, {
            method: 'GET',
            credentials: "include",
            cache: 'no-store',
            headers: {
            "Content-Type": "application/json",
            'Accept': "application/json",
            },
        });
        res.json().then(data => {
            if (res.ok) {
                setLoading(false);
                // console.log(data.data);
                const productData = data.data;
                setProduct(productData);
                setFormData({
                    title: productData.title || '',
                    price: productData.price || '',
                    description: productData.description || '',
                    thumbnail: null, // Keep null for file input
                });
            } else {
                setLoading(false);
                // console.log(data);
                toast.error(`An error occurred. Please try again. Error: ${data.message}`);
                
            }
        }).catch(err => {
            setLoading(false);
            toast.error(`An error occurred. Please try again. Error: ${err.message}`);
        });
        } catch (err) {
            setError('Failed to fetch products');
            setLoading(false);
        }
    };
    
    useEffect(() => {
        document.title = "Product";
        fetchProduct();
    }, [router]);

    const onhandleSubmit = async (e) => {
        e.preventDefault();
        setButtonLoading(true);   
        // Handle form submission logic here
        // console.log(formData);
        if (!formData.title || !formData.price) {
            toast.error("Please fill in all required fields!");
            setButtonLoading(false);
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('description', formData.description);
        // Only append thumbnail if a file is selected
        if (formData.thumbnail) {
            formDataToSend.append('thumbnail', formData.thumbnail);
        }
        // Add this to FormData
        formDataToSend.append('_method', 'PUT');

        
        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const res = await fetch(`${apiUrl}products/${id}`, {
            method: 'POST', 
            cache: 'no-store',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
            },
            body: formDataToSend,
        });
        res.json().then(data => {
            if (res.ok) {
                setButtonLoading(false);
                toast.success(data.message || "Product updated successfully!");
                fetchProduct();
            } else {
                setButtonLoading(false);
                toast.error(data.message || "Failed to add product!");
            }
        }).catch(err => {
            setButtonLoading(false);
            toast.error(`An error occurred. Please try again. Error: ${err.message}`);
        });
    }
    
    return(
        <div className="container mt-5">
            {product && (
                <>
                <div className="col-md-4">
                <div className="card mb-4">
                    <div className="card-body">
                        {/* form for adding new product */}
                        <h5 className="card-title">Edit Product</h5>
                        {error && (
                            <tr>
                                <td colSpan="4">Error: {error}</td>
                            </tr>
                        )}
                        <form onSubmit={onhandleSubmit} encType="multipart/form-data">
                            <div className="mb-3">  
                                <label htmlFor="productName" className="form-label">Product Name <sup>*</sup></label>
                                <input type="text" className="form-control" id="productName" 
                                name="title" 
                                value={formData.title} 
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                placeholder="Enter product name" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="productPrice" className="form-label">Price <sup>*</sup></label>
                                <input type="number" className="form-control" id="productPrice" name="price" 
                                value={formData.price} 
                                 onChange={(e) => setFormData({...formData, price: e.target.value})}
                                placeholder="Enter product price" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="productDesc" className="form-label">Description</label>
                                <textarea className="form-control" id="productDesc" placeholder="Product Description" 
                                value={formData.description} 
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                name="description"></textarea>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="productThumbnail" className="form-label">Thumnbail</label>
                                <input type="file" className="form-control" id="productThumbnail" 
                                name="thumbnail"
                                accept="image/*"
                                onChange={handleFileChange}
                                 />
                                 {preview ? (
                                        <img src={preview} alt="New preview" className="mt-2" style={{maxWidth: '200px'}} />
                                    ) : product?.thumbnail ? (
                                        <img src={`${process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL}${product.thumbnail}`} 
                                            alt="Current image" className="mt-2" style={{maxWidth: '200px'}} />
                                    ) : null}
                            </div>
                            <Toaster position="top-right" />
                             <button
                            type="submit"
                            className={`btn btn-success w-100 py-2 fw-bold text-uppercase shadow-sm mb-3 ${loading ? 'opacity-75 disabled' : ''}`}
                        >
                            {buttonLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Processing...
                                </>
                            ) : "Submit"}
                        </button>
                        </form>

                    </div>
                </div>
            </div>
                </>
            )}
        </div>
    );
}