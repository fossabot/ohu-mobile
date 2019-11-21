import DropMenu, { baseDropMenuItemName } from './DropMenu';
import { componentFactoryOf } from 'vue-tsx-support';
import props from 'vue-strict-prop';
import { DropMenuEvents, DropMenuItemOptions, DropMenuChangeEvent, DropMenuDataModel } from './types';
import { ArrowDownSOutlined, CheckOutlined } from '@/icons';
import Popup, { PopupOpenEvent } from '../Popup';
import Divider from '../Divider';
import { VNode, PropOptions } from 'vue';
import { IconProperty } from '@/global';
import { getIcon } from '../_utils/icon-utils';
import isPlainObject from '../_utils/isPlainObject';

const dropMenuItemOptionsCls = `${baseDropMenuItemName}-options`;
const dropMenuItemOptionCls = `${baseDropMenuItemName}-option`;
const dropMenuItemTextCls = `${baseDropMenuItemName}__text`;
const dropMenuItemIconCls = `${baseDropMenuItemName}__icon`;

type DropMenuType = InstanceType<typeof DropMenu>;
const defaultCheckedFunc = function (checkedOption?: DropMenuItemOptions, option?: DropMenuItemOptions) {
  if (checkedOption && !option) return true;
  if (checkedOption && option) {
    return checkedOption.value === option.value;
  }
  return false;
}

const DropMenuItem = componentFactoryOf<DropMenuEvents>().create({
  name: baseDropMenuItemName,
  props: {
    title: String,
    disabled: props(Boolean).default(false),
    options: props.ofType<DropMenuItemOptions[]>().default(() => []),
    checkIcon: props.ofType<IconProperty>().default(() => CheckOutlined),
    dropDownIcon: props.ofType<IconProperty>().default(() => ArrowDownSOutlined),
    checkedFunc: {
      type: Function,
      default: defaultCheckedFunc,
    } as PropOptions<typeof defaultCheckedFunc>,
  },
  computed: {
    icon() {
      return getIcon(this.$createElement, this.checkIcon);
    },
    icon2() {
      return getIcon(this.$createElement, this.dropDownIcon);
    },
  },
  data() {
    return {
      popupVisible: false,
      zIndex: 1,
    };
  },
  methods: {
    getCheckedOption() {
      let checkedOption: DropMenuItemOptions | undefined = undefined;
      const key = this.getKey();
      const index = this.getIndex();
      const checkedValue = this.getCheckedValue();
      if (this.options.length > 0) {
        this.options.some((option) => {
          if (option.value === checkedValue) {
            checkedOption = Object.assign({
              key,
              index,
            }, option);
            return true;
          }
          return false;
        });
      } else {
        checkedOption = this.getParent().selectedOptions[key || index];
      }
      return checkedOption;
    },
    getParent() {
      return this.$parent as DropMenuType;
    },
    getIndex() {
      return this.getParent().getMenuItemIndex(this);
    },
    getKey() {
      return this.$vnode.key;
    },
    getCheckedValue() {
      const { currentValue } = this.getParent();
      const key = this.$vnode.key;
      if (currentValue instanceof Array) {
        return currentValue[this.getIndex()];
      } else if (isPlainObject<DropMenuDataModel>(currentValue) && key) {
        return currentValue[key];
      }
    },
    close() {
      if (this.popupVisible) {
        this.popupVisible = false;
      }
    },
    handleVisibleChange(visible: boolean) {
      this.popupVisible = visible;
    },
    handleClick() {
      if (this.disabled) return;
      const currentVisible = this.popupVisible;
      this.getParent().closeAllPopup();
      this.popupVisible = !currentVisible;
    },
    handleOptionClick(event: DropMenuChangeEvent) {
      if (event.disabled) return;
      this.getParent().triggerChange(event);
    },
    handlePopupOpen({ documentZIndex }: PopupOpenEvent) {
      this.getParent().zIndex = documentZIndex + 1;
    },
  },
  render() {
    const { $scopedSlots, title, options, disabled, icon, icon2 } = this;
    const { direction } = this.getParent();
    let popupContent;
    let checkedText = title;
    let hasCheckedOption = false;
    let key = this.getKey();
    let checkedOption = this.getCheckedOption();
    if ($scopedSlots.default) {
      popupContent = $scopedSlots.default({ checked: checkedOption });
      if (checkedOption) {
        hasCheckedOption = this.checkedFunc(checkedOption);
        if (checkedOption.label) {
          checkedText = checkedOption.label;
        }
      }
    } else {
      popupContent = options.reduce((result, option, index) => {
        const isCheck = this.checkedFunc(checkedOption, option);
        if (isCheck) {
          hasCheckedOption = true;
        }
        if (isCheck && option.label) {
          checkedText = option.label;
        }
        const optionCls = {
          [dropMenuItemOptionCls]: true,
          'is-active': isCheck,
          'is-disabled': !!option.disabled,
        };
        result.push(
          <div class={optionCls} onClick={() => this.handleOptionClick({
            index,
            key,
            ...option,
          })}>
            {option.label}
            { isCheck && icon }
          </div>
        );
        if (index < options.length - 1) {
          result.push(<Divider></Divider>)
        }
        return result;
      }, [] as VNode[]);
    }
    const dropMenuCls = {
      [baseDropMenuItemName]: true,
      'is-active': hasCheckedOption,
      'is-disabled': disabled,
    };
    const iconCls = {
      [dropMenuItemIconCls]: true,
      'is-up': direction === 'up' ? !this.popupVisible : this.popupVisible,
    };
    return (
      <div class={dropMenuCls}
        onClick={this.handleClick}
        ref="dropItem">
        <span class={dropMenuItemTextCls}>{checkedText}</span>
        <i class={iconCls}>
          { icon2 }
        </i>
        <Popup visible={this.popupVisible}
          targetClass={dropMenuItemOptionsCls}
          onOpen={this.handlePopupOpen}
          getContainer={() => {
            // todo: turn to use optional chain
            return this.$parent.$refs.dropMenu as HTMLElement;
          }}
          position={ direction === 'up' ? 'top' : 'bottom' }
          marginThreshold={0}
          // todo: turn to use optional chain
          anchor={() => this.$parent.$refs.dropMenu as HTMLElement}
          onVisibleChange={this.handleVisibleChange}
          animate={direction === 'up' ? 'scale-down' : 'scale-up'}
          partialMask={direction === 'up' ? 'top' : 'bottom'}>
          {popupContent}
        </Popup>
      </div>
    );
  },
});

export type DropMenuItemType = InstanceType<typeof DropMenuItem>;

export default DropMenuItem;