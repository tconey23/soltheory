import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 50, // virtual users
  duration: '30s',
};

export default function () {
  http.get('https://soltheory.com/avett');
  sleep(1);
}
