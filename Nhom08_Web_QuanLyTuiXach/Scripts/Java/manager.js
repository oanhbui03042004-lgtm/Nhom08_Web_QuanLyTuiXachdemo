function renderManagerOverview() {
    let orders = [];
    let inventory = {};
    let leaveRequests = [];

    try {
        orders = JSON.parse(
            localStorage.getItem("maisoneOrders") || "[]"
        );

        inventory = JSON.parse(
            localStorage.getItem("maisoneInventory") || "{}"
        );

        leaveRequests = JSON.parse(
            localStorage.getItem("maisoneLeaveRequests") || "[]"
        );

        if (
            !Array.isArray(orders) ||
            !Array.isArray(leaveRequests) ||
            !inventory ||
            typeof inventory !== "object"
        ) {
            throw new TypeError("Dữ liệu vận hành sai định dạng.");
        }

    } catch (error) {

        console.error(
            "Không thể tải số liệu vận hành.",
            error
        );

        toast("Không đọc được đầy đủ số liệu vận hành.");

        orders = [];
        inventory = {};
        leaveRequests = [];
    }


    const stages = orders.map(
        order => Number(order.deliveryStage) || 0
    );


    document.getElementById("managerPending").textContent =
        String(
            stages.filter(
                stage => stage === 0
            ).length
        );


    document.getElementById("managerShipping").textContent =
        String(
            stages.filter(
                stage => stage > 0 && stage < 3
            ).length
        );


    document.getElementById("managerLeave").textContent =
        String(
            leaveRequests.filter(
                request => request.status === "pending"
            ).length
        );


    document.getElementById("managerLowStock").textContent =
        String(
            products.filter(
                product =>
                    Number(
                        inventory[product.id] ??
                        (18 + Number(product.id) * 4)
                    ) <= 5
            ).length
        );


    renderManagerLeaveRequests(leaveRequests);
}


function managerEscape(value) {

    return String(value ?? "").replace(
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


function renderManagerLeaveRequests(requests) {

    const pending =
        requests
            .filter(
                request =>
                    request.status === "pending"
            )
            .slice()
            .reverse();


    const rows =
        document.getElementById(
            "managerLeaveRows"
        );


    const empty =
        document.getElementById(
            "managerLeaveEmpty"
        );


    if (!rows || !empty) return;


    let employees = [];


    try {

        employees = JSON.parse(
            localStorage.getItem("maisoneStaff") || "[]"
        );


        if (!Array.isArray(employees)) {
            throw new TypeError(
                "Danh sách nhân viên sai định dạng."
            );
        }


    } catch (error) {

        console.error(
            "Không thể tải hồ sơ nhân viên cho đơn nghỉ.",
            error
        );

        toast(
            "Không đọc được hồ sơ nhân viên."
        );

    }


    rows.innerHTML =
        pending.map(request => {

            const employee =
                employees.find(
                    item =>
                        item.id === request.employeeId
                );


            const employeeName =
                employee?.name ||
                request.employeeName ||
                "Nhân viên";


            const actions = `
                <div class="manager-leave-actions">

                    <button
                        class="ui-btn"
                        type="button"
                        data-manager-leave-status="approved"
                        data-manager-leave-type="Nghỉ phép có lương"
                        data-manager-leave-id="${managerEscape(request.id)}">

                        DUYỆT CÓ LƯƠNG

                    </button>


                    <button
                        class="ui-btn"
                        type="button"
                        data-manager-leave-status="approved"
                        data-manager-leave-type="Nghỉ không lương"
                        data-manager-leave-id="${managerEscape(request.id)}">

                        DUYỆT KHÔNG LƯƠNG

                    </button>


                    <button
                        class="ui-btn danger"
                        type="button"
                        data-manager-leave-status="rejected"
                        data-manager-leave-id="${managerEscape(request.id)}">

                        TỪ CHỐI

                    </button>

                </div>
            `;


            const employeeDetails = [

                request.email,

                employee?.role === "manager" ||
                    request.employeeRole === "manager"
                    ? "Quản lý"
                    : "Nhân viên",

                employee?.workMode ||
                request.workMode,

                employee?.zone ||
                request.employeeZone,

                employee?.dateOfBirth ||
                request.dateOfBirth,

                employee?.gender ||
                request.gender,

                employee?.identityNumber ||
                request.identityNumber,

                employee?.phone ||
                request.phone,

                employee?.address ||
                request.address

            ]
                .filter(Boolean)
                .map(managerEscape)
                .join(" · ");


            return `

                <article class="manager-leave-item">

                    <div class="manager-leave-detail">

                        <span>
                            Nhân viên
                        </span>

                        <strong>
                            ${managerEscape(employeeName)}
                        </strong>

                        <small>
                            ${employeeDetails}
                        </small>

                    </div>


                    <div class="manager-leave-detail">

                        <span>
                            Thời gian nghỉ
                        </span>

                        <strong>
                            ${managerEscape(request.startDate)}
                            –
                            ${managerEscape(request.endDate)}
                        </strong>

                    </div>


                    <div class="manager-leave-detail">

                        <span>
                            Lý do
                        </span>

                        <p>
                            ${managerEscape(request.reason)}
                        </p>

                    </div>


                    <div class="manager-leave-detail">

                        <span>
                            Hình thức nghỉ
                        </span>

                        <strong>
                            Chờ quản lý quyết định
                        </strong>

                    </div>


                    <div class="manager-leave-detail">

                        <span>
                            Trạng thái
                        </span>

                        <strong class="manager-leave-pending">
                            Chờ duyệt
                        </strong>

                    </div>


                    ${actions}

                </article>

            `;

        }).join("");


    empty.hidden =
        pending.length > 0;
}


const managerLeaveRows =
    document.getElementById(
        "managerLeaveRows"
    );


if (managerLeaveRows) {

    managerLeaveRows.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-manager-leave-id]"
                );


            if (!button) return;


            let requests;


            try {

                requests = JSON.parse(
                    localStorage.getItem(
                        "maisoneLeaveRequests"
                    ) || "[]"
                );


                if (!Array.isArray(requests)) {

                    throw new TypeError(
                        "Danh sách đơn nghỉ sai định dạng."
                    );

                }

            } catch (error) {

                console.error(
                    "Không thể đọc đơn xin nghỉ.",
                    error
                );

                toast(
                    "Không đọc được đơn xin nghỉ."
                );

                return;
            }


            const request =
                requests.find(
                    item =>
                        item.id ===
                        button.dataset.managerLeaveId
                );


            if (
                !request ||
                request.status !== "pending"
            ) {

                toast(
                    "Đơn nghỉ này đã được xử lý hoặc không còn tồn tại."
                );

                renderManagerOverview();

                return;
            }


            let reviewer = "manager";


            try {

                const account =
                    JSON.parse(
                        localStorage.getItem(
                            "currentAccount"
                        ) || "null"
                    );


                reviewer =
                    account?.email ||
                    reviewer;


            } catch (error) {

                console.error(
                    "Không thể xác định tài khoản duyệt đơn.",
                    error
                );

                toast(
                    "Không xác định được người duyệt đơn."
                );

                return;
            }


            const nextRequests =
                requests.map(item =>

                    item.id === request.id

                        ? {

                            ...item,

                            status:
                                button.dataset
                                    .managerLeaveStatus,

                            ...(button.dataset.managerLeaveStatus ===
                                "approved"

                                ? {
                                    leaveType:
                                        button.dataset
                                            .managerLeaveType
                                }

                                : {}),

                            reviewedAt:
                                new Date().toISOString(),

                            reviewedBy:
                                reviewer
                        }

                        : item
                );


            try {

                localStorage.setItem(
                    "maisoneLeaveRequests",
                    JSON.stringify(
                        nextRequests
                    )
                );


            } catch (error) {

                console.error(
                    "Không thể lưu kết quả duyệt đơn nghỉ.",
                    error
                );

                toast(
                    "Không thể lưu kết quả duyệt đơn nghỉ."
                );

                return;
            }


            renderManagerOverview();


            toast(
                button.dataset.managerLeaveStatus ===
                    "approved"

                    ? `Đã duyệt đơn ${button.dataset.managerLeaveType ===
                        "Nghỉ phép có lương"
                        ? "nghỉ có lương"
                        : "nghỉ không lương"
                    }.`

                    : "Đã từ chối đơn nghỉ."
            );

        }
    );

}


window.addEventListener(
    "storage",
    event => {

        if (
            [
                "maisoneOrders",
                "maisoneInventory",
                "maisoneLeaveRequests",
                "maisoneStaff"
            ].includes(event.key)
        ) {

            renderManagerOverview();

        }

    }
);


renderManagerOverview();