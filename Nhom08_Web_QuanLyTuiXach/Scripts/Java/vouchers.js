const grid = document.getElementById("rewardGrid");

function savedVouchers() {
    try {
        return JSON.parse(
            localStorage.getItem("savedVouchers") || "[]"
        );
    } catch (error) {
        toast("Không đọc được danh sách voucher đã lưu.");
        return [];
    }
}

function renderRewardVouchers() {

    if (!grid) return;

    const saved = new Set(
        savedVouchers().map(voucher => voucher.code)
    );

    if (!maisoneVoucherFeatureEnabled) {

        grid.innerHTML =
            '<p class="admin-empty-state">Voucher đang tạm ngưng trên toàn hệ thống.</p>';

        return;
    }

    grid.innerHTML =
        maisoneVouchers
            .filter(voucher => voucher.active !== false)
            .map(voucher => {

                const isSaved =
                    saved.has(voucher.code);

                return `
                    <article class="reward-voucher">

                        <div class="voucher-ticket">

                            <span>
                                ${voucher.category === "shipping"
                        ? "ƯU ĐÃI VẬN CHUYỂN"
                        : "ƯU ĐÃI SẢN PHẨM"
                    }
                            </span>

                            <b>
                                ${voucher.code}
                            </b>

                            <strong>
                                ${voucher.label}
                            </strong>

                            <small>
                                ${voucher.condition}
                            </small>

                            <small class="voucher-validity">
                                ${formatVoucherValidity(voucher)}
                            </small>

                        </div>

                        <button
                            class="ui-btn"
                            type="button"
                            data-save-voucher="${voucher.code}"
                            ${isSaved ? "disabled" : ""}>

                            ${isSaved ? "ĐÃ LƯU" : "LƯU VOUCHER"}

                        </button>

                    </article>
                `;

            })
            .join("");
}


if (grid) {

    grid.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-save-voucher]"
                );

            if (!button) return;


            const voucher =
                maisoneVouchers.find(
                    item =>
                        item.code ===
                        button.dataset.saveVoucher
                );


            if (!voucher) {

                toast(
                    "Không tìm thấy voucher."
                );

                return;
            }


            const saved =
                savedVouchers();


            if (
                !saved.some(
                    item =>
                        item.code ===
                        voucher.code
                )
            ) {

                saved.push(voucher);

            }


            try {

                localStorage.setItem(
                    "savedVouchers",
                    JSON.stringify(saved)
                );

                localStorage.setItem(
                    "savedVoucher",
                    voucher.code
                );

            } catch (error) {

                toast(
                    "Không thể lưu voucher trên trình duyệt."
                );

                return;
            }


            renderRewardVouchers();


            toast(
                `Đã lưu voucher ${voucher.code}.`
            );

        }
    );

}


renderRewardVouchers();


document
    .querySelectorAll("#cartNumber")
    .forEach(element => {

        element.textContent =
            cartCount();

    });