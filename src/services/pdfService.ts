import { Invoice } from "@/types/model";
import {
  applyDiscount,
  formatDateTime,
  getInvoicePaymentMethod,
  getInvoiceStatus,
} from "@/utils/helpers";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import RobotoFont from "../../public/Roboto_Regular.js";

const pdfService = {
  exportInvoice: (invoice: Invoice) => {
    const doc = new jsPDF();

    doc.addFileToVFS("Roboto-Regular.ttf", RobotoFont);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.setFont("Roboto");
    doc.setFontSize(18);
    doc.text("Thông tin hóa đơn", 10, 10);

    // Thêm thông tin hóa đơn
    const invoiceInfo = [
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

    let startY = 20;
    invoiceInfo.forEach(([key, value]) => {
      doc.setFontSize(12);
      doc.text(`${key}: ${value}`, 10, startY);
      startY += 6;
    });

    const productHeaders = [
      "STT",
      "Sản Phẩm",
      "Nhãn Hàng",
      "Phân Loại",
      "Số lượng",
      "Giảm Giá",
      "Thành Tiền",
    ];

    const productData = invoice.invoiceProducts.map((product, index) => [
      `${index + 1}`,
      product.productName,
      product.providerName,
      product.categoryName,
      `${product.quantity}`,
      product.discount ? `${product.discount}%` : "Không giảm giá",
      applyDiscount(product.price, product.discount).toLocaleString() + "đ",
    ]);

    autoTable(doc, {
      head: [productHeaders],
      body: productData,
      startY: startY + 10,
      styles: {
        font: "Roboto", // Sử dụng font "Roboto" đã thêm
        fontStyle: "normal", // Kiểu font
        fontSize: 12, // Kích thước font
      },
      headStyles: {
        font: "Roboto", // Áp dụng font cho header
        fontStyle: "bold",
      },
      bodyStyles: {
        font: "Roboto", // Áp dụng font cho body
        fontStyle: "normal",
      },
    });

    doc.save(`HoaDon_${invoice.invoiceID}.pdf`);
  },
};

export default pdfService;
