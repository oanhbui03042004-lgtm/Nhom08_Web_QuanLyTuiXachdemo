const loginForm = document.getElementById("loginForm");

document.querySelectorAll("[data-demo-email]").forEach(button => {
    button.addEventListener("click", () => {
        loginForm.elements.email.value = button.dataset.demoEmail;
        loginForm.elements.password.value = button.dataset.demoPassword;
        loginForm.elements.password.focus();
    });
});

loginForm.addEventListener("submit", event => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;

    let registeredAccounts;

    try {
        registeredAccounts = JSON.parse(
            localStorage.getItem("maisoneAccounts") || "[]"
        );
    } catch (error) {
        toast(
            "Không đọc được tài khoản demo đã lưu. Vui lòng xóa dữ liệu tài khoản và đăng ký lại."
        );
        return;
    }

    if (!Array.isArray(registeredAccounts)) {
        toast("Danh sách tài khoản demo không hợp lệ.");
        return;
    }

    const accountsByEmail = new Map(
        demoAccounts.map(item => [
            item.email.toLowerCase(),
            item
        ])
    );

    registeredAccounts.forEach(item => {
        if (item?.email) {
            accountsByEmail.set(
                item.email.toLowerCase(),
                {
                    ...accountsByEmail.get(item.email.toLowerCase()),
                    ...item
                }
            );
        }
    });

    const account = [...accountsByEmail.values()].find(item =>
        item.email.toLowerCase() === email &&
        item.password === password
    );

    if (!account) {
        toast("Email hoặc mật khẩu chưa chính xác.");
        return;
    }

    if (account.active === false) {
        toast(
            "Tài khoản nhân viên đã ngừng hoạt động. Vui lòng liên hệ quản trị viên."
        );
        return;
    }

    const {
        password: ignoredPassword,
        ...safeAccount
    } = account;

    localStorage.setItem(
        "currentAccount",
        JSON.stringify(safeAccount)
    );

    toast("Đăng nhập thành công.");

    /*
        MVC 5:
        admin   -> Admin/Index
        manager -> Manager/Index
        staff   -> Staff/Index
        customer-> Home/Index
    */

    const destination = {
        admin: "/Admin/Index",
        manager: "/Manager/Index",
        staff: "/Staff/Index",
        customer: "/Home/Index"
    }[account.role] || "/Home/Index";

    window.setTimeout(() => {
        location.assign(destination);
    }, 500);
});