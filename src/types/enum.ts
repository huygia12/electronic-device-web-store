enum Role {
  ADMIN = "ADMIN",
  CLIENT = "CLIENT",
}

enum InvoiceStatus {
  NEW = "NEW",
  SHIPPING = "SHIPPING",
  DONE = "SHIPPINNG",
  ABORT = "ABORT",
}

enum PaymentMethod {
  COD = "COD",
  BANKING = "BANKING",
}

enum Sort {
  ASC = "ascending",
  DES = "decending",
  ATOZ = "atoz",
  ZTOA = "ztoa",
}

enum SchemaResponse {
  REQUIRED = "Không được bỏ trống!",
  INVALID = "Không hợp lệ!",
  IMAGE_FILE_INVALID = "Chỉ có thể chọn file ảnh!",
  IMAGE_FILE_OVER_FLOW = "File ảnh phải dưới 5MB!",
  AT_LEAST_ONE_IMAGE = "Chưa chọn ảnh nào!",
  MUST_BETWEEN_0_AND_100 = "Chỉ có thể trong khoảng 0-100!",
  AT_LEAST_ONE_PRODUCT = "Phải nhập ít nhất 1 sản phẩm!",
  EMAIL_INVALID = "Email không đúng định dạng!",
  PASSWORD_INVALID = "Mật khẩu chứa tối thiểu 6 kí tự!",
  PHONE_INVALID = "SDT không hợp lệ!",
  RATING_INVALID = "Vui lòng chọn số sao đánh giá!",
}

export { Role, InvoiceStatus, PaymentMethod, Sort, SchemaResponse };
