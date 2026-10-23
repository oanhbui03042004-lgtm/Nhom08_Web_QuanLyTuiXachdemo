const staffKey = "maisoneStaff";
const attendanceKey = "maisoneAttendance";
const scheduleKey = "maisoneSchedules";
const leaveKey = "maisoneLeaveRequests";
const openShiftKey = "maisonePartTimeShifts";

const seededStaff = [
    {
        id: "staff-manager",
        name: "Qu·∫£n l√Ω Maison√©",
        email: "manager@bagstore.vn",
        role: "manager",
        zone: "V·∫≠n h√†nh",
        workMode: "full-time",
        permissions: [
            "orders",
            "tracking",
            "inventory",
            "customers",
            "vouchers",
            "staff"
        ],
        dailyRate: 600000,
        active: true
    },

    {
        id: "staff-fulltime-demo",
        name: "Nh√¢n vi√™n b√°n h√†ng full-time",
        email: "fulltime@bagstore.vn",
        role: "staff",
        zone: "B√°n h√†ng",
        workMode: "full-time",
        permissions: [
            "support",
            "tracking"
        ],
        dailyRate: 450000,
        active: true
    },

    {
        id: "staff-demo",
        name: "Nh√¢n vi√™n b√°n h√†ng",
        email: "staff@bagstore.vn",
        role: "staff",
        zone: "B√°n h√†ng",
        workMode: "part-time",
        permissions: [
            "support",
            "tracking"
        ],
        dailyRate: 400000,
        active: true
    }
];


const employeeModal =
    document.getElementById("employeeModal");

const employeeForm =
    document.getElementById("employeeForm");

const payMonth =
    document.getElementById("payrollMonth");


let activeHrRole = "admin";
let activeHrAccount = null;
let filteredStaffForExport = [];


try {

    activeHrAccount =
        JSON.parse(
            localStorage.getItem(
                "currentAccount"
            ) || "null"
        );

    activeHrRole =
        activeHrAccount?.role || "admin";

}
catch (error) {

    console.error(
        "Kh√¥ng ƒë·ªçc ƒë∆∞·ª£c vai tr√≤ ƒëƒÉng nh·∫≠p.",
        error
    );

}


if (activeHrRole !== "admin") {

    employeeForm
        .querySelector(
            'option[value="manager"]'
        )
        .disabled = true;

}


// ========================================
// ƒê·ªåC D·ªÆ LI·ªÜU NH√ÇN S·ª∞
// ========================================
function readStaffData(key, fallback = []) {

    try {

        const data =
            JSON.parse(
                localStorage.getItem(key) || "null"
            );


        return data === null
            ? fallback
            : data;

    }
    catch (error) {

        console.error(
            `Kh√¥ng th·ªÉ ƒë·ªçc ${key}.`,
            error
        );

        toast(
            "Kh√¥ng ƒë·ªçc ƒë∆∞·ª£c d·ªØ li·ªáu nh√¢n s·ª± ƒë√£ l∆∞u."
        );

        return fallback;

    }
}


// ========================================
// L∆ØU D·ªÆ LI·ªÜU NH√ÇN S·ª∞
// ========================================
function writeStaffData(key, value) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;

    }
    catch (error) {

        console.error(
            `Kh√¥ng th·ªÉ l∆∞u ${key}.`,
            error
        );

        toast(
            "Kh√¥ng th·ªÉ l∆∞u d·ªØ li·ªáu nh√¢n s·ª± tr√™n tr√¨nh duy·ªát."
        );

        return false;

    }
}


// ========================================
// ƒê·ªåC T√ÄI KHO·∫¢N NH√ÇN VI√äN
// ========================================
function readEmployeeAccounts() {

    try {

        const accounts =
            JSON.parse(
                localStorage.getItem(
                    "maisoneAccounts"
                ) || "[]"
            );


        if (!Array.isArray(accounts)) {

            throw new TypeError(
                "Danh s√°ch t√†i kho·∫£n kh√¥ng h·ª£p l·ªá"
            );

        }


        return accounts;

    }
    catch (error) {

        console.error(
            "Kh√¥ng th·ªÉ ƒë·ªçc danh s√°ch t√†i kho·∫£n nh√¢n vi√™n.",
            error
        );

        toast(
            "Danh s√°ch t√†i kho·∫£n ƒëƒÉng nh·∫≠p kh√¥ng h·ª£p l·ªá."
        );

        return null;

    }
}


// ========================================
// DANH S√ÅCH NH√ÇN VI√äN
// ========================================
function staffList() {

    const stored =
        readStaffData(
            staffKey,
            null
        );


    const defaultManagerPermissions = [
        "orders",
        "tracking",
        "inventory",
        "customers",
        "vouchers",
        "staff"
    ];


    return (
        Array.isArray(stored)
            ? stored
            : seededStaff
    ).map(employee => ({

        ...employee,

        zone:
            employee.zone ||
            (
                employee.role === "manager"
                    ? "V·∫≠n h√†nh"
                    : "B√°n h√†ng"
            ),

        workMode:
            employee.workMode ||
            (
                employee.id === "staff-demo"
                    ? "part-time"
                    : "full-time"
            ),

        permissions:
            ["staff", "manager"].includes(
                employee.role
            )

                ? [
                    ...new Set([
                        ...(
                            Array.isArray(
                                employee.permissions
                            )
                                ? employee.permissions
                                : employee.role === "manager"
                                    ? defaultManagerPermissions
                                    : ["support"]
                        ),

                        "tracking"
                    ])
                ]

                : Array.isArray(
                    employee.permissions
                )
                    ? employee.permissions
                    : employee.role === "manager"
                        ? defaultManagerPermissions
                        : ["support"],

        active:
            employee.active !== false

    }));

}


// ========================================
// ESCAPE TEXT
// ========================================
function staffEscape(value) {

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


// ========================================
// L·∫§Y T√äN NH√ÇN VI√äN
// ========================================
function employeeName(
    id,
    employees = staffList()
) {

    return (
        employees.find(
            employee =>
                employee.id === id
        )?.name
        || "Nh√¢n vi√™n"
    );

}


// ========================================
// T√çNH TU·ªîI
// ========================================
function employeeAge(dateOfBirth) {

    if (!dateOfBirth) return null;


    const birthDate =
        new Date(
            `${dateOfBirth}T00:00:00`
        );


    if (
        Number.isNaN(
            birthDate.getTime()
        )
    ) {
        return null;
    }


    const now = new Date();


    let age =
        now.getFullYear()
        -
        birthDate.getFullYear();


    if (
        now.getMonth() <
        birthDate.getMonth()
        ||
        (
            now.getMonth() ===
            birthDate.getMonth()
            &&
            now.getDate() <
            birthDate.getDate()
        )
    ) {

        age--;

    }


    return age >= 0
        ? age
        : null;

}


// ========================================
// HI·ªÇN TH·ªä NG√ÄY SINH
// ========================================
function employeeBirthDateLabel(
    dateOfBirth
) {

    if (!dateOfBirth) {

        return "Ch∆∞a b·ªï sung";

    }


    const birthDate =
        new Date(
            `${dateOfBirth}T00:00:00`
        );


    return Number.isNaN(
        birthDate.getTime()
    )

        ? "Ng√†y sinh kh√¥ng h·ª£p l·ªá"

        : birthDate.toLocaleDateString(
            "vi-VN",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );

}


// ========================================
// IN H·ªí S∆† NH√ÇN VI√äN
// ========================================
function printEmployeeProfile(employee) {

    const popup =
        window.open(
            "",
            "_blank"
        );


    if (!popup) {

        toast(
            "Tr√¨nh duy·ªát ƒë√£ ch·∫∑n c·ª≠a s·ªï in. H√£y cho ph√©p c·ª≠a s·ªï b·∫≠t l√™n r·ªìi th·ª≠ l·∫°i."
        );

        return;

    }


    const age =
        employeeAge(
            employee.dateOfBirth
        );


    const details = [

        [
            "H·ªç v√† t√™n",
            employee.name
        ],

        [
            "Ng√†y sinh",
            employeeBirthDateLabel(
                employee.dateOfBirth
            )
            +
            (
                age !== null
                    ? ` (${age} tu·ªïi)`
                    : ""
            )
        ],

        [
            "Gi·ªõi t√≠nh",
            employee.gender
        ],

        [
            "S·ªë CCCD",
            employee.identityNumber
        ],

        [
            "S·ªë ƒëi·ªán tho·∫°i",
            employee.phone
        ],

        [
            "Email ƒëƒÉng nh·∫≠p",
            employee.email
        ],

        [
            "ƒê·ªãa ch·ªâ",
            employee.address
        ],

        [
            "Ng∆∞·ªùi li√™n h·ªá kh·∫©n c·∫•p",
            employee.emergencyContactName
        ],

        [
            "ƒêi·ªán tho·∫°i kh·∫©n c·∫•p",
            employee.emergencyContactPhone
        ],

        [
            "Vai tr√≤",
            employee.role === "manager"
                ? "Qu·∫£n l√Ω"
                : "Nh√¢n vi√™n"
        ],

        [
            "Khu v·ª±c",
            employee.zone
        ],

        [
            "H√¨nh th·ª©c l√†m vi·ªác",
            employee.workMode === "part-time"
                ? "Part-time"
                : "Full-time"
        ],

        [
            "ƒê∆°n gi√°/ng√†y",
            `${Number(
                employee.dailyRate || 0
            ).toLocaleString("vi-VN")}ƒë`
        ],

        [
            "Tr·∫°ng th√°i",
            employee.active
                ? "ƒêang l√†m"
                : "ƒê√£ ngh·ªâ"
        ]

    ];


    const rows =
        details
            .map(
                ([label, value]) =>
                    `<tr>
                        <th>${staffEscape(label)}</th>
                        <td>${staffEscape(
                        value || "Ch∆∞a b·ªï sung"
                    )}</td>
                    </tr>`
            )
            .join("");


    popup.document.write(`

        <!doctype html>

        <html lang="vi">

        <head>

            <meta charset="UTF-8">

            <meta
                name="viewport"
                content="width=device-width,initial-scale=1"
            >

            <title>
                H·ªì s∆° nh√¢n vi√™n -
                ${staffEscape(employee.name)}
            </title>

            <style>

                body{
                    font-family:Arial,sans-serif;
                    color:#29231f;
                    margin:36px auto;
                    max-width:780px;
                    padding:0 24px
                }

                h1{
                    font-size:24px;
                    margin:0 0 5px
                }

                .brand{
                    font-size:11px;
                    letter-spacing:3px;
                    color:#8b5b4f;
                    margin-bottom:24px
                }

                .meta{
                    font-size:12px;
                    color:#766b63;
                    margin:0 0 18px
                }

                table{
                    width:100%;
                    border-collapse:collapse
                }

                th,
                td{
                    border:1px solid #ded8d3;
                    padding:11px 12px;
                    text-align:left;
                    font-size:13px;
                    vertical-align:top
                }

                th{
                    width:34%;
                    background:#f6f2ee;
                    font-weight:600
                }

                .print-tip{
                    margin-top:18px;
                    font-size:11px;
                    color:#857a72
                }

                @media print{

                    body{
                        margin:0 auto;
                        padding:0
                    }

                    .print-tip{
                        display:none
                    }

                }

            </style>

        </head>

        <body>

            <div class="brand">
                MAISON√â ¬∑ PEOPLE OPERATIONS
            </div>

            <h1>
                H·ªì s∆° nh√¢n vi√™n
            </h1>

            <p class="meta">
                M√£ h·ªì s∆°:
                ${staffEscape(employee.id)}
                ¬∑ Ng√†y xu·∫•t:
                ${new Date().toLocaleDateString("vi-VN")}
            </p>

            <table>
                ${rows}
            </table>

            <p class="print-tip">
                Ch·ªçn In / Save as PDF trong h·ªôp tho·∫°i in ƒë·ªÉ l∆∞u h·ªì s∆°.
            </p>

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


// ========================================
// XU·∫§T EXCEL / CSV
// ========================================
function exportStaffExcel(
    employees = filteredStaffForExport
) {

    const headers = [

        "M√£ h·ªì s∆°",
        "H·ªç v√† t√™n",
        "Ng√†y sinh",
        "Tu·ªïi",
        "Gi·ªõi t√≠nh",
        "CCCD",
        "ƒêi·ªán tho·∫°i",
        "Email",
        "ƒê·ªãa ch·ªâ",
        "Ng∆∞·ªùi li√™n h·ªá kh·∫©n c·∫•p",
        "ƒêi·ªán tho·∫°i kh·∫©n c·∫•p",
        "Vai tr√≤",
        "Khu v·ª±c",
        "H√¨nh th·ª©c l√†m vi·ªác",
        "ƒê∆°n gi√°/ng√†y",
        "Tr·∫°ng th√°i"

    ];


    const csvCell = value => {

        const raw =
            String(value ?? "");


        const safe =
            /^[\t\r =+\-@]/.test(raw)
                ? `'${raw}`
                : raw;


        return `"${safe.replaceAll(
            '"',
            '""'
        )}"`;

    };


    const rows =
        employees
            .map(
                employee => [

                    employee.id,

                    employee.name,

                    employeeBirthDateLabel(
                        employee.dateOfBirth
                    ),

                    employeeAge(
                        employee.dateOfBirth
                    ) ?? "",

                    employee.gender,

                    employee.identityNumber,

                    employee.phone,

                    employee.email,

                    employee.address,

                    employee.emergencyContactName,

                    employee.emergencyContactPhone,

                    employee.role === "manager"
                        ? "Qu·∫£n l√Ω"
                        : "Nh√¢n vi√™n",

                    employee.zone,

                    employee.workMode === "part-time"
                        ? "Part-time"
                        : "Full-time",

                    employee.dailyRate,

                    employee.active
                        ? "ƒêang l√†m"
                        : "ƒê√£ ngh·ªâ"

                ]
                    .map(csvCell)
                    .join(",")
            );


    const csv =
        `\uFEFF${[
            headers
                .map(csvCell)
                .join(","),

            ...rows

        ].join("\r\n")
        }`;


    const url =
        URL.createObjectURL(
            new Blob(
                [csv],
                {
                    type:
                        "text/csv;charset=utf-8"
                }
            )
        );


    const download =
        document.createElement("a");


    download.href = url;


    const fileLabel =
        employees.length === 1
            ? employees[0].id
            : "danh-sach";


    download.download =
        `maisone-ho-so-nhan-vien-${fileLabel}-${new Date().toISOString().slice(0, 10)}.csv`;


    document.body.append(download);

    download.click();

    download.remove();


    window.setTimeout(
        () =>
            URL.revokeObjectURL(url),
        1000
    );


    toast(
        `ƒê√£ xu·∫•t ${employees.length} h·ªì s∆°. T·ªáp CSV UTF-8 c√≥ th·ªÉ m·ªü tr·ª±c ti·∫øp b·∫±ng Excel.`
    );

}


// ========================================
// KI·ªÇM TRA TR√ôNG CA
// ========================================
function shiftsOverlap(
    first,
    second
) {

    const parseShift =
        value => {

            const times =
                String(value).match(
                    /(\d{2}):(\d{2})\s*[‚Äì-]\s*(\d{2}):(\d{2})/
                );


            return times

                ? [
                    Number(times[1]) * 60
                    +
                    Number(times[2]),

                    Number(times[3]) * 60
                    +
                    Number(times[4])
                ]

                : null;

        };


    const firstRange =
        parseShift(first);


    const secondRange =
        parseShift(second);


    return firstRange &&
        secondRange

        ? firstRange[0] <
        secondRange[1]
        &&
        secondRange[0] <
        firstRange[1]

        : first === second;

}


// ========================================
// ƒê·ªî OPTIONS NH√ÇN VI√äN
// ========================================
function fillEmployeeOptions(
    employees
) {

    document
        .querySelectorAll(
            ".employee-options"
        )
        .forEach(select => {

            select.innerHTML =
                employees

                    .filter(
                        employee =>
                            employee.active
                    )

                    .map(
                        employee =>
                            `<option value="${staffEscape(employee.id)}">
                                ${staffEscape(employee.name)}
                            </option>`
                    )

                    .join("");

        });


    document
        .querySelectorAll(
            ".fulltime-employee-options"
        )
        .forEach(select => {

            const fullTime =
                employees.filter(
                    employee =>
                        employee.active
                        &&
                        employee.workMode !==
                        "part-time"
                );


            select.innerHTML =
                fullTime

                    .map(
                        employee =>
                            `<option value="${staffEscape(employee.id)}">
                                ${staffEscape(employee.name)}
                            </option>`
                    )

                    .join("");


            select.disabled =
                fullTime.length === 0;

        });

}


// ========================================
// HI·ªÇN TH·ªä NH√ÇN S·ª∞
// ========================================
function renderStaff() {

    const employees =
        staffList();


    fillEmployeeOptions(
        employees
    );


    const query =
        document
            .getElementById("staffSearch")
            .value
            .trim()
            .toLocaleLowerCase("vi");


    const filteredEmployees =
        employees.filter(
            employee => [

                employee.name,
                employee.email,
                employee.phone,
                employee.identityNumber,
                employee.zone,
                employee.role,
                employee.workMode,
                employee.address

            ].some(
                value =>
                    String(value || "")
                        .toLocaleLowerCase("vi")
                        .includes(query)
            )
        );


    filteredStaffForExport =
        filteredEmployees;


    document
        .getElementById(
            "staffSearchResult"
        )
        .textContent = query

            ? `T√¨m th·∫•y ${filteredEmployees.length} / ${employees.length} h·ªì s∆°`

            : `${employees.length} h·ªì s∆° nh√¢n vi√™n`;


    document
        .getElementById("staffRows")
        .innerHTML =
        filteredEmployees

            .map(
                employee => {

                    const age =
                        employeeAge(
                            employee.dateOfBirth
                        );


                    const missingProfile =
                        !employee.dateOfBirth
                        ||
                        !employee.gender
                        ||
                        !employee.identityNumber
                        ||
                        !employee.phone
                        ||
                        !employee.address;


                    const role =
                        employee.role === "manager"
                            ? "Qu·∫£n l√Ω"
                            : "Nh√¢n vi√™n";


                    return `

                            <article
                                class="staff-profile-card"
                            >

                                <div
                                    class="staff-profile-card-head"
                                >

                                    <div
                                        class="staff-profile-identity"
                                    >

                                        <span
                                            class="staff-profile-icon"
                                        >
                                            <i
                                                class="fa-solid fa-user"
                                            ></i>
                                        </span>

                                        <div>

                                            <h3>
                                                ${staffEscape(
                        employee.name
                    )}
                                            </h3>

                                            <p>
                                                ${staffEscape(role)}
                                                ¬∑
                                                ${staffEscape(
                        employee.zone ||
                        "Ch∆∞a ph√¢n khu v·ª±c"
                    )}
                                            </p>

                                        </div>

                                    </div>


                                    <span
                                        class="status-pill ${employee.active
                            ? "status-complete"
                            : "status-cancelled"
                        }"
                                    >
                                        ${employee.active
                            ? "ƒêang l√†m"
                            : "ƒê√£ ngh·ªâ"
                        }
                                    </span>

                                </div>


                                ${missingProfile

                            ? `

                                            <p
                                                class="staff-profile-incomplete"
                                            >

                                                <i
                                                    class="fa-solid fa-circle-exclamation"
                                                ></i>

                                                H·ªì s∆° c√≤n thi·∫øu th√¥ng tin c√° nh√¢n

                                            </p>

                                        `

                            : ""
              %  Pr†42i®.†p* 0¶!i 4((0!	$    ! †©a( †`@Îådÿv*Ä'‡•b Út†%9 D (Ä ,q" †D° ∏∏µm`j`Ä©MIRc= ˚∂gDgk0ÚocpÏ´·Dß~AIË60-
$ †¥ &)-I"`" ‡ $· ! )) !$e, ""6 BO+†‡∫,4¢†0®:$° áÄ)%  a
a(‡¿*" ‡210i>pi‚?Ã	oã!00 (†·Ib 0	 ( ˘!e ∞ @êa`!c∞ #£†$H$†| –#fDK∞,0 h*!(†  p,"$$ -B@ ™" ê8êh†b(y >`'§%\√∞Ω"SËnhB;dlı≤8åiX`l1 ± ®ey D2$ê` ‡(*! …&))  & %  h‡** |Øwyy>ä~80 `†˘qd94$0®!T0 †n‡cË¢0j10≤3‚ p `±,úpí3Rk:écÂ s• $TÜ6$!"a$ †!x¯$=$.D#†§2 "` |#&$5 ê`°,ÚZ4`bD>uoÏrg(%@g¶∞ip d.p†4æh7ÅP£¢(4 0$!4iiqicyÆU¿·z–‰av'%ge@hè ∫@Ñ¢ "d‡0$`Å	` %0®h a!¨†:1£®† )[$Øh°En‡ıGfO-btx+ †%C†d ÄÄ#‡∂ 1"1$2$080¥(†iM» (`!∑±i π"pq8¥0 ±1b)	z60!"q:®Dà( 00p¢P$l," (&8qz °$µ( Í1`Å04Û“=e$π=ndº\†0'!B(H`)& !4! !	0 
Â †`aj hï 5yzg5Ù†tÒ Ø5igîìP†  d$p$X $p$®0!$,†"‚ (!!;Ç$(`¨B" ff%0B`‚! ¢  f"i8}
`!@0)#°&(!†b ! f!!®‡$0:(¥‡0,c†
  æ)suNLÍ-<çw0h%`Ò 02 220*2P†`p! hñp É<"&9'L©vû_ Kjg†°x
$ ‰8$) "dRÄ ,∞R `&i · !& 1<&m˙åä ∞aj!(©! †"∆-i"P B@."#†, v49 !)(a,¢  <ô4Qhƒ…n§≤ < n4c0†‡`'©p  ±$Ä ¢ 4P†!p&"°,"B,$¢8 a˚ªﬂ¿™cÀ¶kI	 Ä%d `†b0†`q¥B $( 8å*" ‡60°(3†b$Hm	2h-qta§>ãçHâ 0‡"(¢!`&(a$: ®∂04!(¢!@&(· #§",0"2$(0$a4roc:Åb 2¿4( !#¢$ $®‡ !+°††BH&`A † d®‚0(p`HÊ$%-ctad‘Hp·ce-JQ" &`520PA (¥‡(¨)b1*8≤l0 ‚n*lkŸÖezqeÎ¥$"˚æ≤:(0®0Äinp† <
v(¡!eh@(b@BjC(ñπsê"a„á%wqn◊	E
A( !+†`¨c˙*$†§¥ †(1( ! "˝òl "@`$Ë`®  /¢#¿F$Â""b @$‡∞"* xï4 v3∏ 5ØswµoFus öH("!(e0 `∏h4H0 1°( 	0Ç  `ad"0 >dy?F)%*	 ‡xp(`&`Ä$$  pÉ∞" 0 Q  ¨r.(kºtÈ¶.+-Ó1"h,0b∞z1¢4 $1*! Ç$ @(A )¢`§0,!"8†,UR@Ê~,  ",‰b &`!0p∞∏¢  $h®0 b!04∞·`± )1(†8$dh0Ñ`]…Ú1`AWGdK0! °*! ®§adj  ¢ d02`Ú‡@¥ )	9 %$ `"Ps>sÔæçûò0·0´™ †™¿„Î0©, ™  ı
 »Ê†5p¯∞d ¥  Ö–ÙcÙ÷m\/ *)8¿-gÇqb` ,ÍJ0®™  •
 `¨5r(r$Ì™  !;‚$∞ © <vvT†"Erk`pWf	&8°Dd†Ë †c‡Ó(´!@¢¸¶ %0A((ÒIy.n{Qt¶‰u~æjÒ~ÒÌÊt.*zdú& !1 £¢ "(“  6§ad† ∫ Â †@‚aH¿‡% b√¶ê&u"0°2!() ,!"- rd $ $¶d≥††0Ωã»8 Ta %5(à‡!sÄ® §#‡æ Æ"	¿ ≠¢d00† `‚$`93ÖrŒB'æe
çä∞à ïb dc®$0  Î ∞£Í((†` cπ
0∞‡®≤(a(è$hf<T¢çÜ $b` "b†
(††,!	i (" e) Ír ‡`$∞††∞ æi6^A++§òÅ`, " ®!A&!%#†Ê(∞ ‰i`(‡1i(± "(–! r2x1|·.>¨`*.h´ êp êd ,¢
(‡`15	0`!1 1#®* pÆ)b§. +¥‹ôdπùÜf(ïP\·í£ib"0$!02 ≤@ä`®‡ +§¿†¢† 	!0$°  ®®à !3ÑÜË©vsp@Ôú%äDÙ†∏ &zE$§"  cß°!p†É‡$&$°4  ±J ®§ 4%(ÛprOmfà !&`$  Ùdπ02$``∞" d"@ @t·h°=`∂l©*)0%@‡h !36~)ûÏU{psÁ∫Ä)k¨ "  |%ÜU0ÄB-2i d &`1smrhm¡Âo+#¯/me8llE: ™a@ë$ ê∞†°pÄ°eD  "*``4»† '†G∏Üc`jI˚Ö(˘uv#,∞µaht( (7†lÅ ∏3Ù` 4ÂÄ!ioa2` h: †1 !! ∞4(®(!!$ $µ,Óp°4Ò(∏=wJYJ≈%|Ì>**& Â,fb3Üb!#≤2( 8,a¢2"  &z!$†0>Óx≥ùN
M†K® "h$±(£† %0bb ¢
"0§040@∞`p`†`&w≈a~.`B6")
! ¢,¢b"L
B »4(`  #£§"!)"  #†  ˛Î_Ò«˛-|‚ E @A*"p‡ê$¢`$ ¥<0°#‚h %""`410!8 Ñ±h«‰#pl0ﬁ…GÇmsjJh¿∫©∞Öö©`  `@#ç +Ñ2‡¢$ a$0$!0§ä ®Ä"Æ")à †(Ä <Ø√`mnVGJ D†‚1bbj  ± ≥§   $v °0- "`` £°agå	R(p¸∑oHw˘˘42 åÅb$ †`0)20 †0!†y e„Ä0¢H!, Ç""4`î"†˚sˆafES£gB5(ä`"D¥@0* ¯§™$ º†, +°p¢ ($‡@%m·	o9±m/ h·i}`$8*t †  0a*p ¢i!"!08
|}ù¨ÖD ‡∞†  pËÇ $Ë‘$  Ö†ùdD± 2(‡j2p†b&,%" d>w$äÔXo%§œ©( p†‡	d!¥00(@ *" ¨2.2s∞b å`¢5@,oÊãv="*  †>Ç7bd!1∞(0h p"b*$ ®"‡$ †#Ê`-¢ufit6H"
*a ≈" @`àëh! `∏†$( ±@ " Ä'&a`01 2 (!$w+|bèN © à#¿` ∆d° "rRtB`,e"l 2‚ 0`Ë‡ $ `àÄ!`!%?êÁ»∑hÄth·≥1')'0,¬∞Üá.e.>o√Ä·! L¢"< $"! t `)g†0Ä"(j 0""1 (! t$80$rxLÁ`dÌ>*
5  l)"8B,@"+≤ Ä$†x $rÅ -"D$`" †Â$(`†8StˆI˛G^L
∞!H†®1h0 0h®–0 a& °" § $¶(°8($ 08h-"b$ @$†*m|Ï|lOjmCÆ^Sy	œio 5ø<
1±0)
( ∏1da 20‡qr ∏l$"†`Ühô+phqÙimE+
()a 1"A j% »§:$à®¢ * †ö'‘´`†ÀÒd©yi≈"4.H#° 0!24 (∞!k§® !D≈$ $`d? Çˆwxn-UjlÁ"Ô0<à  !% Â *. É≤  1") 
s Ê@• †pb00a r(`"	!  ® !&
! î§ †fI!"p"`fH«áoXùN#‰¢0 (@`j#ÄË°  †l≠†4"x§% ‚z!¢6$q(! ,†"0b{ŒQkÁ 6˙I™ &`) 05) ‡!! 1! "" P8a$& £Æ/˝hœmÎÛ,≤e…l˙Stma ]x∆p-b2 P
`Ä†™!@6 °#©"!% †‡Ä%ÆTnHgqÏaSt∫ÈN5(	ä†è‚#Ï`2$ä  Åk†¿¢" f 1   ®aa4Ê¯/UL Nc•00Q"@®*?†ß¬!b0 (  hê≤$  0§‡ "F a †aB0† Ä"%^`’ü@®Eh*a †Åh! -$*(®ê0#∞ 1 †)`p)8‚t,@%&<otHßjGpπ ,8ä$†¥0 1`P Bh$#à!%4Ä`†)e( h"pjzÏk~.mÉï `b@ @+∞ à†!@‡"‰‚0.(# r#¢24*0 È!`(0pdKv †` !2#¢ BP& a&0• ú`¶& ) †"$∞h p "1.(#†2/ÿcur<¶7Ùa|d]p¢iG)Â-mlfb#Rzã!x*$(Ï!b&0! ‡ 4¶	A1( ∞"(¢x$=(&`!-$2d.B!b(q #∂h 0a3¨(8 $•0∞* ††! (°!`*y § §%d>rx!n<K*$ 8 $∞†$2 ∞†0 hƒ $ ¿ †e@ l B0‡‡B1 ):`,É≤,DÇ‡óNAhë©ŸØJ l¸Í$ %!`‰®$!  †o…3‡21h†0(‚Up I%$,t2/QZ!døÃñ-	 1  $≤`†PÄ†§$†¢b60 !!  ß¢``l2*1 ´ÅD% ≤\Ûgbœn#∏!á"$``%1 p®∏41® ‡)††±dâ (*p4¿†$1 ®§ 0 ê‰ê"  0$˚p∞Q√eMì√Qpe
,`2 hA0'∞ h( !$• Ä@   (6! 2#Âuj)h·%u'alEbfQq¸~/°B"(!B t0 !"&`y0§*0Æj†ﬁêÂ¢n¡+ù"Ku+&`ü †`Åî 0 ¢B  $`5 †d°¨§2?=˝
´à,®
 8Ë8≤*"(H(*" ‡7‡)ta(µ((È)a	0(0†h>oCt»mwÀ-j∞©r  .*c´&(10(‡ ,|¢2†1`r	 !<0®!c≤+BiÚZJ
	 "$f!!0†≥„Ë,(" 2'®`:i§©¿(®aa$™0¢
<Ùæ]"``§5(`;Å"" 0a(M ba 2 #†‡$`® (D4$à†vpÌ¶]^`†Ñ%`êF A *$ –h ±"1"(†0‡¢!@""@"`‡!`c0(±(	
hœò^$ÒΩßdM<‡∫çÎ®q†˛sº∫,j*(†Ë(!  %$ºh&	à †8§-D¢D$((h8q,""&6-s¸yn?äM
h& Â(∞@(-(bi02P8"% * `Ä¢–"!4$†$#∞å ™8‡Ùf¸nÂ~X, $% §J Ä∏(¨0
` ®lÄ†3‚h(`! Ú (2, @ d™ (Ç ÛaqU÷Ü≈Sc#tm <Z!! 7£©b!!0c®0 a #°$$$†$!dÕÌMagæ5MecßÛ˚Ko|vuq6LmEo`\æ-K%! a(°(& u `©;¯,§†xÄ4) #K8œµI(@°ùá®qttC™ââaÅ®$$T† ÎÇ+‡ •#‡@,%"(sö!")$` &H©  1;® †`∞3† ""u`h%!0˘ • §d¨Ä" #c≈=q,cafGß%dorŒN„˚RΩ(iS0@(n
-Ímr	 !> &™!H‡!`†≥‰ (†H2``0* ÙÄh£√˜&%c/6#enEÎ1˝u.hÀ1díÄ 0`"  ` ( † å(*` Ç$†8"f5Di[¸o¸ie'•˜DolœBxceNT•ÂT‰Lß.h4Ò8#¨x FjÅ ö0Ò  )Ñ` 0b! )q9;0
1$  ‡10)`
4∞†A *t`†a¬+$#†  a, †)d!(48 ,c†   >J⁄!`†6$° ! )#∞") ®   z`$ˆ$! %i2() a!! dﬁ/È82mNGéçH_Çy-$*p`4'®!a .%*¥‡†2!($  !$! ! à§)h-`·v>=*œ ° †¢5| Ê!m%`bj `Ñ†00±$h Hf =-div|5^	
ôa `#∂b!1!0*" x1% ∏j. :©,†*$`0®J!(ÍytM § †¢$ ,$*$(Äò0#∞#8 $!  $‡4£®(! qzå{2pÊzΩ`˛D|l-3Á4iKk2	
@®âh+† ∞®   x9å5b(`Q†06s°84>9MØ(:!¶Ö0 A"(*  § ∞%q0b¶  §") `#º`u`U/f-∞(0hLA" 8"4`( 1 ®)Ë` xÄÑ(§p 2,b &$È3, Î39¢e…%¢tE"“‚ "%  @0"( 	 Ë$p  †§§020!*( †8Å≠ebd~yYÌ}∫UudTﬂo‚Ìwx∞l!&0u †j%0‰s∞:8dH2 j †‚)`p08BH©   •t}‰˜7Âiqliue9EUh‰'${Û>9fÌÚgjUaÄÂmq>|˘eq{f(IPâ 4  +£† Lp""`d !`e¥‘p ·%l sÄ"(§`$¥|â• (` `8(!h0ptb0%! ,*ÄÄ(Üq! !4a Å‚ ¢-i0¢"   a"0$ †Ç ")" (†¨™(0®pë § ¶ 1&0)" "2 SocysuŒal}TÓa‡¢~umıbL
‡ oêGë%`∞v"A2(‡0 a 2 0(à@ m!g∞%@hL¯j#hæ1L
 †ep¯aa$4p ††LÖ"(xpy$Ñ0$(‰$0`(p b","!s õ≠P%DH∂(Õ$»e´ÊÜo-`0(`@h È 
! ††ê%sÏ`" ƒ† ìÄ¢!`s†Z;&Ût0Nzò>çJ4Ë 0)† ¢p!R !%'§M@h(†!`" &A%$ p∞º™e|¥nàö 0% 8ıå!b†%k¨d¢,*0†@ *p@Å($11(¢  )0Y eala≤u?bEq/BÒÓ2öp"  @TdÄ†.‚!¶D0 (0†ed0‡ "jb\Ä#≠""d*  Ä£s˘p(ˇa`7WÚEn"âãÿ %0Db ™" §p8∏$$0 ¢`Ä "†!0x¢\	"2h@ &q$$ˇe¸¸oyOgeıtm⁄R%b$˙p•AFgECÊkt ®}m}joxÂΩ/O`iQØ‚" `!&©,4" "+∞©$8 $ `•$ x$, "  ≈:≠J" hh‡@( ¿¢"  1%0 jdpê#‡ "LÄ"  %$``4d (	 <mÌ⁄0$™d Ñ´‡(¶ !(Ï0j00™#‡ê$! †   $Ω$`°(†∞0 p;,e∑”5"f[_dı¨©@∫x4‹n&;Ö$‚  v!915#†b!3±)I°(Å1Y	 <(î1a) 03• "^ä+XøVúId% §!t& !-4¢(¥ @ Å"((!"!&`(r(*($Ë ( Hh#´bÜ/Ÿ"PVt)Ö•  I6i!	!9&%! d
4 ††±pA°†41°!`  ˇ =ı/ËgÙ4>k.ô
¢,(`h"q "" b?(/3° 4†®&1!0™(®†0! ‚h§ubUxt}o•+‡ (e!0b0p@`(d    †° •7‚i`A1†02(¢ 8Re @vBmg˚=dH5`–ÔcAÇ&0!! ! ¢.‡È1!*% †h∞ir  +†`àf `†Û∏3F,+2 tˆ[$≠~°x
=0Ê`!($`†®$â(pà †,  '¢q`:!$¢ 60!!ek0ijAh¯9o9µdèÂXsÁztb$9#z`d«Eqo're*$p/Áıt-ki$+u ¶‡Ä0òH§   ‡§&®&*0@°"8∏4( Å$¶ ° 8>:íb"dH`   d`0"`jP C‡*"¢h 	<a59 `!#Ü!0aè
 ‰al∑≤!pc†T> %)@‡ † j8(¥ap5  f)!	7)(H! f0¡+h·≥sM#m]wwmh  fÈ/‡kÌ%ª‡8'dl
4*(!5  d1`pc∞Ü°(°  	$8$ï  ·Bp #Äh§ ~<
k<MJ≠J  . °.rÅ‚$ ‡§08 ∞ P¨"p‹!"&¥`†``"0" $ ()XUÎ£¥÷ Â|SGMO "(p0%2 †D†‡Äl®!§ 4 h°`a¢†3  )@!°0?/·uƒPÓjæ-#fÑ `*"‡ä*¬§!`$5Y§ ∂,Å  §p 2d(–* ,`"<¶`l4K'ç
 ¢&†(<!'° 	@A"·, %"¢† %à"$$ 1 ‡† 2<1 Chw∏w#Ïm{Ñ–d ! 0 à`4 !(∞!*†( (r0"p§`,p!	§ (0`#!  #B%f|Tv9#‚ΩEtOoä)°u7†pi`d((¥)¨ §`e%ˆ 0 )"0("p #†¶% †Í#tc-lçt,+∏t q+Á Ïgø %xSTcFfM3
u∞Â,eiTtkyÂeæ˘ )ºlb  , j` (Ä(s `)a d † b‚!-"0 ®b @yh2˛#-√(4bXÍ `‰Ä2"‡$  !Ëd` †£ 1(e "† $((!$≠y@m~|EÂçscti˛E-É@(· §¢ ! 0(!®‰ 5,h†  
">`b∆Hı©ò!K¢3Å+K(‡" $ ©*0*∞,∞ 0ap: 4†Ä•R`y$3J√äB
lH U®∞—j·å†)  )© "'ºq"†‡3 b¥h` i]Méäp L!#‡P8! (E  # ±q !†Å$≤8 p`Bd 0."S<te|>ÕLlJp( ±m±8b,!°†¢5dad2b¢`*$8§±`/‰m>>ãKÑ ( 4Ü µl¶%†1*yD¡ ,0b r"!'Izt8I,Â$%Oâ2!(a  †"!"* P "™b!Ñ$`† ‡¢;â¨\
a  @ †h #∏$=:,,´1† "@&"p™-: H:e%,0I †((no#*'√;il"8
)J†µ"fdm!<}°nD
≤ahC®"0,#aFÖÏe|dN˛FiÍe:M¥!`°! 	j$4†¶q5lVeqW:J(!ã1r*!(É0#à %*p1èË}$t.H=- °41¢!8&i=perS2FT\x+Yd‘ßåe˛66i!9-] )öBé1qöd.bı+SÓ§*`5#,1}° FÂ4eyqnEFt[[Ù®äK¥ à∏ f,0§y`uffœaÒıT4c„L* Ç"*( ∏é`t≤  ,0&.i@} m.`M,@  0§r'I/5eZÂMDÌpå?}-«Sno#NbP**.Aµ+
Y* ne ëÚP de“UahÁÆ‰Mu≥hh($∏.<†§GOp>KmÂK,
% "+;ß
Ω0"i2end@rJ`MoSji¥Ù1 πKÒ)`∞" ·0!Ì@®OAAm¯
" $ô3
L÷ÿp ¥Tln÷g0—ÙT}¬|°nCe-	*  72 Db m/h~jyae3a 8xÄÄ8å*ñ ! hpek¥a∏F≈!to“‰0wgYv)"%!4´† °@ÂtD.øMG„p†¥!Jâ¢‹
%A@p,j`$¶`·¯.I¨,
B8b!(2†`emjxd≈3ê 00©
™
mJHÕHmH')3?ª;	8Ω}=?ø}ù=m=}%8=}?]/'=.==ª?˝_æ'≠®/§«Ï—I‡ÍN&gMEW L¯Î¿®WÒto _„áâEIÜM’OJ?&/ùw›8ˇ==%=ΩΩ=y=y4,+4ù=∑=1øº/8˘›}}GÔCÙeo≠*–U`dıëpcgnEemmnvh}VÆ"!;]cå: ·co5sÙ"wagw†8Å	p$	%"0¸/ocV≈oÀkS,@8?,°B'2ahAdW$f X0 ‚ %M@àa`° 2ScI$d7˙m*çJ$Å$!-*  82zmvcmg>LÂ°yM%  7˘s£7L|nv≠" Ö, Ú"`.s5$Fxî.<gc7Oa¶	Mã1L$d!0"∞bh æ[f≠tdLK2i~—g3I"'#§ (∞0#08ãH8 d 0 ÊFpa‚h8WcvoaN	ù.hkmJ
  ,Ä2$$4‡  `k5k6y+</fi$e g©ãÇ0&) ®®0`( #>Ù‡ªıQµhÌ˙`aV$1dƒìxRf(ewÈP1ã"Ë °j©  âq(†2dwy?ä%*%0π¸§† ≈9πl!≤ ¶‰d~CwMezu%^d%†Ñ@¶.u$pÊeuLEn$`ı»d≠®çB&"| ¢a¡$(Ú”s`nÊS-ynK+§aı#vu%+¢%®¨$@$E®-H ,†`—b £§÷Ex|«n"V!od!=Õêqc∫  Å0Ä„`$snè_m#bsbn|Á’lm"MBM"0`pΩ$≤$ 9±%‡Au›YNE4%pD:U[P (§◊G
Â‡’GbH*	G!®$2<∞¨H≥)*0**"PMOP|≈M@UBF\Õ'q"	*¡œE!iREK “I3á*Œ$'D bÂoaw#s&dù6x
êp"0°.G£ÙDe{¶n\“}kp»OJ$0∞àn ! (ÂAbs|@f∆p(mivWkaÏÏ"	O k"3å‡(*I£≤1p0Ä( *Ùey0jo~◊7t(}	 $  ®8pW{gw§âΩq0ÛAhwDq$m"J¢ –&†`r†$ ®ª¢2l·˚äw`¿(á†≈†èÉ†¨"# (& ®4†≥`ﬂ‚ | S·;ì;	í}ä
*D‚$Hlq}mu>|?π0q  Ì-jj{’˜viSwl%cdO.a~Ãå!$1†($ 0#|(¶%.¡≈ÈipS·¿¶;ApzÌ˝fd[,SÂˇ,=3aÓdØd]}Œnhu‡|^5
0$ !T4Ä"-† @ ‚d$&frz]EÊ`$¢_6Gx9*-"$"$4'0©a `Ô.˚t !˜‰a∂E - !#+∏#À#(∞ " h´ÈÍD1#¢êÂ: „ °a@'†B
†$;dE0{¸¢*zc,cƒtnf"ï ·2""8†h?p'b! p29é``0!#"(Äx0î` (1-ecÍ (&96$ 0%≤tblhhmI:d(rÈB>endsó[@¯( aM§#Dπf:p( b?f$h!) ∏ #uchî∆ı,!#ä<à‚  †b!∏28HÆ ç
$Jç
∞q(U`)0 %dIÔG6yH-!CDÀud.°JGuÕπì í£,†`¨ (p+æu«TQvc. „x"h$"( $+ (DÅ@+8˘µuHà!fh0djπ®2à:Ç	U“0`%q	>`¢,€b$p`∏MÜÂ$(,¢¢  'Ñ ,$°©`†Ô=ÔÎ/qu—AsÙvlcye∞Jp(0 d‡° † XF"E d®L1z) =·}ÚÚ5ov#Iâ#ò(  $d 0(u0 At(Äu5Gm"ô†¶†q!Ç,ë$(1!∞∏çB
p
 £¶`° ÙAb 5.j• Ò8"%$ ‡"`‰†sO"y A¶ ,p†(n$b(8,],oj@%L˘r5≈‰4≤-Bu|E≠L 2 Ç	`q`$¢ !$!! (e†#GxÕA-bQÔÛh~t∞+ç *# ‘``–5†9 i8 4+:K]J8j$† *p ®îPàé(a*†Ä∞L¢#g!r]õ=
Æ®2""s|}b&|ndd¸,Ó ΩÇP°Ä≤/!riDw%9%Bz·LEÀ˝l$"Y@Ä(ê` $rÈ"!$≠('…Àã'I l¢¿c(ß†O¡A[œL¡Ñ:Ö"!` 9!,@£°v1#ó(¡¶Œ gP¯±`⁄˜Li`SP¡F«Å":&m}$J.m/ }>´iX˘m<9-)%∂&5==≠o=ô99!1=z<Ω-≥_m:*d¿@ ´¢&TH	°˛ï¡G-V·˚íO≈ ø‡!%7Ò5;∑=7)µy≠|=?0ΩòL<9I),99==å+95E6u$idYgnHR%ûÏ~W:`oÀ@ËFqf)ç  2rfLrDœ }Wt}8su#„Ll2P†)æi<{é,±  k˚Lq<ív*•t6`|,
!!,-""!B!!e	o·sÊL·4`(/N+≥x&"a,t¯ÄÌÒÌ{aÓˆ€Â˝TéÅ∞¨$  .k∏Öä
+©¿Ö1B@dÂnˇ†rﬁe˜≤H@0*"†Ä&e-Î`m·Hp/ÊuD+mŒao5kI.u §‡x! bD! +¯Õb“P$¿$Í‰ÁÂæ-ö†! r   πòàáJ Ç (k¬ÿøÚGˆqy3“5VuqJùä©(`Eq/±>ÕfÎ˝pMt"x;e&@bà aw⁄)‰DRé†!$b¥∞ cH ,gdbeeh—bÄÇ°!Ù† !>sMV,	
*° °¢‰B"m H`Ä¿®`8Q≠ p+†>U‡Å Îπc— `$Ë$) Ä '°!h0ocÆ`04d}h˚1/sÏHft},,
T¥ $ %(#`Ç ! #°Ic¢h f(	,lwAijÂ[/m®3PA-¬°` ) Â$(‡®$∞`Äƒp§†b  a#∂"!%"†"¬n7È6g|nÍb§sy¡nT;1z ph &"!p(6† 1 ¶f "† )m
îAQÅ Ä@d)"* $%@0,2 (8/ma0%IÅ !#∞% ‡†<Ç∫1Û¸igâ<?8}-
Ä_‰(#¸4$h@ëÄ†bpP $%-oŒs¸™5M‡\vÎÎÂ|≠M%º!j4»–††Ä.(#ò $   ††¥Ñ}§YLfi%
o7úÏƒ,¢(0 q†#8™†!‰ 0$‡`¢H†       item =>
                                item.id ===
                                slot.employeeId
                        );


                    return `

                        <tr>

                            <td>
                                ${staffEscape(
                        slot.date
                    )}
                            </td>


                            <td>

                                ${staffEscape(
                        slot.shift
                    )}

                                ${slot.demo
                            ? ' <span class="status-pill">M·∫™U</span>'
                            : ""
                        }

                                <br>

                                <small>
                                    ${staffEscape(
                            slot.zone
                        )}
                                </small>

                            </td>


                            <td>

                                <span
                                    class="status-pill ${employee
                            ? "status-complete"
                            : "status-pending"
                        }"
                                >

                                    ${employee
                            ? "ƒê√£ k√≠n"
                            : "C√≤n ch·ªó"
                        }

                                </span>

                            </td>


                            <td>
                                ${employee
                            ? staffEscape(
                                employee.name
                            )
                            : "Ch∆∞a c√≥"
                        }
                            </td>


                            <td>

                                ${employee

                            ? "‚Äî"

                            : `
                                            <button
                                                class="ui-btn danger"
                                                type="button"
                                                data-open-shift-delete="${staffEscape(slot.id)}"
                                            >
                                                G·ª† CA
                                            </button>
                                        `
                        }

                            </td>

                        </tr>

                    `;

                }
            )
            .join("");


    document
        .getElementById(
            "openShiftEmpty"
        )
        .hidden =
        shifts.length > 0;

}


// ========================================
// HI·ªÇN TH·ªä L·ªäCH L√ÄM
// ========================================
function renderSchedules(
    employees
) {

    const schedules =
        readStaffData(
            scheduleKey
        );


    document
        .getElementById(
            "scheduleRows"
        )
        .innerHTML =

        schedules
            .slice()
            .sort(
                (a, b) =>
                    a.date.localeCompare(
                        b.date
                    )
            )
            .map(
                schedule =>
                    `

                            <tr>

                                <td>
                                    ${staffEscape(
                        schedule.date
                    )}
                                </td>

                                <td>
                                    ${staffEscape(
                        employeeName(
                            schedule.employeeId,
                            employees
                        )
                    )}
                                </td>

                                <td>

                                    ${staffEscape(
                        schedule.shift
                    )}

                                    ${schedule.demo
                        ? ' <span class="status-pill">M·∫™U</span>'
                        : ""
                    }

                                </td>

                                <td>

                                    <button
                                        class="ui-btn danger"
                                        type="button"
                                        data-schedule-delete="${staffEscape(schedule.id)}"
                                    >
                                        X√ìA
                                    </button>

                                </td>

                            </tr>

                        `
            )
            .join("");

}


// ========================================
// HI·ªÇN TH·ªä CH·∫§M C√îNG
// ========================================
function renderAttendance(
    employees
) {

    const attendance =
        readStaffData(
            attendanceKey
        );


    const labels = {

        present: "C√≥ m·∫∑t",

        late: "ƒêi tr·ªÖ",

        absent: "V·∫Øng kh√¥ng ph√©p",

        leave: "Ngh·ªâ ph√©p"

    };


    document
        .getElementById(
            "attendanceRows"
        )
        .innerHTML =

        attendance
            .slice()
            .sort(
                (a, b) =>
                    b.date.localeCompare(
                        a.date
                    )
            )
            .slice(0, 20)
            .map(
                record =>
                    `

                            <tr>

                                <td>
                                    ${staffEscape(
                        record.date
                    )}
                                </td>

                                <td>
                                    ${staffEscape(
                        employeeName(
                            record.employeeId,
                            employees
                        )
                    )}
                                </td>

                                <td>
                                    ${labels[
                    record.status
                    ]
                    ||
                    "Ch∆∞a x√°c ƒë·ªãnh"
                    }
                                </td>

                            </tr>

                        `
            )
            .join("");

}


// ========================================
// HI·ªÇN TH·ªä ƒê∆†N NGH·ªà
// ========================================
function renderLeaveRequests(
    employees
) {

    const requests =
        readStaffData(
            leaveKey
        );


    document
        .getElementById(
            "leaveEmpty"
        )
        .hidden =
        requests.length > 0;


    document
        .getElementById(
            "leaveRows"
        )
        .innerHTML =

        requests
            .slice()
            .reverse()
            .map(
                request => {

                    const actions =
                        request.status ===
                            "pending"

                            ? `

                                    <button
                                        class="ui-btn"
                                        type="button"
                                        data-leave-status="approved"
                                        data-leave-type="Ngh·ªâ ph√©p c√≥ l∆∞∆°ng"
                                        data-leave-id="${staffEscape(request.id)}"
                                    >
                                        DUY·ªÜT C√ì L∆Ø∆†NG
                                    </button>

                                    <button
                                        class="ui-btn"
                                        type="button"
                                        data-leave-status="approved"
                                        data-leave-type="Ngh·ªâ kh√¥ng l∆∞∆°ng"
                                        data-leave-id="${staffEscape(request.id)}"
                                    >
                                        DUY·ªÜT KH√îNG L∆Ø∆†NG
                                    </button>

                                    <button
                                        class="ui-btn danger"
                                        type="button"
                                        data-leave-status="rejected"
                                        data-leave-id="${staffEscape(request.id)}"
                                    >
                                        T·ª™ CH·ªêI
                                    </button>

                                `

                            : "‚Äî";


                    const status = {

                        pending:
                            "Ch·ªù duy·ªát",

                        approved:
                            "ƒê√£ duy·ªát",

                        rejected:
                            "T·ª´ ch·ªëi"

                    }[
                        request.status
                    ]
                        ||
                        "Ch·ªù duy·ªát";


                    const employee =
                        employees.find(
                            item =>
                                item.id ===
                                request.employeeId
                        );


                    const name =
                        employee?.name
                        ||
                        request.employeeName
                        ||
                        "Nh√¢n vi√™n";


                    const employeeDetails = [

                        request.email,

                        employee?.role === "manager"
                            ||
                            request.employeeRole === "manager"
                            ? "Qu·∫£n l√Ω"
                            : "Nh√¢n vi√™n",

                        employee?.workMode
                        ||
                        request.workMode,

                        employee?.zone
                        ||
                        request.employeeZone,

                        employee?.dateOfBirth
                        ||
                        request.dateOfBirth,

                        employee?.gender
                        ||
                        request.gender,

                        employee?.identityNumber
                        ||
                        request.identityNumber,

                        employee?.phone
                        ||
                        request.phone,

                        employee?.address
                        ||
                        request.address

                    ]

                        .filter(Boolean)

                        .map(
                            staffEscape
                        )

                        .join(" ¬∑ ");


                    return `

                            <tr>

                                <td>

                                    <strong>
                                        ${staffEscape(
                        name
                    )}
                                    </strong>

                                    <br>

                                    <small>
                                        ${employeeDetails}
                                    </small>

                                </td>


                                <td>

                                    ${staffEscape(
                        request.startDate
                    )}

                                    ‚Äì

                                    ${staffEscape(
                        request.endDate
                    )}

                                </td>


                                <td>
                                    ${staffEscape(
                        request.reason
                    )}
                                </td>


                                <td>

                                    ${staffEscape(
                        request.leaveType
                        ||
                        (
                            request.status ===
                                "pending"
                                ? "Ch·ªù quy·∫øt ƒë·ªãnh"
                                : "Ch∆∞a x√°c ƒë·ªãnh"
                        )
                    )}

                                </td>


                                <td>
                                    ${status}
                                </td>


                                <td>

                                    <div
                                        class="admin-row-actions"
                                    >

                                        ${actions}

                                    </div>

                                </td>

                            </tr>

                        `;

                }
            )
            .join("");

}


// ========================================
// T√çNH L∆Ø∆†NG
// ========================================
function renderPayroll(
    employees
) {

    const month =
        payMonth.value;


    const attendance =
        readStaffData(
            attendanceKey
        );


    const requests =
        readStaffData(
            leaveKey
        );


    const datePrefix =
        month
        ||
        new Date()
            .toISOString()
            .slice(0, 7);


    document
        .getElementById(
            "payrollRows"
        )
        .innerHTML =

        employees

            .filter(
                employee =>
                    employee.active
                    ||
                    attendance.some(
                        record =>
                            record.employeeId ===
                            employee.id
                    )
            )

            .map(
                employee => {

                    const records =
                        attendance.filter(
                            record =>
                                record.employeeId ===
                                employee.id
                                &&
                                record.date.startsWith(
                                    datePrefix
                                )
                        );


                    const workDays =
                        records.filter(
                            record =>
                                [
                                    "present",
                                    "late"
                                ].includes(
                                    record.status
                                )
                        ).length;


                    const paidLeaveDays =
                        requests

                            .filter(
                                request =>
                                    request.employeeId ===
                                    employee.id
                                    &&
                                    request.status ===
                                    "approved"
                                    &&
                                    request.leaveType ===
                                    "Ngh·ªâ ph√©p c√≥ l∆∞∆°ng"
                            )

                            .reduce(
                                (
                                    total,
                                    request
                                ) =>
                                    total
                                    +
                                    dateCount(
                                        request.startDate,
                                        request.endDate,
                                        datePrefix
                                    ),
                                0
                            );


                    const dailyRate =
                        Number(
                            employee.dailyRate ||
                            0
                        );


                    return `

                            <tr>

                                <td>
                                    ${staffEscape(
                        employee.name
                    )}
                                </td>

                                <td>
                                    ${workDays}
                                </td>

                                <td>
                                    ${paidLeaveDays}
                                </td>

                                <td>
                                    ${dailyRate.toLocaleString(
                        "vi-VN"
                    )}ƒë
                                </td>

                                <td>

                                    <strong>
                                        ${(
                            (
                                workDays
                                +
                                paidLeaveDays
                            )
                            *
                            dailyRate
                        ).toLocaleString(
                            "vi-VN"
                        )
                        }ƒë
                                    </strong>

                                </td>

                            </tr>

                        `;

                }
            )

            .join("");

}


// ========================================
// ƒê·∫æM NG√ÄY NGH·ªà
// ========================================
function dateCount(
    start,
    end,
    month
) {

    if (!start || !end) return 0;


    const monthStart =
        new Date(
            `${month}-01T00:00:00`
        );


    const monthEnd =
        new Date(
            monthStart.getFullYear(),
            monthStart.getMonth() + 1,
            0
        );


    const overlapStart =
        new Date(
            Math.max(
                new Date(
                    `${start}T00:00:00`
                ).getTime(),

                monthStart.getTime()
            )
        );


    const overlapEnd =
        new Date(
            Math.min(
                new Date(
                    `${end}T00:00:00`
                ).getTime(),

                monthEnd.getTime()
            )
        );


    return overlapEnd < overlapStart

        ? 0

        : Math.floor(
            (
                overlapEnd -
                overlapStart
            )
            /
            86400000
        ) + 1;

}


// ========================================
// M·ªû FORM NH√ÇN VI√äN
// ========================================
function openEmployeeForm(
    employee = null
) {

    if (
        activeHrRole !== "admin"
        &&
        employee?.role === "manager"
    ) {

        toast(
            "Ch·ªâ qu·∫£n tr·ªã vi√™n m·ªõi c√≥ th·ªÉ thay ƒë·ªïi h·ªì s∆° qu·∫£n l√Ω."
        );

        return;

    }


    employeeForm.reset();


    employeeForm.elements.id.value =
        employee?.id || "";


    employeeForm.elements.name.value =
        employee?.name || "";


    employeeForm.elements.dateOfBirth.value =
        employee?.dateOfBirth || "";


    window.MaisoneDatePicker.refresh(
        employeeForm.elements.dateOfBirth
    );


    employeeForm.elements.gender.value =
        employee?.gender || "";


    employeeForm.elements.identityNumber.value =
        employee?.identityNumber || "";


    employeeForm.elements.phone.value =
        employee?.phone || "";


    employeeForm.elements.address.value =
        employee?.address || "";


    employeeForm.elements.emergencyContactName.value =
        employee?.emergencyContactName || "";


    employeeForm.elements.emergencyContactPhone.value =
        employee?.emergencyContactPhone || "";


    employeeForm.elements.email.value =
        employee?.email || "";


    employeeForm.elements.role.value =
        employee?.role || "staff";


    employeeForm.elements.zone.value =
        employee?.zone || "B√°n h√†ng";


    employeeForm.elements.workMode.value =
        employee?.workMode || "full-time";


    employeeForm.elements.zone.disabled =
        activeHrRole !== "admin";


    employeeForm.elements.workMode.disabled =
        activeHrRole !== "admin";


    employeeForm.elements.dailyRate.value =
        employee?.dailyRate ?? 400000;


    employeeForm.elements.active.value =
        String(
            employee?.active ?? true
        );


    const roleForForm =
        employeeForm.elements.role.value;


    const defaultPermissions =
        roleForForm === "manager"

            ? [
                "orders",
                "tracking",
                "inventory",
                "customers",
                "vouchers",
                "staff"
            ]

            : roleForForm === "staff"

                ? [
                    "support",
                    "tracking"
                ]

                : [];


    employeeForm
        .querySelectorAll(
            '[name="permissions"]'
        )
        .forEach(input => {

            input.checked =

                (
                    employee?.permissions
                    ||
                    defaultPermissions
                ).includes(
                    input.value
                )

                ||

                (
                    input.value === "tracking"
                    &&
                    [
                        "staff",
                        "manager"
                    ].includes(
                        roleForForm
                    )
                );


            input.disabled =

                activeHrRole !== "admin"
                ||

                (
                    input.value === "tracking"
                    &&
                    [
                        "staff",
                        "manager"
                    ].includes(
                        roleForForm
                    )
                );

        });


    employeeForm.elements.password.required =
        !employee;


    employeeForm.elements.password.placeholder =
        employee

            ? "ƒê·ªÉ tr·ªëng n·∫øu kh√¥ng ƒë·ªïi"

            : "B·∫Øt bu·ªôc khi th√™m m·ªõi";


    document
        .getElementById(
            "employeeFormTitle"
        )
        .textContent =
        employee
            ? "Ch·ªânh s·ª≠a h·ªì s∆° nh√¢n vi√™n"
            : "Th√™m nh√¢n vi√™n";


    employeeModal.hidden =
        false;


    employeeForm.elements.name.focus();

}


// ========================================
// M·ªû FORM TH√äM NH√ÇN VI√äN
// ========================================
document
    .getElementById(
        "openEmployeeForm"
    )
    .addEventListener(
        "click",
        () =>
            openEmployeeForm()
    );


// ========================================
// ƒê√ìNG MODAL
// ========================================
employeeModal.addEventListener(
    "click",
    event => {

        if (
            event.target.closest(
                "[data-close-employee]"
            )
        ) {

            employeeModal.hidden =
                true;

        }

    }
);


// ========================================
// ESC ƒê√ìNG MODAL
// ========================================
document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
            &&
            !employeeModal.hidden
        ) {

            employeeModal.hidden =
                true;

        }

    }
);


// ========================================
// L∆ØU NH√ÇN VI√äN
// ========================================
employeeForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const form =
            new FormData(
                employeeForm
            );


        const id =
            String(
                form.get("id") || ""
            );


        const email =
            String(
                form.get("email")
            )
                .trim()
                .toLowerCase();


        const password =
            String(
                form.get("password") || ""
            );


        const employees =
            staffList();


        const existing =
            employees.find(
                employee =>
                    employee.id === id
            );


        const role =
            String(
                form.get("role")
            );


        const dateOfBirth =
            String(
                form.get("dateOfBirth")
            );


        const identityNumber =
            String(
                form.get("identityNumber")
            )
                .trim();


        const phone =
            String(
                form.get("phone")
            )
                .trim();


        const emergencyContactPhone =
            String(
                form.get(
                    "emergencyContactPhone"
                )
            )
                .trim();


        const birthDate =
            new Date(
                `${dateOfBirth}T00:00:00`
            );


        const today =
            new Date();


        today.setHours(
            0,
            0,
            0,
            0
        );


        if (
            Number.isNaN(
                birthDate.getTime()
            )
            ||
            birthDate >= today
        ) {

            toast(
                "Ng√†y sinh kh√¥ng h·ª£p l·ªá."
            );

            return;

        }


        if (
            !/^\d{12}$/.test(
                identityNumber
            )
        ) {

            toast(
                "S·ªë CCCD ph·∫£i g·ªìm ƒë√∫ng 12 ch·ªØ s·ªë."
            );

            return;

        }


        if (
            !/^0\d{9}$/.test(phone)
            ||
            (
                emergencyContactPhone
                &&
                !/^0\d{9}$/.test(
                    emergencyContactPhone
                )
            )
        ) {

            toast(
                "S·ªë ƒëi·ªán tho·∫°i ph·∫£i g·ªìm 10 ch·ªØ s·ªë v√† b·∫Øt ƒë·∫ßu b·∫±ng s·ªë 0."
            );

            return;

        }


        if (
            employees.some(
                employee =>
                    employee.identityNumber ===
                    identityNumber
                    &&
                    employee.id !== id
            )
        ) {

            toast(
                "S·ªë CCCD n√†y ƒë√£ ƒë∆∞·ª£c s·ª≠ d·ª•ng cho h·ªì s∆° nh√¢n vi√™n kh√°c."
            );

            return;

        }


        if (
            activeHrRole !== "admin"
            &&
            (
                role === "manager"
                ||
                existing?.role === "manager"
            )
        ) {

            toast(
                "Qu·∫£n l√Ω kh√¥ng th·ªÉ c·∫•p ho·∫∑c s·ª≠a quy·ªÅn qu·∫£n l√Ω."
            );

            return;

        }


        if (
            activeHrRole !== "admin"
            &&
            !existing
        ) {

            toast(
                "Ch·ªâ qu·∫£n tr·ªã vi√™n m·ªõi c√≥ th·ªÉ th√™m h·ªì s∆° v√† c·∫•p quy·ªÅn nh√¢n vi√™n."
            );

            return;

        }


        if (
            employees.some(
                employee =>
                    employee.email.toLowerCase() ===
                    email
                    &&
                    employee.id !== id
            )
        ) {

            toast(
                "Email n√†y ƒë√£ ƒë∆∞·ª£c g√°n cho nh√¢n vi√™n kh√°c."
            );

            return;

        }


        if (
            !existing
            &&
            staffList().some(
                employee =>
                    employee.email.toLowerCase() ===
                    email
            )
            &&
            !demoAccounts.some(
                account =>
                    account.email === email
            )
        ) {

            toast(
                "Email nh√¢n vi√™n ƒë√£ t·ªìn t·∫°i."
            );

            return;

        }


        const registeredAccounts =
            readEmployeeAccounts();


        if (!registeredAccounts) return;


        const accountExisting =
            [
                ...demoAccounts,
                ...registeredAccounts
            ].find(
                account =>
                    account.email.toLowerCase() ===
                    email
            );


        if (
            !existing
            &&
            accountExisting
        ) {

            toast(
                "Email n√†y ƒë√£ c√≥ t√†i kho·∫£n ƒëƒÉng nh·∫≠p."
            );

            return;

        }


        const employee = {

            ...(existing || {}),

            id:
                id ||
                `employee-${Date.now()}`,

            name:
                String(
                    form.get("name")
                ).trim(),

            dateOfBirth,

            gender:
                String(
                    form.get("gender")
                ),

            identityNumber,

            phone,

            address:
                String(
                    form.get("address")
                ).trim(),

            emergencyContactName:
                String(
                    form.get(
                        "emergencyContactName"
                    )
                ).trim(),

            emergencyContactPhone,

            email,

            role,

            zone:
                String(
                    form.get("zone")
                    ||
                    existing?.zone
                    ||
                    "B√°n h√†ng"
                ),

            workMode:
                String(
                    form.get("workMode")
                    ||
                    existing?.workMode
                    ||
                    "full-time"
                ),

            permissions:
                activeHrRole === "admin"

                    ? form
                        .getAll(
                            "permissions"
                        )
                        .map(String)

                    : existing?.permissions
                    || [],

            dailyRate:
                Number(
                    form.get("dailyRate")
                ),

            active:
                form.get("active") ===
                "true"

        };


        if (
            !Number.isFinite(
                employee.dailyRate
            )
            ||
            employee.dailyRate < 0
        ) {

            toast(
                "ƒê∆°n gi√° ng√†y c√¥ng kh√¥ng h·ª£p l·ªá."
            );

            return;

        }


        const nextEmployees =
            existing

                ? employees.map(
                    item =>
                        item.id === existing.id
                            ? employee
                            : item
                )

                : [
                    ...employees,
                    employee
                ];


        const nextAccounts =
            registeredAccounts.slice();


        const previousEmail =
            existing?.email?.toLowerCase();


        const previousAccountIndex =
            nextAccounts.findIndex(
                account =>
                    account.email.toLowerCase() ===
                    previousEmail
            );


        if (
            previousAccountIndex >= 0
            &&
            previousEmail !== email
        ) {

            nextAccounts.splice(
                previousAccountIndex,
                1
            );

        }


        const accountIndex =
            nextAccounts.findIndex(
                account =>
                    account.email.toLowerCase() ===
                    email
            );


        const accountRecord = {

            name:
                employee.name,

            email,

            role:
                employee.role,

            active:
                employee.active,

            employeeId:
                employee.id,

            zone:
                employee.zone,

            workMode:
                employee.workMode,

            permissions:
                employee.permissions

        };


        if (password) {

            accountRecord.password =
                password;

        }
        else if (
            accountIndex >= 0
        ) {

            accountRecord.password =
                nextAccounts[
                    accountIndex
                ].password;

        }
        else if (
            accountExisting
        ) {

            accountRecord.password =
                accountExisting.password;

        }


        if (
            accountIndex >= 0
        ) {

            nextAccounts[
                accountIndex
            ] = {

                ...nextAccounts[
                accountIndex
                ],

                ...accountRecord

            };

        }
        else if (
            accountRecord.password
        ) {

            nextAccounts.push(
                accountRecord
            );

        }


        const previousStaffData =
            localStorage.getItem(
                staffKey
            );


        if (
            !writeStaffData(
                staffKey,
                nextEmployees
            )
        ) {

            return;

        }


        if (
            !writeStaffData(
                "maisoneAccounts",
                nextAccounts
            )
        ) {

            try {

                if (
                    previousStaffData ===
                    null
                ) {

                    localStorage.removeItem(
                        staffKey
                    );

                }
                else {

                    localStorage.setItem(
                        staffKey,
                        previousStaffData
                    );

                }

            }
            catch (
            rollbackError
            ) {

                console.error(
                    "Kh√¥ng th·ªÉ kh√¥i ph·ª•c danh s√°ch nh√¢n vi√™n sau khi l∆∞u t√†i kho·∫£n th·∫•t b·∫°i.",
                    rollbackError
                );

            }

            return;

        }


        employeeModal.hidden =
            true;


        renderStaff();


        toast(
            existing
                ? "ƒê√£ c·∫≠p nh·∫≠t h·ªì s∆° nh√¢n vi√™n."
                : "ƒê√£ th√™m nh√¢n vi√™n v√† t√†i kho·∫£n ƒëƒÉng nh·∫≠p."
        );

    }
);


// ========================================
// C√ÅC N√öT TRONG DANH S√ÅCH NH√ÇN VI√äN
// ========================================
document
    .getElementById(
        "staffRows"
    )
    .addEventListener(
        "click",
        event => {

            const exportButton =
                event.target.closest(
                    "[data-employee-export]"
                );


            if (exportButton) {

                const employee =
                    staffList().find(
                        item =>
                            item.id ===
                            exportButton
                                .dataset
                                .employeeExport
                    );


                if (employee) {

                    exportStaffExcel(
                        [employee]
                    );

                }


                return;

            }


            const printButton =
                event.target.closest(
                    "[data-employee-print]"
                );


            if (printButton) {

                const employee =
                    staffList().find(
                        item =>
                            item.id ===
                            printButton
                                .dataset
                                .employeePrint
                    );


                if (employee) {

                    printEmployeeProfile(
                        employee
                    );

                }


                return;

            }


            const editButton =
                event.target.closest(
                    "[data-employee-edit]"
                );


            if (editButton) {

                const employee =
                    staffList().find(
                        item =>
                            item.id ===
                            editButton
                                .dataset
                                .employeeEdit
                    );


                if (employee) {

                    openEmployeeForm(
                        employee
                    );

                }


                return;

            }


            const toggleButton =
                event.target.closest(
                    "[data-employee-toggle]"
                );


            if (!toggleButton) return;


            const employees =
                staffList();


            if (
                activeHrRole !== "admin"
                &&
                employees.find(
                    employee =>
                        employee.id ===
                        toggleButton
                            .dataset
                            .employeeToggle
                )?.role === "manager"
            ) {

                toast(
                    "Ch·ªâ qu·∫£n tr·ªã vi√™n m·ªõi c√≥ th·ªÉ thay ƒë·ªïi tr·∫°ng th√°i c·ªßa qu·∫£n l√Ω."
                );

                return;

            }


            const changedEmployee =
                employees.find(
                    employee =>
                        employee.id ===
                        toggleButton
                            .dataset
                            .employeeToggle
                );


            if (!changedEmployee) return;


            const updated =
                employees.map(
                    employee =>
                        employee.id ===
                            toggleButton
                                .dataset
                                .employeeToggle

                            ? {
                                ...employee,
                                active:
                                    !employee.active
                            }

                            : employee
                );


            const accounts =
                readEmployeeAccounts();


            if (!accounts) return;


            const accountIndex =
                accounts.findIndex(
                    account =>
                        account.email?.toLowerCase() ===
                        changedEmployee.email.toLowerCase()
                );


            const demoAccount =
                demoAccounts.find(
                    account =>
                        account.email.toLowerCase() ===
                        changedEmployee.email.toLowerCase()
                );


            if (
                accountIndex >= 0
            ) {

                accounts[
                    accountIndex
                ] = {

                    ...accounts[
                    accountIndex
                    ],

                    active:
                        !changedEmployee.active

                };

            }
            else if (
                demoAccount
            ) {

                accounts.push({

                    ...demoAccount,

                    active:
                        !changedEmployee.active,

                    employeeId:
                        changedEmployee.id

                });

            }


            const priorStaff =
                localStorage.getItem(
                    staffKey
                );


            const priorAccounts =
                localStorage.getItem(
                    "maisoneAccounts"
                );


            if (
                !writeStaffData(
                    staffKey,
                    updated
                )
            ) {

                return;

            }


            if (
                !writeStaffData(
                    "maisoneAccounts",
                    accounts
                )
            ) {

                try {

                    if (
                        priorStaff === null
                    ) {

                        localStorage.removeItem(
                            staffKey
                        );

                    }
                    else {

                        localStorage.setItem(
                            staffKey,
                            priorStaff
                        );

                    }


                    if (
                        priorAccounts === null
                    ) {

                        localStorage.removeItem(
                            "maisoneAccounts"
                        );

                    }
                    else {

                        localStorage.setItem(
                            "maisoneAccounts",
                            priorAccounts
                        );

                    }

                }
                catch (
                rollbackError
                ) {

                    console.error(
                        "Kh√¥ng th·ªÉ kh√¥i ph·ª•c d·ªØ li·ªáu t√†i kho·∫£n sau khi c·∫≠p nh·∫≠t tr·∫°ng th√°i nh√¢n vi√™n th·∫•t b·∫°i.",
                        rollbackError
                    );

                }

                return;

            }


            renderStaff();

        }
    );


// ========================================
// T√åM KI·∫æM NH√ÇN VI√äN
// ========================================
document
    .getElementById(
        "staffSearch"
    )
    .addEventListener(
        "input",
        renderStaff
    );


// ========================================
// XU·∫§T TO√ÄN B·ªò NH√ÇN VI√äN
// ========================================
document
    .getElementById(
        "exportStaff"
    )
    .addEventListener(
        "click",
        exportStaffExcel
    );


// ========================================
// ƒê·ªîI TAB
// ========================================
window.addEventListener(
    "hashchange",
    applyStaffAdminView
);


// ========================================
// FORM L·ªäCH L√ÄM
// ========================================
document
    .getElementById(
        "scheduleForm"
    )
    .addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const form =
                new FormData(
                    event.currentTarget
                );


            const assignedEmployee =
                staffList().find(
                    employee =>
                        employee.id ===
                        String(
                            form.get(
                                "employeeId"
                            )
                        )
                );


            if (
                !assignedEmployee
                ||
                !assignedEmployee.active
                ||
                assignedEmployee.workMode ===
                "part-time"
            ) {

                toast(
                    "Ch·ªâ nh√¢n vi√™n full-time ƒëang l√†m m·ªõi nh·∫≠n l·ªãch ph√¢n c√¥ng."
                );

                return;

            }


            const assignedDate =
                String(
                    form.get("date")
                );


            const assignedShift =
                String(
                    form.get("shift")
                );


            const openShiftBooked =
                readStaffData(
                    openShiftKey
                ).some(
                    slot =>
                        slot.employeeId ===
                        assignedEmployee.id
                        &&
                        slot.date ===
                        assignedDate
                        &&
                        shiftsOverlap(
                            slot.shift,
                            assignedShift
                        )
                );


            if (openShiftBooked) {

                toast(
                    "Nh√¢n vi√™n n√†y ƒë√£ nh·∫≠n m·ªôt ca tr√πng gi·ªù trong ng√†y."
                );

                return;

            }


            const schedules =
                readStaffData(
                    scheduleKey
                );


            if (
                schedules.some(
                    item =>
                        item.employeeId ===
                        assignedEmployee.id
                        &&
                        item.date ===
                        assignedDate
                        &&
                        shiftsOverlap(
                            item.shift,
                            assignedShift
                        )
                )
            ) {

                toast(
                    "Nh√¢n vi√™n ƒë√£ ƒë∆∞·ª£c x·∫øp m·ªôt ca tr√πng gi·ªù trong ng√†y."
                );

                return;

            }


            const schedule = {

                id:
                    `SHIFT-${Date.now()}`,

                employeeId:
                    assignedEmployee.id,

                date:
                    assignedDate,

                shift:
                    assignedShift

            };


            const nextSchedules =
                schedules.filter(
                    item =>
                        !(
                            item.employeeId ===
                            schedule.employeeId
                            &&
                            item.date ===
                            schedule.date
                        )
                );


            nextSchedules.push(
                schedule
            );


            if (
                writeStaffData(
                    scheduleKey,
                    nextSchedules
                )
            ) {

                event.currentTarget.reset();


                event.currentTarget
                    .elements
                    .date
                    .value =
                    todayKey;


                renderStaff();


                toast(
                    "ƒê√£ l∆∞u l·ªãch l√†m."
                );

            }

        }
    );


// ========================================
// FORM CA TR·ªêNG
// ========================================
document
    .getElementById(
        "openShiftForm"
    )
    .addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const form =
                new FormData(
                    event.currentTarget
                );


            const slot = {

                id:
                    `OPEN-${Date.now()}`,

                date:
                    String(
                        form.get("date")
                    ),

                shift:
                    String(
                        form.get("shift")
                    ),

                zone:
                    String(
                        form.get("zone")
                    ).trim(),

                employeeId:
                    null,

                createdAt:
                    new Date().toISOString()

            };


            const shifts =
                readStaffData(
                    openShiftKey
                );


            if (
                shifts.some(
                    item =>
                        item.date ===
                        slot.date
                        &&
                        item.shift ===
                        slot.shift
                        &&
                        item.zone ===
                        slot.zone
                )
            ) {

                toast(
                    "Ca n√†y ƒë√£ ƒë∆∞·ª£c c√¥ng b·ªë."
                );

                return;

            }


            shifts.push(
                slot
            );


            if (
                writeStaffData(
                    openShiftKey,
                    shifts
                )
            ) {

                event.currentTarget.reset();


                event.currentTarget
                    .elements
                    .zone
                    .value =
                    "B√°n h√†ng";


                renderOpenShifts();


                toast(
                    "ƒê√£ c√¥ng b·ªë ca tr·ªëng cho nh√¢n vi√™n part-time."
                );

            }

        }
    );


// ========================================
// X√ìA CA TR·ªêNG
// ========================================
document
    .getElementById(
        "openShiftRows"
    )
    .addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-open-shift-delete]"
                );


            if (!button) return;


            const shifts =
                readStaffData(
                    openShiftKey
                );


            const slot =
                shifts.find(
                    item =>
                        item.id ===
                        button
                            .dataset
                            .openShiftDelete
                );


            if (
                !slot
                ||
                slot.employeeId
            ) {

                toast(
                    "Kh√¥ng th·ªÉ g·ª° ca ƒë√£ ƒë∆∞·ª£c nh√¢n vi√™n ƒëƒÉng k√Ω."
                );

                return;

            }


            if (
                writeStaffData(
                    openShiftKey,

                    shifts.filter(
                        item =>
                            item.id !==
                            slot.id
                    )
                )
            ) {

                renderOpenShifts();

            }

        }
    );


// ========================================
// X√ìA L·ªäCH L√ÄM
// ========================================
document
    .getElementById(
        "scheduleRows"
    )
    .addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-schedule-delete]"
                );


            if (!button) return;


            const schedules =
                readStaffData(
                    scheduleKey
                ).filter(
                    item =>
                        item.id !==
                        button
                            .dataset
                            .scheduleDelete
                );


            if (
                writeStaffData(
                    scheduleKey,
                    schedules
                )
            ) {

                renderStaff();

            }

        }
    );


// ========================================
// FORM CH·∫§M C√îNG
// ========================================
document
    .getElementById(
        "attendanceForm"
    )
    .addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const form =
                new FormData(
                    event.currentTarget
                );


            const previousRecords =
                readStaffData(
                    attendanceKey
                );


            const existingRecord =
                previousRecords.find(
                    item =>
                        item.employeeId ===
                        String(
                            form.get(
                                "employeeId"
                            )
                        )
                        &&
                        item.date ===
                        String(
                            form.get(
                                "date"
                            )
                        )
                );


            const record = {

                ...(existingRecord || {}),

                employeeId:
                    String(
                        form.get(
                            "employeeId"
                        )
                    ),

                date:
                    String(
                        form.get(
                            "date"
                        )
                    ),

                status:
                    String(
                        form.get(
                            "status"
                        )
                    ),

                recordedAt:
                    new Date().toISOString()

            };


            const attendance =
                previousRecords.filter(
                    item =>
                        !(
                            item.employeeId ===
                            record.employeeId
                            &&
                            item.date ===
                            record.date
                        )
                );


            attendance.push(
                record
            );


            if (
                writeStaffData(
                    attendanceKey,
                    attendance
                )
            ) {

                renderStaff();


                toast(
                    "ƒê√£ ghi nh·∫≠n ch·∫•m c√¥ng."
                );

            }

        }
    );


// ========================================
// DUY·ªÜT ƒê∆†N NGH·ªà
// ========================================
document
    .getElementById(
        "leaveRows"
    )
    .addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-leave-id]"
                );


            if (!button) return;


            const requests =
                readStaffData(
                    leaveKey
                ).map(
                    request =>
                        request.id ===
                            button
                                .dataset
                                .leaveId

                            ? {

                                ...request,

                                status:
                                    button
                                        .dataset
                                        .leaveStatus,

                                ...(button
                                    .dataset
                                    .leaveStatus ===
                                    "approved"

                                    ? {
                                        leaveType:
                                            button
                                                .dataset
                                                .leaveType
                                    }

                                    : {}),

                                reviewedAt:
                                    new Date()
                                        .toISOString(),

                                reviewedBy:
                                    activeHrAccount?.email
                                    ||
                                    activeHrRole

                            }

                            : request
                );


            if (
                writeStaffData(
                    leaveKey,
                    requests
                )
            ) {

                renderStaff();


                toast(

                    button
                        .dataset
                        .leaveStatus ===
                        "approved"

                        ? `ƒê√£ duy·ªát ƒë∆°n ${button
                            .dataset
                            .leaveType ===
                            "Ngh·ªâ ph√©p c√≥ l∆∞∆°ng"
                            ? "ngh·ªâ c√≥ l∆∞∆°ng"
                            : "ngh·ªâ kh√¥ng l∆∞∆°ng"
                        }.`

                        : "ƒê√£ t·ª´ ch·ªëi ƒë∆°n ngh·ªâ."

                );

            }

        }
    );


// ========================================
// NG√ÄY HI·ªÜN T·∫†I
// ========================================
const todayDate =
    new Date();


const todayKey =
    `${todayDate.getFullYear()}-${String(
        todayDate.getMonth() + 1
    ).padStart(2, "0")}-${String(
        todayDate.getDate()
    ).padStart(2, "0")}`;


payMonth.value =
    todayKey.slice(
        0,
        7
    );


// ========================================
// DATE PICKER CHO L·ªäCH
// ========================================
document
    .querySelectorAll(
        '#scheduleForm input[name="date"], #openShiftForm input[name="date"]'
    )
    .forEach(
        input => {

            input.min =
                todayKey;


            input.value =
                todayKey;


            window.MaisoneDatePicker.refresh(
                input
            );

        }
    );


// ========================================
// DATE PICKER NG√ÄY SINH
// ========================================
employeeForm
    .elements
    .dateOfBirth
    .max =
    todayKey;


window.MaisoneDatePicker.refresh(
    employeeForm
        .elements
        .dateOfBirth
);


// ========================================
// DATE PICKER TH√ÅNG L∆Ø∆†NG
// ========================================
window.MaisoneDatePicker.refresh(
    payMonth
);


// ========================================
// ƒê·ªîI TH√ÅNG T√çNH L∆Ø∆†NG
// ========================================
payMonth.addEventListener(
    "change",
    renderStaff
);


// ========================================
// ƒê·ªíNG B·ªò LOCAL STORAGE
// ========================================
window.addEventListener(
    "storage",
    event => {

        if (
            [
                staffKey,
                attendanceKey,
                scheduleKey,
                leaveKey,
                openShiftKey
            ].includes(
                event.key
            )
        ) {

            renderStaff();

        }

    }
);


// ========================================
// CH·∫†Y L·∫¶N ƒê·∫¶U
// ========================================
renderStaff();

applyStaffAdminView();