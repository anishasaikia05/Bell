import Link from 'next/link';

const LandingPage = ({ currentUser, products }) => {
  console.log('Hi from the landing page');
  console.log('Products here:', products);
  let productList = [];
  if(products) {
    productList = products.map(product => {

    return (
      <article key={product.id}>
        <h3>{product.title}</h3>
        <h4>{product.price}</h4>
        {/* <img src={product.image.avatar} alt={product.title} /> */}
        <Link href="/products/[productId]" as={`/products/${product.id}`}>
          <a>View</a>
        </Link>
      </article>
    )});
  }

  return (
    <div className='container'>
      <div className='row'>
        <div className='col'>
          <p>Hello World!</p>
          <p>Hello World!</p>
          <p>Hello World!</p>
          <p>Hello World!</p>
          {productList}
        </div>
      </div>
    </div>
  );
}

LandingPage.getInitialProps = async (context, client, currentUser) => {
  console.log('Hello from index!');

  const { data } = await client.get('/api/products');
  console.log('Products from index here:', data);
  return { products: data };
}

export default LandingPage;