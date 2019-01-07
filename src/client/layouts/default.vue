<template>
  <div class="container container--full container--wr container--ovh container--rel">
    <my-header/>
    <nuxt/>
    <my-footer/>
  </div>
</template>

<script>
  import MyHeader from '~/components/header.vue';
  import MyFooter from '~/components/footer.vue';
  
  export default {
    components: {
      MyHeader,
      MyFooter
    }
  };
</script>
