import axios from "axios";
import { FormEvent, useEffect, useState } from "react";

type Courier = {
  available_collection_method: string[];
  available_for_cash_on_delivery: boolean;
  available_for_proof_of_delivery: boolean;
  available_for_instant_waybill_id: boolean;
  available_for_insurance: boolean;
  company: string;
  courier_name: string;
  courier_code: string;
  courier_service_name: string;
  courier_service_code: string;
  description: string;
  duration: string;
  shipment_duration_range: string;
  shipment_duration_unit: string;
  price: number;
  service_type: string;
  shipping_type: string;
  type: string;
};

type HistoryTracking = {
  note: string;
  service_type: string;
  status: string;
  updated_at: string;
};

export default function Biteship() {
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [selectedCourier, setSelectedCourier] = useState<Courier>();
  const [selectedCourierId, setSelectedCourierId] = useState<number>(0);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    courier: Courier
  ) => {
    setSelectedCourier(courier);
    setSelectedCourierId(Number(event.target.value));
  };

  async function getCouriersRate() {
    //TODO: should be requested from created custom endpoint in backend
    const response = await axios.post(
      "https://api.biteship.com/v1/rates/couriers",
      {
        origin_latitude: -6.3031123,
        origin_longitude: 106.7794934999,
        destination_latitude: -6.2441792,
        destination_longitude: 106.783529,
        couriers: "grab",
        items: [
          {
            name: "Shoes",
            description: "Black colored size 45",
            value: 2000000,
            length: 30,
            width: 15,
            height: 20,
            weight: 200,
            quantity: 2,
          },
        ],
      },
      {
        headers: {
          Authorization: import.meta.env.VITE_BITESHIP_KEY,
        },
      }
    );

    setCouriers(response.data.pricing);
  }

  useEffect(() => {
    getCouriersRate();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await axios.post(
      `https://api.biteship.com/v1/orders`,
      {
        shipper_contact_name: "Amir",
        shipper_contact_phone: "081277882932",
        shipper_contact_email: "biteship@test.com",
        shipper_organization: "Biteship Org Test",
        origin_contact_name: "Amir",
        origin_contact_phone: "081740781720",
        origin_address: "Plaza Senayan, Jalan Asia Afrik...",
        origin_note: "Deket pintu masuk STC",
        origin_coordinate: {
          latitude: -6.2253114,
          longitude: 106.7993735,
        },
        destination_contact_name: "John Doe",
        destination_contact_phone: "08170032123",
        destination_contact_email: "jon@test.com",
        destination_address: "Lebak Bulus MRT...",
        destination_coordinate: {
          latitude: -6.2253114,
          longitude: 106.7993735,
        },
        destination_note: "Near the gas station",
        courier_company: selectedCourier?.courier_code,
        courier_type: selectedCourier?.courier_service_code,
        courier_insurance: 500000,
        delivery_type: "now",
        order_note: "Please be careful",
        metadata: {},
        items: [
          {
            name: "Black L",
            description: "White Shirt",
            value: 165000,
            quantity: 1,
            height: 10,
            length: 10,
            weight: 200,
            width: 10,
          },
        ],
      },
      {
        headers: {
          Authorization: import.meta.env.VITE_BITESHIP_KEY,
        },
      }
    );
  }

  return (
    <>
      <>
        <h1>List Courier</h1>
        <form onSubmit={onSubmit}>
          {couriers?.map((courier, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <input
                id={String(index)}
                type="radio"
                name="courier"
                value={index}
                checked={selectedCourierId == index}
                onChange={(e) => handleChange(e, courier)}
              />
              <label htmlFor={String(index)} style={{ marginLeft: "10px" }}>
                {courier.courier_name} - {courier.courier_service_name} (Rp.
                {courier.price})
              </label>
            </div>
          ))}
          <button type="submit">submit</button>
        </form>
      </>
      <>
        <BiteshipTracking />
      </>
    </>
  );
}

function BiteshipTracking() {
  const [histories, setHistories] = useState<HistoryTracking[]>([]);

  async function getData() {
    const response = await axios.get(
      "https://api.biteship.com/v1/trackings/7DIsK1MAO8PYewZ8LaiLMMSZ",
      {
        headers: {
          Authorization: import.meta.env.VITE_BITESHIP_KEY,
        },
      }
    );

    setHistories(response.data.history);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {histories?.map((history) => (
        <div>
          Note :<h1>{history.note}</h1>
          Service Type :<h1>{history.service_type}</h1>
          Status :<h1>{history.status}</h1>
          Updated At :<h1>{history.updated_at}</h1>
        </div>
      ))}
    </>
  );
}
