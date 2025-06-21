import { Invoice } from "@/types/model";
import * as XLSX from "xlsx";
import {
  applyDiscount,
  formatDateTime,
  getInvoicePaymentMethod,
  getInvoiceStatus,
} from "@/utils/helpers";

const excelService = {
  exportInvoice: (invoice: Invoice) => {
    const invoiceData = [
      ["Mã hóa đơn", invoice.invoiceID],
      ["Trạng thái", getInvoiceStatus(invoice.status)],
      ["Phương thức thanh toán", getInvoicePaymentMethod(invoice.payment)],
      [
        "Địa chỉ",
        `${invoice.detailAddress}, ${invoice.ward}, ${invoice.district}, ${invoice.province}`,
      ],
      ["SĐT", invoice.phoneNumber],
      ["Ngày đặt hàng", formatDateTime(`${invoice.createdAt}`)],
      ["Email", invoice.email],
      ["Tên đặt hàng", invoice.userName],
      ["Ghi chú", invoice.note],
      ["Phí vận chuyển", `${invoice.shippingFee.toLocaleString()}đ`],
    ];

    const productData = [
      [
        "STT",
        "Sản Phẩm",
        "Nhãn Hàng",
        "Phân Loại",
        "Số lượng",
        "Giảm Giá",
        "Thành Tiền",
      ],
      ...invoice.invoiceProducts.map((product, index) => [
        `${index + 1}`,
        product.productName,
        product.providerName,
        product.categoryName,
        `${product.quantity}`,
        product.discount ? `${product.discount}%` : "Không giảm giá",
        applyDiscount(product.price, product.discount).toLocaleString() + "đ",
      ]),
    ];

    // Tạo workbook và worksheet
    const ws1 = XLSX.utils.aoa_to_sheet(invoiceData);
    const ws2 = XLSX.utils.aoa_to_sheet(productData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, "Thông tin hóa đơn");
    XLSX.utils.book_append_sheet(wb, ws2, "Sản phẩm");

    // Xuất file Excel
    XLSX.writeFile(wb, `HoaDon_${invoice.invoiceID}.xlsx`);
  },
};

export default excelService;
