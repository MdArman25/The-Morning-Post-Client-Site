import React, { useEffect, useState } from "react";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import useAxiosPublic from "../../../Hook/useAxiosPublic";
import Context from "../../../Hook/useContext";
import { loadStripe } from "@stripe/stripe-js";
import Swal from "sweetalert2";

interface DonationItem {
  id: number;
  amount: number;
  name: string;
  email: string;
  option: string;
}

interface DonationFormProps {
  setAmount: React.Dispatch<React.SetStateAction<number | null>>;
  clientSecret: string; // Prop for clientSecret
}

const DonationForm: React.FC<DonationFormProps> = ({ setAmount, clientSecret }) => {
 
  const stripe = useStripe();
  const elements = useElements();
  const { user } = Context();

  const AxiosPublic = useAxiosPublic();
  
  const [error, setError] = useState<string>("");
  const [transactionId, setTransactionId] = useState<number | string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const amount = form.amount.value;
    setAmount(amount)
    const name = (form.name as unknown as HTMLInputElement).value;
    const email = (form.email as unknown as HTMLInputElement).value;
    const option = (form.option as unknown as HTMLInputElement).value;

    const newDonation = {
      id: Date.now(),
      amount: parseFloat(amount),
    
      name,
      email,
      option,
    };

    console.log(newDonation);

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (card === null) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("payment error", error);
      setError(error.message);
    } else {
      console.log("payment method", paymentMethod);
      setError("");
    }

    // confirm payment
    // const {}= await stripe.confirmSofortPayment(clientSecret,paymentMethod)
    console.log(clientSecret);
    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            email: user?.email || "anonymous",
            name: user?.displayName || "anonymous",
          },
        },
      });

    if (confirmError) {
      console.log("confirm error");
    } else {
      console.log("payment intent", paymentIntent);
      if (paymentIntent.status === "succeeded") {
        console.log("transaction id", paymentIntent.id);
        setTransactionId(paymentIntent.id);

      
        console.log(newDonation);
        const res = await AxiosPublic.post("/donation", {newDonation,transactionId});
        console.log("payment saved", res);
        // refetch();
        if (res.data?.paymentResult?.insertedId) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Thank you for the taka paisa",
            showConfirmButton: false,
            timer: 1500,
          });
          // navigate("/dashboard/paymentHistory");
        }
      }
    }


    // AxiosPublic.post("/create-payment-intent", { price: amount }).then(
    //   (res) => {
    //     console.log(res.data.clientSecret);
    //     setClientSecret(res.data.clientSecret);
    //   }
    // );

    
  };

  return (
    <div className="col-span-2 p-5">
      <h1 className="text-center font-semibold text-xl"> Donate Here</h1>
      <form onSubmit={handleSubmit} className="card-body w-full">
        <div className="grid grid-cols-2 gap-3">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="name"
              className="input input-bordered"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="email"
              className="input input-bordered"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="form-control w-full max-h-full">
            <div className="label">
              <span className="label-text">Pick One</span>
            </div>
            <select name="option" className="select select-bordered">
              <option disabled selected>
                Pick one
              </option>
              <option>For flooding</option>
              <option>For Poor People</option>
            </select>
          </label>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Amount</span>
            </label>
            <input
              type="number"
              name="amount"
              placeholder="amount"
              className="input input-bordered w-full"
              required
            />
          </div>
        </div>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
        <div className="form-control mt-6">
          <button
            type="submit"
            className="btn bg-sky-400 hover:bg-sky-700 text-white"
            disabled={!stripe || !clientSecret}
          >
            Donate
          </button>
          <p className="text-red-600">{error}</p>
          {transactionId && (
            <p className="text-green-600">
              Your transaction id: {transactionId}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

const Donation = () => {
  const AxiosPublic = useAxiosPublic();
  const [clientSecret, setClientSecret] = useState<string>('')
  // const [donationList, setDonationList] = useState<DonationItem[]>([]);
;
  const [amount, setAmount] = useState<number | null>(null);
  // const { user } = Context();

  const stripePromise = loadStripe(
    "pk_test_51OEB62HYQBx9XJIje5mwCddGST209INYLsInEqWeE9a9R6l7ws0uOXRQMTKgdRGQllRnQBMKRMoq72ycLMm1j2Ov00Ys2cygN9"
  );

  useEffect(() => {
    // Fetch the client secret and amount from the server
    AxiosPublic
      .post("/create-payment-intent", { amount })
      .then((res) => {
        console.log(res.data.clientSecret);
        setClientSecret(res.data.clientSecret);
       // Set the amount received from the server
      })
      .catch((error) => {
        console.error("Error fetching client secret:", error);
      });
  }, [AxiosPublic, amount]);
  
  return (
    <div>
      {/* ... your existing code ... */}
      <Elements stripe={stripePromise}>
        <DonationForm clientSecret={clientSecret} setAmount ={setAmount} />
      </Elements>
      {/* ... your existing code ... */}
    </div>
  );
};

export default Donation;
