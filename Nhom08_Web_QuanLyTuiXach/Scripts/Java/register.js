const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", event => {

        event.preventDefault();

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email")
                .value.trim()
                .toLowerCase();

        const phone =
            document.getElementById("phone")
                .value.trim();

        const password =
            document.getElementById("password").value;


        if (password.length < 6) {

            toast(
                "Mật khẩu cần có ít nhất 6 ký tự."
            );

            return;
        }


        let registeredAccounts;


        try {

            registeredAccounts = JSON.parse(
                localStorage.getItem(
                    "maisoneAccounts"
                ) || "[]"
            );

        } catch (error) {

            toast(
                "Không đọc được dữ liệu tài khoản demo. Vui lòng xóa dữ liệu tài khoản và thử lại."
            );

            return;
        }


        if (
            [...demoAccounts, ...registeredAccounts]
                .some(
                    account =>
                        account.email.toLowerCase() === email
                )
        ) {

            toast(
                "Email này đã được đăng ký. Hãy đăng nhập hoặc dùng email khác."
            );

            return;
        }


        const account = {
            name,
            email,
            phone,
            password,
            role: "customer"
        };


        registeredAccounts.push(account);


        try {

            localStorage.setItem(
                "maisoneAccounts",
                JSON.stringify(
                    registeredAccounts
                )
            );


            localStorage.setItem(
                "currentAccount",
                JSON.stringify({
                    name,
                    email,
                    phone,
                    role: "customer"
                })
            );


        } catch (error) {

            toast(
                "Không lưu được tài khoản trên trình duyệt. Hãy kiểm tra dung lượng lưu trữ."
            );

            return;
        }


        toast(
            "Đăng ký thành công. Đang chuyển tới cửa hàng..."
        );


        window.setTimeout(() => {

            location.assign(
                window.mvcHomeUrl || "/Home/Index"
            );

        }, 500);

    });

}