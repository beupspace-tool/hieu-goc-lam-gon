# CLAUDE.md — Template Backoffice

## Project
- **Name**: [Tên doanh nghiệp] Operations
- **Description**: Quản lý vận hành, xử lý dữ liệu, và tự động hóa báo cáo
- **Owner**: [Tên / Team vận hành]

## Data Sources
- Doanh thu: [file/system nào]
- Khách hàng: [file/system nào]
- Chi phí: [file/system nào]
- Nhân sự: [file/system nào]

## File Structure
```
operations/
├── data/
│   ├── raw/           # Dữ liệu gốc (không sửa)
│   ├── cleaned/       # Dữ liệu đã xử lý
│   └── archive/       # Lưu trữ cũ
├── reports/
│   ├── weekly/        # Báo cáo tuần
│   ├── monthly/       # Báo cáo tháng
│   └── templates/     # Mẫu báo cáo
├── invoices/          # Hóa đơn
├── hr/                # Nhân sự
└── templates/         # Mẫu email, văn bản
```

## Conventions
- Data files: CSV hoặc Excel
- Report format: Markdown → export PDF
- File naming: YYYY-MM-DD-type-description
- Backup: copy raw/ trước khi xử lý
- Currency: VND, format 1.000.000

## Common Workflows

### Báo cáo tuần
1. Đọc dữ liệu tuần từ data/raw/
2. Dọn dẹp và chuẩn hóa
3. Tạo báo cáo theo template
4. Lưu vào reports/weekly/

### Xử lý hóa đơn
1. Đọc hóa đơn mới từ invoices/
2. Trích xuất thông tin: ngày, số tiền, nhà cung cấp
3. Cập nhật vào bảng tổng hợp
4. Đánh dấu đã xử lý

### Dọn dẹp dữ liệu khách hàng
1. Đọc contacts từ data/raw/
2. Loại trùng lặp (theo email)
3. Chuẩn hóa tên, SĐT, địa chỉ
4. Lưu vào data/cleaned/

## Important Rules
- KHÔNG bao giờ sửa file trong data/raw/ — luôn tạo bản mới
- Kiểm tra kết quả trước khi gửi báo cáo
- Bảo mật: không chia sẻ dữ liệu nhân sự ra ngoài team
