import './App.css';
import PaymentForm from './components/PaymentForm';

const App = () => {
  return (
    <div>
      <script src="https://sdk.mercadopago.com/js/v2"></script>
      <PaymentForm />
    </div>
  );
}

export default App;
