import Vue from 'vue';
import docs from '@/Result/README.md';
import Result from '@/Result';
import '@/Result/style';
import Button from '@/Button';
import '@/Button/style';
import Icon from '@/Icon';
import '@/Icon/style';
import Divider from '@/Divider';
import '@/Divider/style';
import { CheckboxCircleFilled } from '~/icons/index';
import Card from '@/Card';
import '@/Card/style';

export default {
  title: 'Components|FeedBack/Result',
  parameters: {
    component: Result,
    options: {
      showPanel: true,
    },
    notes: { markdown: docs }
  },
};

export const basic = () => Vue.extend({
  render() {
    return (
      <div>
        <Result></Result>
        <Result></Result>
      </div>
    );
  },
});

export const title = () => Vue.extend({
  render() {
    return (
      <Result title="暂无数据">
      </Result>
    );
  }
});

export const subtitle = () => Vue.extend({
  render() {
    return (
      <Result title="暂无数据" subTitle="刷新试试"></Result>
    );
  }
});

export const extraSlot = () => Vue.extend({
  render() {
    return (
      <div>
        <Card>
          <Result>
            <template slot="extra">
              <Button round inline>设置网络</Button>
              <Button type="primary" round inline>点击重试</Button>
            </template>
          </Result>
        </Card>
        <Card>
          <Result>
            <template slot="extra">
              <Button round>设置网络</Button>
              <Button type="primary" round>点击重试</Button>
            </template>
          </Result>
        </Card>
      </div>
    );
  }
});

export const status = () => Vue.extend({
  render() {
    return (
      <div>
        <Result status="network-broken" title="无网络" style="padding: 10px;">
          <template slot="extra">
            <Button round inline>设置网络</Button>
            <Button type="primary" round inline>点击重试</Button>
          </template>
        </Result>
        <Divider></Divider>
        <Result status="no-message" title="无消息" style="padding: 10px;">
        </Result>
        <Divider></Divider>
        <Result status="not-queried" title="未搜索到相关内容" style="padding: 10px;">
        </Result>
        <Divider></Divider>
        <Result status="success" title="预约成功，订单待支付" subTitle="请在就诊当日支付" style="padding: 10px;">
          <template slot="extra">
            <Button round inline>首页</Button>
            <Button type="primary" round inline>查看订单</Button>
          </template>
        </Result>
      </div>
    );
  },
});

export const iconSlot = () => Vue.extend({
  render() {
    return (
      <Result status="success" title="预约成功，订单待支付" subTitle="请在就诊当日支付">
        <Icon slot="icon" type={CheckboxCircleFilled} color="#36b365"></Icon>
      </Result>
    );
  }
});
