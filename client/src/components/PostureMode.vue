<template>
  <div>
    <div class="header">
      <h3>Posture Mode</h3>
      <div class="form-control row style">
        Set Timer
        <q-input
          dense
          dark
          outlined
          color="white"
          label-color="white"
        ></q-input>
        <q-btn label="Start" />
      </div>
      <q-btn
        @click="$router.push('/')"
        color="primary"
        label="Back To Main Menu"
      />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
