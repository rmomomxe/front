import { useEffect, useState } from "react";
import { api } from "../axiosInstanse";
import { LotModal, type LotFormValues } from "../components/LotModal";

export type Lot = {
  lotId: number;
  lotName: string;
  customerCode: string;
  price: number;
  currencyCode: string;
  ndsRate: string;
  placeDelivery: string;
  dateDelivery: string; // ISO string
};

export const LotsPage = () => {
  const [lots, setLots] = useState<Lot[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLot, setEditingLot] = useState<Lot | null>(null);

  const fetchLots = () => {
    api
      .get<Lot[]>("/api/lots")
      .then((res) => setLots(res.data))
      .catch((err) => console.error("Ошибка при загрузке лотов:", err));
  };

  useEffect(() => {
    fetchLots();
  }, []);

  const deleteLot = async (id: number) => {
    try {
      await api.delete(`/api/lots/${id}`);
      setLots((prev) => prev.filter((lot) => lot.lotId !== id));
    } catch (error) {
      console.error("Ошибка при удалении лота:", error);
    }
  };

  const onModalSubmit = async (data: LotFormValues) => {
    try {
      if (editingLot) {
        await api.put(`/api/lots/${editingLot.lotId}`, data);
      } else {
        console.log(data);
        await api.post("/api/lots", data);
      }

      await fetchLots();
      setModalOpen(false);
    } catch (error) {
      console.error("Ошибка при сохранении лота:", error);
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-[15px] p-[60px]">
      <table>
        <thead>
          <tr>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2">Название</th>
            <th className="px-4 py-2">Код клиента</th>
            <th className="px-4 py-2">Цена</th>
            <th className="px-4 py-2">Валюта</th>
            <th className="px-4 py-2">НДС</th>
            <th className="px-4 py-2">Место доставки</th>
            <th className="px-4 py-2">Дата доставки</th>
          </tr>
        </thead>
        <tbody>
          {lots.map((lot) => (
            <tr key={lot.lotId} className="border-b-[1px] border-black/50">
              <td className="px-4 py-2">
                <button
                  onClick={() => deleteLot(lot.lotId)}
                  className="rounded-[5px] border-[1px] border-black/50 p-[5px]"
                >
                  d
                </button>
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => {
                    setEditingLot(lot);
                    setModalOpen(true);
                  }}
                  className="rounded-[5px] border-[1px] border-black/50 p-[5px]"
                >
                  e
                </button>
              </td>
              <td className="px-4 py-2">{lot.lotName}</td>
              <td className="px-4 py-2">{lot.customerCode}</td>
              <td className="px-4 py-2">{lot.price}</td>
              <td className="px-4 py-2">{lot.currencyCode}</td>
              <td className="px-4 py-2">{lot.ndsRate}</td>
              <td className="px-4 py-2">{lot.placeDelivery}</td>
              <td className="px-4 py-2">
                {new Date(lot.dateDelivery).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={() => {
          setEditingLot(null);
          setModalOpen(true);
        }}
      >
        ДОБАВИТЬ ЛОТ
      </button>

      {modalOpen && (
        <div className="absolute top-0 flex h-[100vh] w-[100vw] items-center justify-center bg-black/50">
          <LotModal
            initialValues={editingLot}
            onClose={() => setModalOpen(false)}
            onModalSubmit={onModalSubmit}
          />
        </div>
      )}
    </div>
  );
};
