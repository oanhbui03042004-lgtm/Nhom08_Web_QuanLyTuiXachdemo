let customerAccount = null;

try {

    customerAccount = JSON.parse(
        localStorage.getItem("currentAccount") || "null"
    );

} catch (error) {

    toast("Không đọc được thông tin tài khoản demo.");

}

const customerName =
    document.getElementById("customerName");

if (
    customerName &&
    customerAccount?.name
) {

    customerName.textContent =
        customerAccount.name;

}


document
    .getElementById("logoutButton")
    .addEventListener("click", () => {

        localStorage.removeItem(
            "currentAccount"
        );

        toast("Bạn đã đăng xuất.");

        window.setTimeout(
            () => location.assign(homeUrl),
            450
        );

    });