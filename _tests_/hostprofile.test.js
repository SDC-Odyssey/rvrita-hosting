import 'jsdom-global/register';
require("regenerator-runtime");
import iconv from 'iconv-lite';
import encodings from 'iconv-lite/encodings';
iconv.encodings = encodings;

import React from 'react';
import HostInfo from '../client/src/components/HostInfo';
import HostTitle from '../client/src/components/HostTitle';
import HostVerify from '../client/src/components/HostVerify';
import HostIcons from '../client/src/components/HostListIcons';
import CoHost from '../client/src/components/CoHost';
import SuperHost from '../client/src/components/SuperHost';
import SvgSecurity from '../client/src/components/SvgSecurity';
import ReadMoreReact from 'read-more-react';
import { configure, shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import renderer, { act } from 'react-test-renderer';
let { hostInfo, coHostPic } = require('./data/hostInfoData');

configure({
  adapter: new EnzymeAdapter(),
  disableLifecycleMethods: true
});

describe("Test Host Profile component: ", () => {

  it("Initial Check", (done) => {
    const wrapper = shallow(<HostInfo />);
    expect(wrapper.exists()).toBe(true);
    done();
  });


  it("Initial Test for Host Profile lifecycle method: ", (done) => {
    const wrapper = shallow(<HostInfo />);
    const spy = jest.spyOn(HostInfo.prototype, 'componentDidMount');
    wrapper.instance().componentDidMount();
    expect(spy).toHaveBeenCalled();
    done();
  });

  // it("Check whether the getReviewCount function is executed correctly", (done) => {
  //   const spy = jest.spyOn(HostInfo.prototype, 'getReviewCount');
  //   const component = renderer.create(<HostInfo />).getInstance();
  //   component.getReviewCount(1);
  //   expect(spy).toBeCalled();
  //   done();
  // });

  it("Check whether the state is updated correctly", (done) => {
    const component = renderer.create(<HostInfo />);
    const instance = component.getInstance();
    const instance1 = component.root;
    // expect(instance.state.reviewCount).toBe(0);
    instance.setState({
      // reviewCount: 123,
      hostInfo: hostInfo
    });
    // expect(instance.state.reviewCount).toBe(123);
    expect(instance1.findByProps({ className: 'security-txt' }).children[0]).toContain('To protect your payment, never transfer money or communicate outside of the Airbnb website or app.');
    done();
  });

  it("Check whether the <HostInfo> component has the expected child components after state update: ", (done) => {
    const wrapper = shallow(<HostInfo />);
    wrapper.setState({ hostInfo: hostInfo });
    // console.log( wrapper.debug() );
    wrapper.update();
    expect(wrapper.find(HostTitle).length).toBe(1);
    expect(wrapper.find(HostVerify).length).toBe(1);
    expect(wrapper.find(HostIcons).length).toBe(1);
    expect(wrapper.find(ReadMoreReact).length).toBe(2);
    expect(wrapper.find(CoHost).length).toBe(1);
    expect(wrapper.find(SuperHost).length).toBe(1);
    done();
  });

  it("Check whether the superHostText has initial state value", (done) => {
    const component = renderer.create(<HostInfo />).getInstance();
    expect(component.state.superHostText).toBe('Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.');
    done();
  });

});


describe("Test Host Profile sub-components: ", () => {

  it("Check whether the <HostTitle> component has title element", (done) => {
    const component = renderer.create(<HostTitle hostInfo={hostInfo} />);
    let instance = component.root;
    expect(instance.findAllByType('img').length).toBe(1);
    expect(instance.findByProps({ className: 'host-title' }).children[0]).toContain(['Hosted by ']);
    expect(instance.findByProps({ className: 'host-title' }).children[1]).toContain(['Rudy']);
    done();
  });

  it("Check whether the <HostTitle> component has only one image element", (done) => {
    const component = renderer.create(<HostTitle hostInfo={hostInfo} />);
    let instance = component.root;
    expect(instance.findAllByType('img').length).toBe(1);
    done();
  });

  it("Check whether the <HostListIcons> component has 3 image elements", (done) => {
    const component = renderer.create(<HostIcons hostInfo={hostInfo} />);
    let instance = component.root;
    let instance1 = component.toJSON();
    expect(instance.findAllByType('img').length).toBe(0); // changed to svg
    done();
  });

  it("Check whether the <CoHost> component retrieves image src from s3", (done) => {
    const component = renderer.create(<CoHost hostInfo={hostInfo} coHostPic={coHostPic} />);
    let instance = component.root;
    let instance1 = component.toJSON();
    expect(instance.findAllByType('img').length).toBe(1);
    console.log(instance1.children[0].children[1])
    expect(instance1.children[0].children[1].props.src).toEqual('https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjE2NjUwNn0');
    done();
  });

  it("Check the innerText in <CoHost> component", (done) => {
    const wrapper = shallow(<CoHost hostInfo={hostInfo} />);
    expect(wrapper.text()).toEqual('Co-hosts');
    done();
  });

  it("Check whether the SvgSecurity has the correct element", (done) => {
    const component = renderer.create(<SvgSecurity />);
    let instance = component.toJSON();
    expect(instance.type).toEqual('svg');
    done();
  });

});