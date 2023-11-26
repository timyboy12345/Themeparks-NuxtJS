<template>
  <div>
    <h1 class="text-lg text-indigo-800 font-bold mb-2">Nieuwe blogpost maken</h1>

    <div class="flex flex-col gap-4">
      <div v-if="error" class="text-sm text-red-900 p-2 bg-red-100 rounded border border-red-500">{{ error }}</div>

      <CustomTextInput id="title" v-model="title" label="Titel" placeholder="Titel van de blog post" />
      <CustomTextInput id="image" v-model="imageUrl" label="Afbeelding" placeholder="Externe afbeelding van de blog post" />
      <CustomTextInput
        id="description"
        v-model="description"
        label="Omschrijving"
        placeholder="Omschrijving van de blog post"
        :max-length="160"
        :min-length="120"
      />
      <CustomSelectInput
        id="park"
        v-model="parkId"
        :options="parks"
        :disabled="parks && parks.length > 0"
        label="Pretpark ID"
        placeholder="Het ID van het park"
      />
      <CustomSelectInput id="locale" v-model="locale" :options="localeOptions" label="Taal" placeholder="De taalcode van deze blogpost" />
      <CustomUrlInput id="slug" v-model="slug" label="URL" placeholder="De URL/Slug van deze blogpost, in de geselecteerde locale" />

      <client-only>
        <mavon-editor
          v-model="content"
          :autofocus="false"
          language="en"
          placeholder="Inhoud van de blogpost"
          box-shadow-style="0 2px 12px 0 rgba(0, 0, 0, 0.1)"
        />
      </client-only>

      <button type="submit" class="rounded bg-indigo-800 transition duration-100 hover:bg-indigo-900 text-white py-2 px-4" @click="save">
        Blogpost toevoegen
      </button>
    </div>
  </div>
</template>

<script>
import CustomTextInput from '~/components/form/CustomTextInput.vue'
import CustomUrlInput from '~/components/form/CustomUrlInput.vue'
import CustomSelectInput from '~/components/form/CustomSelectInput.vue'

export default {
  name: 'CreateBlogPost',
  components: { CustomSelectInput, CustomUrlInput, CustomTextInput },
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
      parks: null,
    }
  },
  async fetch() {
    await this.$axios
      .get('/parks')
      .then((parks) => {
        this.parks = parks.data.map((p) => {
          return {
            value: p.id,
            text: p.name,
          }
        })
      })
      .catch((reason) => {
        throw reason
      })
  },
  computed: {
    localeOptions() {
      return [
        {
          value: 'nl',
          text: 'Nederlands',
        },
        {
          value: 'en',
          text: 'Engels',
        },
        {
          value: 'es',
          text: 'Spaans',
        },
      ]
    },
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
          parkId: this.parkId,
          imageUrl: this.imageUrl,
          description: this.description,
          content: this.content,
          locale: this.locale,
          slug: this.slug,
        })
        .then(() => {
          this.$router.push(this.localePath('/blog/' + this.slug))

          this.title = ''
          this.parkId = ''
          this.imageUrl = ''
          this.description = ''
          this.content = ''
          this.locale = 'nl'
          this.slug = ''
        })
        .catch((exception) => {
          this.error = exception
        })
    },
  },
}
</script>
