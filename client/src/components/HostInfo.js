import React from 'react';
import http from 'axios';
import ReadMoreReact from 'read-more-react';
import SvgSecurity from './SvgSecurity';
import HostListIcons from './HostListIcons';
import HostTitle from './HostTitle';
import CoHost from './CoHost';
import SuperHost from './SuperHost';
import HostVerify from './HostVerify';
import Contact from './Contact';

var serverUrl = 'http://localhost:3006';

class HostInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 1,
      hostInfo: {},
      superHostText: 'Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.',
      securityText: 'To protect your payment, never transfer money or communicate outside of the Airbnb website or app.',
      resTime: 'within an hour',
      reviewCount: 20,
      hostPic: 'http://placehold.it/200x200',
      coHostPic: 'http://placehold.it/200x200',
    }
    this.getHostInfoById = this.getHostInfoById.bind(this);
    // this.getReviewCount = this.getReviewCount.bind(this);
  }

  componentDidMount() {
    let queryString = window.location.search;
    if (!queryString.length) {
      let pathname = window.location.pathname.split('/').pop();
      if (pathname === undefined || pathname === 'blank' || pathname === false) {
        this.getHostInfoById(1);
        // this.getProfilePicture(1);
      } else {
        this.getHostInfoById(pathname);
        // this.getReviewCount(pathname);
        // this.getProfilePicture(pathname);
        this.setState({
          id: Number(pathname)
        });
      }
    } else {
      let queryStringRes = queryString.split('?').pop();
      this.getHostInfoById(queryStringRes);
      // this.getReviewCount(queryStringRes);
      // this.getProfilePicture(queryStringRes);
      this.setState({
        id: Number(queryStringRes)
      });
    }
  }

  // getReviewCount(id) {
  //   http.get('https://fec-gai-hostprofile.s3-us-west-1.amazonaws.com/json/reviews.json')
  //     .then(response => {
  //         let reviewCount = response.data.filter((ele, i, self) => {
  //           return ele.id === Number(id)
  //         });
  //         this.setState({
  //           reviewCount: reviewCount[0].review_count
  //         });
  //     })
  //     .catch(err => {
  //       console.log('Error receiving review counts from AWS s3: ');
  //     });
  // }

  // getProfilePicture(id) {
  //   http.get('https://fec-gai-hostprofile.s3-us-west-1.amazonaws.com/json/images.json')
  //     .then(response => {
  //         let pictures = response.data.filter((ele, i, self) => {
  //           return ele.room_id === Number(id)
  //         });
  //         this.setState({
  //           hostPic: pictures[0].host_image,
  //           coHostPic: pictures[0].reviewers[0],
  //         });
  //     })
  //     .catch(err => {
  //       console.log('Error receiving profile pictures from AWS s3: ');
  //     });
  // }

  getHostInfoById(id) {
    http.get(`${serverUrl}/hostInfo/${id}`)
      .then(response => {
        // console.log('Successfully able to get the host info by id: ', response.data);
        this.setState({
          hostInfo: response.data
        });
      })
      .catch(err => {
        console.log('Error receiving response from the server by hostId: ');
      });
  }

  render() {
    let { hostInfo, superHostText, securityText, resTime, reviewCount, coHostPic, hostPic } = this.state;
    return (
      <div>
      <hr></hr>
        {(hostInfo.host_languages) ?
          <div>
            <HostTitle hostInfo={hostInfo} hostPic={hostPic} />
            <div className="list row">
              <div className="col-left col-md-6">
                <HostListIcons hostInfo={hostInfo} reviewCount={reviewCount} />
                <ReadMoreReact text={hostInfo.host_about} readMoreText="...read more" />
                <br></br>
                <CoHost hostInfo={hostInfo} coHostPic={coHostPic} />
                <br></br>

                <div className="heading6">During your stay</div>
                <ReadMoreReact text={hostInfo.host_messages} min={100} max={200} readMoreText="...read more" />
                <br></br>

                <SuperHost hostInfo={hostInfo} superHostText={superHostText} />
              </div>

              <div className="col-right col-md-6">
                <HostVerify hostInfo={hostInfo} resTime={resTime} />
                <Contact />
                <SvgSecurity />
                <p className="security-txt">{securityText}</p>
              </div>
            </div>
          </div>
          : <p>Host profile loading...</p>}

      </div>
    )
  }

};

export default HostInfo;