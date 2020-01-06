import docs from '../README.md';
import Vue from 'vue';
import Lazyload from '..';
import Skeleton from '../../Skeleton';
import List from '../../List';
import Grid from '../../Grid';
import Result from '../../Result';
import Button from '../../Button';

export default {
  title: 'Components|Utils/Lazyload',
  parameters: {
    component: Lazyload,
    notes: { markdown: docs }
  },
};

const GreatList = Vue.extend({
  data() {
    return {
      list: [{
        text: '解放院区',
        minorText: '浙江杭州市解放路88号',
        img: 'http://photocdn.sohu.com/20161221/vrsa_hor9271114.jpg'
      }, {
        text: '滨江院区',
        minorText: '浙江杭州市滨江区江虹路1511号',
        img: 'http://photocdn.sohu.com/20161221/vrsa_hor9271114.jpg'
      }, {
        text: '国际医学中心',
        minorText: '浙江杭州市滨江区江虹路1511号',
        img: 'http://photocdn.sohu.com/20161221/vrsa_hor9271114.jpg'
      }],
    };
  },
  render() {
    return (
      <List>
        {
          this.list.map((item) => {
            return (
              <List.Item button text={item.text} minorText={item.minorText}>
                <img slot="thumb" style="object-fit: contain; width: 120px;" src={item.img} />
              </List.Item>
            );
          })
        }
      </List>
    );
  },
});

const GreatListSkeleton = Vue.extend({
  render() {
    return (
      <div>
        {
          new Array(3).fill('').map(() => {
            return (
              <Skeleton title rows={2} style="box-sizing: border-box; height: 120px; width: 100%; padding: 15px">
                <Skeleton style="width: 120px; height: 90px;" slot="left"></Skeleton>
                <Grid slot="content" style="height: 72px;" column x="left" y="center">
                  <Skeleton row rowWidth="30%"></Skeleton>
                  <Skeleton row rowWidth="70%"></Skeleton>
                </Grid>
              </Skeleton>
            );
          })
        }
      </div>
    );
  },
});

export const basic = () => Vue.extend({
  data() {
    return {
      src: 'http://sdfsdfsd'
    };
  },
  render() {
    return (
      <div>
        <Lazyload>
          <GreatList></GreatList>
          <GreatListSkeleton slot="placeholder"></GreatListSkeleton>
        </Lazyload>
        <Lazyload>
          <GreatList></GreatList>
          <GreatListSkeleton slot="placeholder"></GreatListSkeleton>
        </Lazyload>
        <Lazyload>
          <GreatList></GreatList>
          <GreatListSkeleton slot="placeholder"></GreatListSkeleton>
        </Lazyload>
        <Lazyload
          asyncComponent={() => import('./GreatCard')}
          scopedSlots={{
            error: ({ reload, error }) => {
              return (
                <div style="padding: 20px;">
                  <Result title={error?.message}>
                    <template slot="extra">
                      <Button type="primary"
                        round
                        inline
                        onClick={() => reload()}>
                        点击重试
                      </Button>
                    </template>
                  </Result>
                </div>
              );
            },
          }}>
          <div slot="placeholder">
            <Skeleton style="height: 37px;">
              <Skeleton shape="rect"></Skeleton>
            </Skeleton>
            <GreatListSkeleton style="padding: 12px;"></GreatListSkeleton>
          </div>
        </Lazyload>
        <Lazyload
          src={this.src}
          scopedSlots={{
            error: ({ reload }) => {
              return (
                <div style="height: 144px; width: 240px; background: #EEE; text-align: center; color: #333; font-size: 14px;"
                  onClick={() => {
                    this.src = 'http://via.placeholder.com/240x144/666666';
                    reload();
                  }}>
                  加载出错
                </div>
              );
            },
          }}>
          <Skeleton slot="placeholder" title rows={2} style="box-sizing: border-box; height: 144px; width: 240px; padding: 15px">
            <Skeleton shape="rect"></Skeleton>
          </Skeleton>
        </Lazyload>
      </div>
    );
  },
});
