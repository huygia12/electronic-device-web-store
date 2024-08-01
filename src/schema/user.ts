import z from "zod";

const UserSchema = z
  .object({
    userName: z.string().min(1, { message: "String cannot be blank" }),
    avt: z.string().min(1, { message: "String cannot be blank" }),
    idBanned: z.boolean().default(false),
    phoneNumber: z.string().regex(new RegExp("^[0-9]+$")),
    email: z.string().email({ message: "Must be a valid email" }),
    passwd: z
      .string()
      .min(1, { message: "Must contain atleast 1 character" })
      .max(100, { message: "Must less than 100 characters" }),
  })
  .partial({ phoneNumber: true });

const LoginSchema = z.object({
  email: z.string().email({ message: "Email không đúng định dạng!" }),
  password: z.string().min(6, { message: "Mật khẩu chứa tối thiểu 6 kí tự!" }),
});

const SignupSchema = z.object({
  userName: z.string().min(1, { message: "Tên không được bỏ trống!" }),
  email: z.string().email({ message: "Email không đúng định dạng!" }),
  password: z.string().min(6, { message: "Mật khẩu chứa tối thiểu 6 kí tự!" }),
  retypePassword: z.string(),
});

type SignupForm = z.infer<typeof SignupSchema>;

type LoginForm = z.infer<typeof LoginSchema>;

export {
  UserSchema,
  LoginSchema,
  SignupSchema,
  type LoginForm,
  type SignupForm,
};
