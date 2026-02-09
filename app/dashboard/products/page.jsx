"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect,useState } from "react";
import toast, { Toaster } from 'react-hot-toast';


export default function Product() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        thumbnail: null,
    });
    const [buttonLoading, setButtonLoading] = useState(false);
    const [preview, setPreview] = useState(null);

    const [allProducts, setAllProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Adjust as needed




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

    const fetchProducts = async (page = 1   ) => {
        try {
            setLoading(true);   
            // Simulate API call
            const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
            const res = await fetch(`${apiUrl}products?page=${page}&per_page=${itemsPerPage}`, {
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
                // console.log(data.data.data);
                // Try different data structures
                const apiData = data.data || data;
                const products = apiData.data || apiData.products || [];
                const pagination = apiData;

                setProducts(products);
                setTotalPages(pagination.last_page || 1);
                setTotalProducts(pagination.total || 0);
                setCurrentPage(pagination.current_page || 1);
                setItemsPerPage(pagination.per_page || 10);
                
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
        document.title = "Products";
        fetchProducts(currentPage);
    }, [router, currentPage]);

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

        // console.log(formData);
        // return;
        
        
        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const res = await fetch(`${apiUrl}products`, {
            method: 'POST', 
            credentials: "include",
            headers: {
                'Accept': 'application/json',
            },
            body: formDataToSend,
        });
        res.json().then(data => {
            if (res.ok) {
                setButtonLoading(false);
                toast.success(data.message || "Product added successfully!");
                setFormData({
                    title: '',
                    price: '',
                    description: '',
                    thumbnail: null,
                });
                setPreview(null);
                fetchProducts(currentPage);
            } else {
                setButtonLoading(false);
                toast.error(data.message || "Failed to add product!");
            }
        }).catch(err => {
            setButtonLoading(false);
            toast.error(`An error occurred. Please try again. Error: ${err.message}`);
        });
    }

    const deleteProduct = async (product) => {
        try {
            setLoading(true);
            const isConfirmed = confirm(`Are you sure you want to delete ${product.title}?`);  
            if (!isConfirmed) {
                setLoading(false);
                return;
            }
            // Simulate API call
            const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
            const res = await fetch(`${apiUrl}products/${product.id}`, {
            method: 'DELETE',
            credentials: "include",
            cache: 'no-store',
            headers: {
            "Content-Type": "application/json",
            'Accept': "application/json",
            },
        });
        res.json().then(data => {
            if (res.ok) {
                toast.success(data.message || "Product deleted successfully!");
                fetchProducts(currentPage);
            } else {
                toast.error(data.message || "Failed to delete product!");
                setLoading(false);
            }
        }).catch(err => {
            toast.error(`An error occurred. Please try again. Error: ${err.message}`);
            setLoading(false);
        });
        } catch (err) {
            toast.error(`An error occurred. Please try again. Error: ${err.message}`);
            setLoading(false);
        }
        
    }   


 const productsData = products;

  return (
    <div className="container mt-5">
        <div className="row">
            <div className="col-md-8">
                <h1 className="mb-4">Products</h1>
                <table className="table table-striped">
                    <thead>
                        <tr>    
                            <th scope="col">Id</th>
                            <th scope="col">Image</th>
                            <th scope="col">Title</th>
                            <th scope="col">Price</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Loading...</td> 
                                </tr>
                                )
                        }
                        
                        {productsData && productsData.map((product) => (
                            <tr key={product.id}>
                                <th scope="row">#{product.id}</th> 
                                {product.thumbnail ? (
                                    <td><Image src={`${process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL}${product.thumbnail}`} alt={product.title} width={50} height={50} className="img-fluid" /></td>  
                                ) : (
                                    <td>--</td>
                                )}
                                <td>{product.title}</td>
                                <td>{product.price}</td>
                                <td><span className={`badge ${product.status === 1 ? 'bg-success' : 'bg-danger'}`}>{product.status===1 ? 'Active':'Inactive'}</span></td>
                                <td>
                                    <Link href={`/dashboard/products/${product.id}`}><button className="btn btn-sm btn-primary me-2">Edit</button></Link>
                                    <button className="btn btn-sm btn-danger" onClick={() => deleteProduct(product)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                       
                    </tbody>
                </table>
                {/* Pagination Controls */}

                <div className="d-flex justify-content-center mt-3">
                    <nav>
                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => fetchProducts(1)}>First</button>
                            </li>
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => fetchProducts(currentPage - 1)}>‹</button>
                            </li>
                            <li className="page-item active">
                                <span className="page-link">{currentPage} / {totalPages}</span>
                            </li>
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => fetchProducts(currentPage + 1)}>›</button>
                            </li>
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => fetchProducts(totalPages)}>Last</button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card mb-4">
                    <div className="card-body">
                        {/* form for adding new product */}
                        <h5 className="card-title">Add New Product</h5>
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
                                 {preview && (
                                    <img src={preview} alt="Preview" className="mt-2" style={{maxWidth: '200px'}} />
                                )}
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
        </div>
    </div>
  )
}
