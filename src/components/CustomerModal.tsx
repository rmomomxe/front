/* eslint-disable @typescript-eslint/no-unused-vars */
import { type FC, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { type Customer } from "../pages/CustomersPage";
import { api } from "../axiosInstanse";

export type CustomerFormValues = {
  customerCode: string;
  customerName: string;
  customerInn: string;
  customerKpp: string;
  customerLegalAddress: string;
  customerPostalAddress: string;
  customerEmail: string;
  customerCodeMain?: string | null;
  isOrganization: boolean;
};

const customerSchema = yup.object({
  customerCode: yup.string().required("Код обязателен"),
  customerName: yup.string().required("Название обязательно"),
  customerInn: yup.string().required("ИНН обязателен"),
  customerKpp: yup.string().required("КПП обязателен"),
  customerLegalAddress: yup.string().required("Юр. адрес обязателен"),
  customerPostalAddress: yup.string().required("Почтовый адрес обязателен"),
  customerEmail: yup
    .string()
    .email("Неверный email")
    .required("Email обязателен"),
  isOrganization: yup.boolean().required(),
});

type CustomerModalProps = {
  initialValues?: Customer | null;
  onModalSubmit: (data: CustomerFormValues) => void;
  onClose: () => void;
};

export const CustomerModal: FC<CustomerModalProps> = ({
  initialValues,
  onModalSubmit,
  onClose,
}) => {
  const [existingCodes, setExistingCodes] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  const fetchAllCustomers = async () => {
    try {
      const response = await api.get<Customer[]>("/api/customers");
      const codes = response.data.map((customer) => customer.customerCode);
      setExistingCodes(codes);
    } catch (error) {
      console.error("Ошибка при получении клиентов:", error);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormValues>({
    resolver: yupResolver(customerSchema),
  });

  useEffect(() => {
    if (initialValues) {
      const {
        customerId,
        isPerson, // не нужен в форме
        customerCodeMain,
        ...formData
      } = initialValues;
      reset({ ...formData, customerCodeMain: customerCodeMain ?? null });
      setSelectedCode(customerCodeMain ?? null);
    } else {
      reset({
        customerCodeMain: null,
        isOrganization: true,
      });
      setSelectedCode(null);
    }
  }, [initialValues, reset]);

  const onSubmit: SubmitHandler<CustomerFormValues> = (data) => {
    const formDataWithCode = {
      ...data,
      customerCodeMain: selectedCode ?? null,
    };
    onModalSubmit(formDataWithCode);
  };

  return (
    <div className="relative w-[500px] rounded-[12px] border border-black/70 bg-white p-6 shadow-lg">
      <button
        onClick={onClose}
        className="absolute top-2 right-4 text-xl font-bold"
      >
        ✕
      </button>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        <input {...register("customerCode")} placeholder="Код" />
        {errors.customerCode && <p>{errors.customerCode.message}</p>}

        <input {...register("customerName")} placeholder="Название" />
        {errors.customerName && <p>{errors.customerName.message}</p>}

        <input {...register("customerInn")} placeholder="ИНН" />
        {errors.customerInn && <p>{errors.customerInn.message}</p>}

        <input {...register("customerKpp")} placeholder="КПП" />
        {errors.customerKpp && <p>{errors.customerKpp.message}</p>}

        <input
          {...register("customerLegalAddress")}
          placeholder="Юридический адрес"
        />
        {errors.customerLegalAddress && (
          <p>{errors.customerLegalAddress.message}</p>
        )}

        <input
          {...register("customerPostalAddress")}
          placeholder="Почтовый адрес"
        />
        {errors.customerPostalAddress && (
          <p>{errors.customerPostalAddress.message}</p>
        )}

        <input {...register("customerEmail")} placeholder="Email" />
        {errors.customerEmail && <p>{errors.customerEmail.message}</p>}

        <div className="relative">
          <div
            onClick={() => {
              fetchAllCustomers();
              setOpenDropdown((prev) => !prev);
            }}
            className="cursor-pointer rounded-[16px] border p-[12px] text-sm shadow-sm hover:bg-gray-50"
          >
            Основной код (опц.): {selectedCode ?? "Не выбран"}
          </div>
          {openDropdown && (
            <div className="absolute z-50 mt-[5px] max-h-[200px] w-full overflow-y-auto rounded border border-black/30 bg-white shadow-md">
              {existingCodes.map((code) => (
                <div
                  key={code}
                  onClick={() => {
                    setSelectedCode(code);
                    setOpenDropdown(false);
                  }}
                  className="cursor-pointer px-3 py-2 hover:bg-blue-100"
                >
                  {code}
                </div>
              ))}
            </div>
          )}
        </div>

        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("isOrganization")} />
          Юр. лицо
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isSubmitting ? "Сохранение..." : "Сохранить"}
        </button>
      </form>
    </div>
  );
};
