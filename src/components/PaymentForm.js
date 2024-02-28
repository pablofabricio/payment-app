import { loadMercadoPago } from "@mercadopago/sdk-js";

    const publicKey = process.env.REACT_APP_PUBLIC_KEY;
    const email = process.env.REACT_APP_EMAIL;
    const password = process.env.REACT_APP_PASSWORD;
    const paymentApiUrl = process.env.REACT_APP_PAYMENT_API;

    export async function loginAndGetJWT() {
        
        const response = await fetch(paymentApiUrl + 'auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if (!response.ok) {
            throw new Error('Failed to login');
        }

        const data = await response.json();

        return data.access_token;
    }

    export async function submitFormData(formData, token) {
        const response = await fetch(paymentApiUrl + 'payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Failed to submit form data');
        }

        const responseData = await response.json();
        return responseData;
    }

    async function initializationMercadopago() {
        await loadMercadoPago();
        
        const mp = new window.MercadoPago(publicKey);
    
        const bricksBuilder = mp.bricks();
    
        const renderCardPaymentBrick = async (bricksBuilder) => {
            const settings = {
                initialization: {
                    amount: 100,
                },
                callbacks: {
                    onReady: () => {},
                    onSubmit: (formData) => {
                        return loginAndGetJWT().then(token => {
                            return submitFormData(formData, token);
                        });
                    },
                    onError: (error) => {
                        console.error(error);
                    },
                },
            };
    
            window.cardPaymentBrickController = await bricksBuilder.create(
                'cardPayment',
                'cardPaymentBrick_container',
                settings,
            );  
        }

        renderCardPaymentBrick(bricksBuilder);
   };

   initializationMercadopago()

const PaymentForm = () => {
    return (        
        <div id="cardPaymentBrick_container"></div>
    );
}

export default PaymentForm;
