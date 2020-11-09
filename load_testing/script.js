import http from 'k6/http';
import { check } from 'k6';
export let options = {
  discardResponseBodies: true,
  scenarios: {
    ramping: {
      executor: 'ramping-arrival-rate',
      startRate: 0,
      timeUnit: '1s',
      preAllocatedVUs: 100,
      maxVUs: 2000,
      stages: [
        { duration: '10m', target: 1000 },
      ],
    },
  },
};

export default function () {
  var id = 9000000 + Math.floor(Math.random() * 1000000);
  var data = { host_name: 'Bert', cohost_name: 'Jane' };
  var headers = { 'Content-Type': 'application/json' };
  var res = http.put(`http://localhost:3006/hostinfo/${id}`, JSON.stringify(data), {
    tags: { name: 'PostsItemURL' }, headers
  });
  check(res, { 'status was 200': (r) => r.status == 200 });
}




// export default function () {
//   var id = 9000000 + Math.floor(Math.random() * 1000000);
//   var res = http.get(`http://localhost:3006/hostinfo/${id}`, {
//     tags: { name: 'PostsItemURL' },
//   });
//   check(res, { 'status was 200': (r) => r.status == 200 });
// }

// constant_request_rate: {
    //   executor: 'constant-arrival-rate',
    //   rate: 1000,
    //   timeUnit: '1s',
    //   duration: '2m',
    //   preAllocatedVUs: 100,
    //   maxVUs: 10000,
    // },