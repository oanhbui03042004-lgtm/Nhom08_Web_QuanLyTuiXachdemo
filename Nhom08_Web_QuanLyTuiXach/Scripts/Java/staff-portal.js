const portalAttendanceKey = "maisoneAttendance";
const portalLeaveKey = "maisoneLeaveRequests";
const portalScheduleKey = "maisoneSchedules";
const portalOpenShiftKey = "maisonePartTimeShifts";
const demoStaffScheduleFlag = "maisoneDemoStaffScheduleSeeded";

let portalAccount = null;

try {
    portalAccount = JSON.parse(
        localStorage.getItem("currentAccount") || "null"
    );
} catch (error) {
    console.error("Không đọc được tài khoản nhân viên.", error);
    toast("Không đọc được tài khoản đang đăng nhập.");
}


function portalRead(key) {
    try {
        const value = JSON.parse(
            localStorage.getItem(key) || "[]"
        );

        if (!Array.isArray(value)) {
            throw new TypeError("Dữ liệu không hợp lệ");
        }

        return value;

    } catch (error) {
        console.error(`Không đọc được ${key}.`, error);
        toast("Không đọc được dữ liệu nhân viên.");
        return [];
    }
}


function portalWrite(key, value) {
    try {
        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;

    } catch (error) {
        console.error(`Không thể lưu ${key}.`, error);
        toast("Không thể lưu thông tin vào trình duyệt.");
        return false;
    }
}


/* =========================
   HỒ SƠ NHÂN VIÊN
========================= */

const employeeProfile = (() => {

    try {

        const employees = JSON.parse(
            localStorage.getItem("maisoneStaff") || "[]"
        );

        if (!Array.isArray(employees)) {
            throw new TypeError(
                "Danh sách nhân viên không hợp lệ."
            );
        }

        const normalizedEmail =
            String(
                portalAccount?.email || ""
            ).toLowerCase();


        const existing =
            employees.find(employee =>
                employee.id === portalAccount?.employeeId ||
                String(employee.email || "").toLowerCase() === normalizedEmail
            );


        return existing
            ? {
                ...existing,

                workMode:
                    existing.workMode ||
                    portalAccount?.workMode ||
                    (
                        normalizedEmail === "fulltime@bagstore.vn"
                            ? "full-time"
                            : "part-time"
                    )
            }

            : {

                id:
                    portalAccount?.employeeId ||
                    (
                        normalizedEmail === "fulltime@bagstore.vn"
                            ? "staff-fulltime-demo"
                            : portalAccount?.role === "staff"
                                ? "staff-demo"
                                : ""
                    ),

                email:
                    portalAccount?.email,

                name:
                    portalAccount?.name,

                role:
                    portalAccount?.role,

                zone:
                    portalAccount?.zone ||
                    (
                        normalizedEmail === "fulltime@bagstore.vn"
                            ? "Bán hàng"
                            : ""
                    ),

                workMode:
                    portalAccount?.workMode ||
                    (
                        portalAccount?.email === "fulltime@bagstore.vn"
                            ? "full-time"
                            : "part-time"
                    ),

                active:
                    portalAccount?.active !== false
            };

    } catch (error) {

        console.error(
            "Không thể đọc hồ sơ nhân viên.",
            error
        );

        return {
            id: "staff-demo",
            email: portalAccount?.email,
            name: portalAccount?.name
        };
    }

})();


/* =========================
   NGÀY HIỆN TẠI
========================= */

const portalNow = new Date();

const today =
    `${portalNow.getFullYear()}-${String(
        portalNow.getMonth() + 1
    ).padStart(2, "0")}-${String(
        portalNow.getDate()
    ).padStart(2, "0")}`;


const staffBirthDateInput =
    document.querySelector(
        '#staffPersonalProfileForm [name="dateOfBirth"]'
    );


if (staffBirthDateInput) {

    staffBirthDateInput.max = today;

    if (
        window.MaisoneDatePicker &&
        typeof window.MaisoneDatePicker.refresh === "function"
    ) {
        window.MaisoneDatePicker.refresh(
            staffBirthDateInput
        );
    }
}


const todayAttendance = () =>
    portalRead(
        portalAttendanceKey
    ).find(
        record =>
            record.employeeId === employeeProfile.id &&
            record.date === today
    );


function dateAfterDays(days) {

    const date = new Date();

    date.setDate(
        date.getDate() + days
    );

    return `${date.getFullYear()}-${String(
        date.getMonth() + 1
    ).padStart(2, "0")}-${String(
        date.getDate()
    ).padStart(2, "0")}`;
}


/* =========================
   TẠO LỊCH DEMO
========================= */

function seedDemoStaffSchedule() {

    if (
        localStorage.getItem(
            demoStaffScheduleFlag
        ) === "true"
    ) {
        return;
    }


    try {

        const openShifts =
            JSON.parse(
                localStorage.getItem(
                    portalOpenShiftKey
                ) || "[]"
            );


        const schedules =
            JSON.parse(
                localStorage.getItem(
                    portalScheduleKey
                ) || "[]"
            );


        if (
            !Array.isArray(openShifts) ||
            !Array.isArray(schedules)
        ) {
            throw new TypeError(
                "Dữ liệu lịch làm mẫu không đúng định dạng."
            );
        }


        const demoShifts = [

            {
                id: "DEMO-OPEN-SHIFT-01",
                date: dateAfterDays(1),
                shift: "Sáng · 08:00–14:00",
                zone: "Bán hàng",
                employeeId: null,
                demo: true
            },

            {
                id: "DEMO-OPEN-SHIFT-02",
                date: dateAfterDays(2),
                shift: "Chiều · 14:00–20:00",
                zone: "Bán hàng",
                employeeId: null,
                demo: true
            },

            {
                id: "DEMO-OPEN-SHIFT-03",
                date: dateAfterDays(3),
                shift: "Tối · 17:00–21:00",
                zone: "Chăm sóc khách hàng",
                employeeId: null,
                demo: true
            },

            {
                id: "DEMO-OPEN-SHIFT-04",
                date: dateAfterDays(4),
                shift: "Sáng · 08:00–14:00",
                zone: "Bán hàng",
                employeeId: "staff-demo",
                employeeName: "Nhân viên bán hàng",
                demo: true
            }

        ];


        const demoSchedules = [

            {
                id: "DEMO-SCHEDULE-01",
                employeeId: "staff-fulltime-demo",
                date: dateAfterDays(1),
                shift: "Full-time · 08:00–17:00",
                demo: true
            },

            {
                id: "DEMO-SCHEDULE-02",
                employeeId: "staff-fulltime-demo",
                date: dateAfterDays(2),
                shift: "Full-time · 08:00–17:00",
                demo: true
            },

            {
                id: "DEMO-SCHEDULE-03",
                employeeId: "staff-fulltime-demo",
                date: dateAfterDays(3),
                shift: "Full-time · 08:00–17:00",
                demo: true
            }

        ];


        const nextOpenShifts = [
            ...openShifts,
            ...demoShifts.filter(
                item =>
                    !openShifts.some(
                        shift =>
                            shift.id === item.id
                    )
            )
        ];


        const nextSchedules = [
            ...schedules,
            ...demoSchedules.filter(
                item =>
                    !schedules.some(
                        schedule =>
                            schedule.id === item.id
                    )
            )
        ];


        localStorage.setItem(
            portalOpenShiftKey,
            JSON.stringify(nextOpenShifts)
        );


        localStorage.setItem(
            portalScheduleKey,
            JSON.stringify(nextSchedules)
        );


        localStorage.setItem(
            demoStaffScheduleFlag,
            "true"
        );

    } catch (error) {

        console.error(
            "Không thể thêm dữ liệu lịch làm mẫu.",
            error
        );

        toast(
            "Không thể tạo dữ liệu ca làm mẫu trên trình duyệt."
        );
    }
}


/* =========================
   RENDER PORTAL
========================= */

function renderStaffPortal() {

    const attendance =
        todayAttendance();


    const attendanceText =
        attendance
            ? `Vào ca: ${attendance.checkIn || "—"} · Kết ca: ${attendance.checkOut || "chưa kết ca"}`
            : "Bạn chưa chấm công hôm nay.";


    const attendanceTextElement =
        document.getElementById(
            "staffTodayAttendance"
        );


    if (attendanceTextElement) {
        attendanceTextElement.textContent =
            attendanceText;
    }


    const clockIn =
        document.getElementById(
            "staffClockIn"
        );


    const clockOut =
        document.getElementById(
            "staffClockOut"
        );


    if (clockIn) {
        clockIn.disabled =
            Boolean(attendance?.checkIn);
    }


    if (clockOut) {
        clockOut.disabled =
            !attendance?.checkIn ||
            Boolean(attendance?.checkOut);
    }


    const shift =
        portalRead(
            portalScheduleKey
        ).find(
            item =>
                item.employeeId === employeeProfile.id &&
                item.date === today
        );


    const todayShift =
        document.getElementById(
            "staffTodayShift"
        );


    if (todayShift) {

        todayShift.textContent =
            shift
                ? `Lịch ca hôm nay: ${shift.shift}`
                : "Chưa có ca làm được phân cho hôm nay.";
    }


    renderPortalShifts();


    const requests =
        portalRead(
            portalLeaveKey
        ).filter(
            request =>
                request.employeeId === employeeProfile.id ||
                request.email === employeeProfile.email
        );


    const labels = {

        pending:
            "Chờ quản lý duyệt",

        approved:
            "Đã duyệt",

        rejected:
            "Không được duyệt"

    };


    const leaveEmpty =
        document.getElementById(
            "staffLeaveEmpty"
        );


    const leaveRows =
        document.getElementById(
            "staffLeaveRows"
        );


    if (leaveEmpty) {
        leaveEmpty.hidden =
            requests.length > 0;
    }


    if (leaveRows) {

        leaveRows.innerHTML =
            requests
                .slice()
                .reverse()
                .map(
                    request =>
                        `<tr>
                            <td>
                                ${portalEscape(request.startDate)}
                                –
                                ${portalEscape(request.endDate)}
                            </td>

                            <td>
                                ${portalEscape(request.reason)}
                            </td>

                            <td>
                                ${portalEscape(
                            request.leaveType ||
                            (
                                request.status === "pending"
                                    ? "Chờ quản lý phân loại"
                                    : "Chưa xác định"
                            )
                        )}
                            </td>

                            <td>
                                ${labels[request.status] || labels.pending}
                            </td>
                        </tr>`
                )
                .join("");
    }


    renderPersonalProfile();
}


/* =========================
   HỒ SƠ CÁ NHÂN
========================= */

function renderPersonalProfile() {

    const form =
        document.getElementById(
            "staffPersonalProfileForm"
        );


    if (!form) return;


    [
        "name",
        "dateOfBirth",
        "gender",
        "identityNumber",
        "phone",
        "address",
        "emergencyContactName",
        "emergencyContactPhone"
    ].forEach(field => {

        if (form.elements[field]) {

            form.elements[field].value =
                employeeProfile[field] || "";

        }

    });


    if (form.elements.dateOfBirth) {

        form.elements.dateOfBirth.dispatchEvent(
            new Event(
                "change",
                {
                    bubbles: true
                }
            )
        );

    }


    if (form.elements.gender) {

        form.elements.gender.dispatchEvent(
            new Event(
                "change",
                {
                    bubbles: true
                }
            )
        );

    }


    const details = [

        [
            "Email",
            employeeProfile.email
        ],

        [
            "Khu vực",
            employeeProfile.zone
        ],

        [
            "Hình thức làm việc",
            employeeProfile.workMode === "part-time"
                ? "Part-time"
                : "Full-time"
        ],

        [
            "Đơn giá/ngày",
            Number(employeeProfile.dailyRate) > 0
                ? `${Number(
                    employeeProfile.dailyRate
                ).toLocaleString("vi-VN")}đ`
                : "Chưa cập nhật"
        ],

        [
            "Trạng thái",
            employeeProfile.active === false
                ? "Đã nghỉ"
                : "Đang làm"
        ]

    ];


    const profileName =
        document.getElementById(
            "staffProfileName"
        );


    const profileRole =
        document.getElementById(
            "staffProfileRole"
        );


    const profileDetails =
        document.getElementById(
            "staffProfileDetails"
        );


    if (profileName) {

        profileName.textContent =
            employeeProfile.name ||
            portalAccount?.name ||
            "Nhân viên";

    }


    if (profileRole) {

        profileRole.textContent =
            `${employeeProfile.role === "manager"
                ? "Quản lý"
                : "Nhân viên"} · ${employeeProfile.zone ||
            "Chưa phân khu vực"
            }`;

    }


    if (profileDetails) {

        profileDetails.innerHTML =
            details
                .map(
                    ([label, value]) =>
                        `<div>
                            <span>
                                ${portalEscape(label)}
                            </span>

                            <strong>
                                ${portalEscape(
                            value ||
                            "Chưa bổ sung"
                        )}
                            </strong>
                        </div>`
                )
                .join("");
    }
}


/* =========================
   LƯU HỒ SƠ
========================= */

const staffPersonalProfileForm =
    document.getElementById(
        "staffPersonalProfileForm"
    );


if (staffPersonalProfileForm) {

    staffPersonalProfileForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const form =
                event.currentTarget;


            const values =
                Object.fromEntries(
                    new FormData(form)
                );


            const name =
                String(
                    values.name || ""
                ).trim();


            const dateOfBirth =
                String(
                    values.dateOfBirth || ""
                );


            const identityNumber =
                String(
                    values.identityNumber || ""
                ).trim();


            const phone =
                String(
                    values.phone || ""
                ).trim();


            const emergencyContactPhone =
                String(
                    values.emergencyContactPhone || ""
                ).trim();


            const currentDate =
                new Date();


            const todayKey =
                `${currentDate.getFullYear()}-${String(
                    currentDate.getMonth() + 1
                ).padStart(2, "0")}-${String(
                    currentDate.getDate()
                ).padStart(2, "0")}`;


            if (
                !name ||
                !dateOfBirth ||
                dateOfBirth >= todayKey
            ) {

                toast(
                    "Vui lòng nhập họ tên và ngày sinh hợp lệ."
                );

                return;
            }


            if (
                !/^\d{12}$/.test(
                    identityNumber
                )
            ) {

                toast(
                    "Số CCCD phải gồm đúng 12 chữ số."
                );

                return;
            }


            if (
                !/^0\d{9}$/.test(phone) ||
                (
                    emergencyContactPhone &&
                    !/^0\d{9}$/.test(
                        emergencyContactPhone
                    )
                )
            ) {

                toast(
                    "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0."
                );

                return;
            }


            let employees;
            let existingIndex;


            try {

                employees =
                    JSON.parse(
                        localStorage.getItem(
                            "maisoneStaff"
                        ) || "[]"
                    );


                if (!Array.isArray(employees)) {

                    throw new TypeError(
                        "Danh sách nhân viên không hợp lệ."
                    );

                }


                existingIndex =
                    employees.findIndex(
                        employee =>
                            employee.id ===
                            employeeProfile.id ||
                            String(
                                employee.email || ""
                            ).toLowerCase() ===
                            String(
                                employeeProfile.email || ""
                            ).toLowerCase()
                    );

            } catch (error) {

                console.error(
                    "Không thể đọc hồ sơ nhân viên để cập nhật.",
                    error
                );


                toast(
                    "Không thể đọc hồ sơ nhân viên. Vui lòng tải lại trang."
                );

                return;
            }


            if (
                employees.some(
                    employee =>
                        employee.identityNumber ===
                        identityNumber &&
                        employee.id !==
                        employeeProfile.id
                )
            ) {

                toast(
                    "Số CCCD này đã được sử dụng cho hồ sơ nhân viên khác."
                );

                return;
            }


            const updatedProfile = {

                ...(existingIndex >= 0
                    ? employees[existingIndex]
                    : employeeProfile),

                name,

                dateOfBirth,

                gender:
                    String(
                        values.gender || ""
                    ),

                identityNumber,

                phone,

                address:
                    String(
                        values.address || ""
                    ).trim(),

                emergencyContactName:
                    String(
                        values.emergencyContactName || ""
                    ).trim(),

                emergencyContactPhone

            };


            const nextEmployees =
                employees.slice();


            if (existingIndex >= 0) {

                nextEmployees[existingIndex] =
                    updatedProfile;

            } else {

                nextEmployees.push(
                    updatedProfile
                );

            }


            const nextAccount =
                portalAccount
                    ? {
                        ...portalAccount,
                        name
                    }
                    : null;


            let nextAccounts = null;


            if (nextAccount?.email) {

                try {

                    nextAccounts =
                        JSON.parse(
                            localStorage.getItem(
                                "maisoneAccounts"
                            ) || "[]"
                        );


                    if (!Array.isArray(nextAccounts)) {

                        throw new TypeError(
                            "Danh sách tài khoản không hợp lệ."
                        );

                    }


                    const accountIndex =
                        nextAccounts.findIndex(
                            account =>
                                String(
                                    account.email || ""
                                ).toLowerCase() ===
                                String(
                                    nextAccount.email
                                ).toLowerCase()
                        );


                    if (accountIndex >= 0) {

                        nextAccounts[accountIndex] = {
                            ...nextAccounts[accountIndex],
                            name
                        };

                    } else {

                        nextAccounts.push(
                            nextAccount
                        );

                    }

                } catch (error) {

                    console.error(
                        "Không thể đọc tài khoản nhân viên để đồng bộ tên.",
                        error
                    );


                    toast(
                        "Không thể đọc dữ liệu tài khoản. Vui lòng tải lại trang."
                    );

                    return;
                }
            }


            const previousStaff =
                localStorage.getItem(
                    "maisoneStaff"
                );


            const previousAccount =
                localStorage.getItem(
                    "currentAccount"
                );


            const previousAccounts =
                localStorage.getItem(
                    "maisoneAccounts"
                );


            try {

                localStorage.setItem(
                    "maisoneStaff",
                    JSON.stringify(
                        nextEmployees
                    )
                );


                if (nextAccount) {

                    localStorage.setItem(
                        "currentAccount",
                        JSON.stringify(
                            nextAccount
                        )
                    );

                }


                if (nextAccounts) {

                    localStorage.setItem(
                        "maisoneAccounts",
                        JSON.stringify(
                            nextAccounts
                        )
                    );

                }

            } catch (error) {

                console.error(
                    "Không thể lưu thông tin cá nhân nhân viên.",
                    error
                );


                try {

                    if (
                        previousStaff === null
                    ) {

                        localStorage.removeItem(
                            "maisoneStaff"
                        );

                    } else {

                        localStorage.setItem(
                            "maisoneStaff",
                            previousStaff
                        );

                    }


                    if (
                        previousAccount === null
                    ) {

                        localStorage.removeItem(
                            "currentAccount"
                        );

                    } else {

                        localStorage.setItem(
                            "currentAccount",
                            previousAccount
                        );

                    }


                    if (
                        previousAccounts === null
                    ) {

                        localStorage.removeItem(
                            "maisoneAccounts"
                        );

                    } else {

                        localStorage.setItem(
                            "maisoneAccounts",
                            previousAccounts
                        );

                    }

                } catch (rollbackError) {

                    console.error(
                        "Không thể khôi phục hồ sơ sau khi lưu thất bại.",
                        rollbackError
                    );

                }


                toast(
                    "Không thể lưu hồ sơ cá nhân trên trình duyệt."
                );

                return;
            }


            Object.assign(
                employeeProfile,
                updatedProfile
            );


            if (nextAccount) {

                portalAccount =
                    nextAccount;

            }


            document
                .querySelectorAll(
                    "[data-admin-name]"
                )
                .forEach(
                    element => {
                        element.textContent =
                            name;
                    }
                );


            renderStaffPortal();


            toast(
                "Đã cập nhật thông tin cá nhân."
            );

        }
    );

}


/* =========================
   ESCAPE HTML
========================= */

function portalEscape(value) {

    return String(
        value ?? ""
    ).replace(
        /[&<>"']/g,
        char =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            })[char]
    );
}


/* =========================
   LỊCH / CA LÀM
========================= */

function renderPortalShifts() {

    const allShifts =
        portalRead(
            portalOpenShiftKey
        ).filter(
            slot =>
                slot.date >= today
        );


    const openShifts =
        allShifts.filter(
            slot =>
                !slot.employeeId
        );


    const myShifts =
        allShifts.filter(
            slot =>
                slot.employeeId ===
                employeeProfile.id
        );


    const assignedShifts =
        portalRead(
            portalScheduleKey
        ).filter(
            slot =>
                slot.employeeId ===
                employeeProfile.id &&
                slot.date >= today
        );


    const canBook =
        employeeProfile.active !== false &&
        employeeProfile.workMode ===
        "part-time";


    const staffShiftNav =
        document.getElementById(
            "staffShiftNav"
        );


    if (staffShiftNav) {

        const icon =
            staffShiftNav.querySelector(
                "i"
            );


        if (icon) {

            icon.className =
                canBook
                    ? "fa-solid fa-calendar-plus"
                    : "fa-solid fa-calendar-days";

        }


        if (staffShiftNav.lastChild) {

            staffShiftNav.lastChild.textContent =
                canBook
                    ? " Đăng ký ca part-time"
                    : " Lịch làm của tôi";

        }
    }


    const eyebrow =
        document.getElementById(
            "staffShiftEyebrow"
        );


    const title =
        document.getElementById(
            "staffShiftTitle"
        );


    const description =
        document.getElementById(
            "staffShiftDescription"
        );


    const registration =
        document.getElementById(
            "staffShiftRegistration"
        );


    const schedulePanel =
        document.getElementById(
            "staffSchedulePanel"
        );


    const notice =
        document.getElementById(
            "staffShiftNotice"
        );


    if (eyebrow) {

        eyebrow.textContent =
            canBook
                ? "PART-TIME SHIFTS"
                : "MY WORK SCHEDULE";

    }


    if (title) {

        title.textContent =
            canBook
                ? "Ca trống để đăng ký"
                : "Lịch làm được phân công";

    }


    if (description) {

        description.textContent =
            canBook
                ? "Chọn một ca còn trống phù hợp. Mỗi nhân viên chỉ có thể nhận một ca trong cùng ngày."
                : "Lịch làm full-time do quản lý sắp xếp; bạn không cần đăng ký ca trống.";

    }


    if (registration) {

        registration.hidden =
            !canBook;

    }


    if (schedulePanel) {

        schedulePanel.hidden =
            canBook;

    }


    if (notice) {

        notice.textContent =
            canBook
                ? `Hình thức: part-time · Khu vực: ${employeeProfile.zone ||
                "theo ca"
                }`
                : `Hình thức: full-time · Khu vực: ${employeeProfile.zone ||
                "chưa phân khu vực"
                }.`;

    }


    const openShiftEmpty =
        document.getElementById(
            "staffOpenShiftEmpty"
        );


    const openShiftCards =
        document.getElementById(
            "staffOpenShiftCards"
        );


    if (openShiftEmpty) {

        openShiftEmpty.hidden =
            openShifts.length > 0;

    }


    if (openShiftCards) {

        openShiftCards.innerHTML =
            openShifts
                .map(
                    slot =>
                        `<article class="staff-shift-card">

                            <span class="status-pill status-pending">
                                CÒN 1 CHỖ
                            </span>

                            ${slot.demo
                            ? '<span class="status-pill">CA MẪU</span>'
                            : ""
                        }

                            <h3>
                                ${portalEscape(slot.shift)}
                            </h3>

                            <p>
                                ${portalEscape(slot.date)}
                                ·
                                ${portalEscape(slot.zone)}
                            </p>

                            <button
                                class="collection-link"
                                type="button"
                                data-book-shift="${portalEscape(slot.id)}"
                                ${canBook ? "" : "disabled"}
                            >
                                NHẬN CA
                            </button>

                        </article>`
                )
                .join("");

    }


    const visibleShifts =
        canBook

            ? myShifts.map(
                slot => ({
                    ...slot,
                    status: "Đã xác nhận"
                })
            )

            : assignedShifts.map(
                slot => ({
                    ...slot,
                    zone:
                        employeeProfile.zone,
                    status:
                        "Quản lý phân công"
                })
            );


    const scheduleEmpty =
        document.getElementById(
            "staffScheduleEmpty"
        );


    const scheduleTitle =
        document.getElementById(
            "staffScheduleTitle"
        );


    const myShiftRows =
        document.getElementById(
            "staffMyShiftRows"
        );


    if (scheduleEmpty) {

        scheduleEmpty.hidden =
            visibleShifts.length > 0;

    }


    if (scheduleTitle) {

        scheduleTitle.textContent =
            canBook
                ? "Ca đã đăng ký"
                : "Lịch sắp tới";

    }


    if (myShiftRows) {

        myShiftRows.innerHTML =
            visibleShifts
                .sort(
                    (a, b) =>
                        a.date.localeCompare(
                            b.date
                        )
                )
                .map(
                    slot =>
                        `<tr>

                            <td>
                                ${portalEscape(slot.date)}
                            </td>

                            <td>
                                ${portalEscape(slot.shift)}
                                <br>
                                <small>
                                    ${portalEscape(slot.zone)}
                                    ${slot.demo
                            ? " · Mẫu"
                            : ""
                        }
                                </small>
                            </td>

                            <td>
                                <span class="status-pill status-complete">
                                    ${portalEscape(slot.status)}
                                </span>
                            </td>

                        </tr>`
                )
                .join("");

    }
}


/* =========================
   CHUYỂN TAB STAFF
========================= */

function applyStaffPortalView() {

    const requestedView =
        location.hash.slice(1);


    const activeView =
        requestedView ||
        "staffOpenShifts";


    const view =
        {
            staffProfile:
                "profile",

            staffOpenShifts:
                "shifts",

            staffAttendanceLeavePanel:
                "attendance-leave",

            staffInbox:
                "support"

        }[requestedView] ||
        "shifts";


    const viewTitles = {

        profile:
            [
                "STAFF / PROFILE",
                "Hồ sơ cá nhân"
            ],

        "attendance-leave":
            [
                "STAFF / ATTENDANCE & LEAVE",
                "Nghỉ phép / chấm công"
            ],

        shifts:
            [
                employeeProfile.workMode === "part-time"
                    ? "STAFF / PART-TIME"
                    : "STAFF / WORK SCHEDULE",

                employeeProfile.workMode === "part-time"
                    ? "Đăng ký ca làm"
                    : "Lịch làm của tôi"
            ],

        support:
            [
                "STAFF / CUSTOMER CARE",
                "Hỗ trợ khách hàng"
            ]

    };


    document
        .querySelectorAll(
            "[data-staff-panel]"
        )
        .forEach(
            panel => {

                panel.hidden =
                    panel.dataset.staffPanel !==
                    view;

            }
        );


    const breadcrumb =
        document.getElementById(
            "staffPageBreadcrumb"
        );


    const pageTitle =
        document.getElementById(
            "staffPageTitle"
        );


    if (breadcrumb) {

        breadcrumb.textContent =
            viewTitles[view][0];

    }


    if (pageTitle) {

        pageTitle.textContent =
            viewTitles[view][1];

    }


    document.body.dataset.staffView =
        view;


    document
        .querySelectorAll(
            ".admin-sidebar nav a[href^=\"#\"]"
        )
        .forEach(link => {

            const active =
                link.hash ===
                `#${activeView}`;


            link.classList.toggle(
                "active",
                active
            );


            if (active) {

                link.setAttribute(
                    "aria-current",
                    "page"
                );

            } else {

                link.removeAttribute(
                    "aria-current"
                );

            }

        });
}


/* =========================
   IN HỒ SƠ NHÂN VIÊN
========================= */

const staffProfilePrint =
    document.getElementById(
        "staffProfilePrint"
    );


if (staffProfilePrint) {

    staffProfilePrint.addEventListener(
        "click",
        () => {

            const popup =
                window.open(
                    "",
                    "_blank"
                );


            if (!popup) {

                toast(
                    "Trình duyệt đã chặn cửa sổ in. Hãy cho phép cửa sổ bật lên rồi thử lại."
                );

                return;
            }


            const rows = [

                [
                    "Họ và tên",
                    employeeProfile.name ||
                    portalAccount?.name
                ],

                [
                    "Ngày sinh",
                    employeeProfile.dateOfBirth
                ],

                [
                    "Giới tính",
                    employeeProfile.gender
                ],

                [
                    "Số CCCD",
                    employeeProfile.identityNumber
                ],

                [
                    "Điện thoại",
                    employeeProfile.phone
                ],

                [
                    "Email",
                    employeeProfile.email
                ],

                [
                    "Địa chỉ",
                    employeeProfile.address
                ],

                [
                    "Liên hệ khẩn cấp",
                    employeeProfile.emergencyContactName
                ],

                [
                    "Điện thoại khẩn cấp",
                    employeeProfile.emergencyContactPhone
                ],

                [
                    "Vai trò",
                    employeeProfile.role === "manager"
                        ? "Quản lý"
                        : "Nhân viên"
                ],

                [
                    "Khu vực",
                    employeeProfile.zone
                ],

                [
                    "Hình thức làm việc",
                    employeeProfile.workMode === "part-time"
                        ? "Part-time"
                        : "Full-time"
                ],

                [
                    "Đơn giá/ngày",
                    Number(
                        employeeProfile.dailyRate
                    ) > 0
                        ? `${Number(
                            employeeProfile.dailyRate
                        ).toLocaleString(
                            "vi-VN"
                        )}đ`
                        : "Chưa cập nhật"
                ],

                [
                    "Trạng thái",
                    employeeProfile.active === false
                        ? "Đã nghỉ"
                        : "Đang làm"
                ]

            ]
                .map(
                    ([label, value]) =>
                        `<tr>
                            <th>
                                ${portalEscape(label)}
                            </th>

                            <td>
                                ${portalEscape(
                            value ||
                            "Chưa bổ sung"
                        )}
                            </td>
                        </tr>`
                )
                .join("");


            popup.document.write(`
                <!doctype html>

                <html lang="vi">

                <head>

                    <meta charset="UTF-8">

                    <title>
                        Hồ sơ nhân viên
                    </title>

                    <style>

                        body {
                            font-family: Arial, sans-serif;
                            color: #29231f;
                            margin: 36px auto;
                            max-width: 780px;
                            padding: 0 24px;
                        }

                        h1 {
                            font-size: 24px;
                        }

                        .brand {
                            font-size: 11px;
                            letter-spacing: 3px;
                            color: #8b5b4f;
                            margin-bottom: 24px;
                        }

                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }

                        th,
                        td {
                            border: 1px solid #ded8d3;
                            padding: 11px 12px;
                            text-align: left;
                            font-size: 13px;
                        }

                        th {
                            width: 34%;
                            background: #f6f2ee;
                        }

                        @media print {

                            body {
                                margin: 0 auto;
                                padding: 0;
                            }

                        }

                    </style>

                </head>

                <body>

                    <div class="brand">
                        MAISONÉ · PEOPLE OPERATIONS
                    </div>

                    <h1>
                        Hồ sơ nhân viên
                    </h1>

                    <table>
                        ${rows}
                    </table>

                    <script>
                        window.addEventListener(
                            "load",
                            () =>
                                window.setTimeout(
                                    () => window.print(),
                                    150
                                )
                        );
                    <\/script>

                </body>

                </html>
            `);


            popup.document.close();

        }
    );

}


/* =========================
   ĐĂNG KÝ CA
========================= */

const staffOpenShiftCards =
    document.getElementById(
        "staffOpenShiftCards"
    );


if (staffOpenShiftCards) {

    staffOpenShiftCards.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-book-shift]"
                );


            if (!button) return;


            if (
                !employeeProfile.id ||
                employeeProfile.active === false ||
                employeeProfile.workMode !==
                "part-time"
            ) {

                toast(
                    "Chỉ nhân viên part-time đang làm mới có thể đăng ký ca."
                );

                return;
            }


            const slots =
                portalRead(
                    portalOpenShiftKey
                );


            const slot =
                slots.find(
                    item =>
                        item.id ===
                        button.dataset.bookShift
                );


            if (
                !slot ||
                slot.employeeId ||
                slot.date < today
            ) {

                toast(
                    "Ca này đã được nhận hoặc không còn khả dụng."
                );

                renderPortalShifts();

                return;
            }


            const alreadyBooked =
                slots.some(
                    item =>
                        item.employeeId ===
                        employeeProfile.id &&
                        item.date === slot.date
                );


            const hasAssignedShift =
                portalRead(
                    portalScheduleKey
                ).some(
                    item =>
                        item.employeeId ===
                        employeeProfile.id &&
                        item.date === slot.date
                );


            if (
                alreadyBooked ||
                hasAssignedShift
            ) {

                toast(
                    "Bạn đã có ca làm trong ngày này."
                );

                return;
            }


            const nextSlots =
                slots.map(
                    item =>
                        item.id === slot.id &&
                            !item.employeeId

                            ? {
                                ...item,

                                employeeId:
                                    employeeProfile.id,

                                employeeName:
                                    employeeProfile.name,

                                bookedAt:
                                    new Date()
                                        .toISOString()
                            }

                            : item
                );


            const updated =
                nextSlots.find(
                    item =>
                        item.id === slot.id
                );


            if (
                !updated?.employeeId ||
                updated.employeeId !==
                employeeProfile.id
            ) {

                toast(
                    "Ca vừa được nhân viên khác nhận."
                );

                renderPortalShifts();

                return;
            }


            if (
                portalWrite(
                    portalOpenShiftKey,
                    nextSlots
                )
            ) {

                renderStaffPortal();

                toast(
                    "Đã xác nhận đăng ký ca làm."
                );

            }

        }
    );

}


/* =========================
   CHẤM CÔNG
========================= */

function clock(action) {

    if (!employeeProfile.id) {

        toast(
            "Tài khoản chưa được liên kết hồ sơ nhân viên. Báo quản lý cập nhật hồ sơ."
        );

        return;
    }


    const records =
        portalRead(
            portalAttendanceKey
        );


    const record =
        records.find(
            item =>
                item.employeeId ===
                employeeProfile.id &&
                item.date === today
        );


    const time =
        new Date().toLocaleTimeString(
            "vi-VN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    if (
        action === "in" &&
        record?.checkIn
    ) {
        return;
    }


    if (
        action === "out" &&
        (
            !record?.checkIn ||
            record.checkOut
        )
    ) {
        return;
    }


    const updated =
        record

            ? {
                ...record,

                [
                    action === "in"
                        ? "checkIn"
                        : "checkOut"
                ]:
                    time,

                status:
                    record.status ||
                    "present"
            }

            : {

                employeeId:
                    employeeProfile.id,

                date:
                    today,

                status:
                    "present",

                checkIn:
                    time

            };


    const next =
        records.filter(
            item =>
                !(
                    item.employeeId ===
                    employeeProfile.id &&
                    item.date === today
                )
        );


    next.push(updated);


    if (
        portalWrite(
            portalAttendanceKey,
            next
        )
    ) {

        renderStaffPortal();


        toast(
            action === "in"
                ? "Đã ghi nhận vào ca."
                : "Đã ghi nhận kết ca."
        );

    }
}


/* =========================
   NÚT CHẤM CÔNG
========================= */

const staffClockIn =
    document.getElementById(
        "staffClockIn"
    );


const staffClockOut =
    document.getElementById(
        "staffClockOut"
    );


if (staffClockIn) {

    staffClockIn.addEventListener(
        "click",
        () => clock("in")
    );

}


if (staffClockOut) {

    staffClockOut.addEventListener(
        "click",
        () => clock("out")
    );

}


/* =========================
   XIN NGHỈ PHÉP
========================= */

const staffLeaveForm =
    document.getElementById(
        "staffLeaveForm"
    );


if (staffLeaveForm) {

    staffLeaveForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            if (
                !employeeProfile.id ||
                !employeeProfile.email
            ) {

                toast(
                    "Tài khoản chưa được liên kết hồ sơ nhân viên."
                );

                return;
            }


            const form =
                new FormData(
                    event.currentTarget
                );


            const startDate =
                String(
                    form.get("startDate")
                );


            const endDate =
                String(
                    form.get("endDate")
                );


            if (
                startDate >
                endDate
            ) {

                toast(
                    "Ngày bắt đầu phải trước hoặc trùng ngày kết thúc."
                );

                return;
            }


            const requests =
                portalRead(
                    portalLeaveKey
                );


            requests.push({

                id:
                    `LEAVE-${Date.now()}`,

                employeeId:
                    employeeProfile.id,

                email:
                    employeeProfile.email,

                employeeName:
                    employeeProfile.name ||
                    portalAccount?.name ||
                    "Nhân viên",

                employeeRole:
                    employeeProfile.role ||
                    portalAccount?.role ||
                    "staff",

                employeeZone:
                    employeeProfile.zone ||
                    portalAccount?.zone ||
                    "",

                workMode:
                    employeeProfile.workMode ||
                    portalAccount?.workMode ||
                    "",

                startDate,

                endDate,

                reason:
                    String(
                        form.get("reason")
                    ).trim(),

                status:
                    "pending",

                createdAt:
                    new Date().toISOString()

            });


            if (
                portalWrite(
                    portalLeaveKey,
                    requests
                )
            ) {

                event.currentTarget.reset();

                renderStaffPortal();

                toast(
                    "Đã gửi yêu cầu nghỉ cho quản lý."
                );

            }

        }
    );

}


/* =========================
   STORAGE
========================= */

window.addEventListener(
    "storage",
    event => {

        if (
            [
                portalAttendanceKey,
                portalLeaveKey,
                portalScheduleKey,
                portalOpenShiftKey
            ].includes(event.key)
        ) {

            renderStaffPortal();

        }

    }
);


/* =========================
   HASH / TAB
========================= */

window.addEventListener(
    "hashchange",
    applyStaffPortalView
);


/* =========================
   KHỞI CHẠY
========================= */

seedDemoStaffSchedule();

renderStaffPortal();

applyStaffPortalView();