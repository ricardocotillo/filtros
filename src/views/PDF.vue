<template>
  <b-container>
    <b-row>
      <b-col>
        <PDFPage class="page" :page="pageLeft" :scale="scale" v-if="!loading" />
      </b-col>
      <b-col>
        <PDFPage
          class="page"
          :page="pageRight"
          :scale="scale"
          v-if="!loading"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
// import range from 'lodash/range'
import PDFPage from '../components/PDFPage'
export default {
  data() {
    return {
      url: 'http://filtroswillybusch.com.pe/catalogo/doc.pdf',
      scale: 1,
      pdf: null,
      pageLeft: null,
      pageRight: null,
      pageNumber: 1,
      loading: true,
    }
  },
  methods: {
    async getPage(pageNumber) {
      this.pageLeft = await this.pdf.getPage(pageNumber)
      this.pageRight = await this.pdf.getPage(pageNumber + 1)
    },
  },
  mounted() {
    import('pdfjs-dist/webpack').then((pdfjs) => {
      const loadingTask = pdfjs.getDocument(this.url)
      loadingTask.promise.then((pdf) => {
        this.pdf = pdf
        this.getPage(this.pageNumber).then(() => (this.loading = false))
      })
    })
  },
  components: {
    PDFPage,
  },
}
</script>

<style scoped>
footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: #f5f5f5;
}
.page {
  border: black 1px solid;
}
</style>
