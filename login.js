document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('api-key');
    const loginButton = document.getElementById('login-button');
    const loginError = document.getElementById('login-error');
    const loginPage = document.getElementById('login-page');
    const protectedPage = document.getElementById('protected-page');
    const logoutButton = document.getElementById('logout-button');

    const COOKIE_NAME = 'auth_token'; // 定义cookie名称

    // 检查是否已登录 (通过检查 Cookie)
    function isLoggedIn() {
        return document.cookie.includes(COOKIE_NAME + '=');
    }

    // 显示对应的页面
    function updateUI() {
        if (isLoggedIn()) {
            loginPage.style.display = 'none';
            protectedPage.style.display = 'block';
        } else {
            loginPage.style.display = 'block';
            protectedPage.style.display = 'none';
        }
    }

    updateUI(); // 页面加载时检查

    loginButton.addEventListener('click', async () => {
        const apiKey = apiKeyInput.value;

        try {
            const response = await fetch('/api/login', { // 假设 Cloudflare Worker 监听 /api/login
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ apiKey: apiKey })
            });

            if (response.ok) {
                // 登录成功，Worker 会设置 Cookie
                loginError.style.display = 'none';
                updateUI(); // 更新页面
                apiKeyInput.value = ''; // 清空输入框
            } else {
                // 登录失败
                const errorData = await response.json();
                loginError.textContent = errorData.message || '登录失败，请重试。';
                loginError.style.display = 'block';
            }
        } catch (error) {
            console.error('登录请求失败:', error);
            loginError.textContent = '登录请求失败，请检查网络。';
            loginError.style.display = 'block';
        }
    });

    logoutButton.addEventListener('click', () => {
        // 删除 Cookie
        document.cookie = COOKIE_NAME + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        updateUI(); // 更新页面
    });
});
