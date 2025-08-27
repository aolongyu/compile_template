<template>
  <iframe
    ref="iframe"
    style="width: 100%; height: 100%"
    scrolling="no"
    title="Vue Demo"
    src="https://codepen.io/longyu_ao/embed/ZYbRjpg?default-tab=html&editable=false"
    frameborder="no"
    loading="lazy"
    allowtransparency="true"
    allowfullscreen="true"
  >
    See the Pen
    <a href="https://codepen.io/longyu_ao/pen/ZYbRjpg"> Vue Demo</a> by 敖龙宇
    (<a href="https://codepen.io/longyu_ao">@longyu_ao</a>) on
    <a href="https://codepen.io">CodePen</a>.
  </iframe>
</template>

<script>
import axios from "axios";

export default {
  name: "CodePenEditor",

  methods: {
    async getCodes(userName, penId) {
      const { data } = await axios.get(
        `http://localhost:8081/api/proxy/iframe-content?userName=${userName}&penId=${penId}`
      );
      return data;
    },
  },
};
</script>
