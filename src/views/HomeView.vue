<template>
<div class="container-fluid" id="main-container">
<h2>Dashboard</h2>
<div class="accordion accordion-flush" id="accordionFlushExample" v-for="pedido in pedidos" :key="pedido.id">
  <div class="accordion-item">
    <h2 class="accordion-header" id="flush-headingOne">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#p'+pedido.id" aria-expanded="false" aria-controls="flush-collapseOne">
        <div class="container">
          <div class="row">
            <div class="col-sm-6">
                <strong>{{pedido.id}} - {{pedido.cliente}}</strong>
            </div>
            <div class="col-sm-2">
              {{pedido.dataentrega}}
            </div>
            <div class="col-sm-2">
              <h6><span class="badge bg-info text-dark">{{pedido.status.tipo}}</span></h6>
            </div>
            <div class="col-sm-2">
              <h5>
              <span v-if="pedido.situacao.id == '1'" class="badge bg-success">{{pedido.situacao.tipo}}</span>
              <span v-if="pedido.situacao.id == '2'" class="badge bg-warning">{{pedido.situacao.tipo}}</span>
              <span v-if="pedido.situacao.id == '3'" class="badge bg-danger">{{pedido.situacao.tipo}}</span>
              </h5>
            </div>
          </div>
        </div>
      </button>
    </h2>
    <div :id="'p'+pedido.id" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
      <div class="accordion-body">
        <div class="container">
          <div class="row row-cols-2">
            <div class="col">
                Ambiente: {{pedido.ambiente}}
            </div>
            <div class="col">
                Previsão Produção: {{pedido.dataproducao}}
            </div>
            <div class="col">
                Previsão Embalagem: {{pedido.dataembalagem}}
            </div>
            <div class="col">
                Previsão de Carga: {{pedido.datacarga}}
            </div>
            <div class="col">
                Previsão de Montagem: {{pedido.dataentrega}}
            </div>
            <div class="col">
                Total de peças: {{pedido.pecas.length}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'HomeView',
  data(){
    return {
            pedidos: null,
            situacao: null,
            getData: new Date(),
            dataHoje: null,
            dataAproximada: null,
    }
  },

  methods: {
    async getPedidos(){
      const req = await fetch("http://localhost:3000/pedidos");
      const data = await req.json();
      this.pedidos = data;
      this.verificaSituacao(data);
    },
    async verificaSituacao(data){
      this.dataHoje = moment(this.getData).format("YYYY/MM/DD");
      for(var i=0;i<data.length;i++){       
        if(data[i].situacao.id <= "7"){
          if(this.dataHoje > data[i].dataentrega){
             this.updateSituacao(data[i].id,{
                  "id": 3,
                  "tipo": "Atrasado"
                  });
          }else{
              if(this.dataHoje == data[i].dataentrega){
                  this.updateSituacao(data[i].id,{
                    "id": 2,
                    "tipo": "Aproximando"
                  });         
              }else{
                  this.updateSituacao(data[i].id,{
                    "id": 1,
                    "tipo": "No prazo"
                  });  
              }
          }
        }
      }
    },
    async updateSituacao(id, situacao){
      const data = JSON.stringify({situacao: situacao});
      const req = await fetch(`http://localhost:3000/pedidos/${id}`, {
        method: "PATCH",
        headers: {"Content-type": "application/json"},
        body: data
      });
      const res = await req.json();
    }
  },
  mounted() {
    this.getPedidos();
  }
}
</script>

<style scoped>
#main-container{
  margin-top: 65px;
}
</style>
