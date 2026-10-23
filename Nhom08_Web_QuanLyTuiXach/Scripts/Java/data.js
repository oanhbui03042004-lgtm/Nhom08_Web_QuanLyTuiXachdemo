const defaultProductImages = {
    1: "Images/product-01-ava.jpg",
    2: "Images/tui_ngoctrai.png",
    3: "Images/tuixach_cc_trang.png",
    4: "Images/tui_den.png",
    5: "Images/tui_be_work.jpg",
    6: "Images/tui_tote_xanh.png",
    7: "Images/tuitanhlichnau.jpg",
    8: "Images/tuida_reu.jpg",
    9: "Images/tui.png",
    10: "Images/tuihong.jpg",
    11: "Images/tui_xanhreu.jpg",
    12: "Images/tuibenau.jpg"
};

const defaultColorVariants = {
    1: [
        { color: "Đỏ", image: "Images/product-01-ava.jpg" },
        { color: "Nâu", image: "Images/tuinau.jpg" },
        { color: "Đen", image: "Images/tuiden.jpg" }
    ],
    2: [
        { color: "Trắng ngọc trai", image: "Images/tui_ngoctrai.png" },
        { color: "Đen ngọc trai", image: "Images/tui_ngoc_trai_den.png" }
    ],
    3: [
        { color: "Trắng", image: "Images/tuixach_cc_trang.png" },
        { color: "Hồng", image: "Images/tuixach_cc_hong.png" },
        { color: "Nâu", image: "Images/tuixach_cc_nau.png" }
    ],
    5: [
        { color: "Be", image: "Images/tui_be_work.jpg" },
        { color: "Đen", image: "Images/tui_den_work.jpg" }
    ],
    6: [
        { color: "Xanh pastel", image: "Images/tui_tote.webp" },
        { color: "Xanh", image: "Images/tui_tote_xanh.png" },
        { color: "Hồng", image: "Images/tui_tote_hong.png" },
        { color: "Xám", image: "Images/tui_tote_xam.png" }
    ],
    7: [
        { color: "Nâu", image: "Images/tuitanhlichnau.jpg" },
        { color: "Trắng", image: "Images/tuithanhlichtrang.jpg" }
    ],
    4: [
        { color: "Đen", image: "Images/tui_den.png" },
        { color: "Be", image: "Images/tui_be.webp" }
    ],
    10: [
        { color: "Hồng", image: "Images/tuihong.jpg" },
        { color: "Vàng be", image: "Images/tui_vangbe.webp" }
    ],
    91: [
        { color: "Đen", image: "Images/tui_work_den.jpg" },
        { color: "Xám", image: "Images/tui_work_xam.webp" }
    ]
};

const supplementalColorVariantProducts = [
    {
        id: 59,
        name: "Tote Mộc Nâu & Trắng",
        category: "Tote",
        collection: "weekend",
        description: "Tote dáng mềm với quai xách ngắn; cùng một phom có màu nâu và trắng.",
        details: [["Kiểu dáng", "Tote quai xách mềm"], ["Màu sắc", "Nâu, trắng"]],
        variants: [
            { color: "Nâu", image: "Images/tui_totenau.jpg" },
            { color: "Trắng", image: "Images/tui_totetrang.jpg" }
        ]
    },
    {
        id: 56,
        name: "Tote Quai Cong Nâu & Trắng",
        category: "Tote",
        collection: "summer",
        description: "Tote dáng gọn với quai cong; có cùng mẫu màu nâu và trắng.",
        details: [["Kiểu dáng", "Tote quai cong"], ["Màu sắc", "Nâu, trắng"]],
        variants: [
            { color: "Nâu", image: "Images/tui_thoi_trang.png" },
            { color: "Trắng", image: "Images/tui_thoi_trang_trang.png" }
        ]
    },
    {
        id: 83,
        name: "Túi Bán Nguyệt Đen & Trắng",
        category: "Shoulder",
        collection: "weekend",
        description: "Túi shoulder dáng bán nguyệt với quai đeo dài; có màu đen và trắng.",
        details: [["Kiểu dáng", "Shoulder bán nguyệt"], ["Cách mang", "Quai đeo dài"], ["Màu sắc", "Đen, trắng"]],
        variants: [
            { color: "Đen", image: "Images/tuixachden.jpg" },
            { color: "Trắng", image: "Images/tuixachtrang.jpg" }
        ]
    },
    {
        id: 91,
        name: "Túi Hộp Công Sở Đen & Xám",
        category: "Office",
        collection: "work",
        description: "Túi công sở dáng hộp, đường nét gọn gàng; chọn phiên bản màu đen hoặc xám.",
        details: [["Kiểu dáng", "Túi hộp công sở"], ["Cách mang", "Quai xách trên"], ["Màu sắc", "Đen, xám"]],
        variants: [
            { color: "Đen", image: "Images/tui_work_den.jpg" },
            { color: "Xám", image: "Images/tui_work_xam.webp" }
        ]
    }
];

const localProductImages = [
    "Images/IMG_3300.jpg",
    "Images/IMG_3301.jpg",
    "Images/IMG_3302.jpg",
    "Images/IMG_3303.jpg",
    "Images/IMG_3305.jpg",
    "Images/IMG_3306.jpg",
    "Images/IMG_3307.jpg",
    "Images/IMG_3309.jpg",
    "Images/IMG_3310.jpg",
    "Images/IMG_3311.jpg",
    "Images/IMG_3313.jpg",
    "Images/IMG_3314.jpg",
    "Images/IMG_3317.jpg",
    "Images/IMG_3318.jpg",
    "Images/IMG_3319.jpg",
    "Images/IMG_3320.jpg",
    "Images/IMG_3321.jpg",
    "Images/IMG_3323.jpg",
    "Images/IMG_3325.jpg",
    "Images/IMG_3326.jpg",
    "Images/IMG_3327.jpg",
    "Images/IMG_3328.jpg",
    "Images/IMG_3329.jpg",
    "Images/IMG_3330.jpg",
    "Images/IMG_3331.jpg",
    "Images/IMG_3332.jpg",
    "Images/IMG_3333.jpg",
    "Images/TuiMini_Be.png",
    "Images/TuiMini_Xach.png",
    "Images/TuiMini_XanhMin.png",
    "Images/camtayxanhbien.jpg",
    "Images/product-01-ava.jpg",
    "Images/product-02-lea.jpg",
    "Images/product-03-mila.jpg",
    "Images/product-04-elora.jpg",
    "Images/product-05-cleo.jpg",
    "Images/traitimden.png",
    "Images/traitimhong.png",
    "Images/tui.png",
    "Images/tui.jpg",
    "Images/tui_be.jpg",
    "Images/tui_be.webp",
    "Images/tui_be_work.jpg",
    "Images/tui_den.jpg",
    "Images/tui_den.png",
    "Images/tui_den_work.jpg",
    "Images/tui_do.png",
    "Images/tuido.jpg",
    "Images/tui_naudo.jpg",
    "Images/tui_ngoc_trai_den.png",
    "Images/tui_ngoctrai.png",
    "Images/tui_thoiTrang.jpg",
    "Images/tui_thoi_trang.png",
    "Images/tui_thoi_trang_trang.png",
    "Images/tui_tote.webp",
    "Images/tui_tote_hong.png",
    "Images/tui_tote_xam.png",
    "Images/tui_tote_xanh.png",
    "Images/tui_totenau.jpg",
    "Images/tui_totetrang.jpg",
    "Images/tui_trang.png",
    "Images/tui_vangbe.webp",
    "Images/tui_work_be.jpg",
    "Images/tui_work_den.jpg",
    "Images/tui_work_xam.webp",
    "Images/tui_xanhdam.jpg",
    "Images/tui_xanhnau.png",
    "Images/tui_xanhreu.jpg",
    "Images/tui_xanhreu.png",
    "Images/tuinhehong.jpg",
    "Images/tuibenau.jpg",
    "Images/tuicam.jpg",
    "Images/tuicamtayxanhmint.jpg",
    "Images/tuida_reu.jpg",
    "Images/tuidabeo.jpg",
    "Images/tuidaden.jpg",
    "Images/tuidaquang.jpg",
    "Images/tuidareu.jpg",
    "Images/tuiden.jpg",
    "Images/tuidencongso.jpg",
    "Images/tuideoden.jpg",
    "Images/tuideonau.jpg",
    "Images/tuihong.jpg",
    "Images/tui_hong.jpg",
    "Images/tuijean.jpg",
    "Images/tuinau.jpg",
    "Images/tuinaunhat.jpg",
    "Images/tuinguanau.png",
    "Images/tuitanhlichnau.jpg",
    "Images/tuithanhlichtrang.jpg",
    "Images/tuitrang_tote.jpg",
    "Images/tuivang.jpg",
    "Images/tuixach_cc_hong.png",
    "Images/tuixach_cc_nau.png",
    "Images/tuixach_cc_trang.png",
    "Images/tuixachden.jpg",
    "Images/tuixachdentote.jpg",
    "Images/tuixachhong.jpg",
    "Images/tuixachtrang.jpg",
    "Images/tuixam.jpg",
    "Images/tuixanhbien.jpg",
    "Images/tuixanhdam.png"
];

const products = [
    {
        id: 1,
        name: "Túi Satchel Khóa Gọn",
        category: "Office",
        collections: ["work"],
        price: 850000,
        oldPrice: 1050000,
        label: "WORK EDIT",
        image: defaultProductImages[1],
        colorVariants: defaultColorVariants[1],
        storyTitle: "Satchel Khóa Gọn — một phom túi, ba sắc độ",
        story: "Phom satchel đứng với quai cầm ngắn, nắp trước và khóa kim loại. Ba lựa chọn đỏ, nâu và đen cùng thuộc thiết kế này.",
        description: "Túi satchel dáng hộp với quai xách trên, nắp trước và khóa kim loại. Chọn màu đỏ, nâu hoặc đen; ảnh luôn khớp với màu đang chọn.",
        details: [["Kiểu dáng", "Túi dáng hộp"], ["Cách mang", "Quai xách trên"], ["Điểm nhận diện", "Nắp trước và khóa kim loại"]]
    },
    {
        id: 2,
        name: "Lune Pearl Hobo",
        category: "Shoulder",
        collections: ["weekend"],
        price: 690000,
        oldPrice: 890000,
        label: "WEEKEND EDIT",
        image: defaultProductImages[2],
        colorVariants: defaultColorVariants[2],
        storyTitle: "Lune — ánh ngọc trai trên phom hobo mềm",
        story: "Thân túi cong ôm theo dáng bán nguyệt. Chuỗi hạt ngọc trai đặt nổi ở mặt trước làm điểm nhấn, kết hợp quai cầm ngắn và dây xích dài.",
        description: "Túi shoulder dáng cong, có quai cầm ngắn, dây xích dài và chuỗi hạt trang trí. Chọn màu trắng hoặc đen; cả hai ảnh đều là cùng một mẫu.",
        details: [["Kiểu dáng", "Hobo bán nguyệt"], ["Cách mang", "Quai ngắn và dây xích"], ["Điểm nhận diện", "Chuỗi hạt ngọc trai mặt trước"]]
    },
    {
        id: 3,
        name: "Túi Mini Khóa Nắp Ba Màu",
        category: "Mini",
        collections: ["weekend"],
        price: 590000,
        oldPrice: 750000,
        label: "CROSSBODY",
        image: defaultProductImages[3],
        colorVariants: defaultColorVariants[3],
        storyTitle: "Mini Khóa Nắp — nhỏ gọn, nổi bật với chi tiết kim loại",
        story: "Túi mini có quai cầm trên, nắp trước và khóa kim loại. Ba ảnh màu trắng, hồng và nâu cùng một kiểu dáng.",
        description: "Túi mini dáng hộp với quai cầm trên, nắp trước và khóa kim loại; có màu trắng, hồng và nâu.",
        details: [["Kiểu dáng", "Túi mini dáng hộp"], ["Cách mang", "Quai cầm trên"], ["Điểm nhận diện", "Nắp trước và khóa kim loại"]]
    },
    {
        id: 4,
        name: "Túi Hobo Mềm Đen & Be",
        category: "Shoulder",
        collections: ["autumn"],
        price: 790000,
        oldPrice: 950000,
        label: "AUTUMN EDIT",
        image: defaultProductImages[4],
        colorVariants: defaultColorVariants[4],
        storyTitle: "Hobo Mềm — tối giản trong hai gam màu",
        story: "Thân túi cong mềm cùng quai vai tạo dáng gọn gàng, dễ phối đồ thường nhật. Cùng một phom có màu đen và be.",
        description: "Túi hobo thân mềm với quai vai cong. Chọn phiên bản màu đen hoặc be của cùng một dáng túi.",
        details: [["Kiểu dáng", "Hobo thân mềm"], ["Cách mang", "Quai vai"], ["Màu sắc", "Đen, be"]]
    },
    {
        id: 5,
        name: "Sable Beige Hobo",
        category: "Shoulder",
        collections: ["summer"],
        price: 720000,
        oldPrice: 890000,
        label: "SUMMER EDIT",
        image: defaultProductImages[5],
        storyTitle: "Sable — sắc be nhẹ nhàng, phom túi mềm",
        story: "Phần thân bo cong, quai vai và chi tiết khóa phía trước tạo dáng gọn gàng. Mẫu có hai lựa chọn màu be và đen.",
        description: "Túi shoulder dáng mềm, có quai vai và chi tiết khóa phía trước. Cùng mẫu có màu be và đen.",
        colorVariants: defaultColorVariants[5],
        details: [["Kiểu dáng", "Hobo mềm"], ["Cách mang", "Quai vai"], ["Điểm nhận diện", "Chi tiết khóa mặt trước"]]
    },
    {
        id: 6,
        name: "Túi Tote Nơ Pastel",
        category: "Tote",
        collections: ["summer", "weekend"],
        price: 650000,
        oldPrice: 790000,
        label: "SUMMER EDIT",
        image: defaultProductImages[6],
        storyTitle: "Tote Nơ Pastel — chiếc túi nhỏ xinh cho ngày dạo phố",
        story: "Phom tote nhỏ với quai xách và nơ trang trí phía trước. Cùng một dáng túi có bốn lựa chọn màu pastel.",
        description: "Túi tote nhỏ có quai xách và nơ phía trước; có màu xanh pastel, xanh, hồng và xám.",
        colorVariants: defaultColorVariants[6],
        details: [["Kiểu dáng", "Tote nhỏ"], ["Cách mang", "Quai xách"], ["Điểm nhận diện", "Nơ phía trước"]]
    },
    {
        id: 7,
        name: "Túi Hobo Thanh Lịch",
        category: "Shoulder",
        collections: ["autumn"],
        price: 790000,
        oldPrice: 950000,
        label: "AUTUMN EDIT",
        image: defaultProductImages[7],
        storyTitle: "Hobo Thanh Lịch — mềm mại trong hai sắc độ",
        story: "Dáng túi hobo mềm với quai vai dài. Hai ảnh màu nâu và trắng có cùng phom túi.",
        description: "Túi hobo dáng mềm, có quai vai dài; chọn màu nâu hoặc trắng.",
        colorVariants: defaultColorVariants[7],
        details: [["Kiểu dáng", "Túi hobo mềm"], ["Cách mang", "Quai vai dài"], ["Màu sắc", "Nâu, trắng"]]
    },
    {
        id: 8,
        name: "Olive Structured Shoulder",
        category: "Shoulder",
        collections: ["work"],
        price: 920000,
        oldPrice: 1150000,
        label: "WORK EDIT",
        image: defaultProductImages[8],
        storyTitle: "Olive — dáng túi gọn trong sắc rêu trầm",
        story: "Sắc rêu trầm, quai xách cong và thân túi đứng tạo tổng thể gọn gàng. Phù hợp mang đi làm hoặc dùng trong những dịp thường ngày.",
        description: "Túi shoulder màu rêu, phom thân đứng với quai xách cong và chi tiết khóa phía trước. Ảnh hiện có một màu.",
        details: [["Kiểu dáng", "Túi thân đứng"], ["Cách mang", "Quai xách trên"], ["Điểm nhận diện", "Sắc rêu và khóa trước"]]
    },
    {
        id: 9,
        name: "Poppy Bow Mini",
        category: "Mini",
        collections: ["weekend"],
        price: 420000,
        oldPrice: 590000,
        label: "MINI",
        image: defaultProductImages[9],
        storyTitle: "Poppy — chiếc mini xanh nhạt có nơ và charm",
        story: "Thân túi nhỏ màu xanh nhạt, quai xách cong và nơ lớn ở mặt trước. Charm hình sao cùng dây trang trí làm mẫu túi nổi bật, phù hợp khi chỉ cần mang theo vật dụng gọn nhẹ.",
        description: "Túi mini xanh nhạt có quai xách, nơ mặt trước và charm hình sao. Mẫu ảnh hiện có một màu.",
        details: [["Kiểu dáng", "Mini bag"], ["Cách mang", "Quai xách"], ["Điểm nhận diện", "Nơ lớn và charm hình sao"]]
    },
    {
        id: 10,
        name: "Túi Mini Charm Hồng & Vàng Be",
        category: "Mini",
        collections: ["weekend"],
        price: 490000,
        oldPrice: 650000,
        label: "NEW",
        image: "Images/tuihong.jpg",
        colorVariants: defaultColorVariants[10],
        storyTitle: "Mini Charm — điểm nhấn ngọt ngào trong hai gam màu",
        story: "Phom túi nhỏ dáng hộp bo tròn, hai quai xách và nơ ở mặt trước. Các charm nhiều hình dáng tạo vẻ trẻ trung; nền ảnh và chi tiết trang trí đều thuộc mẫu túi trong hình.",
        description: "Túi mini có hai quai xách, nơ trước và charm treo trang trí. Cùng một mẫu có màu hồng và vàng be.",
        details: [["Kiểu dáng", "Mini bag dáng hộp bo tròn"], ["Cách mang", "Quai xách"], ["Điểm nhận diện", "Nơ trước và charm treo"]]
    },
    {
        id: 11,
        name: "Sage Mini Shoulder",
        category: "Mini",
        collections: ["weekend"],
        price: 590000,
        oldPrice: 720000,
        label: "NEW",
        image: defaultProductImages[11],
        storyTitle: "Sage — sắc xanh dịu trên phom túi nhỏ",
        story: "Thân túi xanh sage, quai vai ngắn và nắp trước tạo dáng gọn gàng. Một chi tiết khóa ở mặt trước làm điểm nhấn cho thiết kế.",
        description: "Túi shoulder màu xanh sage, thân dáng hộp nhỏ, quai ngắn và chi tiết khóa phía trước. Mẫu ảnh hiện có một màu.",
        details: [["Kiểu dáng", "Túi shoulder nhỏ"], ["Cách mang", "Quai vai"], ["Điểm nhận diện", "Nắp trước và khóa"]]
    },
    {
        id: 12,
        name: "Juno Two-Tone Mini",
        category: "Mini",
        collections: ["weekend"],
        price: 690000,
        oldPrice: 850000,
        label: "SOFT SHAPE",
        image: defaultProductImages[12],
        storyTitle: "Juno — sắc be và nâu trên phom mini",
        story: "Phom nhỏ với quai cầm trên, thân màu be và phần đáy nâu tạo điểm tương phản. Thiết kế gọn nhẹ, phù hợp những buổi dạo phố.",
        description: "Túi mini phối màu be-nâu, có quai xách trên và thân dáng hộp bo mềm. Mẫu ảnh hiện có một màu.",
        details: [["Kiểu dáng", "Mini bag phối màu"], ["Cách mang", "Quai xách"], ["Điểm nhận diện", "Thân be phối nâu"]]
    }
];

function getSupplementalProductName(image, id) {
    const names = {
        "Images/IMG_3300.jpg": "Túi Satchel Khóa Tròn",
        "Images/IMG_3301.jpg": "Túi Chần Bông Dây Xích",
        "Images/IMG_3302.jpg": "Túi Mini Hoa Ngọc Trai",
        "Images/IMG_3303.jpg": "Túi Hộp Quai Cong Màu Be",
        "Images/IMG_3305.jpg": "Túi Tote Đen Chữ In",
        "Images/IMG_3306.jpg": "Túi Satchel Họa Tiết Nâu",
        "Images/IMG_3307.jpg": "Túi Kẻ Ô Phối Nâu",
        "Images/IMG_3309.jpg": "Túi Tote Đen Tối Giản",
        "Images/IMG_3310.jpg": "Túi Mây Quai Cầm",
        "Images/IMG_3311.jpg": "Túi Hobo Trắng Mềm",
        "Images/IMG_3313.jpg": "Túi Satchel Khóa Mặt Trước",
        "Images/IMG_3314.jpg": "Túi Mini Cam Rực Rỡ",
        "Images/IMG_3317.jpg": "Túi Hộp Quai Xách Sáng Màu",
        "Images/IMG_3318.jpg": "Túi Tote Vàng Nắng",
        "Images/IMG_3319.jpg": "Túi Tote Nâu Quai Cong",
        "Images/IMG_3320.jpg": "Túi Hobo Kem Nhẹ Nhàng",
        "Images/IMG_3321.jpg": "Túi Tote Đen Quai Da",
        "Images/IMG_3323.jpg": "Túi Satchel Họa Tiết Ghép",
        "Images/IMG_3325.jpg": "Túi Hobo Chần Bông",
        "Images/IMG_3326.jpg": "Túi Satchel Hồng Phấn",
        "Images/IMG_3327.jpg": "Clutch Phong Thư Trắng",
        "Images/IMG_3328.jpg": "Túi Mini Vân Nổi Đen",
        "Images/IMG_3329.jpg": "Túi Denim Xanh Dạo Phố",
        "Images/IMG_3330.jpg": "Túi Họa Tiết Quai Cong",
        "Images/IMG_3331.jpg": "Túi Tote Đen Charm",
        "Images/IMG_3332.jpg": "Túi Satchel Họa Tiết Trầm",
        "Images/IMG_3333.jpg": "Túi Tote Đen Quai Tròn",
        "Images/TuiMini_Be.png": "Túi Mini Nơ Be",
        "Images/TuiMini_Xach.png": "Túi Mini Quai Xách",
        "Images/TuiMini_XanhMin.png": "Túi Mini Xanh Bạc Hà",
        "Images/camtayxanhbien.jpg": "Túi Hộp Xanh Biển",
        "Images/product-02-lea.jpg": "Túi Đeo Chéo Nắp Gập",
        "Images/product-03-mila.jpg": "Túi Chần Bông Khóa Vàng",
        "Images/traitimhong.png": "Túi Tim Hồng Nơ",
        "Images/tui.png": "Túi Mini Nơ Xanh",
        "Images/tui.jpg": "Túi Mini Màu Nổi",
        "Images/tui_be.jpg": "Túi Đeo Vai Màu Be",
        "Images/tui_be.webp": "Túi Hobo Be Nhẹ Nhàng",
        "Images/tui_den.jpg": "Túi Đeo Vai Đen",
        "Images/tui_den.png": "Túi Hobo Đen",
        "Images/tui_do.png": "Túi Đỏ Quai Vai",
        "Images/tuido.jpg": "Túi Mini Đỏ",
        "Images/tui_naudo.jpg": "Túi Nâu Đỏ Dáng Hộp",
        "Images/tui_thoiTrang.jpg": "Túi Quai Xách Nâu",
        "Images/tui_thoi_trang.png": "Túi Quai Xách Trắng",
        "Images/tui_thoi_trang_trang.png": "Túi Thời Trang Trắng",
        "Images/tui_totenau.jpg": "Tote Mộc Nâu",
        "Images/tui_totetrang.jpg": "Tote Mộc Trắng",
        "Images/tui_trang.png": "Túi Đeo Vai Trắng",
        "Images/tui_vangbe.webp": "Túi Vàng Be",
        "Images/tui_work_den.jpg": "Túi Hộp Công Sở Đen",
        "Images/tui_work_xam.webp": "Túi Kẻ Ô Xám",
        "Images/tui_xanhdam.jpg": "Túi Xanh Đậm Quai Cong",
        "Images/tui_xanhnau.png": "Túi Phối Xanh Nâu",
        "Images/tui_xanhreu.jpg": "Túi Hobo Xanh Rêu",
        "Images/tui_xanhreu.png": "Túi Xanh Rêu Dáng Hộp",
        "Images/tuicam.jpg": "Túi Mini Cam",
        "Images/tuicamtayxanhmint.jpg": "Túi Cầm Tay Xanh Mint",
        "Images/tuida_reu.jpg": "Túi Dáng Hộp Xanh Rêu",
        "Images/tuidabeo.jpg": "Túi Họa Tiết Da Be",
        "Images/tuidaden.jpg": "Túi Dáng Hộp Đen",
        "Images/tuidaquang.jpg": "Túi Quai Xách Phối Sáng",
        "Images/tuidareu.jpg": "Túi Dáng Hộp Rêu",
        "Images/tuidencongso.jpg": "Túi Công Sở Đen",
        "Images/tuideoden.jpg": "Túi Đeo Vai Đen Khóa Vàng",
        "Images/tuideonau.jpg": "Túi Đeo Vai Nâu",
        "Images/tui_hong.jpg": "Túi Hobo Hồng",
        "Images/tuijean.jpg": "Túi Denim Quai Cong",
        "Images/tuinau.jpg": "Túi Satchel Nâu",
        "Images/tuinaunhat.jpg": "Túi Satchel Nâu Nhạt",
        "Images/tuinguanau.png": "Túi Nâu Quai Xách",
        "Images/tuinhehong.jpg": "Túi Hồng Nhẹ Nhàng",
        "Images/tuitrang_tote.jpg": "Tote Trắng Dáng Mềm",
        "Images/tuivang.jpg": "Túi Vàng Tươi",
        "Images/tuixachden.jpg": "Túi Xách Đen",
        "Images/tuixachdentote.jpg": "Tote Đen Quai Cong",
        "Images/tuixachhong.jpg": "Túi Xách Hồng",
        "Images/tuixachtrang.jpg": "Túi Xách Trắng",
        "Images/tuixam.jpg": "Túi Xám Quai Cong",
        "Images/tuixanhbien.jpg": "Túi Xanh Biển Dáng Mềm",
        "Images/tuixanhdam.png": "Túi Xanh Đậm Quai Xách"
    };

    return names[image] || `Túi Maisoné ${String(id).padStart(3, "0")}`;
}

function getSupplementalCategory(image) {
    const filename = image.toLowerCase();

    if (filename.includes("work") || filename.includes("congso")) return "Office";
    if (filename.includes("tote")) return "Tote";
    if (filename.includes("mini") || filename.includes("camtay") || filename.includes("xach")) return "Mini";

    return "Shoulder";
}

function getSupplementalCollection(category) {
    if (category === "Office") return "work";
    if (category === "Tote") return "summer";
    if (category === "Mini") return "weekend";

    return "";
}

const coveredProductImages = new Set(products.flatMap(product => [
    product.image,
    ...(product.colorVariants || []).map(variant => variant.image)
]));

products.push(
    {
        id: 13,
        name: "Túi Tim Mini Đen & Hồng",
        category: "Mini",
        collections: ["weekend"],
        price: 590000,
        oldPrice: 0,
        label: "NEW",
        image: "Images/traitimden.png",
        colorVariants: [
            { color: "Đen", image: "Images/traitimden.png" },
            { color: "Hồng", image: "Images/traitimhong.png" }
        ],
        description: "Túi mini dáng trái tim với quai đeo và chi tiết trang trí nổi bật; có hai màu đen và hồng."
    },
    {
        id: 14,
        name: "Túi Hộp Công Sở Be",
        category: "Office",
        collections: ["work"],
        price: 590000,
        oldPrice: 0,
        label: "NEW",
        image: "Images/tui_work_be.jpg",
        description: "Túi hộp màu be với quai xách trên và nắp trước gọn gàng."
    }
);

products.forEach(product => {
    coveredProductImages.add(product.image);
    product.colorVariants?.forEach(variant => coveredProductImages.add(variant.image));
});

const stableSupplementalProductIds = {
    "Images/IMG_3300.jpg": 15,
    "Images/IMG_3301.jpg": 16,
    "Images/IMG_3302.jpg": 17,
    "Images/IMG_3303.jpg": 18,
    "Images/IMG_3305.jpg": 19,
    "Images/IMG_3306.jpg": 20,
    "Images/IMG_3307.jpg": 21,
    "Images/IMG_3309.jpg": 22,
    "Images/IMG_3310.jpg": 23,
    "Images/IMG_3311.jpg": 24,
    "Images/IMG_3313.jpg": 25,
    "Images/IMG_3314.jpg": 26,
    "Images/IMG_3317.jpg": 27,
    "Images/IMG_3318.jpg": 28,
    "Images/IMG_3319.jpg": 29,
    "Images/IMG_3320.jpg": 30,
    "Images/IMG_3321.jpg": 31,
    "Images/IMG_3323.jpg": 32,
    "Images/IMG_3325.jpg": 33,
    "Images/IMG_3326.jpg": 34,
    "Images/IMG_3327.jpg": 35,
    "Images/IMG_3328.jpg": 36,
    "Images/IMG_3329.jpg": 37,
    "Images/IMG_3330.jpg": 38,
    "Images/IMG_3331.jpg": 39,
    "Images/IMG_3332.jpg": 40,
    "Images/IMG_3333.jpg": 41,
    "Images/TuiMini_Be.png": 42,
    "Images/TuiMini_Xach.png": 43,
    "Images/TuiMini_XanhMin.png": 44,
    "Images/camtayxanhbien.jpg": 45,
    "Images/product-02-lea.jpg": 46,
    "Images/product-03-mila.jpg": 47,
    "Images/tui.jpg": 48,
    "Images/tui_be.jpg": 49,
    "Images/tui_be.webp": 50,
    "Images/tui_den.jpg": 51,
    "Images/tui_do.png": 52,
    "Images/tuido.jpg": 53,
    "Images/tui_naudo.jpg": 54,
    "Images/tui_thoiTrang.jpg": 55,
    "Images/tui_thoi_trang.png": 56,
    "Images/tui_thoi_trang_trang.png": 57,
    "Images/tui_tote.webp": 58,
    "Images/tui_totenau.jpg": 59,
    "Images/tui_totetrang.jpg": 60,
    "Images/tui_trang.png": 61,
    "Images/tui_vangbe.webp": 62,
    "Images/tui_xanhdam.jpg": 63,
    "Images/tui_xanhnau.png": 64,
    "Images/tui_xanhreu.png": 65,
    "Images/tuinhehong.jpg": 66,
    "Images/tuicam.jpg": 67,
    "Images/tuicamtayxanhmint.jpg": 68,
    "Images/tuidabeo.jpg": 69,
    "Images/tuidaden.jpg": 70,
    "Images/tuidaquang.jpg": 71,
    "Images/tuidareu.jpg": 72,
    "Images/tuidencongso.jpg": 73,
    "Images/tuideoden.jpg": 74,
    "Images/tuideonau.jpg": 75,
    "Images/tui_hong.jpg": 76,
    "Images/tuijean.jpg": 77,
    "Images/tuinaunhat.jpg": 78,
    "Images/tuinguanau.png": 79,
    "Images/tuithanhlichtrang.jpg": 80,
    "Images/tuitrang_tote.jpg": 81,
    "Images/tuivang.jpg": 82,
    "Images/tuixachden.jpg": 83,
    "Images/tuixachdentote.jpg": 84,
    "Images/tuixachhong.jpg": 85,
    "Images/tuixachtrang.jpg": 86,
    "Images/tuixam.jpg": 87,
    "Images/tuixanhbien.jpg": 88,
    "Images/tuixanhdam.png": 89
};

let nextCatalogId = 1000;

supplementalColorVariantProducts.forEach(group => {
    const variants = group.variants.filter(variant => localProductImages.includes(variant.image));

    if (variants.length < 2 || variants.some(variant => coveredProductImages.has(variant.image))) return;

    const image = variants[0].image;

    products.push({
        id: group.id,
        name: group.name,
        category: group.category,
        collections: [group.collection],
        price: 590000,
        oldPrice: 0,
        label: "NEW",
        image,
        colorVariants: variants,
        description: group.description,
        details: group.details
    });

    variants.forEach(variant => coveredProductImages.add(variant.image));
});

const duplicateCatalogImages = new Set([
    "Images/tuicam.jpg",
    "Images/product-04-elora.jpg",
    "Images/product-05-cleo.jpg"
]);

localProductImages.forEach(image => {

    if (coveredProductImages.has(image) || duplicateCatalogImages.has(image)) return;

    const stableId = stableSupplementalProductIds[image];

    let productId = stableId || nextCatalogId;

    while (products.some(product => String(product.id) === String(productId))) {

        if (stableId) {
            throw new Error(`Mã sản phẩm ${stableId} bị trùng khi khởi tạo catalog.`);
        }

        productId = ++nextCatalogId;
    }

    const category = getSupplementalCategory(image);
    const name = getSupplementalProductName(image, productId);

    products.push({
        id: productId,
        name,
        category,
        collections: getSupplementalCollection(category)
            ? [getSupplementalCollection(category)]
            : [],
        price: 590000,
        oldPrice: 0,
        label: "NEW",
        image,
        description: "Mẫu túi được bổ sung từ bộ ảnh Maisoné. Hình ảnh sản phẩm thể hiện kiểu dáng và màu sắc; thông tin chất liệu, kích thước chưa được cung cấp."
    });

    coveredProductImages.add(image);

    if (!stableId) nextCatalogId = productId + 1;
});

function getReferenceDimensions(product) {

    const name = product.name.toLocaleLowerCase("vi");

    if (name.includes("clutch") || name.includes("phong thư")) return "22 × 13 × 4 cm (ước tính)";
    if (product.category === "Tote") return "30 × 25 × 12 cm (ước tính)";
    if (product.category === "Office") return "28 × 21 × 10 cm (ước tính)";
    if (product.category === "Mini") return "20 × 14 × 7 cm (ước tính)";
    if (name.includes("hobo") || name.includes("bán nguyệt")) return "26 × 18 × 9 cm (ước tính)";

    return "25 × 19 × 9 cm (ước tính)";
}

function getReferenceMaterial(image, productName) {

    const file = image.toLocaleLowerCase("vi");
    const name = productName.toLocaleLowerCase("vi");

    if (file.includes("denim") || file.includes("jean") || name.includes("denim")) return "Vải denim (ước tính theo ảnh)";
    if (file.includes("may") || file.includes("woven") || name.includes("mây")) return "Chất liệu đan sợi (ước tính theo ảnh)";
    if (name.includes("tote") || name.includes("canvas")) return "Canvas hoặc da tổng hợp (ước tính theo ảnh)";

    return "Da PU/giả da (ước tính theo ảnh)";
}

function getProductStyleDescription(product) {

    const name = product.name.toLocaleLowerCase("vi");

    if (name.includes("tote")) return "phom tote thoáng rộng, tiện sắp xếp vật dụng mỗi ngày";
    if (name.includes("hobo") || name.includes("bán nguyệt")) return "đường cong mềm mại, tạo vẻ thanh lịch khi mang vai";
    if (name.includes("satchel") || name.includes("hộp") || name.includes("khóa nắp")) return "phom gọn đứng cùng chi tiết mặt trước làm điểm nhấn";
    if (name.includes("clutch") || name.includes("phong thư")) return "dáng cầm tay mảnh gọn, hợp những dịp cần vẻ chỉn chu";
    if (product.category === "Mini") return "phom nhỏ xinh, vừa đủ mang theo những món đồ thiết yếu";
    if (product.category === "Office") return "đường nét gọn gàng, phù hợp nhịp đi làm thường nhật";

    return "kiểu dáng dễ phối, phù hợp từ buổi dạo phố đến những cuộc hẹn nhẹ nhàng";
}

products.forEach(product => {

    const details = Array.isArray(product.details) ? product.details : [];

    if (!details.some(([label]) => label === "Kích thước tham khảo")) {
        details.push(["Kích thước tham khảo", getReferenceDimensions(product)]);
    }

    if (!details.some(([label]) => label === "Chất liệu tham khảo")) {
        details.push(["Chất liệu tham khảo", getReferenceMaterial(product.image, product.name)]);
    }

    product.details = details;

    if (product.description?.startsWith("Mẫu túi được bổ sung")) {
        product.description = `${product.name} ghi điểm với ${getProductStyleDescription(product)}. Dễ phối cùng trang phục đi làm, dạo phố hoặc những buổi hẹn cuối tuần. Kích thước và chất liệu trong phần chi tiết là thông tin tham khảo, cần đối chiếu với sản phẩm thực tế.`;
    }
});

products.sort((first, second) => Number(first.id) - Number(second.id));

const catalogVersion = "2026-10-visual-catalog-4";

try {

    const storedProducts = JSON.parse(localStorage.getItem("maisoneProducts") || "null");

    if (Array.isArray(storedProducts)) {

        const validProducts = storedProducts.filter(product =>
            product
            && Number.isInteger(Number(product.id))
            && String(product.name || "").trim()
            && Number.isFinite(Number(product.price))
        );

        const storedById = new Map(validProducts.map(product => [String(product.id), product]));

        const seededIds = new Set(products.map(product => String(product.id)));

        const hasCurrentCatalog = localStorage.getItem("maisoneCatalogVersion") === catalogVersion;

        const catalogProducts = products.map(defaultProduct => {

            if (!hasCurrentCatalog) return defaultProduct;

            const storedProduct = storedById.get(String(defaultProduct.id));

            if (!storedProduct) return defaultProduct;

            const storedVariants = Array.isArray(storedProduct.colorVariants)
                ? storedProduct.colorVariants.filter(variant =>
                    variant
                    && String(variant.color || "").trim()
                    && localProductImages.includes(variant.image)
                )
                : defaultProduct.colorVariants;

            return {
                ...defaultProduct,
                ...storedProduct,
                image: localProductImages.includes(storedProduct.image) ? storedProduct.image : defaultProduct.image,
                collections: Array.isArray(storedProduct.collections) ? storedProduct.collections : defaultProduct.collections,
                colorVariants: storedVariants?.length ? storedVariants : undefined
            };
        });

        const usedImages = new Set(catalogProducts.flatMap(product => [
            product.image,
            ...(product.colorVariants || []).map(variant => variant.image)
        ]));

        const customProducts = validProducts.filter(product =>
            !seededIds.has(String(product.id))
            && localProductImages.includes(product.image)
            && !duplicateCatalogImages.has(product.image)
        );

        let customId = Math.max(...catalogProducts.map(product => Number(product.id))) + 1;

        customProducts.forEach(product => {

            if (usedImages.has(product.image)) return;

            catalogProducts.push({
                ...product,
                id: hasCurrentCatalog ? product.id : customId++,
                collections: Array.isArray(product.collections) ? product.collections : [],
                colorVariants: undefined
            });

            usedImages.add(product.image);
        });

        products.splice(0, products.length, ...catalogProducts);

        if (!hasCurrentCatalog) {
            localStorage.setItem("maisoneProducts", JSON.stringify(products));
            localStorage.setItem("maisoneCatalogVersion", catalogVersion);
        }

    } else {

        localStorage.setItem("maisoneProducts", JSON.stringify(products));
        localStorage.setItem("maisoneCatalogVersion", catalogVersion);

    }

} catch (error) {

    console.error("Không đọc được hoặc không thể cập nhật danh sách sản phẩm đã lưu.", error);

}

function localProductImageFor(productId, color = "") {

    const product = products.find(item => String(item.id) === String(productId));

    return product
        ? getProductVariant(product, color).image
        || defaultProductImages[productId]
        || defaultProductImages[1]
        : defaultProductImages[productId] || defaultProductImages[1];
}

function getProductColors(product) {

    return Array.isArray(product.colorVariants) && product.colorVariants.length
        ? product.colorVariants.map(variant => variant.color)
        : ["Màu duy nhất"];
}

function getProductVariant(product, color) {

    return product.colorVariants?.find(variant => variant.color === color)
        || product.colorVariants?.[0]
        || { color: "Màu duy nhất", image: product.image };
}

const defaultMaisoneVouchers = [

    {
        code: "WELCOME50",
        label: "Giảm 50.000đ",
        condition: "Đơn từ 500.000đ",
        type: "fixed",
        value: 50000,
        min: 500000,
        category: "product",
        validFrom: "2026-10-01",
        validUntil: "2026-10-31"
    },

    {
        code: "GOLD15",
        label: "Giảm 15%",
        condition: "Tối đa 150.000đ · thành viên GOLD",
        type: "percent",
        value: .15,
        min: 0,
        cap: 150000,
        category: "product",
        membershipTier: "GOLD",
        validFrom: "2026-10-01",
        validUntil: "2026-10-31"
    },

    {
        code: "FREESHIP",
        label: "Miễn phí vận chuyển",
        condition: "Đơn từ 999.000đ",
        type: "ship",
        value: 0,
        min: 999000,
        category: "shipping",
        validFrom: "2026-10-01",
        validUntil: "2026-10-31"
    },

    {
        code: "BAG80",
        label: "Giảm 80.000đ",
        condition: "Đơn từ 1.200.000đ",
        type: "fixed",
        value: 80000,
        min: 1200000,
        category: "product",
        validFrom: "2026-10-01",
        validUntil: "2026-10-31"
    },

    {
        code: "SHIP20",
        label: "Giảm 20.000đ phí giao",
        condition: "Đơn từ 500.000đ",
        type: "shipping-discount",
        value: 20000,
        min: 500000,
        category: "shipping",
        validFrom: "2026-10-01",
        validUntil: "2026-10-31"
    },

    {
        code: "SHIP50",
        label: "Miễn phí giao hàng ưu tiên",
        condition: "Đơn từ 1.500.000đ",
        type: "ship",
        value: 0,
        min: 1500000,
        category: "shipping",
        validFrom: "2026-10-01",
        validUntil: "2026-10-31"
    },

    {
        code: "BIRTHDAY",
        label: "Giảm 100.000đ",
        condition: "Đơn từ 500.000đ · ưu đãi sinh nhật",
        type: "fixed",
        value: 100000,
        min: 500000,
        category: "product",
        birthdayOnly: true,
        validFrom: "2026-10-01",
        validUntil: "2026-10-31"
    },

    {
        code: "WEEKEND10",
        label: "Giảm 10%",
        condition: "Cuối tuần · tối đa 100.000đ",
        type: "percent",
        value: .1,
        cap: 100000,
        min: 0,
        category: "product",
        weekendOnly: true,
        validFrom: "2026-10-01",
        validUntil: "2026-10-31"
    }

];

let maisoneVouchers = defaultMaisoneVouchers;

let maisoneVoucherFeatureEnabled = true;

try {

    const savedVoucherSettings = JSON.parse(
        localStorage.getItem("maisoneVoucherSettings") || "null"
    );

    if (savedVoucherSettings && typeof savedVoucherSettings === "object") {

        if (typeof savedVoucherSettings.enabled === "boolean") {
            maisoneVoucherFeatureEnabled = savedVoucherSettings.enabled;
        }

        if (Array.isArray(savedVoucherSettings.vouchers)) {
            maisoneVouchers = savedVoucherSettings.vouchers;
        }

    }

} catch (error) {

    console.error("Không đọc được cài đặt voucher đã lưu.", error);

}

function isVoucherEligible(voucher, subtotal, account = null, now = new Date()) {

    if (!maisoneVoucherFeatureEnabled || voucher.active === false) return false;

    const startsAt = new Date(`${voucher.validFrom}T00:00:00`);
    const endsAt = new Date(`${voucher.validUntil}T23:59:59.999`);

    if (
        Number.isNaN(startsAt.getTime())
        || Number.isNaN(endsAt.getTime())
        || now < startsAt
        || now > endsAt
    ) return false;

    if (subtotal < voucher.min) return false;

    if (
        voucher.membershipTier
        && String(account?.membershipTier || account?.tier || "").toUpperCase() !== voucher.membershipTier
    ) return false;

    if (voucher.birthdayOnly) {

        const birthDate = account?.birthDate || account?.birthday;
        const birthday = birthDate ? new Date(birthDate) : null;

        if (
            !birthday
            || Number.isNaN(birthday.getTime())
            || birthday.getDate() !== now.getDate()
            || birthday.getMonth() !== now.getMonth()
        ) return false;

    }

    if (voucher.weekendOnly && ![0, 6].includes(now.getDay())) return false;

    return true;
}

function formatVoucherValidity(voucher) {

    const formatDate = value => {

        const [year, month, day] = value.split("-");

        return `${day}/${month}/${year}`;
    };

    return `Hiệu lực: ${formatDate(voucher.validFrom)} – ${formatDate(voucher.validUntil)}`;
}


/* =====================================================
   CART DATA
===================================================== */

const demoAccounts = [
    {
        name: "System Admin",
        email: "admin@bagstore.vn",
        password: "admin123",
        role: "admin"
    },
    {
        name: "Quản lý Maisoné",
        email: "manager@bagstore.vn",
        password: "manager123",
        role: "manager"
    },
    {
        name: "Nhân viên bán hàng",
        email: "staff@bagstore.vn",
        password: "staff123",
        role: "staff"
    },
    {
        name: "Khách hàng Maisoné",
        email: "customer@bagstore.vn",
        password: "customer123",
        role: "customer"
    }
];

function toast(m) {

    const t = document.getElementById('toast');

    if (!t) return;

    t.textContent = m;

    t.classList.add('show');

    setTimeout(() => t.classList.remove('show'), 2200);

}

function cartCount() {

    return JSON.parse(localStorage.getItem('cart') || '[]')
        .reduce(
            (total, item) =>
                total + (Number(item.qty) || Number(item.quantity) || 1),
            0
        );

}

function addCart(id, options = {}) {

    const product = products.find(item => item.id === id);

    if (!product) {
        toast('Không tìm thấy sản phẩm để thêm vào giỏ.');
        return;
    }

    let cartItems;

    try {

        cartItems = JSON.parse(localStorage.getItem('cart') || '[]')
            .map(({ size, ...item }) =>
                item.selected === undefined
                    ? { ...item, selected: false }
                    : item
            );

    } catch (error) {

        toast('Không đọc được giỏ hàng đã lưu.');
        return;

    }

    const variant = getProductVariant(product, options.color);
    const color = variant.color;

    const existingItem = cartItems.find(
        item =>
            item.id === id
            && (item.color || '') === color
    );

    if (existingItem) {

        existingItem.qty =
            (Number(existingItem.qty) || Number(existingItem.quantity) || 1) + 1;

    } else {

        cartItems.push({
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            image: variant.image,
            qty: 1,
            color,
            selected: false
        });

    }

    try {

        localStorage.setItem('cart', JSON.stringify(cartItems));

    } catch (error) {

        toast('Không thể lưu sản phẩm vào giỏ hàng trên trình duyệt.');
        return;

    }

    document
        .querySelectorAll('#cartNumber')
        .forEach(element => element.textContent = cartCount());

    toast('Đã thêm vào giỏ hàng');

}

function toggleWish(id) {

    let w = JSON.parse(localStorage.getItem('wishlist') || '[]');

    w = w.includes(id)
        ? w.filter(x => x !== id)
        : [...w, id];

    localStorage.setItem('wishlist', JSON.stringify(w));

    toast(
        w.includes(id)
            ? 'Đã thêm vào yêu thích'
            : 'Đã bỏ khỏi yêu thích'
    );

}