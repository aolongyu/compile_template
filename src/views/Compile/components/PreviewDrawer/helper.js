export const combineHtml = (html, css, js) => {
  return `
<!DOCTYPE html>
<html>
  <head>
    <style>
      ${css}
    </style>
  </head>
  <body>
    ${html}
  </body>
  <script>
    ${js}
  </script>
</html>`;
};
