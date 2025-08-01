import Vue from "vue";
import { v4 } from "uuid";
import { compile as vueTemplateComplie } from "vue-template-compiler";
import { Message } from "element-ui";

export class ComponentRender {
  scopedId = "";
  vueText = "";
  vueStructure = {
    template: "",
    script: "",
    style: "",
  };
  containerRef = null;
  componentInstance = null;

  constructor(containerRef) {
    this.containerRef = containerRef;
    this.scopedId = `data-v-${v4().slice(0, 8)}`;
  }

  get instance() {
    return this.componentInstance;
  }

  render(vueText, { props = {}, events = {} } = {}) {
    this.vueText = vueText;

    try {
      // 1. 销毁原有实例
      this.destroy();

      // 2. 拆分结构
      this.splitStructure();

      // 3. template安全防卫
      this.sanitizeTemplate();

      // 6. 注入scoped标识
      this.withScopedStyle();

      // 4. 编译template
      const parsedTemplate = this.parseTemplate();

      // 5. 解析script
      const parsedScript = this.parseScript();

      // 7. 创建组件构造器
      const ComponentConstructor = Vue.extend({
        ...parsedScript,
        render: parsedTemplate.render,
        staticRenderFns: parsedTemplate.staticRenderFns,
      });

      // 8. 实例化组件
      this.componentInstance = new ComponentConstructor({
        propsData: {
          ...props,
        },
      });

      // 9. 挂载事件
      for (let key in events) {
        this.componentInstance.$on(key, events[key]);
      }

      // 10. 挂载到容器
      this.componentInstance.$mount(this.containerRef);
    } catch (error) {
      Message.error(error);
      throw new Error(error);
    }
  }

  /**
   * 销毁已有实例
   */
  destroy() {
    if (!this.componentInstance) {
      return;
    }
    this.componentInstance.$destroy();
    this.containerRef.innerHTML = "";
  }

  /**
   * 拆分结构
   */
  splitStructure() {
    const getMatch = (text, reg) => {
      const match = text.match(reg);
      return match ? match[1].trim() : "";
    };

    Object.assign(this.vueStructure, {
      template: getMatch(this.vueText, /<template>([\s\S]*?)<\/template>/),
      script: getMatch(this.vueText, /<script>([\s\S]*?)<\/script>/),
      style: getMatch(this.vueText, /<style>([\s\S]*?)<\/style>/),
    });
    debugger
  }

  /**
   * 模版安全防卫
   */
  sanitizeTemplate() {
    const { template } = this.vueStructure;

    // 1. 危险标签
    ["script", "iframe", "svg", "canvas", "video", "audio"].forEach((tag) => {
      const regexp = new RegExp(`<\/?${tag}[^>]*>`, "gi");
      if (regexp.test(template)) {
        throw new Error(`禁止使用${tag}标签`);
      }
    });

    // 2. 危险指令v-html
    if (/v-html=/.test(template)) {
      throw new Error(`禁止使用v-html指令`);
    }

    // 3. 危险事件
    // 当前没有危险事件
    [].forEach((name) => {
      const regexp = new RegExp(`@(${name})`, "gi");
      if (regexp.test(template)) {
        throw new Error(`禁止使用${name}事件`);
      }
    });
  }

  /**
   * 解析template内容
   */
  parseTemplate() {
    try {
      const { template } = this.vueStructure;
      const result = vueTemplateComplie(template);
      if (result.errors.length > 0) {
        throw new Error(
          result.errors
            .map((error, index) => `${index + 1}. ${error}`)
            .join("\n")
        );
      }

      // 将render字符串转换为函数
      const renderFunction = new Function("_c", "_v", "_s", result.render);
      const staticRenderFns = result.staticRenderFns.map(
        (fn) => new Function("_c", "_v", "_s", fn)
      );

      return {
        render: renderFunction,
        staticRenderFns: staticRenderFns,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * 解析script内容
   */
  parseScript() {
    try {
      const { script } = this.vueStructure;
      const optionStr = script.replace(/^export(\s)+default/, "");
      const getOption = new Function(`return ${optionStr}`);
      const option = getOption();
      if (option.data && typeof option.data !== "function") {
        option.data = () => option.data;
      }
      return option;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * 注入style内容
   */
  withScopedStyle() {
    try {
      const withTemplate = (template, id) => {
        const parser = new DOMParser();
        const html = parser.parseFromString(template, "text/html");
        const el = html.body.firstChild;
        el.setAttribute(id, "");
        return el.outerHTML;
      };
      const withStyle = (style, id) => {
        const scopedStyle = `[${id}]{${style}}`;
        const styleElement = document.createElement("style");
        styleElement.type = "text/css";
        styleElement.textContent = scopedStyle;
        document.head.appendChild(styleElement);
        return scopedStyle;
      };

      const { template, style } = this.vueStructure;

      // 1. template attribute 注入
      this.vueStructure.template = withTemplate(template, this.scopedId);
      // 2. style样式属性注入
      this.vueStructure.style = withStyle(style, this.scopedId);
    } catch (error) {
      throw new Error(error);
    }
  }
}
