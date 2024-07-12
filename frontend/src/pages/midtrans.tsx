import { useEffect } from "react";
import axios from "axios";

interface MidtransSnap extends Window {
  snap : {
    pay : (token : string) => void
  }
} 


export default function MidtransPage() {
  useEffect(() => {
    // You can also change below url value to any script url you wish to load,
    // for example this is snap.js for Sandbox Env (Note: remove `.sandbox` from url if you want to use production version)
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";

    const scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;

    // Optional: set script attribute, for example snap.js have data-client-key attribute
    // (change the value according to your client-key)
    const myMidtransClientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  return (
    <button
      onClick={async () => {
        const response = await axios.post("http://localhost:3000/payment");
        const token = response.data.token;
        (window as unknown as MidtransSnap).snap.pay(token);
      }}
    >
      pay
    </button>
  );
}
