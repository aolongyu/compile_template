import Vue from "vue";
import { v4 } from "uuid";
import { compile as vueTemplateCompile } from "vue-template-compiler";
import { Message } from "element-ui";

export const LogStatus = {
  success: "success",
  danger: "danger",
};

export class ComponentRender {
  scopedId = "";
  vueText = "";
  originStructure = {
    template: "",
    script: "",
    style: "",
  };
  vueStructure = {
    template: "",
    script: "",
    style: "",
  };
  logCallback = () => {};
  containerRef = null;
  componentInstance = null;

  constructor(containerRef, logCallback) {
    this.containerRef = containerRef;
    this.logCallback = logCallback || (() => {});

    this.logCallback(
      { status: { status: LogStatus.success, done: false }, done: false },
      "创建渲染器",
      this.containerRef.outerHTML
    );

    this.scopedId = `data-v-${v4().slice(0, 8)}`;
    this.logCallback(
      { status: { status: LogStatus.success, done: false }, done: false },
      "生成scoped标识",
      this.scopedId
    );
  }

  get text() {
    return this.vueText;
  }

  get structure() {
    return this.vueStructure;
  }

  render(vueText, { props = {}, events = {} } = {}) {
    this.logCallback(
      { status: LogStatus.success, done: false },
      "开始渲染",
      this.scopedId
    );

    this.vueText = vueText;
    this.logCallback(
      { status: LogStatus.success, done: false },
      "获取原始字符",
      this.vueText
    );

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
      this.logCallback(
        { status: LogStatus.success, done: false },
        "创建组件构造器",
        ComponentConstructor.toString()
      );

      // 8. 实例化组件
      this.componentInstance = new ComponentConstructor({
        propsData: {
          ...props,
        },
      });
      this.logCallback(
        { status: LogStatus.success, done: false },
        "实例化组件",
        JSON.stringify(this.componentInstance.$options)
      );
      this.logCallback(
        { status: LogStatus.success, done: false },
        "挂载props",
        JSON.stringify(props)
      );

      // 9. 挂载事件
      for (let key in events) {
        this.componentInstance.$on(key, events[key]);
      }
      this.logCallback(
        { status: LogStatus.success, done: false },
        "挂载事件",
        JSON.stringify(Object.keys(events))
      );

      // 10. 挂载到容器
      this.componentInstance.$mount(this.containerRef);
      this.logCallback(
        { status: LogStatus.success, done: false },
        "挂载到容器",
        this.containerRef.innerHTML
      );
      this.logCallback(
        { status: LogStatus.success, done: true },
        "渲染完成",
        "前往【渲染预览】查看效果"
      );
    } catch (error) {
      Message.error(error);
      this.logCallback(
        { status: LogStatus.danger, done: true },
        "出错了，渲染失败",
        error
      );
      throw new Error(error);
    }
  }

  /**
   * 销毁已有实例
   */
  destroy() {
    this.logCallback(
      { status: LogStatus.success, done: false },
      "销毁已有实例",
      this.componentInstance?.$options.name || "无实例"
    );

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

    const template = getMatch(this.vueText, /<template>([\s\S]*?)<\/template>/);
    this.logCallback(
      { status: LogStatus.success, done: false },
      "拆分template",
      template
    );
    const script = getMatch(this.vueText, /<script>([\s\S]*?)<\/script>/);
    this.logCallback(
      { status: LogStatus.success, done: false },
      "拆分script",
      script
    );
    const style = getMatch(this.vueText, /<style>([\s\S]*?)<\/style>/);
    this.logCallback(
      { status: LogStatus.success, done: false },
      "拆分style",
      style
    );

    Object.assign(this.originStructure, {
      template,
      script,
      style,
    });

    Object.assign(this.vueStructure, {
      template,
      script,
      style,
    });
  }

  /**
   * 模版安全防卫
   */
  sanitizeTemplate() {
    const { template } = this.vueStructure;

    // 1. 危险标签
    const dangerTags = ["script", "iframe", "svg", "canvas", "video", "audio"];
    this.logCallback(
      { status: LogStatus.success, done: false },
      "检测template模版标签安全",
      `目标标签：${JSON.stringify(dangerTags)}`,
      `模版内容：${template}`
    );
    dangerTags.forEach((tag) => {
      const regexp = new RegExp(`<\/?${tag}[^>]*>`, "gi");
      if (regexp.test(template)) {
        throw new Error(`禁止使用${tag}标签`);
      }
    });

    // 2. 危险指令v-html
    this.logCallback(
      { status: LogStatus.success, done: false },
      "检测template模版指令安全",
      "目标指令：[v-html]",
      `模版内容：${template}`
    );
    if (/v-html=/.test(template)) {
      throw new Error(`禁止使用v-html指令`);
    }

    // 3. 危险事件
    this.logCallback(
      { status: LogStatus.success, done: false },
      "检测template模版事件安全",
      "[]"
    );
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
      const result = vueTemplateCompile(template);
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

      this.logCallback(
        { status: LogStatus.success, done: false },
        "解析template内容",
        "生成render函数",
        `render函数：${renderFunction.toString()}`
      );
      this.logCallback(
        { status: LogStatus.success, done: false },
        "解析template内容",
        "生成staticRenderFns函数",
        `staticRenderFns函数：${staticRenderFns.map((fn) => fn.toString())}`
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
    this.logCallback(
      { status: LogStatus.success, done: false },
      "解析script内容",
      `script内容：${this.vueStructure.script}`
    );
    try {
      const { script } = this.vueStructure;
      const optionStr = script.replace(/^export(\s)+default/, "");
      const getOption = new Function(`return ${optionStr}`);
      const option = getOption();
      if (option.data && typeof option.data !== "function") {
        option.data = () => option.data;
      }
      this.logCallback(
        { status: LogStatus.success, done: false },
        "解析script内容",
        `option：${JSON.stringify(option)}`
      );
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
      this.logCallback(
        { status: LogStatus.success, done: false },
        "template注入scopedId",
        `原：${template}`,
        `现：${this.vueStructure.template}`
      );
      // 2. style样式属性注入
      this.vueStructure.style = withStyle(style, this.scopedId);
      this.logCallback(
        { status: LogStatus.success, done: false },
        "style注入scopedId",
        `原：${style}`,
        `现：${this.vueStructure.style}`
      );
    } catch (error) {
      throw new Error(error);
    }
  }
}
