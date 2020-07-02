<template>
  <div class="home">
    <b-container>
      <b-row align-h="center">
        <b-col md="6" class="catalogo-btn-warpper">
          <b-btn @click="goToCatalogo">ir a modo catálogo</b-btn>
        </b-col>
      </b-row>
    </b-container>
    <img src="../assets/logo.png" />
    <b-container>
      <b-row align-h="center">
        <b-col md="8">
          <b-tabs>
            <b-tab title-link-class="text-danger" title="Por Aplicación">
              <Aplicacion />
            </b-tab>
            <b-tab title-link-class="text-danger" title="Por Equivalencia">
              <Equivalencia />
            </b-tab>
            <b-tab title-link-class="text-danger" title="Por Dimensiones">
              <Dimensiones />
            </b-tab>
          </b-tabs>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Aplicacion from "@/components/Aplicacion";
import Equivalencia from "@/components/Equivalencia";
import Dimensiones from "@/components/Dimensiones";

export default {
  name: "home",
  methods: {
    goToCatalogo() {
      this.$router.push("catalogo");
    }
  },
  components: {
    Aplicacion,
    Equivalencia,
    Dimensiones
  }
};
</script>

<style>
.home {
  margin-top: 60px;
}
.catalogo-btn-warpper {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

