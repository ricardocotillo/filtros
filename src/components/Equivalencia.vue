<template>
	<div>
		<b-row class="text-center" align-h="center">
      <b-col md="6" class="py-3">
        <b-form inline @submit.prevent="getFiltro">
					<b-form-group id="exampleInputGroup3"
												label-for="exampleInput3">
						<b-input placeholder="Ingrese código de producto" v-model.trim="codigo" />
					</b-form-group>
					<b-form-group id="exampleInputGroup3"
												label-for="exampleInput3">
						<b-button variant="danger" @click="getFiltro">Buscar</b-button>
					</b-form-group>
        </b-form>
      </b-col>
    </b-row>
	<b-row>
		<b-col md="12">
			<b-table responsive :fields="fields" :items="equivalencia" v-if="equivalencia.length > 0">
				<template #cell(marca)="data">
					{{data.value.toUpperCase()}}
				</template>
				<template #cell(equivalencia)="data">
					<a class="hover" @click="mostrarFiltro(data.value)">{{ data.value }}</a>
				</template>
			</b-table>
      <p v-else-if="emptyFiltro">No se pudo encontrar el código</p>
		</b-col>
	</b-row>
	<b-modal size="lg" centered ref="modal2" title="Producto" hide-footer>
      <b-container fluid>
        <b-row align-h="center">
          <b-col md="6">
            <img class="imagen" :src="imagen" alt="">
          </b-col>
          <b-col md="6">
            <b-table class="tabla" stacked striped hover :items="filtro" :fields="campos" v-if="filtro.length > 0"></b-table>
          </b-col>
        </b-row>
        <b-row align-h="center">
          <b-col md="6"></b-col>
          <b-col md="6">
            <b-table class="tabla" stacked striped hover :items="filtro" :fields="camposDimensiones"></b-table>
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
	data () {
		return {
      inciales: ['HH', 'BPE', 'AE', 'BLE', 'BAE', 'BPS', 'HFA', 'BPES', 'BHE', 'HFF', 'HFL', 'HS', 'HWP', 'BLS', 'HFAR', 'HFH'],
			marcas: [{text: 'Selecciona una marca', value: null}, 'PUROLATOR', 'LYS'],
			equi: {
				codigo: '',
				marca: '',
				equivalencia: ''
			},
			codigo: '',
			equivalencia: [],
			imagen: '',
			filtro: [],
      aplicaciones: '',
      emptyFiltro: false,
      campos: ['item', 'linea', 'tipo', 
        {
          key: 'Valv. Antidr',
          label: 'Valv. Antidr'
        }, 
        {
          key: 'Valv. by Pass',
          label: 'Valv. by Pass'
        }, 'empaquetadura'],
			camposDimensiones: ['dimensiones',
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
			fields: [
				{
					key: 'codigo',
					label: 'Código',
				},
				'marca',
				{
					key: 'equivalencia',
					label: 'Código WB'
				}
			]
		}
  },
	methods: {
		getFiltro () {
      this.equivalencia = []
      this.emptyFiltro = false
      for (let i = 0; i < this.inciales.length; i++) {
        if (this.codigo.toUpperCase().match(this.inciales[i] + '?')) {
          db.collection('codigos')
            .where('item','>=', this.codigo.toUpperCase())
            .where('item','<=', (this.codigo.substring(0, this.codigo.length - 1) + String.fromCharCode(this.codigo.charCodeAt(this.codigo.length-1)+1)).toUpperCase())
            .get()
            .then(docs => {
              if (!docs.empty) {
                docs.forEach(doc => {
                  this.equivalencia.push({
                    codigo: doc.data()['item'],
                    marca: 'WB',
                    equivalencia: doc.data()['item']      
                  })
                })
              } else {
                this.emptyFiltro = true
              }
            })
        }
      }
			if (this.codigo.length > 0) {
        db.collection('equivalencias')
          .where('codigo', '>=', this.codigo.toUpperCase())
          .where('codigo', '<=', (this.codigo.substring(0, this.codigo.length - 1) + String.fromCharCode(this.codigo.charCodeAt(this.codigo.length-1)+1)).toUpperCase())
          .get()
					.then(docs => {
            if (!docs.empty) {
              docs.forEach(el => this.equivalencia.push(el.data()))
            }
            else {
              this.emptyFiltro = true
            }
					})
			}
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
            this.$refs.modal2.show()
          } else {
            console.log({'error': 'Codigo no existe en el folder de codigos'})
          }
        })
    }
	}
}
</script>

<style>
.hover:hover {
  cursor: pointer;
}
.tabla {
  font-size: 13px
}
</style>
