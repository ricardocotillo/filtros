<template>
  <div class="hello">
    <b-row class="text-center" align-h="center">
      <b-col md="12" class="py-3">
        <b-form>
          <b-row align-h="center">
            <b-col>
              <b-form-group label="TIPO" label-for="exampleInput3">
                <b-form-select :options="opciones" required v-model="form.tipo"></b-form-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row v-if="form.tipo">
            <b-col>
              <b-form-group label="DIMENSION" label-for="exampleInput4">
                <b-form-select :options="opcionesDeDimension" required v-model="form.dimension"></b-form-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row v-if="form.dimension">
            <b-col>
              <b-form-group>
                <b-input placeholder="Desde..." v-model.trim="form.valorDesde"/>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group>
                <b-input placeholder="Hasta..." v-model.trim="form.valorHasta"/>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row v-if="form.tipo && form.dimension && (form.valorDesde || form.valorHasta)">
            <b-col>
              <b-form-group>
                <b-button variant="danger" @click="poblarFiltros">Buscar</b-button>
              </b-form-group>
            </b-col>
          </b-row>
        </b-form>
      </b-col>
    </b-row>
    <b-row align-h="center">
      <b-col md="12">
        <b-table
          responsive
          striped
          hover
          :items="filtros"
          :fields="fields"
          v-if="filtros.length > 0"
        >
          <template v-slot:cell(item)="data">
            <a class="hover" @click="mostrarFiltro(data.value)">{{ data.value }}</a>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-modal size="lg" centered ref="modal1" title="Producto" hide-footer>
      <b-container fluid>
        <b-row align-h="center">
          <b-col md="6">
            <img class="imagen" :src="imagen" alt>
          </b-col>
          <b-col md="6">
            <b-table
              stacked
              striped
              hover
              :items="filtro"
              :fields="campos"
              v-if="filtro.length > 0"
            ></b-table>
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
import { db, storage } from "../firebase";
export default {
  data() {
    return {
      fields: [
        {
          key: "tipo",
          label: "Tipo"
        },
        "Diametro Exterior",
        "Diametro Interior",
        {
          key: "altura",
          label: "Altura"
        },
        {
          key: "item",
          label: "Código"
        }
      ],
      campos: [
        "item",
        "linea",
        "tipo",
        {
          key: "Valv. Antidr",
          label: "Valv. Antidr"
        },
        {
          key: "Valv. by Pass",
          label: "Valv. by Pass"
        },
        "empaquetadura"
      ],
      camposDimensiones: [
        "dimensiones",
        {
          key: "Diametro Exterior",
          label: "Diametro Exterior (mm)"
        },
        {
          key: "Diametro Interior",
          label: "Diametro Interior (mm)"
        },
        {
          key: "altura",
          label: "Altura (mm)"
        },
        "PZS x Caja"
      ],
      filtros: [],
      filtro: [],
      imagen: "",
      opciones: [{ text: "Selecciona un tipo", value: null }],
      opcionesDeDimension: [
        { text: "Selecciona una dimensión", value: null },
        "Diametro Exterior",
        "Diametro Interior",
        {
          text: "Altura",
          value: "altura"
        }
      ],
      form: {
        tipo: null,
        dimension: null,
        valorDesde: "",
        valorHasta: ""
      },
      show: true,
      aplicaciones: ""
    };
  },
  methods: {
    poblarFiltros() {
      this.filtros = [];
      this.imagen = "";
      this.filtro = [];
      this.aplicaciones = "";
      db.collection("codigos")
        .where("tipo", "==", this.form.tipo)
        .where(this.form.dimension, ">=", this.form.valorDesde)
        .where(this.form.dimension, "<=", this.form.valorHasta)
        .get()
        .then(snap => {
          snap.forEach(el => {
            if (Number(el.data()[this.form.dimension]) >= Number(this.form.valorDesde) && Number(el.data()[this.form.dimension]) <= Number(this.form.valorHasta)) {
              this.filtros.push(el.data());
            }
          });
        });
    },
    mostrarFiltro(codigo) {
      this.imagen = "";
      this.aplicaciones = "";
      this.filtro = [];
      db.collection("codigos")
        .doc(codigo)
        .get()
        .then(doc => {
          if (doc.exists) {
            storage
              .refFromURL(
                "gs://wbusch-f8fb7.appspot.com/opt/" + doc.data().item + ".jpg"
              )
              .getDownloadURL()
              .then(url => {
                this.imagen = url;
              });
            this.imagen = doc.data().imagen;
            this.aplicaciones = doc.data().aplicaciones;
            this.filtro.push(doc.data());
            this.$refs.modal1.show();
          }
        });
    }
  },
  mounted() {
    this.$binding("tipos", db.collection("listas").doc("tipo")).then(tipos => {
      Object.keys(tipos).forEach(tipo => {
        if (tipo != ".key") {
          this.opciones.push(tipo);
        }
      });
    });
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
