<template>
  <div class="hello">
    <b-row class="text-center" align-h="center">
      <b-col md="12" class="py-3">
        <b-form>
          <b-row>
            <b-col md="6">
              <b-form-group id="exampleInputGroup3"
                            label="MARCA"
                            label-for="exampleInput3">
                <b-form-select id="exampleInput3"
                              :options="opciones"
                              required
                              v-model="form.marca"
                              @change="poblarModelos">
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group id="exampleGroup4"
                            label='MODELO'
                            label-for='exampleInput4'>
                <b-form-select id='exampleInput4'
                              :options="opcionesModelos"
                              required
                              v-model="form.modelo"
                              @change="poblarFiltros">
                </b-form-select>
              </b-form-group>
            </b-col>
          </b-row>
        </b-form>
      </b-col>
    </b-row>
    <b-row align-h="center">
      <b-col md="12">
        <b-table responsive striped hover :items="filtros" :fields="fields" v-if="filtros.length > 0">
          <template slot="aire" slot-scope="data">
            <template class="hover" v-for="(item, index) in items(data.value)">
              <a class="hover" @click="mostrarFiltro(item)" v-if="index < items(data.value).length - 1" :key="item">{{ item + "/" }}</a>
              <a class="hover" @click="mostrarFiltro(item)" v-else :key="`${item}-else`">{{ item }}</a>
            </template>
          </template>
          <template slot="aceite" slot-scope="data">
            <template v-for="(item, index) in items(data.value)">
              <a class="hover" @click="mostrarFiltro(item)" v-if="index < items(data.value).length - 1" :key="item">{{ item + "/" }}</a>
              <a class="hover" @click="mostrarFiltro(item)" v-else :key="`${item}-else`">{{ item }}</a>
            </template>
          </template>
          <template slot="combustible" slot-scope="data">
            <template v-for="(item, index) in items(data.value)">
              <a class="hover" @click="mostrarFiltro(item)" v-if="index < items(data.value).length - 1" :key="item">{{ item + "/" }}</a>
              <a class="hover" @click="mostrarFiltro(item)" v-else :key="`${item}-else`">{{ item }}</a>
            </template>
          </template>
          <template slot="otros" slot-scope="data">
            <template v-for="(item, index) in items(data.value)">
              <a class="hover" @click="mostrarFiltro(item)" v-if="index < items(data.value).length - 1" :key="item">{{ item + "/" }}</a>
              <a class="hover" @click="mostrarFiltro(item)" v-else :key="`${item}-else`">{{ item }}</a>
            </template>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-modal size="lg" centered ref="modal1" title="Producto" hide-footer>
      <b-container fluid>
        <b-row align-h="center">
          <b-col md="6">
            <img class="imagen" :src="imagen" alt="">
          </b-col>
          <b-col md="6">
            <b-table stacked striped hover :items="filtro" :fields="campos" v-if="filtro.length > 0"></b-table>
          </b-col>
        </b-row>
        <b-row align-h="center">
          <b-col md="6"></b-col>
          <b-col md="6">
            <b-table stacked striped hover :items="filtro" :fields="camposDimensiones"></b-table>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <h4 v-if="aplicaciones != ''">Aplicaciones Principales</h4>
            <p>{{ aplicaciones }}</p>
          </b-col>
        </b-row>
      </b-container>
    </b-modal>
  </div>
</template>

<script>
import { db, storage } from '../firebase'
export default {
  data() {
    return {
      fields: [
        'motor', 
        {
          key: 'ano',
          label: 'Año'
        },
        'aire', 
        'aceite', 
        'combustible', 
        'otros'
      ],
      campos: ['item', 'linea', 'tipo', 
        {
          key: 'Valv. Antidr',
          label: 'Valv. Antidr'
        }, 
        {
          key: 'Valv. by Pass',
          label: 'Valv. by Pass'
        }, 'empaquetadura'],
      camposDimensiones: [
        'dimensiones',
        {
          key: 'Diametro Exterior',
          label: 'Diametro Exterior (mm)'
        },
        {
          key: 'Diametro Interior',
          label: 'Diametro Interior (mm)'
        },
        {
          key: 'altura',
          label: 'Altura (mm)'
        },
        'PZS x Caja'
      ],
      filtros: [],
      filtro: [],
      imagen: '',
      opciones: [
        { text: 'Selecciona una marca', value: null }
      ],
      opcionesModelos: [
        { text: 'Selecciona un modelo', value: null }
      ],
      form: {
        marca: null,
        modelo: null
      },
      show: true,
      aplicaciones: ''
    };
  },
  methods: {
    items (val) {
      return val.split(" ")
    },
    poblarModelos (val) {
      this.filtros = []
      this.form.modelo = null
      this.filtro = []
      this.imagen = ''
      this.aplicaciones = ''
      this.opcionesModelos = [
        { text: 'Selecciona un modelo', value: null }
      ]
      this.$binding('modelos', db.collection('listas').doc(val))
        .then(modelos => {
          Object.keys(modelos).forEach(modelo => {
            if (modelo != '.key') {
              this.opcionesModelos.push(modelo)
            }
          })
        })
    },
    poblarFiltros (val) {
      this.filtros = []
      this.imagen = ''
      this.filtro = []
      this.aplicaciones = ''
      db.collection('aplicaciones').where('marca', '==', this.form.marca).where('modelo', '==', val).get()
        .then(snap => {
          snap.forEach(el => {
            this.filtros.push(el.data())
          })
        })
    },
    mostrarFiltro (codigo) {
      this.imagen = ''
      this.aplicaciones = ''
      this.filtro = []
      db.collection('codigos').doc(codigo).get()
        .then( doc => {
          if (doc.exists) {
            storage.refFromURL("gs://wbusch-f8fb7.appspot.com/opt/" + doc.data().item + ".jpg").getDownloadURL()
              .then(url => {
                this.imagen = url
              })
            this.imagen = doc.data().imagen
            this.aplicaciones = doc.data().aplicaciones
            this.filtro.push(doc.data())
            this.$refs.modal1.show()
          } 
        })
    }
  },
  mounted () {
    this.$binding("marcas", db.collection("listas").doc('marcas'))
      .then(marcas => {
        Object.keys(marcas).forEach(marca => {
          if (marca != '.key') {
            this.opciones.push(marca)
          }
        })
      })
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.hover {
  color: teal;
}
.hover:hover {
  cursor: pointer;
}
</style>
