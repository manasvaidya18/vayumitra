const API_URL = "http://127.0.0.1:8000/auth";

export const signupUser = async (email, password, role) => {
    const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Signup failed");
    }

    return response.json();
};

export const loginUser = async (email, password) => {
    // OAuth2PasswordRequestForm sends data as form-urlencoded
    const formData = new URLSearchParams();
    formData.append('username', email); // FASTAPI expects 'username'
    formData.append('password', password);

    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
    }

    return response.json();
};
