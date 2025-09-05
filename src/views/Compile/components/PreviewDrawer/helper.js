export const combineHtml = (html, css, js) => {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      /* 基础样式重置 */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #333;
      }
      
      /* 用户自定义样式 */
      ${css}
    </style>
  </head>
  <body>
    ${html}
    <script>
      ${js}
    </script>
  </body>
</html>`;
};
