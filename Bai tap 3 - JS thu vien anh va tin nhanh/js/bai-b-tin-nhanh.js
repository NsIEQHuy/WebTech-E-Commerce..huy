/* BÀI B — VIẾT CODE: Lọc tin và đăng tin nhanh (news.html)
   Viết code theo đặc tả.
   Không sửa news.html, không sửa css; chỉ viết JavaScript trong file này. */

// ---------- ĐÃ CHO SẴN (không sửa) ----------
// Chặn việc gửi form tìm kiếm khi nhấn Enter, để trang không bị tải lại.
document.querySelector("#searchbar form").addEventListener("submit", (e) => e.preventDefault());

// ---------- PHẦN BẠN VIẾT ----------

const oTimKiem = document.getElementById("o-tim-kiem");
const dsTin = document.getElementById("list");
const boDem = document.getElementById("bo-dem");
const khongThay = document.getElementById("khong-thay");
const oTieuDe = document.getElementById("tin-tieu-de");
const oNoiDung = document.getElementById("tin-noi-dung");
const nutDang = document.getElementById("nut-dang");
const baoLoi = document.getElementById("bao-loi");

const CHU_MO = "Read more >>";
const CHU_DONG = "Thu gọn <<";

// F1. Bộ đếm "Đang hiển thị x/y tin" trong #bo-dem.
function capNhatBoDem() {
	const tatCa = dsTin.querySelectorAll("li");
	let soHien = 0;
	for (const li of tatCa) {
		if (!li.classList.contains("an")) {
			soHien++;
		}
	}
	boDem.textContent = `Đang hiển thị ${soHien}/${tatCa.length} tin`;
}

// F2 + F3. Lọc tin khi gõ vào #o-tim-kiem (sự kiện keyup) và thông báo #khong-thay.
function khopTuKhoa(li, tuKhoa) {
	const tieuDe = li.querySelector("h3").textContent.toLowerCase();
	const noiDung = li.querySelector("p").textContent.toLowerCase();
	return tieuDe.includes(tuKhoa) || noiDung.includes(tuKhoa);
}

function locTin() {
	const tuKhoa = oTimKiem.value;
	const tuKhoaThuong = tuKhoa.toLowerCase();
	let soKhop = 0;

	for (const li of dsTin.querySelectorAll("li")) {
		// Từ khoá rỗng: "".includes("") luôn true → hiện tất cả.
		if (khopTuKhoa(li, tuKhoaThuong)) {
			li.classList.remove("an");
			soKhop++;
		} else {
			li.classList.add("an");
		}
	}

	if (soKhop === 0) {
		// textContent: từ khoá hiện nguyên văn, không bị diễn giải thành thẻ HTML.
		khongThay.textContent = `Không tìm thấy tin nào cho "${tuKhoa}"`;
		khongThay.classList.remove("an");
	} else {
		khongThay.textContent = "";
		khongThay.classList.add("an");
	}

	capNhatBoDem();
}

oTimKiem.addEventListener("keyup", locTin);

// F4. Nút "Read more >>" / "Thu gọn <<" — MỘT trình lắng nghe đặt trên #list.
dsTin.addEventListener("click", (e) => {
	const nut = e.target.closest("button.more");
	if (nut === null || !dsTin.contains(nut)) {
		return; // bấm vào tiêu đề, đoạn văn, khoảng trống: bỏ qua
	}
	const doan = nut.closest("li").querySelector("p");
	const daMo = doan.classList.toggle("day-du");
	nut.textContent = daMo ? CHU_DONG : CHU_MO;
});

// F5. Nút #nut-dang: kiểm tra dữ liệu, tạo <li> mới, chèn vào đầu #list.
function taoPhanTu(the, noiDung, lop) {
	const pt = document.createElement(the);
	if (lop) {
		pt.className = lop;
	}
	pt.textContent = noiDung; // luôn dùng textContent để hiện nguyên văn
	return pt;
}

nutDang.addEventListener("click", () => {
	const tieuDe = oTieuDe.value;
	const noiDung = oNoiDung.value;

	if (tieuDe.trim() === "" || noiDung.trim() === "") {
		baoLoi.textContent = "Vui lòng nhập đủ tiêu đề và nội dung.";
		return;
	}

	const li = document.createElement("li");
	const nut = taoPhanTu("button", CHU_MO, "more");
	nut.type = "button";
	li.append(
		taoPhanTu("span", homNay(), "time"),
		taoPhanTu("h3", tieuDe),
		taoPhanTu("p", noiDung),
		nut
	);
	dsTin.prepend(li);

	oTieuDe.value = "";
	oNoiDung.value = "";
	baoLoi.textContent = "";

	// Áp lại bộ lọc đang gõ (tin mới không khớp sẽ bị ẩn ngay) và cập nhật bộ đếm.
	locTin();
});

// Bộ đếm đúng ngay khi tải trang.
locTin();
