import PaymentForm from '../../components/PaymentForm'

export default function PayInvoicePage() {
  // You can customize these props or make them dynamic via query params or form
  const amount = 5000 // $50.00 in cents (example)
  const description = 'Invoice Payment for BV Studios'
  const metadata = { invoiceId: 'INV-001' }
  const email = '' // Optionally prefill or collect from user

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Pay Your Invoice</h1>
      <p className="mb-6 text-lg">Securely pay your invoice online using any major credit or debit card.</p>
      <div className="w-full max-w-lg">
        <PaymentForm amount={amount} description={description} metadata={metadata} email={email} />
      </div>
    </div>
  )
}