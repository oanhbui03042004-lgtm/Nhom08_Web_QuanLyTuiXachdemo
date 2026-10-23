const serviceStorageKeys = {
    returns: "maisoneReturnRequests",
    warranty: "maisoneWarrantyRequests",
    support: "maisoneSupportMessages"
};


function readServiceItems(key) {
    return JSON.parse(
        localStorage.getItem(key) || "[]"
    );
}


function showServiceToast(message) {

    const toast =
        document.getElementById("toast");

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    window.setTimeout(
        () => toast.classList.remove("show"),
        2500
    );
}


function renderSavedRequests(
    key,
    targetId,
    emptyMessage
) {

    const target =
        document.getElementById(targetId);

    if (!target) return;


    const items =
        readServiceItems(key);


    target.replaceChildren();


    if (!items.length) {

        const empty =
            document.createElement("p");

        empty.className =
            "service-empty";

        empty.textContent =
            emptyMessage;

        target.append(empty);

        return;
    }


    items
        .slice()
        .reverse()
        .forEach(item => {

            const card =
                document.createElement("article");

            card.className =
                "service-request-card";


            const title =
                document.createElement("strong");

            title.textContent =
                `${item.id} · ${item.order}`;


            const details =
                document.createElement("p");

            details.textContent =
                `${item.product} — ${item.reason}`;


            const status =
                document.createElement("span");

            status.className =
                "status-pill";

            status.textContent =
                item.stages?.[item.stage] ||
                item.status;


            card.append(
                title,
                details,
                status
            );


            if (item.stages) {

                const progress =
                    document.createElement("ol");

                progress.className =
                    "request-progress";


                item.stages.forEach(
                    (label, index) => {

                        const step =
                            document.createElement("li");

                        step.className =
                            index < item.stage
                                ? "is-complete"
                                : index === item.stage
                                    ? "is-current"
                                    : "";


                        step.textContent =
                            label;


                        progress.append(step);

                    }
                );


                card.append(progress);


                if (
                    item.stage <
                    item.stages.length - 1
                ) {

                    const advance =
                        document.createElement("button");

                    advance.type =
                        "button";

                    advance.className =
                        "ui-btn light request-demo-advance";

                    advance.dataset.requestId =
                        item.id;

                    advance.textContent =
                        "CẬP NHẬT QUY TRÌNH DEMO";


                    card.append(advance);
                }
            }


            if (item.note || item.phone) {

                const note =
                    document.createElement("p");

                note.className =
                    "service-request-note";


                note.textContent = [
                    item.note,
                    item.phone &&
                    `Liên hệ: ${item.phone}`
                ]
                    .filter(Boolean)
                    .join(" · ");


                card.append(note);
            }


            if (item.photos?.length) {

                const photoList =
                    document.createElement("div");

                photoList.className =
                    "service-request-photos";


                item.photos.forEach(photo => {

                    const image =
                        document.createElement("img");

                    image.src =
                        photo.data;

                    image.alt =
                        `Ảnh minh chứng: ${photo.name}`;


                    photoList.append(image);

                });


                card.append(photoList);
            }


            target.append(card);

        });
}


/* =========================
   ĐỔI TRẢ
========================= */

const returnForm =
    document.getElementById("returnForm");


if (returnForm) {

    const orderInput =
        document.getElementById(
            "returnOrder"
        );


    const productInput =
        document.getElementById(
            "returnProduct"
        );


    const photoInput =
        document.getElementById(
            "returnPhotos"
        );


    const photoPreview =
        document.getElementById(
            "returnPhotoPreview"
        );


    const photoNames =
        document.getElementById(
            "returnPhotoNames"
        );


    const returnStages = [
        "Chờ nhân viên xác nhận",
        "Đã xác nhận · chờ đơn vị vận chuyển đến lấy",
        "Đơn vị vận chuyển đã nhận hàng",
        "Đang kiểm tra sản phẩm",
        "Đã hoàn tất đổi trả / hoàn tiền"
    ];


    let availableOrders = [];


    try {

        availableOrders =
            JSON.parse(
                localStorage.getItem(
                    "maisoneOrders"
                ) || "[]"
            )
                .filter(
                    order =>
                        Number(order.deliveryStage) >= 3
                );

    } catch (error) {

        showServiceToast(
            "Không đọc được đơn hàng đã giao. Vui lòng tải lại trang."
        );

    }


    availableOrders.forEach(order => {

        const option =
            document.createElement("option");


        option.value =
            order.id;


        option.textContent =
            `#${order.id} · ${(order.items || [])
                .map(item => item.name)
                .join(", ")
            }`;


        orderInput.append(option);

    });


    orderInput.addEventListener(
        "change",
        () => {

            const order =
                availableOrders.find(
                    item =>
                        item.id ===
                        orderInput.value
                );


            productInput.replaceChildren(
                new Option(
                    order
                        ? "Chọn sản phẩm"
                        : "Chọn đơn hàng trước",
                    ""
                )
            );


            (order?.items || [])
                .forEach(item => {

                    productInput.add(
                        new Option(
                            item.name,
                            item.name
                        )
                    );

                });


            productInput.disabled =
                !order;


            const phoneInput =
                document.getElementById(
                    "returnContact"
                );


            if (
                order?.phone &&
                !phoneInput.value
            ) {

                phoneInput.value =
                    order.phone;

            }

        }
    );


    const requestedOrder =
        new URLSearchParams(
            location.search
        ).get("order");


    if (
        requestedOrder &&
        availableOrders.some(
            order =>
                order.id === requestedOrder
        )
    ) {

        orderInput.value =
            requestedOrder;

        orderInput.dispatchEvent(
            new Event("change")
        );

    }


    photoInput.addEventListener(
        "change",
        () => {

            photoPreview.replaceChildren();


            const files =
                Array.from(
                    photoInput.files || []
                );


            photoNames.textContent =
                files.length
                    ? files
                        .map(file => file.name)
                        .join(", ")
                    : "Chưa chọn ảnh nào.";


            if (
                files.length > 3 ||
                files.some(
                    file =>
                        file.size >
                        5 * 1024 * 1024
                )
            ) {

                photoInput.setCustomValidity(
                    "Chọn tối đa 3 ảnh, mỗi ảnh không quá 5 MB."
                );


                photoInput.reportValidity();


                photoInput.value =
                    "";


                photoNames.textContent =
                    "Vui lòng chọn tối đa 3 ảnh, mỗi ảnh không quá 5 MB.";


                return;
            }


            photoInput.setCustomValidity(
                ""
            );


            files.forEach(file => {

                const image =
                    document.createElement("img");


                image.src =
                    URL.createObjectURL(file);


                image.alt =
                    `Ảnh xem trước: ${file.name}`;


                photoPreview.append(image);

            });

        }
    );


    returnForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const files =
                Array.from(
                    photoInput.files || []
                );


            if (
                !files.length ||
                files.length > 3 ||
                files.some(
                    file =>
                        file.size >
                        5 * 1024 * 1024
                )
            ) {

                photoInput.setCustomValidity(
                    "Vui lòng tải lên từ 1 đến 3 ảnh, mỗi ảnh không quá 5 MB."
                );


                photoInput.reportValidity();

                return;
            }


            photoInput.setCustomValidity(
                ""
            );


            const formData =
                new FormData(returnForm);


            const requests =
                readServiceItems(
                    serviceStorageKeys.returns
                );


            let photos;


            try {

                photos =
                    await Promise.all(
                        files.map(
                            compressWarrantyImage
                        )
                    );

            } catch (error) {

                showServiceToast(
                    error.message ||
                    "Không thể đọc ảnh minh chứng. Vui lòng thử lại."
                );

                return;
            }


            const request = {

                id:
                    `RT-${Date.now()
                        .toString()
                        .slice(-6)}`,

                order:
                    String(
                        formData.get("order")
                    ),

                product:
                    String(
                        formData.get("product")
                    ),

                reason:
                    String(
                        formData.get("reason")
                    ),

                note:
                    String(
                        formData.get("note")
                    ),

                phone:
                    String(
                        formData.get("phone")
                    ),

                photos,

                stages:
                    returnStages,

                stage: 0

            };


            requests.push(request);


            try {

                localStorage.setItem(
                    serviceStorageKeys.returns,
                    JSON.stringify(requests)
                );

            } catch (error) {

                showServiceToast(
                    "Không đủ dung lượng lưu yêu cầu và ảnh. Hãy chọn ảnh nhẹ hơn."
                );

                return;
            }


            returnForm.reset();


            productInput.disabled =
                true;


            productInput.replaceChildren(
                new Option(
                    "Chọn đơn hàng trước",
                    ""
                )
            );


            photoPreview.replaceChildren();


            photoNames.textContent =
                "Chưa chọn ảnh nào.";


            renderSavedRequests(
                serviceStorageKeys.returns,
                "returnRequests",
                "Chưa có yêu cầu đổi trả nào được gửi."
            );


            showServiceToast(
                `Đã ghi nhận yêu cầu ${request.id} trên trình duyệt demo.`
            );

        }
    );


    renderSavedRequests(
        serviceStorageKeys.returns,
        "returnRequests",
        "Chưa có yêu cầu đổi trả nào được gửi."
    );


    const returnRequests =
        document.getElementById(
            "returnRequests"
        );


    if (returnRequests) {

        returnRequests.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-request-id]"
                    );


                if (!button) return;


                const requests =
                    readServiceItems(
                        serviceStorageKeys.returns
                    );


                const request =
                    requests.find(
                        item =>
                            item.id ===
                            button.dataset.requestId
                    );


                if (
                    !request ||
                    !request.stages
                ) {

                    showServiceToast(
                        "Không tìm thấy yêu cầu đổi trả này."
                    );

                    return;
                }


                request.stage =
                    Math.min(
                        request.stage + 1,
                        request.stages.length - 1
                    );


                try {

                    localStorage.setItem(
                        serviceStorageKeys.returns,
                        JSON.stringify(requests)
                    );

                } catch (error) {

                    showServiceToast(
                        "Không thể cập nhật trạng thái yêu cầu đổi trả."
                    );

                    return;
                }


                renderSavedRequests(
                    serviceStorageKeys.returns,
                    "returnRequests",
                    "Chưa có yêu cầu đổi trả nào được gửi."
                );

            }
        );

    }
}


/* =========================
   BẢO HÀNH
========================= */

const warrantyForm =
    document.getElementById(
        "warrantyForm"
    );


if (warrantyForm) {

    const photoInput =
        document.getElementById(
            "warrantyPhotos"
        );


    const photoPreview =
        document.getElementById(
            "warrantyPhotoPreview"
        );


    const photoNames =
        document.getElementById(
            "warrantyPhotoNames"
        );


    photoInput.addEventListener(
        "change",
        () => {

            photoPreview.replaceChildren();


            const files =
                Array.from(
                    photoInput.files || []
                );


            photoNames.textContent =
                files.length
                    ? files
                        .map(file => file.name)
                        .join(", ")
                    : "Chưa chọn ảnh nào.";


            if (
                files.length > 3 ||
                files.some(
                    file =>
                        file.size >
                        5 * 1024 * 1024
                )
            ) {

                photoInput.setCustomValidity(
                    "Chọn tối đa 3 ảnh, mỗi ảnh không quá 5 MB."
                );


                photoInput.reportValidity();


                photoInput.value =
                    "";


                photoNames.textContent =
                    "Vui lòng chọn tối đa 3 ảnh, mỗi ảnh không quá 5 MB.";


                return;
            }


            photoInput.setCustomValidity(
                ""
            );


            files.forEach(file => {

                if (
                    !file.type.startsWith(
                        "image/"
                    )
                ) {
                    return;
                }


                const image =
                    document.createElement(
                        "img"
                    );


                image.src =
                    URL.createObjectURL(file);


                image.alt =
                    `Ảnh xem trước: ${file.name}`;


                photoPreview.append(image);

            });

        }
    );


    warrantyForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const files =
                Array.from(
                    photoInput.files || []
                );


            if (
                !files.length ||
                files.length > 3 ||
                files.some(
                    file =>
                        file.size >
                        5 * 1024 * 1024
                )
            ) {

                photoInput.setCustomValidity(
                    "Vui lòng tải lên từ 1 đến 3 ảnh, mỗi ảnh không quá 5 MB."
                );


                photoInput.reportValidity();

                return;
            }


            photoInput.setCustomValidity(
                ""
            );


            const formData =
                new FormData(
                    warrantyForm
                );


            const requests =
                readServiceItems(
                    serviceStorageKeys.warranty
                );


            let photos;


            try {

                photos =
                    await Promise.all(
                        files.map(
                            compressWarrantyImage
                        )
                    );

            } catch (error) {

                showServiceToast(
                    error.message ||
                    "Không thể đọc ảnh minh chứng. Vui lòng thử lại."
                );

                return;
            }


            const request = {

                id:
                    `BH-${Date.now()
                        .toString()
                        .slice(-6)}`,

                order:
                    String(
                        formData.get("order")
                    ),

                product:
                    String(
                        formData.get("product")
                    ),

                reason:
                    String(
                        formData.get("reason")
                    ),

                photos,

                status:
                    "Đã tiếp nhận · chờ nhân viên kiểm tra"

            };


            requests.push(request);


            try {

                localStorage.setItem(
                    serviceStorageKeys.warranty,
                    JSON.stringify(requests)
                );

            } catch (error) {

                showServiceToast(
                    "Không đủ dung lượng trình duyệt để lưu ảnh. Hãy chọn ảnh ít hơn hoặc dung lượng nhỏ hơn."
                );

                return;
            }


            warrantyForm.reset();


            photoPreview.replaceChildren();


            photoNames.textContent =
                "Chưa chọn ảnh nào.";


            renderSavedRequests(
                serviceStorageKeys.warranty,
                "warrantyRequests",
                "Bạn chưa gửi yêu cầu bảo hành nào."
            );


            showServiceToast(
                `Đã ghi nhận yêu cầu ${request.id} trên trình duyệt demo.`
            );

        }
    );


    renderSavedRequests(
        serviceStorageKeys.warranty,
        "warrantyRequests",
        "Bạn chưa gửi yêu cầu bảo hành nào."
    );

}


/* =========================
   NÉN ẢNH
========================= */

function compressWarrantyImage(file) {

    return new Promise(
        (resolve, reject) => {

            const image =
                new Image();


            const objectUrl =
                URL.createObjectURL(file);


            image.onload = () => {

                URL.revokeObjectURL(
                    objectUrl
                );


                const scale =
                    Math.min(
                        1,
                        1200 /
                        Math.max(
                            image.width,
                            image.height
                        )
                    );


                const canvas =
                    document.createElement(
                        "canvas"
                    );


                canvas.width =
                    Math.max(
                        1,
                        Math.round(
                            image.width * scale
                        )
                    );


                canvas.height =
                    Math.max(
                        1,
                        Math.round(
                            image.height * scale
                        )
                    );


                const context =
                    canvas.getContext(
                        "2d"
                    );


                if (!context) {

                    reject(
                        new Error(
                            "Trình duyệt không thể xử lý ảnh này."
                        )
                    );

                    return;
                }


                context.drawImage(
                    image,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );


                resolve({

                    name:
                        file.name,

                    data:
                        canvas.toDataURL(
                            "image/jpeg",
                            0.72
                        )

                });

            };


            image.onerror = () => {

                URL.revokeObjectURL(
                    objectUrl
                );


                reject(
                    new Error(
                        `Không thể đọc ảnh ${file.name}.`
                    )
                );

            };


            image.src =
                objectUrl;

        }
    );
}


/* =========================
   HỖ TRỢ KHÁCH HÀNG
========================= */

const supportMessages =
    document.getElementById(
        "supportMessages"
    );


if (supportMessages) {

    const customerForm =
        document.getElementById(
            "supportCustomerForm"
        );


    function appendSupportMessage(
        message
    ) {

        const bubble =
            document.createElement(
                "article"
            );


        bubble.className =
            `support-message ${message.role}`;


        const sender =
            document.createElement(
                "strong"
            );


        sender.textContent =
            message.role === "staff"
                ? "Nhân viên Maisoné"
                : "Bạn";


        const text =
            document.createElement(
                "p"
            );


        text.textContent =
            message.text;


        const time =
            document.createElement(
                "small"
            );


        time.textContent =
            new Date(
                message.sentAt
            ).toLocaleString(
                "vi-VN"
            );


        bubble.append(
            sender,
            text,
            time
        );


        supportMessages.append(
            bubble
        );

    }


    function renderSupportMessages() {

        supportMessages.replaceChildren();


        const messages =
            readServiceItems(
                serviceStorageKeys.support
            );


        if (!messages.length) {

            const welcome =
                document.createElement(
                    "p"
                );


            welcome.className =
                "support-welcome";


            welcome.textContent =
                "Xin chào! Hãy gửi câu hỏi về sản phẩm, đơn hàng hoặc chính sách. Tin nhắn sẽ được lưu trên trình duyệt demo này.";


            supportMessages.append(
                welcome
            );

        } else {

            messages.forEach(
                appendSupportMessage
            );

        }


        supportMessages.scrollTop =
            supportMessages.scrollHeight;
    }


    customerForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const input =
                document.getElementById(
                    "supportCustomerInput"
                );


            const text =
                input.value.trim();


            if (!text) return;


            const messages =
                readServiceItems(
                    serviceStorageKeys.support
                );


            messages.push({

                role:
                    "customer",

                text,

                sentAt:
                    new Date().toISOString()

            });


            localStorage.setItem(
                serviceStorageKeys.support,
                JSON.stringify(messages)
            );


            input.value =
                "";


            renderSupportMessages();

        }
    );


    renderSupportMessages();


    window.addEventListener(
        "storage",
        event => {

            if (
                event.key ===
                serviceStorageKeys.support
            ) {

                renderSupportMessages();

            }

        }
    );

}