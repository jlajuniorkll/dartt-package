<template>
<div class="container-fluid" id="main-container">
  <div id="btnconfig">
<h2>Dashboard
          <button class="btn btn-primary btn-sm" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
        <i class="fa-solid fa-gear"></i>
      </button>
</h2>

</div>
<div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="offcanvasExampleLabel">Configurações</h5>
    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>  
  <div class="offcanvas-body">
    <div class="mb-3">
    <label for="tipoexibicao" class="form-label">Tipo de exibição</label>
  <select id="tipoexibicao" class="form-select" aria-label="Tipo de exibição" v-model="tipoexibicaoselected" @change="tipoExibicao(tipoexibicaoselected)">
  <option v-for="te in tipoexibicao" :key=te.id :value="te.id">{{te.tipo}}</option>
</select>
</div>
<div class="mb-3">
<div v-show="tipoexibicaoselected>0">
  <label for="qtdPP" class="form-label">Itens por página</label>
  <input type="text" class="form-control" id="qtdPP" name="qtdPP" v-model="qtdPP" @change="getDataPagina(1)" placeholder="Digite que deseja exibir por página...">
</div>
</div>
<div class="mb-3">
  <div v-show="tipoexibicaoselected===1">
    <label for="qtdT" class="form-label">Digite o tempo</label>
  <input type="text" class="form-control" id="qtdT" name="qtdT" v-model="qtdT" @change="recomecarIntervalo()" placeholder="Tempo em segundos por página...">
</div>
</div>
  </div>
</div>
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

<div class="container">
  <div class="row">
    <div class="col align-self-center">
      <nav aria-label="Page navigation example" v-show="tipoexibicaoselected == 2">
  <ul class="pagination">
    <li class="page-item" @click="getPreviousPage()"><a class="page-link" href="#">Previous</a></li>
    <li v-for="pagina in totalPaginas()" :key="pagina.id" class="page-item" @click="getDataPagina(pagina)"><a class="page-link" href="#">{{pagina}}</a></li>
    <li class="page-item" @click="getNextPage()"><a class="page-link" href="#">Next</a></li>
  </ul>
</nav>
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
            pedidos: [],
            pedidosfilter: [],
            situacao: null,
            getData: new Date(),
            dataHoje: null,
            dataAproximada: null,
            tipoexibicao: [
              {id: 1, tipo: "Por tempo"},
              {id: 2, tipo: "Por Quantidade"},
              {id: 0, tipo: "Todos"},
            ],
            tipoexibicaoselected: [{id: 0, tipo: "Todos"}],
            atualPage: 1,
            qtdPP: 10,
            qtdT: 10,
            refreshIntervalID: null,
    }
  },

  methods: {
    async getPedidos(){
      const req = await fetch("http://localhost:3000/pedidos");
      const data = await req.json();
      this.pedidosfilter = data;
      this.verificaSituacao(data);
      this.tipoExibicao(this.tipoexibicaoselected);
    },
    tipoExibicao(tipoexibicao){
      switch (tipoexibicao){
        case 1:
          this.totalPaginas();
          this.filtroPorTempo(this.qtdT);
          break;
        case 2:
          clearInterval(this.refreshIntervalID);
          this.totalPaginas();
          this.getDataPagina(1);
          break;
        default:
          clearInterval(this.refreshIntervalID);
          this.pedidos = this.pedidosfilter;
          break;
      }
    },
    recomecarIntervalo(){
      clearInterval(this.refreshIntervalID);
       this.filtroPorTempo(this.qtdT);
    },
    filtroPorTempo(tempo){  
      this.refreshIntervalID = setInterval(() => { 
          if (this.atualPage == this.totalPaginas()) {
            this.getPreviousPage()
          }else{
            this.getNextPage();
          }
      }, tempo*1000);
      // getDataPagina(nPagina)
    },
    totalPaginas(){
      return Math.ceil(this.pedidosfilter.length/this.qtdPP);
    },    
    getDataPagina(nPagina){      
      this.atualPage = nPagina;
      this.pedidos = [];
      let ini = (nPagina * this.qtdPP) - this.qtdPP;
      let fim = (nPagina * this.qtdPP);
      //for(let index = ini; index<fim; index++){
      //  this.pedidos.push(this.pedidosfilter[index]);
      //}
      this.pedidos = this.pedidosfilter.slice(ini, fim);

    },
    getPreviousPage(){
      if(this.atualPage > 1){
        this.atualPage--;
      }
      this.getDataPagina(this.atualPage);
    },

    getNextPage(){
      if(this.atualPage < this.totalPaginas()){
        this.atualPage++;
      }
      this.getDataPagina(this.atualPage);
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
.header{
  padding: 16px;
}
#paginacao{
  align-content: center;
}
#btnconfig{
  padding: 5px;
}
</style>
