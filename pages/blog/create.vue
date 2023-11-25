<template>
  <div>
    <h1 class="text-lg text-indigo-800 font-bold mb-2">Nieuwe blogpost maken</h1>

    <div class="flex flex-col gap-4">
      <div v-if="error" class="text-sm text-red-900 p-2 bg-red-100 rounded border border-red-500">{{ error }}</div>

      <CustomInput id="title" v-model="title" label="Titel" placeholder="Titel van de blog post" />
      <CustomInput id="title" v-model="imageUrl" label="Afbeelding" placeholder="Externe afbeelding van de blog post" />
      <CustomInput id="title" v-model="description" label="Omschrijving" placeholder="Omschrijving van de blog post (max 160 char.)" />
      <CustomInput id="title" v-model="parkId" label="Pretpark ID" placeholder="Het ID van het park" />
      <CustomInput id="title" v-model="locale" label="Taal" placeholder="De taalcode van deze blogpost" />
      <CustomInput id="title" v-model="slug" label="URL" placeholder="De URL/Slug van deze blogpost, in de geselecteerde locale" />
      <mavon-editor
        v-model="content"
        language="en"
        placeholder="Inhoud van de blogpost"
        box-shadow-style="0 2px 12px 0 rgba(0, 0, 0, 0.1)"
      />

      <button type="submit" class="rounded bg-indigo-800 transition duration-100 hover:bg-indigo-900 text-white py-2 px-4" @click="save">
        Blogpost toevoegen
      </button>
    </div>
  </div>
</template>

<script>
import CustomInput from '~/components/form/CustomInput.vue'

export default {
  name: 'CreateBlogPost',
  components: { CustomInput },
  data() {
    return {
      title: '',
      imageUrl: '',
      description: '',
      parkId: '',
      content: '',
      locale: 'nl',
      slug: '',
      error: null,
    }
  },
  methods: {
    async save() {
      if (!this.title || !this.imageUrl || !this.description || !this.content || !this.locale || !this.slug) {
        alert('Niet alles ingevuld')
        return
      }

      await this.$axios
        .post('/blog-posts', {
          title: this.title,
          park: this.parkId,
          imageUrl: this.imageUrl,
          description: this.description,
          content: this.content,
          locale: this.locale,
          slug: this.slug,
        })
        .then(() => {
          this.$router.push(this.localePath('/blog/' + this.slug))
        })
        .catch((exception) => {
          this.error = exception
        })
    },
  },
}
</script>
