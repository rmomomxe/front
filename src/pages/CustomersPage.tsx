import { useEffect, useState } from "react";
import { api } from "../axiosInstanse";
import { CustomerModal } from "../components/CustomerModal";
import type { CustomerFormValues } from "../components/CustomerModal";
export type Customer = {
  customerId: number;
  customerCode: string;
  customerName: string;
  customerInn: string;
  customerKpp: string;
  customerLegalAddress: string;
  customerPostalAddress: string;
  customerEmail: string;
  customerCodeMain: string | null;
  isOrganization: boolean;
  isPerson: boolean;
};

export const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const fetchCustomers = () => {
    api
      .get<Customer[]>("/api/customers")
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const deleteCustomer = async (id: number) => {
    try {
      await api.delete(`/api/customers/${id}`);
      setCustomers((prev) =>
        prev.filter((customer) => customer.customerId !== id),
      );
    } catch (error) {
      console.log("Ошибка при удалении:", error);
    }
  };

  const onModalSubmit = async (data: CustomerFormValues) => {
    try {
      if (data.customerCodeMain === "" || data.customerCodeMain === null) {
        delete data.customerCodeMain;
      }

      if (editingCustomer) {
        await api.put(`/api/customers/${editingCustomer.customerId}`, data);
      } else {
        console.log(data);
        await api.post("/api/customers", data);
      }

      await fetchCustomers();
      setModalOpen(false);
    } catch (error) {
      console.error("Ошибка при сохранении клиента:", error);
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-[15px] p-[60px]">
      <table>
        <thead>
          <tr>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2">Code</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Inn</th>
            <th className="px-4 py-2">Kpp</th>
            <th className="px-4 py-2">Legal Address</th>
            <th className="px-4 py-2">Postal Address</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">CodeMain</th>
            <th className="px-4 py-2">Вид лица</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr className="border-b-[1px] border-black/50">
              <td className="px-4 py-2">
                <button
                  onClick={() => {
                    deleteCustomer(customer.customerId);
                  }}
                  className="rounded-[5px] border-[1px] border-black/50 p-[5px]"
                >
                  d
                </button>
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => {
                    setEditingCustomer(customer);
                    setModalOpen(true);
                  }}
                  className="rounded-[5px] border-[1px] border-black/50 p-[5px]"
                >
                  e
                </button>
              </td>
              <td className="px-4 py-2">{customer.customerCode}</td>
              <td className="px-4 py-2">{customer.customerName}</td>
              <td className="px-4 py-2">{customer.customerInn}</td>
              <td className="px-4 py-2">{customer.customerKpp}</td>
              <td className="px-4 py-2">{customer.customerLegalAddress}</td>
              <td className="px-4 py-2">{customer.customerPostalAddress}</td>
              <td className="px-4 py-2">{customer.customerEmail}</td>
              <td className="px-4 py-2">{customer.customerCodeMain}</td>
              <td className="px-4 py-2">
                {customer.isOrganization ? "organization" : "person"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => {
          setEditingCustomer(null);
          setModalOpen(true);
        }}
      >
        ДОБАВИТЬ КЛИЕНТА
      </button>

      {modalOpen && (
        <div className="absolute top-0 flex h-[100vh] w-[100vw] items-center justify-center bg-black/50">
          <CustomerModal
            initialValues={editingCustomer}
            onClose={() => setModalOpen(false)}
            onModalSubmit={onModalSubmit}
          />
        </div>
      )}
    </div>
  );
};
