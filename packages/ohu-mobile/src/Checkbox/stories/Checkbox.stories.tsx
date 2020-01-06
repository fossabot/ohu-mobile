import Vue from 'vue';
import Checkbox from '..';
import docs from '../README.md';
import { CheckboxBlankCircleOutlined, CheckboxCircleFilled, IndeterminateCircleFilled } from '@/icons';
import CheckboxGroup from '../../CheckboxGroup';
import Button from '../../Button';


export default {
  title: 'Components|Form/Checkbox',
  parameters: {
    component: Checkbox,
    notes: { markdown: docs }
  },
};

export const basic = () => Vue.extend({
  data() {
    return {
      value: ['apple', 'chestnut'],
    };
  },
  render() {
    return (
      <div>
        <CheckboxGroup v-model={this.value} name="fruit">
          <Checkbox value="apple" ref="apple">苹果（apple）</Checkbox>
          <Checkbox value="banana">香蕉（banana）</Checkbox>
          <Checkbox value="chestnut">栗子（chestnut）</Checkbox>
        </CheckboxGroup>
        <p>
          {JSON.stringify(this.value)}
        </p>
        <p style="text-align: center;">
          <Button type="primary" size="sm" inline onClick={() => {
            (this.$refs.apple as any).toggle();
          }}>toggle苹果</Button>
        </p>
      </div>
    );
  },
});

export const icon = () => Vue.extend({
  data() {
    return {
      c1: true,
    };
  },
  render() {
    return (
      <div>
        <Checkbox
          v-model={this.c1}
          checkedIcon={CheckboxCircleFilled}
          unCheckedIcon={CheckboxBlankCircleOutlined}
          indeterminateIcon={IndeterminateCircleFilled}>苹果</Checkbox>
      </div>
    );
  },
});

export const color = () => Vue.extend({
  data() {
    return {
      c1: true,
    };
  },
  render() {
    return (
      <div>
        <Checkbox v-model={this.c1} color="#36b365" unCheckedColor="#36b365">苹果</Checkbox>
      </div>
    );
  },
});

export const disabled = () => Vue.extend({
  render() {
    return (
      <div>
        <p>In CheckboxGroup</p>
        <CheckboxGroup value={['apple', 'banana']} name="fruit" disabled>
          <Checkbox value="apple">苹果（apple）</Checkbox>
          <Checkbox value="banana">香蕉（banana）</Checkbox>
          <Checkbox value="chestnut">栗子（chestnut）</Checkbox>
        </CheckboxGroup>
        <p>In Checkbox</p>
        <Checkbox value="hello" disabled>你好</Checkbox>
      </div>
    );
  },
});


export const groupOptions = () => Vue.extend({
  data() {
    return {
      f: ['apple'],
    };
  },
  render() {
    return (
      <div>
        <CheckboxGroup v-model={this.f} options={['apple', 'banana', 'chestnut']}>
        </CheckboxGroup>
      </div>
    );
  },
});


export const groupMax = () => Vue.extend({
  data() {
    return {
      f: ['apple'],
    };
  },
  render() {
    return (
      <div>
        <CheckboxGroup v-model={this.f} max={3} options={[
          { label: '🍎', value: 'apple' },
          { label: '🍌', value: 'banana' },
          { label: '🌰', value: 'chestnut' },
          { label: '🍊', value: 'orange' }
        ]}>
        </CheckboxGroup>
      </div>
    );
  },
});
