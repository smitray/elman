<template>
  <section class="container container--full container--wr container--ovh container--rel">
    <form @submit.prevent="authorize">
      <p class="error" v-if="formError">{{ formError }}</p>
      <input type="text" name v-model="username" placeholder="Your email or username" required>
      <input type="password" v-model="password" placeholder="Your password" required>
      <a href="#" @click.prevent="noAccount">Don't have an account?</a>
      <input type="submit" value="Login" class="btn-primary">
    </form>
    <p>User details: {{ $store.state.user.user }}</p>
    <RouterLink
      :to="{
        name: 'graph'
      }"
    >
      Graph
    </RouterLink>
    <p>File upload test</p>
    <input
      id="file"
      ref="file"
      type="file"
      name="file"
      @change="handleFileUpload"
    >
  </section>
</template>

<script>
export default {
  data: () => ({
    username: '',
    password: '',
    formError: null
  }),
  async mounted() {
    if (this.$store.state.user.token) {
      try {
        await this.$store.dispatch('user/USER_GET_DETAILS');
        if (this.$store.state.user.direction) {
          this.$router.push({
            name: this.$store.state.user.direction
          });
        }
      } catch (e) {
        this.formError = e.message;
      }
    }
  },
  methods: {
    async authorize() {
      try {
        await this.$store.dispatch('user/USER_LOGIN', {
          username: this.username,
          password: this.password
        });
        this.username = '';
        this.password = '';
        this.formError = null;
        if (this.$store.state.user.direction) {
          this.$router.push({
            name: this.$store.state.user.direction
          });
        }
      } catch (e) {
        this.formError = e.message;
      }
    },
    async handleFileUpload({
      target: {
        validity,
        files: [file]
      }
    }) {
      console.log(file);
    }
  }
};
</script>
