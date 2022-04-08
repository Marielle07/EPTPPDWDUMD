<template>
  <router-view v-slot="{ Component }">
    <transition name="slide">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
body {
  background-color: rgb(212, 209, 209);
}
* {
  font-family: "poppins", sans-serif;
}
h1,
h2,
h3,
h4,
h5 {
  margin: 0;
  font-weight: 700;
}
body {
  background-image: linear-gradient(
    to right,
    rgb(117, 170, 248),
    rgb(71, 142, 248)
  );
  height: 100vh;
  width: 100%;
  overflow: hidden;
}
</style>
