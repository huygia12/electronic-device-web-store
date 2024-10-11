import { FC, HTMLAttributes } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useCurrentUser from "@/hooks/use-current-user";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { ShippingFormProps } from "@/utils/schema";
import { District, Province, Ward } from "@/types/api";

interface ShippingInputsProps extends HTMLAttributes<HTMLDivElement> {
  register: UseFormRegister<ShippingFormProps>;
  errors: FieldErrors<ShippingFormProps>;
  provinces: Province[];
  districts: District[];
  wards: Ward[];
  handleProvinceChange: (value: string) => void;
  handleDistrictChange: (value: string) => void;
  handleWardChange: (value: string) => void;
  selectedProvince: string;
  selectedDistrict: string;
  selectedWard: string;
}

const ShippingInputs: FC<ShippingInputsProps> = ({ ...props }) => {
  const { currentUser } = useCurrentUser();

  return (
    <section className="grid grid-cols-3 gap-4 col-span-3 border-2 border-slate-2 rounded-md p-4">
      <h1 className="text-2xl font-semibold col-span-3">THÔNG TIN GIAO HÀNG</h1>
      {/** ACCOUNT NAME */}
      <div className="space-y-1">
        <Label htmlFor="name" className="text-lg">
          Họ và tên
        </Label>
        <Input
          id="name"
          type="text"
          disabled={true}
          value={currentUser?.userName}
          placeholder="abc"
          className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
        />
      </div>
      {/** ACCOUNT EMAIL */}
      <div className="space-y-1">
        <Label htmlFor="name" className="text-lg  ">
          Email
          <span className="text-red-600 ">*</span>
        </Label>
        <Input
          {...props.register("email")}
          id="name"
          type="text"
          placeholder="abc@gmail.com"
          className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
        />
        {props.errors.email && (
          <div className="text-red-600">{props.errors.email.message}</div>
        )}
      </div>
      {/** ACCOUNT PHONE NUMBER */}
      <div className="space-y-1">
        <Label htmlFor="name" className="text-lg  ">
          Số điện thoại
          <span className="text-red-600 ">*</span>
        </Label>
        <Input
          {...props.register("phoneNumber")}
          id="name"
          type="text"
          placeholder="+84"
          className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
        />
        {props.errors.phoneNumber && (
          <div className="text-red-600">{props.errors.phoneNumber.message}</div>
        )}
      </div>
      {/** PROVINCE */}
      <div className="space-y-1">
        <Label htmlFor="category" className="text-lg  ">
          Tỉnh/Thành phố
          <span className="text-red-600 ">*</span>
        </Label>
        <Select onValueChange={(value) => props.handleProvinceChange(value)}>
          <SelectTrigger
            value={props.selectedProvince}
            {...props.register("province")}
            className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
          >
            <SelectValue id="category" className="p-0" />
          </SelectTrigger>
          <SelectContent>
            {props.provinces.map((province, index) => {
              return (
                <SelectItem
                  key={index}
                  value={province.ProvinceID + ""}
                  className="max-w-[30rem] truncate"
                >
                  {province.ProvinceName}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {props.errors.province && (
          <div className="text-red-600">{props.errors.province.message}</div>
        )}
      </div>
      {/** DISTRICT */}
      <div className="space-y-1">
        <Label htmlFor="category" className="text-lg  ">
          Quận/Huyện
          <span className="text-red-600 ">*</span>
        </Label>
        <Select onValueChange={(value) => props.handleDistrictChange(value)}>
          <SelectTrigger
            value={props.selectedDistrict}
            {...props.register("district")}
            className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
          >
            <SelectValue id="category" className="p-0" />
          </SelectTrigger>
          <SelectContent>
            {props.districts.map((district, index) => {
              return (
                <SelectItem
                  key={index}
                  value={district.DistrictID + ""}
                  className="max-w-[30rem] truncate"
                >
                  {district.DistrictName}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {props.errors.district && (
          <div className="text-red-600">{props.errors.district.message}</div>
        )}
      </div>
      {/** WARD */}
      <div className="space-y-1">
        <Label htmlFor="category" className="text-lg  ">
          Phường/Xã
          <span className="text-red-600 ">*</span>
        </Label>
        <Select onValueChange={(value) => props.handleWardChange(value)}>
          <SelectTrigger
            value={props.selectedWard}
            {...props.register("ward")}
            className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
          >
            <SelectValue id="category" className="p-0" />
          </SelectTrigger>
          <SelectContent>
            {props.wards.map((ward, index) => {
              return (
                <SelectItem
                  key={index}
                  value={ward.WardCode}
                  className="max-w-[30rem] truncate"
                >
                  {ward.WardName}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {props.errors.ward && (
          <div className="text-red-600">{props.errors.ward.message}</div>
        )}
      </div>
      {/** DETAIL ADDRESS */}
      <div className="col-span-3 space-y-1">
        <Label htmlFor="name" className="text-lg  ">
          Địa chỉ cụ thể
        </Label>
        <Input
          {...props.register("detailAddress")}
          id="name"
          type="text"
          className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
        />
        {props.errors.detailAddress && (
          <div className="text-red-600">
            {props.errors.detailAddress.message}
          </div>
        )}
      </div>
      {/** NOTION */}
      <div className="col-span-3 space-y-1">
        <Label htmlFor="desc" className="text-lg">
          Ghi chú đơn hàng
        </Label>
        <Textarea
          {...props.register("note")}
          id="desc"
          className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
        />
      </div>
    </section>
  );
};

export default ShippingInputs;
