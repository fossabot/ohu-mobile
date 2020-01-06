import Icon from '..';
import docs from '../README.md';
import * as icons from '@/icons';
import { SVGIconDef } from '@/global';


export default {
  title: 'Components|Basic/Icon',
  parameters: {
    component: Icon,
    notes: {
      markdown: docs,
    },
  },
};
const filledIcons: SVGIconDef[] = [];

const outlinedIcons: SVGIconDef[] = [];

const target: Record<string, SVGIconDef> = icons;
Object.keys(target).map((name) => {
  const currentIcon = target[name];
  if (currentIcon.theme === 'filled') {
    filledIcons.push(currentIcon);
  } else if(currentIcon.theme === 'outlined') {
    outlinedIcons.push(currentIcon);
  }
});

export const outlined = () => ({
  render() {
    return (
      <div>
        <div style="font-size: 36px; display: flex; flex-flow: row wrap;">
          {
            outlinedIcons.map((name) => {
              return (
                <div style="box-sizing: border-box; padding: 10px; text-align: center; width: 25%;">
                  <Icon type={name}></Icon>
                  <div style="font-size: 14px; text-align: center;">{name.name}</div>
                </div>
              );
            })
          }
        </div>
        <p style="text-align: center; font-size: 18px;">共{outlinedIcons.length}个</p>
      </div>
    );
  },
});

export const filled = () => ({
  render() {
    return (
      <div>
        <div style="font-size: 36px; display: flex; flex-flow: row wrap;">
          {
            filledIcons.map((name) => {
              return (
                <div style="box-sizing: border-box; padding: 10px; text-align: center; width: 25%;">
                  <Icon type={name}></Icon>
                  <div style="font-size: 14px; text-align: center;">{name.name}</div>
                </div>
              );
            })
          }
        </div>
        <p style="text-align: center; font-size: 18px;">共{filledIcons.length}个</p>
      </div>
    );
  },
});

export const color = () => ({
  render() {
    return (
      <div style="font-size: 36px; display: flex; flex-flow: row wrap;">
        <div style="box-sizing: border-box; padding: 10px; text-align: center; width: 25%;">
          <Icon type="share" color="#2d7eff"></Icon>
        </div>
        <div style="box-sizing: border-box; padding: 10px; text-align: center; width: 25%;">
          <Icon type="close-circle-f" color="#999"></Icon>
        </div>
        <div style="box-sizing: border-box; padding: 10px; text-align: center; width: 25%;">
          <Icon type="star" color="#ff9434"></Icon>
        </div>
        <div style="box-sizing: border-box; padding: 10px; text-align: center; width: 25%;">
          <Icon type="question" color="#ff2d31"></Icon>
        </div>
      </div>
    );
  },
});

export const spin = () => ({
  render() {
    return (
      <div style="font-size: 36px; padding: 10px;">
        <Icon type="loader-f" spin color="#999"></Icon>
      </div>
    );
  },
});

export const rotate = () => ({
  render() {
    return (
      <div style="font-size: 36px; padding: 10px;">
        <Icon type="loader-tail" rotate={90}></Icon>
      </div>
    );
  }
});
