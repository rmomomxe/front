import { type FC, useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "../axiosInstanse";
import type { Lot } from "../pages/LotsPage";

export type LotFormValues = {
  lotName: string;
  customerCode: string;
  price: number;
  currencyCode: string;
  ndsRate: string;
  placeDelivery: string;
  dateDelivery: string; // ISO string
};

const lotSchema = yup.object({
  lotName: yup.string().required("Название лота обязательно"),
  customerCode: yup.string().required("Код клиента обязателен"),
  price: yup
    .number()
    .typeError("Цена должна быть числом")
    .positive("Цена должна быть положительной")
    .required("Цена обязательна"),
  currencyCode: yup.string().required("Валюта обязательна"),
  ndsRate: yup.string().required("Ставка НДС обязательна"),
  placeDelivery: yup.string().required("Место доставки обязательно"),
  dateDelivery: yup.string().required("Дата доставки обязательна"),
});

const ndsOptions = ["Без НДС", "18%", "20%"];
const currencyOptions = ["RUB", "USD", "EUR"];

type LotModalProps = {
  initialValues?: LotFormValues | null;
  onModalSubmit: (data: LotFormValues) => void;
  onClose: () => void;
};

export const LotModal: FC<LotModalProps> = ({
  initialValues,
  onModalSubmit,
  onClose,
}) => {
  const [existingCodes, setExistingCodes] = useState<string[]>([]);
  const [openCustomerDropdown, setOpenCustomerDropdown] =
    useState<boolean>(false);
  const [openNdsDropdown, setOpenNdsDropdown] = useState<boolean>(false);
  const [openCurrencyDropdown, setOpenCurrencyDropdown] =
    useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LotFormValues>({
    resolver: yupResolver(lotSchema),
  });

  const customerCodeValue = watch("customerCode");
  const ndsRateValue = watch("ndsRate");
  const currencyCodeValue = watch("currencyCode");

  const fetchAllCustomers = async () => {
    try {
      const response = await api.get<Lot[]>("/api/customers");
      const codes = response.data.map((customer) => customer.customerCode);
      setExistingCodes(codes);
    } catch (error) {
      console.error("Ошибка при получении клиентов:", error);
    }
  };

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    } else {
      reset({
        lotName: "",
        customerCode: "",
        price: 0,
        currencyCode: currencyOptions[0],
        ndsRate: ndsOptions[0],
        placeDelivery: "",
        dateDelivery: "",
      });
    }
  }, [initialValues, reset]);

  const onSubmit: SubmitHandler<LotFormValues> = (data) => {
    onModalSubmit(data);
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
        <input {...register("lotName")} placeholder="Название лота" />
        {errors.lotName && <p>{errors.lotName.message}</p>}

        {/* Customer code dropdown */}
        <div className="relative">
          <div
            onClick={() => {
              fetchAllCustomers();
              setOpenCustomerDropdown((prev) => !prev);
            }}
            className="cursor-pointer rounded-[16px] border p-[12px] text-sm shadow-sm hover:bg-gray-50"
          >
            Основной код: {customerCodeValue || "Не выбран"}
          </div>
          {openCustomerDropdown && (
            <div className="absolute z-50 mt-[5px] max-h-[200px] w-full overflow-y-auto rounded border border-black/30 bg-white shadow-md">
              {existingCodes.map((code) => (
                <div
                  key={code}
                  onClick={() => {
                    setValue("customerCode", code, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                    setOpenCustomerDropdown(false);
                  }}
                  className="cursor-pointer px-3 py-2 hover:bg-blue-100"
                >
                  {code}
                </div>
              ))}
            </div>
          )}
        </div>
        {errors.customerCode && <p>{errors.customerCode.message}</p>}

        <input
          type="number"
          step="0.01"
          {...register("price")}
          placeholder="Цена"
        />
        {errors.price && <p>{errors.price.message}</p>}

        {/* CurrencyCode dropdown */}
        <div className="relative">
          <div
            onClick={() => setOpenCurrencyDropdown((prev) => !prev)}
            className="cursor-pointer rounded-[16px] border p-[12px] text-sm shadow-sm hover:bg-gray-50"
          >
            Валюта: {currencyCodeValue || "Не выбрана"}
          </div>
          {openCurrencyDropdown && (
            <div className="absolute z-50 mt-[5px] max-h-[150px] w-full overflow-y-auto rounded border border-black/30 bg-white shadow-md">
              {currencyOptions.map((currency) => (
                <div
                  key={currency}
                  onClick={() => {
                    setValue("currencyCode", currency, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                    setOpenCurrencyDropdown(false);
                  }}
                  className="cursor-pointer px-3 py-2 hover:bg-blue-100"
                >
                  {currency}
                </div>
              ))}
            </div>
          )}
        </div>
        {errors.currencyCode && <p>{errors.currencyCode.message}</p>}

        {/* NdsRate dropdown */}
        <div className="relative">
          <div
            onClick={() => setOpenNdsDropdown((prev) => !prev)}
            className="cursor-pointer rounded-[16px] border p-[12px] text-sm shadow-sm hover:bg-gray-50"
          >
            Ставка НДС: {ndsRateValue || "Не выбрана"}
          </div>
          {openNdsDropdown && (
            <div className="absolute z-50 mt-[5px] max-h-[150px] w-full overflow-y-auto rounded border border-black/30 bg-white shadow-md">
              {ndsOptions.map((rate) => (
                <div
                  key={rate}
                  onClick={() => {
                    setValue("ndsRate", rate, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                    setOpenNdsDropdown(false);
                  }}
                  className="cursor-pointer px-3 py-2 hover:bg-blue-100"
                >
                  {rate}
                </div>
              ))}
            </div>
          )}
        </div>
        {errors.ndsRate && <p>{errors.ndsRate.message}</p>}

        <input {...register("placeDelivery")} placeholder="Место доставки" />
        {errors.placeDelivery && <p>{errors.placeDelivery.message}</p>}

        <input
          type="datetime-local"
          {...register("dateDelivery")}
          placeholder="Дата доставки"
        />
        {errors.dateDelivery && <p>{errors.dateDelivery.message}</p>}

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
