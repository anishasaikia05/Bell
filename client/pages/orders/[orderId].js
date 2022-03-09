import useRequest from "../../hooks/use-request";
import StripeCheckout from 'react-stripe-checkout';

const OrderShow = ({ order, currentUser }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: () => Router.push('/orders'),
  })

  return (
    <div>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51KWlXUSJj7IkyJ6dtzvFM3s4LZp9b8E3O2MJMc0wvznr4tpwPcqANOMNTsDfjQlviK49BtVi9r6wpSO2Cpp3HVfO00oXfuppuB"
        amount={order.price}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
}

export default OrderShow;