
const getSubdomain = (): string | null => {
    const match = window.location.hostname.match(/^([^.]+)\.localhost/);
    return match ? match[1] : null;
};

const subdomain = getSubdomain();

const API_URL = `http://${subdomain}.${import.meta.env.VITE_API_DOMAIN}/api`

const retriveRequest = async (endpoint: string, options: RequestInit = {}) => {

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    })

    if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
    }

    return await response.json()
}

export { retriveRequest }