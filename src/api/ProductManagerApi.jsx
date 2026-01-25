import {getToken} from "../utils/auth";

const token  = getToken();
const productManagerApi = {
    getAllProducts: async (page, size) => {
        const res = await fetch("http://localhost:8080/api/admin/product-management/products?page=" + page + "&size=" + size, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });

        if (!res.ok) return null;

        const json = await res.json();
        return json;
    },

    getCategories: async () => {
        const res = await fetch("http://localhost:8080/api/admin/product-management/categories", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json;
    },

    searchProducts: async (filters ,page, size) => {
        let api = "http://localhost:8080/api/admin/product-management/products/search?page=" + page + "&size=" + size;
        Object.entries(filters).forEach(([key, value]) => {
            if(value !== ""){
                api = api + "&" + key + "=" + value;
            }
        })
        const res = await fetch(api, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        console.log(api);
        if (!res.ok) return null;
        const json = await res.json();
        return json;
    },

    toggleActive: async (product) => {
        let active = true;
        if(product.active === true) {
            active = false;
        }
        const res = await fetch(`http://localhost:8080/api/admin/product-management/products/updateIsActive/${product.id}?isActive=${active}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json;
    },

    toggleFeaturedStatus: async (product) => {
        let featured = true;
        if(product.featured === true) {
            featured = false;
        }
        const res = await fetch(`http://localhost:8080/api/admin/product-management/products/updateIsFeatured/${product.id}?isFeatured=${featured}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json;
    },

    addProduct: async (productRequest) => {
        const res = await fetch("http://localhost:8080/api/admin/product-management/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(productRequest)
        });
        const json = await res.json();
        return json;
    },

    delete: async (id) => {
        const res = await fetch(`http://localhost:8080/api/admin/product-management/products/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json;
    },

    getProductById: async (id) => {
        const res = await fetch(`http://localhost:8080/api/admin/product-management/products/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json;
    },

    updateProduct: async (id, productRequest) => {
        const res =  await fetch(`http://localhost:8080/api/admin/product-management/products/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(productRequest)
        });
        const json = await res.json();
        return json;
    }
}
export default productManagerApi