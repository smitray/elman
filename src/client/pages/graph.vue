<template>
  <section class="container">
    <ul :class="$style.testList">
      <li
        v-for="author in authors"
        :key="author._id"
        class="test"
      >
        {{ author.name }}
        <ul
          v-if="author.books.length"
          class="list-reset"
        >
          <li
            v-for="book in author.books"
            :key="book._id"
          >
            {{ author.name }}'s book - {{ book.name }}
          </li>
        </ul>
      </li>
    </ul>
    <div class="w-1/2">
      <form
        @submit.prevent="createAuthor"
      >
        <input
          v-model="author.name"
          type="text"
        >
        <input
          v-model="author.age"
          type="number"
        >
        <input
          type="submit"
          value="Add author"
        >
      </form>
    </div>
    <!-- <div class="w-1/2"></div> -->
  </section>
</template>

<script>
import authors from '~/graphql/queries/authors.gql';
import createAuthorGQL from '~/graphql/mutations/createAuthor.gql';

export default {
  data: () => ({
    author: {
      name: '',
      age: 0
    }
  }),
  apollo: {
    authors
  },
  methods: {
    async createAuthor() {
      try {
        const author = await this.$apollo.mutate({
          mutation: createAuthorGQL,
          variables: {
            name: this.author.name,
            age: parseInt(this.author.age, 10)
          }
        });
        console.log(author);
      } catch (err) {
        throw new Error(err);
      }
    }
  }
};
</script>

<style module>
  .testList {
    @apply list-reset w-full;
  }
</style>
