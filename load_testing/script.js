import http from 'k6/http';
import { check } from 'k6';
export let options = {
  discardResponseBodies: true,
  scenarios: {
    constant_request_rate: {
      executor: 'ramping-arrival-rate',
      startRate: 0,
      timeUnit: '1s',
      preAllocatedVUs: 100,
      maxVUs: 20000,
      stages: [
        { duration: '10m', target: 500 },
      ],
    },
    // constant_request_rate: {
    //   executor: 'constant-arrival-rate',
    //   rate: 1000,
    //   timeUnit: '1s',
    //   duration: '2m',
    //   preAllocatedVUs: 100,
    //   maxVUs: 10000,
    // },
  },
};

export default function () {
  var id = 9000000 + Math.floor(Math.random() * 1000000);
  var res = http.get(`http://localhost:3006/hostinfo/${id}`, {
    tags: { name: 'PostsItemURL' },
  });
  check(res, { 'status was 200': (r) => r.status == 200 });
}