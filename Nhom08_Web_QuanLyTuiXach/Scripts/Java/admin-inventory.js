const inventoryStorageKey = "maisoneInventory";
const receiptStorageKey = "maisoneStockReceipts";

const inventoryRows =
    document.getElementById("inventoryRows");

const receiptRows =
    document.getElementById("receiptRows");

const receiptModal =
    document.getElementById("receiptModal");

const receiptForm =
    document.getElementById("receiptForm");


const stockSeed =
    Object.fromEntries(
        products.map(
            product => [
                product.id,
                18 + Number(product.id) * 4
            ]
        )
    );


function readInventory() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    inventoryStorageKey
                ) || "null"
            );


        return saved &&
            typeof saved === "object"

            ? {
                ...stockSeed,
                ...saved
            }

            : {
                ...stockSeed
            };

    } catch (error) {

        console.error(
            "Không thể đọc tồn kho đã lưu.",
            error
        );


        toast(
            "Không đọc được tồn kho đã lưu."
        );


        return {
            ...stockSeed
        };
    }
}


function readReceipts() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    receiptStorageKey
                ) || "[]"
            );


        if (!Array.isArray(saved)) {

            throw new TypeError(
                "Định dạng phiếu nhập không hợp lệ"
            );
        }


        return saved;

    } catch (error) {

        console.error(
            "Không thể đọc phiếu nhập đã lưu.",
            error
        );


        toast(
            "Không đọc được lịch sử phiếu nhập."
        );


        return [];
    }
}


function escInventory(value) {

    return String(
        value ?? ""
    ).replace(
        /[&<>"']/g,

        char => ({

            "&": "&amp;",

            "<": "&lt;",

            ">": "&gt;",

            '"': "&quot;",

            "'": "&#39;"
        })[char]
    );
}


function renderInventory() {

    const inventory =
        readInventory();


    const receipts =
        readReceipts();


    inventoryRows.innerHTML =
        products
            .map(
                product => {

                    const quantity =
                        Number(
                            inventory[
                            product.id
                            ] || 0
                        );


                    const status =
                        quantity <= 5
                            ? "Sắp hết"
                            : "Sẵn hàng";


                    return `
                        <tr>

                            <td>
                                ${escInventory(
                        product.name
                    )}
                            </td>

                            <td>
                                MS-${String(
                        product.id
                    ).padStart(3, "0")}
                            </td>

                            <td>
                                ${Number(
                        product.price
                    ).toLocaleString(
                        "vi-VN"
                    )}đ
                            </td>

                            <td>
                                <strong>
                                    ${quantity}
                                </strong>
                            </td>

                            <td>

                                <span
                                    class="status-pill ${quantity <= 5
                            ? "status-warning"
                            : ""
                        }">

                                    ${status}

                                </span>

                            </td>

                        </tr>
                    `;
                }
            )
            .join("");


    document.getElementById(
        "inventorySkuCount"
    ).textContent =
        String(
            products.length
        );


    document.getElementById(
        "inventoryTotal"
    ).textContent =
        String(
            Object.values(
                inventory
            ).reduce(
                (
                    total,
                    quantity
                ) =>
                    total +
                    Number(
                        quantity || 0
                    ),

                0
            )
        );


    document.getElementById(
        "inventoryLow"
    ).textContent =
        String(
            products.filter(
                product =>
                    Number(
                        inventory[
                        product.id
                        ] || 0
                    ) <= 5
            ).length
        );


    document.getElementById(
        "inventoryReceipts"
    ).textContent =
        String(
            receipts.length
        );


    document.getElementById(
        "receiptEmpty"
    ).hidden =
        receipts.length > 0;


    receiptRows.innerHTML =
        receipts
            .slice()
            .reverse()
            .map(
                receipt => `
                    <tr>

                        <td>
                            ${escInventory(
                    receipt.id
                )}
                        </td>

                        <td>
                            ${new Date(
                    `${receipt.receivedAt}T00:00:00`
                ).toLocaleDateString(
                    "vi-VN"
                )
                    }
                        </td>

                        <td>
                            ${escInventory(
                        receipt.supplier
                    )}
                        </td>

                        <td>
                            ${escInventory(
                        receipt.productName
                    )}
                        </td>

                        <td>
                            ${Number(
                        receipt.quantity
                    )}
                        </td>

                        <td>
                            ${Number(
                        receipt.unitCost
                    ).toLocaleString(
                        "vi-VN"
                    )}đ
                        </td>

                        <td>
                            ${escInventory(
                        receipt.note
                    )}
                        </td>

                    </tr>
                `
            )
            .join("");
}


function openReceipt() {

    const productSelect =
        document.getElementById(
            "receiptProduct"
        );


    productSelect.innerHTML =
        products
            .map(
                product => `
                    <option
                        value="${escInventory(
                    product.id
                )}">

                        ${escInventory(
                    product.name
                )}
                        ·
                        MS-${String(
                    product.id
                ).padStart(3, "0")}

                    </option>
                `
            )
            .join("");


    receiptForm.reset();


    receiptForm.elements.receivedAt.value =
        new Date()
            .toISOString()
            .slice(0, 10);


    window.MaisoneDatePicker.refresh(
        receiptForm.elements.receivedAt
    );


    receiptModal.hidden = false;
}


document
    .getElementById(
        "openReceiptForm"
    )
    .addEventListener(
        "click",
        openReceipt
    );


receiptModal.addEventListener(
    "click",
    event => {

        if (
            event.target.closest(
                "[data-close-receipt]"
            )
        ) {

            receiptModal.hidden =
                true;
        }
    }
);


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            !receiptModal.hidden
        ) {

            receiptModal.hidden =
                true;
        }
    }
);


receiptForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const form =
            new FormData(
                receiptForm
            );


        const productId =
            Number(
                form.get(
                    "productId"
                )
            );


        const quantity =
            Number(
                form.get(
                    "quantity"
                )
            );


        const unitCost =
            Number(
                form.get(
                    "unitCost"
                )
            );


        const product =
            products.find(
                item =>
                    Number(
                        item.id
                    ) === productId
            );


        if (
            !product ||
            !Number.isInteger(
                quantity
            ) ||
            quantity < 1 ||
            !Number.isFinite(
                unitCost
            ) ||
            unitCost < 0
        ) {

            toast(
                "Vui lòng kiểm tra sản phẩm, số lượng và giá nhập."
            );

            return;
        }


        const inventory =
            readInventory();


        const receipts =
            readReceipts();


        const receipt = {

            id:
                `PN-${Date.now()
                    .toString()
                    .slice(-8)}`,

            productId,

            productName:
                product.name,

            quantity,

            unitCost,

            supplier:
                String(
                    form.get(
                        "supplier"
                    )
                ).trim(),

            receivedAt:
                String(
                    form.get(
                        "receivedAt"
                    )
                ),

            note:
                String(
                    form.get(
                        "note"
                    ) || ""
                ).trim()
        };


        inventory[productId] =
            Number(
                inventory[productId] || 0
            ) + quantity;


        receipts.push(
            receipt
        );


        const previousInventory =
            localStorage.getItem(
                inventoryStorageKey
            );


        const previousReceipts =
            localStorage.getItem(
                receiptStorageKey
            );


        try {

            localStorage.setItem(
                inventoryStorageKey,

                JSON.stringify(
                    inventory
                )
            );


            localStorage.setItem(
                receiptStorageKey,

                JSON.stringify(
                    receipts
                )
            );

        } catch (error) {

            console.error(
                "Không thể lưu phiếu nhập.",
                error
            );


            try {

                if (
                    previousInventory ===
                    null
                ) {

                    localStorage.removeItem(
                        inventoryStorageKey
                    );

                } else {

                    localStorage.setItem(
                        inventoryStorageKey,
                        previousInventory
                    );
                }


                if (
                    previousReceipts ===
                    null
                ) {

                    localStorage.removeItem(
                        receiptStorageKey
                    );

                } else {

                    localStorage.setItem(
                        receiptStorageKey,
                        previousReceipts
                    );
                }

            } catch (
            rollbackError
            ) {

                console.error(
                    "Không thể khôi phục tồn kho sau khi lưu phiếu thất bại.",
                    rollbackError
                );
            }


            toast(
                "Không thể lưu phiếu nhập vào trình duyệt."
            );


            return;
        }


        receiptModal.hidden =
            true;


        renderInventory();


        toast(
            `Đã lưu ${receipt.id} và cập nhật tồn kho.`
        );
    }
);


window.addEventListener(
    "storage",
    event => {

        if (
            [
                inventoryStorageKey,
                receiptStorageKey
            ].includes(
                event.key
            )
        ) {

            renderInventory();
        }
    }
);


renderInventory();