import React from 'react';
import SvgSuperHost from './SvgSuperHost';
import moment from 'moment';

const HostTitle = ({ hostInfo, hostPic }) => {
  return (
    <div>
      {hostInfo.host_has_profile_pic && hostInfo.host_is_superHost ?
        <div>
          <img className="host-img" src={hostPic} height="90px" width="90px" alt="host-img"></img>
          <SvgSuperHost />
        </div>
        : (!hostInfo.host_has_profile_pic && hostInfo.host_is_superHost) ?
          <div>
            <img className="host-img" src={hostPic} width="90px" alt="host-img"></img>
            <SvgSuperHost />
          </div>
          : hostInfo.host_has_profile_pic ?
            <div>
              <img className="host-img" src={hostPic} height="90px" width="90px" alt="host-img"></img>
            </div>
            : !hostInfo.host_has_profile_pic ?
              <div>
                <img className="host-img" src={hostPic} height="90px" width="90px" alt="host-img"></img>
              </div>
              : null}

      <span className="host-title">Hosted by {hostInfo.host_name}</span>
      {hostInfo.host_languages &&
        <div>
          <span className="title-time">Joined in {moment(hostInfo.createdAt).format("MMM YYYY")}</span>
        </div>
       }
    </div>
  )
};

export default HostTitle;