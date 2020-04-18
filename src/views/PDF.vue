<template>
  <section class="pdfViewer" fluid>
    <div id="flipbook" v-if="!loading">
      <div class="hard">{{loading}}</div>
      <div v-for="page in pages" :key="page.pageNumber">
        <PDFPage class="page" :page="page" :scale="scale" />
      </div>
    </div>
  </section>
</template>

<script>
import $ from 'jquery'
import 'vue-turn/src/lib/turn'
import PDFPage from '../components/PDFPage'
export default {
  data() {
    return {
      url: '/doc.pdf',
      scale: 1,
      pdf: null,
      pageNumber: 1,
      loading: true,
      translateX: 'translateX(-25%)',
      pages: [],
    }
  },
  methods: {
    async getPages(pageNumber, numPages) {
      for (let i = 1; i <= numPages; i++) {
        const page = await this.pdf.getPage(i)
        this.pages.push(page)
      }
    },

    flipBook() {
      const viewport = this.pages[0].getViewport({ scale: this.scale })
      const book = $('#flipbook')
      this.width = viewport.width
      book.turn({
        width: viewport.width * 2,
        height: viewport.height,
        autoCenter: true,
      })
      book.bind('turned', (e, page) => {
        console.log(page)
      })
    },
  },
  mounted() {
    import('pdfjs-dist/webpack')
      .then((pdfjs) => {
        const loadingTask = pdfjs.getDocument(this.url)
        return loadingTask.promise
      })
      .then((pdf) => {
        this.pdf = pdf
        return this.getPages(this.pageNumber, pdf.numPages)
      })
      .then(() => {
        // this.loading = false
        this.$nextTick(() => {
          this.flipBook()
        })
      })
  },
  components: {
    PDFPage,
  },
}
</script>

<style scoped>
.page {
  border: black 1px solid;
}
.pdfViewer {
  background: #383434;
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  justify-items: center;
  align-items: center;
  overflow: hidden;
}
.hard {
  background: white;
}
</style>
