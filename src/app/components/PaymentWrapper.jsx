"use client";
import { useState } from "react";
import { Box, Button, TextField, Typography, Divider } from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

function RegistrationPayment({ ticketAmount, handlePaymentComplete }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    // Create a payment intent on the server
    const response = await fetch("/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: ticketAmount }),
    });
    const { clientSecret } = await response.json();

    if (!clientSecret) {
      alert("Failed to initialize payment");
      setIsProcessing(false);
      return;
    }

    // Confirm the payment with the clientSecret
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });
    if (error) {
      alert(error.message);
    } else if (paymentIntent.status === "succeeded") {
      alert("Payment successful!");
      handlePaymentComplete(true);
    }
    setIsProcessing(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handlePayment}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        p: 3,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: 400,
        margin: "0 auto",
      }}
    >
      <Typography variant="h6" color="primary" textAlign="center" gutterBottom>
        Stripe Payment
      </Typography>

      <Typography variant="body2" textAlign="center" color="textSecondary">
        Complete your payment of <strong>${ticketAmount}</strong> securely with
        Stripe.
      </Typography>

      <Divider sx={{ width: "100%", my: 2 }} />

      <Box sx={{ width: '100%', mt: 2, mb: 2 }}>
        <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      </Box>

      

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!stripe || isProcessing}
        sx={{ width: "100%", mt: 2 }}
      >
        {isProcessing ? 'Processing...' : `Pay $${ticketAmount}`}
      </Button>
    </Box>
  );
}

export default function PaymentWrapper({ ticketAmount, handlePaymentComplete }) {
    return (
      <Elements stripe={stripePromise}>
        <RegistrationPayment ticketAmount={ticketAmount} handlePaymentComplete = {handlePaymentComplete} />
      </Elements>
    );
  }
