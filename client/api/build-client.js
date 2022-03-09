import axios from 'axios';

 const buildClient = ({ req }) => {
   if (typeof window === 'undefined') {
    console.log('Server here!');
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local', 
      headers: req.headers
    });
  }
  // browser
  else {
    console.log('Client here!');
    return axios.create({
      baseURL: '/', 
    });
  }
}

export default buildClient;