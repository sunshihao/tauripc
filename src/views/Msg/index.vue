<template>
  <div style="height: 40px;width: 60px;">11122333</div>
</template>

<script setup>
// import { ref } from "vue";
// ...

// const flashTimer = ref(false);
// const flashTray = async (bool) => {
//   let flag = true;
//   if (bool) {
//     TrayIcon.getById("tray").then(async (res) => {
//       clearInterval(flashTimer.value);
//       flashTimer.value = setInterval(() => {
//         if (flag) {
//           res.setIcon(null);
//         } else {
//           // 支持把自定义图标放在默认icons文件夹，通过如下方式设置图标
//           // res.setIcon('icons/msg.png')
//           // 支持把自定义图标放在自定义文件夹tray，需要配置tauri.conf.json参数 "bundle": {"resources": ["tray"]}
//           res.setIcon("tray/msg.png");
//         }
//         flag = !flag;
//       }, 500);
//     });
//   } else {
//     clearInterval(flashTimer.value);
//     let tray = await TrayIcon.getById("tray");
//     tray.setIcon("icons/icon.png");
//   }
// };
</script>
